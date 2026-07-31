/*
 * Copyright 2025 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ThemeProvider } from '@mui/material/styles';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../../App';
import { KubeObject } from '../../../lib/k8s/KubeObject';
import { createMuiTheme } from '../../../lib/themes';
import { TestContext } from '../../../test';
import ResourceTable from '../Resource/ResourceTable';
import Table, { TableProps } from './Table';

// Initialize the app module first to resolve the existing Kubernetes import cycle.
// eslint-disable-next-line no-unused-vars
const _dont_delete_me = App;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key.split('|').at(-1) ?? key,
    i18n: { language: 'en' },
  }),
  initReactI18next: { type: '3rdParty', init: () => {} },
}));

vi.mock('../../App/Settings/hook', () => ({
  useSettings: () => [15, 25, 50],
}));

const theme = createMuiTheme({ base: 'light', name: 'light' });

function makeRows(count: number, namePrefix = 'item') {
  return Array.from({ length: count }, (_, i) => ({
    id: `${namePrefix}-${i}`,
    name: `${namePrefix}-${i}`,
  }));
}

type Row = ReturnType<typeof makeRows>[number];

function tableElement(props: Partial<TableProps<Row>> = {}, urlSearchParams?: { filter: string }) {
  return (
    <TestContext urlSearchParams={urlSearchParams}>
      <ThemeProvider theme={theme}>
        <Table
          columns={[
            {
              id: 'name',
              header: 'Name',
              accessorKey: 'name',
            },
          ]}
          data={makeRows(20)}
          getRowId={row => row.id}
          initialState={{ showGlobalFilter: true }}
          {...props}
        />
      </ThemeProvider>
    </TestContext>
  );
}

async function flushSearchUpdate() {
  // MRT debounces search by 250ms; also allow the visibility transition to finish.
  await act(async () => {
    await vi.advanceTimersByTimeAsync(600);
  });
}

describe('Table search focus across refresh', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it.each([5, 20, 30, 0])(
    'preserves the search input when data refreshes to %i rows',
    async count => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { rerender } = render(tableElement());
      const search = screen.getByRole('textbox');
      await user.type(search, 'item-1');
      await flushSearchUpdate();

      rerender(tableElement({ data: makeRows(count) }));
      const searchAfterRefresh = screen.getByRole('textbox');
      expect(searchAfterRefresh).toBe(search);
      expect(searchAfterRefresh).toHaveValue('item-1');
      expect(searchAfterRefresh).toHaveFocus();

      rerender(tableElement({ data: makeRows(20) }));
      expect(screen.getByRole('textbox')).toBe(search);
      expect(search).toHaveValue('item-1');
      expect(search).toHaveFocus();
    }
  );

  it('preserves in-progress typing when data refreshes before search is debounced', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { rerender } = render(tableElement());
    const search = screen.getByRole('textbox');
    await user.type(search, 'item-1');

    rerender(tableElement({ data: makeRows(5) }));
    await flushSearchUpdate();

    expect(screen.getByRole('textbox')).toBe(search);
    expect(search).toHaveValue('item-1');
    expect(search).toHaveFocus();
  });

  it('preserves the search input during loading and after data returns', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { rerender } = render(tableElement());
    const search = screen.getByRole('textbox');
    await user.type(search, 'item-1');
    await flushSearchUpdate();

    rerender(tableElement({ loading: true, data: [] }));
    expect(screen.getByRole('progressbar', { name: 'Loading table data' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBe(search);
    expect(search).toHaveFocus();

    rerender(tableElement({ data: makeRows(5) }));
    expect(screen.getByRole('textbox')).toBe(search);
    expect(search).toHaveValue('item-1');
    expect(search).toHaveFocus();
  });

  it('preserves focus when searching returns no matches', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { rerender } = render(tableElement());
    const search = screen.getByRole('textbox');
    await user.type(search, 'missing');
    await flushSearchUpdate();

    rerender(tableElement({ data: makeRows(5) }));

    expect(screen.getByRole('status')).toHaveTextContent('No results found');
    expect(screen.getByRole('textbox')).toBe(search);
    expect(search).toHaveValue('missing');
    expect(search).toHaveFocus();
  });

  it.each([{ data: [] }, { data: null }])(
    'preserves resource search while data is $data',
    async ({ data }) => {
      const resources = makeRows(20).map(
        ({ id, name }) =>
          new KubeObject({
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {
              name,
              uid: id,
              namespace: 'default',
              creationTimestamp: '2026-10-13T00:00:00Z',
            },
          })
      );
      function resourceTableElement(data: KubeObject[] | null) {
        return (
          <TestContext>
            <ThemeProvider theme={theme}>
              <ResourceTable
                columns={[{ id: 'name', label: 'Name', getValue: item => item.metadata.name }]}
                data={data}
                defaultGlobalFilter="item"
              />
            </ThemeProvider>
          </TestContext>
        );
      }

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { rerender } = render(resourceTableElement(resources));
      const search = screen.getByRole('textbox');
      await user.clear(search);
      await user.type(search, 'item-1');
      await flushSearchUpdate();

      rerender(resourceTableElement(data));
      expect(screen.getByRole('textbox')).toBe(search);
      expect(search).toHaveValue('item-1');
      expect(search).toHaveFocus();

      rerender(resourceTableElement(resources));
      expect(screen.getByRole('textbox')).toBe(search);
      expect(search).toHaveFocus();
    }
  );

  it('keeps a search restored from the URL open when its text is cleared', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const props = { reflectInURL: true, initialState: {} };
    const { rerender } = render(tableElement(props, { filter: 'item-1' }));
    const search = screen.getByRole('textbox');
    expect(search).toHaveValue('item-1');
    await user.clear(search);
    await flushSearchUpdate();

    rerender(tableElement({ ...props, data: makeRows(5) }));
    expect(screen.getByRole('textbox')).toBe(search);
    expect(search).toHaveValue('');
    expect(search).toHaveFocus();
  });

  it('allows the user to open, clear, and explicitly close search', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(tableElement({ initialState: {} }));

    await user.click(screen.getByRole('button', { name: 'Show/Hide search' }));
    await flushSearchUpdate();
    const search = screen.getByRole('textbox');
    await user.type(search, 'item');
    await flushSearchUpdate();
    await user.clear(search);
    await flushSearchUpdate();
    expect(search).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Show/Hide search' }));
    await flushSearchUpdate();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it.each([
    { data: [], initialState: {} },
    { data: [], loading: true, initialState: {} },
    { enableTopToolbar: false },
    { errorMessage: 'Unable to load rows' },
  ])('does not introduce a search input for %j', props => {
    render(tableElement(props));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
