import { Meta, Story } from '@storybook/react';
import _ from 'lodash';
import { useMockListQuery } from '../../helpers/testHelpers';
import PersistentVolumeClaim, {
  KubePersistentVolumeClaim,
} from '../../lib/k8s/persistentVolumeClaim';
import { TestContext } from '../../test';
import ListView from './ClaimList';
import { BASE_PVC } from './storyHelper';

const noStorageClassNamePVC = _.cloneDeep(BASE_PVC);
noStorageClassNamePVC.metadata.name = 'no-storage-class-name-pvc';
noStorageClassNamePVC.spec!.storageClassName = '';

const noVolumeNamePVC = _.cloneDeep(BASE_PVC);
noVolumeNamePVC.metadata.name = 'no-volume-name-pvc';
noVolumeNamePVC.spec = {
  accessModes: ['ReadWriteOnce'],
  volumeMode: 'Block',
  resources: {
    requests: {
      storage: '10Gi',
    },
  },
};

const objList = [BASE_PVC, noStorageClassNamePVC, noVolumeNamePVC].map(
  pvc => new PersistentVolumeClaim(pvc as KubePersistentVolumeClaim)
);
PersistentVolumeClaim.useListQuery = useMockListQuery.data(objList);

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

const Template: Story = () => {
  return <ListView />;
};

export const Items = Template.bind({});
