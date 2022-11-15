import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import { KubeObject } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import PDB, { KubePDB } from '../../lib/k8s/podDisruptionBudget';
import { TestContext } from '../../test';
import HPADetails from './Details';

const usePhonyGet: KubeObjectClass['useGet'] = () => {
  return [
    new PDB({
      kind: 'PodDisruptionBudget',
      metadata: {
        annotations: {
          'kubectl.kubernetes.io/last-applied-configuration':
            '{"apiVersion":"policy/v1beta1","kind":"PodDisruptionBudget","metadata":{"annotations":{},"labels":{"addonmanager.kubernetes.io/mode":"Reconcile"},"name":"coredns-pdb","namespace":"kube-system"},"spec":{"minAvailable":1,"selector":{"matchLabels":{"k8s-app":"kube-dns"}}}}\n',
        },
        selfLink: '',
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
    } as KubePDB),
  ] as any;
};

export default {
  title: 'pdb/PDBDetailsView',
  component: HPADetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ namespace: 'my-namespace', name: 'my-endpoint' }}>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

interface MockerStory {
  useGet?: KubeObjectClass['useGet'];
  useList?: KubeObjectClass['useList'];
}

const Template: Story = (args: MockerStory) => {
  if (!!args.useGet) {
    PDB.useGet = args.useGet;
    Event.objectEvents = async (obj: KubeObject) => {
      console.log('object:', obj);
      return [];
    };
  }
  if (!!args.useList) {
    PDB.useList = args.useList;
  }

  return <HPADetails />;
};

export const Default = Template.bind({});
Default.args = {
  useGet: usePhonyGet,
};

export const NoItemYet = Template.bind({});
NoItemYet.args = {
  useGet: () => [null, null, () => {}, () => {}] as any,
};

export const Error = Template.bind({});
Error.args = {
  useGet: () => [null, 'Phony error is phony!', () => {}, () => {}] as any,
};
