import { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor } from '@storybook/test';
import { screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import ConfigMap from '../../lib/k8s/configMap';
import store from '../../redux/stores/store';
import { TestContext } from '../../test';
import { CreateResourceButton, CreateResourceButtonProps } from './CreateResourceButton';

export default {
  title: 'CreateResourceButton',
  component: CreateResourceButton,
  decorators: [
    Story => {
      return (
        <Provider store={store}>
          <TestContext>
            <Story />
          </TestContext>
        </Provider>
      );
    },
  ],
} as Meta;

type Story = StoryObj<CreateResourceButtonProps>;

export const ValidResource: Story = {
  args: { resourceClass: ConfigMap },

  play: async ({ args }) => {
    await userEvent.click(
      screen.getByRole('button', { name: `Create ${args.resourceClass.kind}` })
    );

    await waitFor(() => expect(screen.getByRole('textbox')).toBeVisible());

    await userEvent.click(screen.getByRole('textbox'));

    await userEvent.keyboard('{Control>}a{/Control} {Backspace}');
    await userEvent.keyboard(`apiVersion: v1{Enter}`);
    await userEvent.keyboard(`kind: ConfigMap{Enter}`);
    await userEvent.keyboard(`metadata:{Enter}`);
    await userEvent.keyboard(`  name: base-configmap`);

    const button = await screen.findByRole('button', { name: 'Apply' });
    expect(button).toBeVisible();
  },
};

export const InvalidResource: Story = {
  args: { resourceClass: ConfigMap },

  play: async ({ args }) => {
    await userEvent.click(
      screen.getByRole('button', { name: `Create ${args.resourceClass.kind}` })
    );

    await waitFor(() => expect(screen.getByRole('textbox')).toBeVisible());

    await userEvent.click(screen.getByRole('textbox'));

    await userEvent.keyboard('{Control>}a{/Control}');
    await userEvent.keyboard(`apiVersion: v1{Enter}`);
    await userEvent.keyboard(`kind: ConfigMap{Enter}`);
    await userEvent.keyboard(`metadata:{Enter}`);
    await userEvent.keyboard(`  name: base-configmap{Enter}`);
    await userEvent.keyboard(`  creationTimestamp: ''`);

    const button = await screen.findByRole('button', { name: 'Apply' });
    expect(button).toBeVisible();

    await userEvent.click(button);

    await waitFor(() =>
      userEvent.click(
        screen.getByRole('button', {
          name: `Create ${args.resourceClass.kind}`,
        })
      )
    );

    await waitFor(() => expect(screen.getByText(/Failed/)).toBeVisible(), {
      timeout: 15000,
    });
  },
};
