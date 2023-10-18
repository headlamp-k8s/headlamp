import { Meta, Story } from '@storybook/react/types-6-0';
import _ from 'lodash';
import PersistentVolumeClaim, {
  KubePersistentVolumeClaim,
} from '../../lib/k8s/persistentVolumeClaim';
import { TestContext } from '../../test';
import PVClaimList from './ClaimList';

const basePVC: KubePersistentVolumeClaim = {
  apiVersion: 'v1',
  kind: 'PersistentVolumeClaim',
  metadata: {
    creationTimestamp: '2023-04-27T20:31:27Z',
    finalizers: ['kubernetes.io/pvc-protection'],
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc-1234',
  },
  spec: {
    accessModes: ['ReadWriteOnce'],
    resources: {
      requests: {
        storage: '8Gi',
      },
    },
    storageClassName: 'default',
    volumeMode: 'Filesystem',
    volumeName: 'pvc-abc-1234',
  },
  status: {
    accessModes: ['ReadWriteOnce'],
    capacity: {
      storage: '8Gi',
    },
    phase: 'Bound',
  },
};

PersistentVolumeClaim.useList = () => {
  const noStorageClassNamePVC = _.cloneDeep(basePVC);
  noStorageClassNamePVC.metadata.name = 'no-storage-class-name-pvc';
  noStorageClassNamePVC.spec!.storageClassName = '';

  const noVolumeNamePVC = _.cloneDeep(basePVC);
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

  const objList = [basePVC, noStorageClassNamePVC, noVolumeNamePVC].map(
    pvc => new PersistentVolumeClaim(pvc as KubePersistentVolumeClaim)
  );
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'Storage/PersistentVolumeClaim',
  component: PVClaimList,
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
  return <PVClaimList />;
};

export const ListView = Template.bind({});
