import { configureStore } from '@reduxjs/toolkit';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { makeMockKubeObject } from '../../test/mocker';
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

const Template: StoryFn<DetailsViewSectionProps> = args => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(
      setDetailsView((resource: any) => {
        return (
          <SectionBox title={'A title'}>
            I am a custom detail view. <br />
            Made by a {resource.kind} component.
          </SectionBox>
        );
      })
    );
  }, []);

  return <DetailsViewSection {...args} />;
};

export const MatchRenderIt = Template.bind({});
MatchRenderIt.args = {
  resource: makeMockKubeObject({ kind: 'Node' }),
};

export const NoMatchNoRender = Template.bind({});
NoMatchNoRender.args = {
  resource: makeMockKubeObject({ kind: 'DoesNotExist' }),
};
