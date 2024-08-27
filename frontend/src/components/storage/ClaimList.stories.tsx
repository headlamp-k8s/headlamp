import { Meta, StoryFn } from '@storybook/react';
import { cloneDeep } from 'lodash';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ListView from './ClaimList';
import { BASE_PVC } from './storyHelper';

const noStorageClassNamePVC = cloneDeep(BASE_PVC);
noStorageClassNamePVC.metadata.name = 'no-storage-class-name-pvc';
noStorageClassNamePVC.metadata.uid = '1234';
noStorageClassNamePVC.spec!.storageClassName = '';

const noVolumeNamePVC = cloneDeep(BASE_PVC);
noVolumeNamePVC.metadata.name = 'no-volume-name-pvc';
noVolumeNamePVC.metadata.uid = '12345';
noVolumeNamePVC.spec = {
  accessModes: ['ReadWriteOnce'],
  volumeMode: 'Block',
  resources: {
    requests: {
      storage: '10Gi',
    },
  },
};

const items = [BASE_PVC, noStorageClassNamePVC, noVolumeNamePVC];

export default {
  title: 'PersistentVolumeClaim/ListView',
  component: ListView,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: StoryFn = () => {
  return <ListView />;
};

export const Items = Template.bind({});
Items.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/persistentvolumeclaims', () =>
          HttpResponse.json({
            kind: 'SecretList',
            items,
            metadata: {},
          })
        ),
      ],
    },
  },
};
