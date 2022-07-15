import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { KubeObjectInterface } from '../../../lib/k8s/cluster';
import {
  MetadataDisplay as MetadataDisplayComponent,
  MetadataDisplayProps,
} from './MetadataDisplay';

export default {
  title: 'Resource/MetadataDisplay',
  component: MetadataDisplayComponent,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<MetadataDisplayProps> = args => <MetadataDisplayComponent {...args} />;

const mockResource: KubeObjectInterface = {
  kind: 'MyKind',
  apiVersion: 'v1',
  metadata: {
    name: 'my-new-kind',
    namespace: 'kube-system',
    uid: '123',
    resourceVersion: '216658365',
    creationTimestamp: new Date(),
    selfLink: '',
    labels: {
      label1: 'My Label 1',
      label2: 'My Label 2',
      label3: 'My Label 3',
    },
  },
};

export const MetadataDisplay = Template.bind({});
MetadataDisplay.args = {
  resource: mockResource,
};

export const WithOwnerReferences = Template.bind({});
WithOwnerReferences.args = {
  resource: {
    ...mockResource,
    metadata: {
      ...mockResource.metadata,
      ownerReferences: [
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          name: 'kube-scheduler',
          uid: '321',
          controller: true,
          blockOwnerDeletion: true,
        },
      ],
    },
  },
};

export const WithExtraRows = Template.bind({});
WithExtraRows.args = {
  resource: mockResource,
  extraRows: [
    {
      name: 'Some extra label 1',
      value: 'Some extra value 1',
    },
    {
      name: 'Some extra label 2',
      value: 'Some extra value 2',
    },
    {
      name: 'Some extra label 3',
      value: 'Some extra value 3',
    },
  ],
};
