import { configureStore } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { SectionBox } from '../common';
import DetailsViewSection, { DetailsViewSectionProps } from './DetailsViewSection';
import { setDetailsView } from './detailsViewSectionSlice';

const ourState = {
  detailsViewSection: {
    detailViews: [],
  },
};

export default {
  title: 'DetailsViewSection',
  component: DetailsViewSection,
  decorators: [
    Story => {
      return (
        <MemoryRouter>
          <Provider
            store={configureStore({
              reducer: (state = ourState) => state,
              preloadedState: ourState,
            })}
          >
            <Story />
          </Provider>
        </MemoryRouter>
      );
    },
  ],
} as Meta;

const Template: Story<DetailsViewSectionProps> = args => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(
      setDetailsView((resource: any) => {
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
      })
    );
  }, []);

  return <DetailsViewSection {...args} />;
};

export const MatchRenderIt = Template.bind({});
MatchRenderIt.args = {
  resource: { kind: 'Node' },
};

export const NoMatchNoRender = Template.bind({});
NoMatchNoRender.args = {
  resource: { kind: 'DoesNotExist' },
};
