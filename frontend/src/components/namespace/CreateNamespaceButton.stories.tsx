import { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor } from '@storybook/test';
import { screen } from '@testing-library/react';
import React from 'react';
import { TestContext } from '../../test';
import CreateNamespaceButton from './CreateNamespaceButton';

const meta: Meta<typeof CreateNamespaceButton> = {
  title: 'Namespace/CreateNamespaceButton',
  component: CreateNamespaceButton,
  decorators: [
    Story => {
      return (
        <TestContext>
          <Story />
        </TestContext>
      );
    },
  ],
};

export default meta;

export const OkayName: StoryObj = {
  play: async () => {
    await userEvent.click(screen.getByLabelText('Create'));

    await waitFor(() => expect(screen.getByLabelText('Dialog')).toBeVisible());

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'okay-name'), {
      timeout: 5000,
    });

    const button = await screen.findByRole('button', { name: 'Create' });

    expect(button).toBeEnabled();
  },
};

export const EmptyName: StoryObj = {
  play: async () => {
    await userEvent.click(screen.getByLabelText('Create'));

    await waitFor(() => expect(screen.getByLabelText('Dialog')).toBeVisible());

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), ' '), { timeout: 5000 });

    const button = await screen.findByRole('button', { name: 'Create' });
    const errorMessage = await screen.findByText(
      "Namespaces must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
    );

    expect(errorMessage).toBeVisible();
    expect(button).not.toBeEnabled();
  },
};

export const NotValidName: StoryObj = {
  play: async () => {
    await userEvent.click(screen.getByLabelText('Create'));

    await waitFor(() => expect(screen.getByLabelText('Dialog')).toBeVisible());

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 'not-valid-name-'), {
      timeout: 5000,
    });

    const button = await screen.findByRole('button', { name: 'Create' });
    const errorMessage = await screen.findByText(
      "Namespaces must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
    );

    expect(errorMessage).toBeVisible();
    expect(button).not.toBeEnabled();
  },
};

export const NotValidNameLong: StoryObj = {
  play: async () => {
    const longName = 'w'.repeat(64);
    await userEvent.click(screen.getByLabelText('Create'));

    await waitFor(() => expect(screen.getByLabelText('Dialog')).toBeVisible());

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), longName), { timeout: 10000 });

    const button = await screen.findByRole('button', { name: 'Create' });
    const errorMessage = await screen.findByText('Namespaces must be under 64 characters.');

    expect(errorMessage).toBeVisible();
    expect(button).not.toBeEnabled();
  },
};
