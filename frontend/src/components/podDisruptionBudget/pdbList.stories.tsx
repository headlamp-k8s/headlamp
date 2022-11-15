import { Meta, Story } from '@storybook/react/types-6-0';
import PDB, { KubePDB } from '../../lib/k8s/podDisruptionBudget';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import PDBList from './List';

PDB.useList = () => {
  const objList = generateK8sResourceList<KubePDB>(
    {
      kind: 'PodDisruptionBudget',
      metadata: {
        annotations: {
          'kubectl.kubernetes.io/last-applied-configuration':
            '{"apiVersion":"policy/v1beta1","kind":"PodDisruptionBudget","metadata":{"annotations":{},"labels":{"addonmanager.kubernetes.io/mode":"Reconcile"},"name":"coredns-pdb","namespace":"kube-system"},"spec":{"minAvailable":1,"selector":{"matchLabels":{"k8s-app":"kube-dns"}}}}\n',
        },
        creationTimestamp: '2022-10-06T05:17:14Z',
        generation: 1,
        labels: {
          'addonmanager.kubernetes.io/mode': 'Reconcile',
        },
        name: 'coredns-pdb',
        namespace: 'kube-system',
        resourceVersion: '3679611',
        uid: '80728de7-5d4f-42a2-bc4a-a8eb2a0ddabd',
      },
      spec: {
        minAvailable: 1,
        selector: {
          matchLabels: {
            'k8s-app': 'kube-dns',
          },
        },
      },
      status: {
        conditions: [
          {
            lastTransitionTime: '2022-10-17T21:56:52Z',
            message: '',
            observedGeneration: 1,
            reason: 'SufficientPods',
            status: 'True',
            type: 'DisruptionAllowed',
          },
        ],
        currentHealthy: 2,
        desiredHealthy: 1,
        disruptionsAllowed: 1,
        expectedPods: 2,
        observedGeneration: 1,
      },
    },
    { instantiateAs: PDB }
  );
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'PDB/PDBListView',
  component: PDBList,
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
  return <PDBList />;
};

export const Items = Template.bind({});
