import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { SectionBox } from '../common';
import DetailsViewSection, { DetailsViewSectionProps } from './DetailsViewSection';

const ourState = {
  ui: {
    views: {
      details: {
        pluginAppendedDetailViews: [
          (resource: any) => {
            if (resource.kind === 'Node') {
              return {
                component: (props: { resource: any }) => {
                  const { resource } = props;
                  return (
                    <SectionBox title={'A title'}>
                      I am a custom detail view. <br />
                      Made by a {resource.kind} component.
                    </SectionBox>
                  );
                },
              };
            }
            return null;
          },
        ],
      },
    },
  },
};

export default {
  title: 'DetailsViewSection',
  component: DetailsViewSection,
  decorators: [
    Story => {
      return (
        <MemoryRouter>
          <Provider store={createStore((state = ourState) => state, ourState)}>
            <Story />
          </Provider>
        </MemoryRouter>
      );
    },
  ],
} as Meta;

const Template: Story<DetailsViewSectionProps> = args => <DetailsViewSection {...args} />;

export const MatchRenderIt = Template.bind({});
MatchRenderIt.args = {
  resource: { kind: 'Node' },
};

export const NoMatchNoRender = Template.bind({});
NoMatchNoRender.args = {
  resource: { kind: 'DoesNotExist' },
};
