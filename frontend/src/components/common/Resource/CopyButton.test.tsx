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

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestContext } from '../../../test';
import CopyButton from './CopyButton';

describe('CopyButton', () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
  });

  it('calls onError and does not report success when the clipboard write fails', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'));
    const onError = vi.fn();
    const onCopied = vi.fn();

    render(
      <TestContext>
        <CopyButton text="some-text" onError={onError} onCopied={onCopied} />
      </TestContext>
    );

    fireEvent.click(screen.getByRole('button', { name: 'translation|Copy to clipboard' }));

    await waitFor(() => expect(onError).toHaveBeenCalledWith(new Error('denied')));
    expect(onCopied).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'translation|Copy to clipboard' })
    ).toBeInTheDocument();
  });

  it('resolves an async text function before copying and calls onCopied on success', async () => {
    const onCopied = vi.fn();
    const textFn = vi.fn().mockResolvedValue('resolved-text');

    render(
      <TestContext>
        <CopyButton
          buttonStyle="menu"
          description="Copy kubeconfig"
          text={textFn}
          onCopied={onCopied}
        />
      </TestContext>
    );

    fireEvent.click(screen.getByRole('menuitem'));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('resolved-text'));
    expect(onCopied).toHaveBeenCalled();
  });

  it('does not write to the clipboard when the async text resolves to nothing', async () => {
    const onError = vi.fn();
    const onCopied = vi.fn();
    const textFn = vi.fn().mockResolvedValue(null);

    render(
      <TestContext>
        <CopyButton
          buttonStyle="menu"
          description="Copy kubeconfig"
          text={textFn}
          onError={onError}
          onCopied={onCopied}
        />
      </TestContext>
    );

    fireEvent.click(screen.getByRole('menuitem'));

    await waitFor(() => expect(textFn).toHaveBeenCalled());
    expect(writeText).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onCopied).not.toHaveBeenCalled();
  });

  it('uses ClipboardItem write for async text when available (Safari user-activation path)', async () => {
    class FakeClipboardItem {
      static instances: FakeClipboardItem[] = [];
      constructor(public types: Record<string, Promise<Blob>>) {
        FakeClipboardItem.instances.push(this);
      }
    }
    FakeClipboardItem.instances = [];
    const write = vi.fn(async (items: FakeClipboardItem[]) => {
      // Mirror browser behavior: the write resolves/rejects with its blob promises.
      await Promise.all(items.flatMap(item => Object.values(item.types)));
    });
    const writeText = vi.fn();
    Object.defineProperty(window, 'ClipboardItem', {
      value: FakeClipboardItem,
      configurable: true,
    });
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { write, writeText },
      configurable: true,
    });

    const onCopied = vi.fn();
    render(
      <TestContext>
        <CopyButton
          buttonStyle="menu"
          description="Copy kubeconfig"
          text={vi.fn().mockResolvedValue('async-yaml')}
          onCopied={onCopied}
        />
      </TestContext>
    );

    fireEvent.click(screen.getByRole('menuitem'));

    // write() was started during the click with a promised blob; no writeText.
    expect(write).toHaveBeenCalledTimes(1);
    const blob = await FakeClipboardItem.instances[0].types['text/plain'];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBe('async-yaml'.length); // jsdom Blob has no .text()
    await waitFor(() => expect(onCopied).toHaveBeenCalled());
    expect(writeText).not.toHaveBeenCalled();
  });

  it('does not clobber the clipboard when async text resolves to nothing under ClipboardItem', async () => {
    class FakeClipboardItem {
      static instances: FakeClipboardItem[] = [];
      constructor(public types: Record<string, Promise<Blob>>) {
        FakeClipboardItem.instances.push(this);
      }
    }
    FakeClipboardItem.instances = [];
    const write = vi.fn(async (items: FakeClipboardItem[]) => {
      await Promise.all(items.flatMap(item => Object.values(item.types)));
    });
    const writeText = vi.fn();
    Object.defineProperty(window, 'ClipboardItem', {
      value: FakeClipboardItem,
      configurable: true,
    });
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { write, writeText },
      configurable: true,
    });

    const onError = vi.fn();
    const onCopied = vi.fn();
    render(
      <TestContext>
        <CopyButton
          buttonStyle="menu"
          description="Copy kubeconfig"
          text={vi.fn().mockResolvedValue(null)}
          onError={onError}
          onCopied={onCopied}
        />
      </TestContext>
    );

    fireEvent.click(screen.getByRole('menuitem'));

    await waitFor(() => expect(write).toHaveBeenCalledTimes(1));
    // The promised blob must reject instead of resolving to an empty Blob, so
    // the browser never commits a clipboard-clobbering empty write.
    await expect(FakeClipboardItem.instances[0].types['text/plain']).rejects.toBeDefined();
    await waitFor(() => expect(onCopied).not.toHaveBeenCalled());
    expect(onError).not.toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });

  it('renders a labelled button for the "wide" style and copies its text', async () => {
    render(
      <TestContext>
        <CopyButton
          buttonStyle="wide"
          description="Copy kubeconfig to clipboard"
          text="yaml-text"
        />
      </TestContext>
    );

    const button = screen.getByRole('button', { name: 'Copy kubeconfig to clipboard' });
    fireEvent.click(button);

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('yaml-text'));
    expect(screen.getByRole('button', { name: 'translation|Copied!' })).toBeInTheDocument();
  });
});
