import Container from '@mui/material/Container';
import { Meta, Story } from '@storybook/react/types-6-0';
import DaemonSet from '../../lib/k8s/daemonSet';
import { TestContext } from '../../test';
import List from './List';

DaemonSet.useList = () => {
  const objList = [
    {
      apiVersion: 'apps/v1',
      kind: 'DaemonSet',
      metadata: {
        creationTimestamp: '2023-05-02T04:34:53Z',
        generation: 1,
        labels: {
          'k8s-app': 'gadget',
        },
        name: 'gadget',
        namespace: 'gadget',
        resourceVersion: '1234567',
        uid: 'abc123',
      },
      spec: {
        revisionHistoryLimit: 10,
        selector: {
          matchLabels: {
            'k8s-app': 'gadget',
          },
        },
        template: {
          metadata: {
            annotations: {
              'container.apparmor.security.beta.kubernetes.io/gadget': 'unconfined',
              'inspektor-gadget.kinvolk.io/option-hook-mode': 'auto',
            },
            creationTimestamp: null,
            labels: {
              'k8s-app': 'gadget',
            },
          },
          spec: {
            containers: [
              {
                command: ['/entrypoint.sh'],
                env: [
                  {
                    name: 'NODE_NAME',
                    valueFrom: {
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'spec.nodeName',
                      },
                    },
                  },
                  {
                    name: 'GADGET_POD_UID',
                    valueFrom: {
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.uid',
                      },
                    },
                  },
                  {
                    name: 'TRACELOOP_NODE_NAME',
                    valueFrom: {
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'spec.nodeName',
                      },
                    },
                  },
                  {
                    name: 'TRACELOOP_POD_NAME',
                    valueFrom: {
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.name',
                      },
                    },
                  },
                  {
                    name: 'TRACELOOP_POD_NAMESPACE',
                    valueFrom: {
                      fieldRef: {
                        apiVersion: 'v1',
                        fieldPath: 'metadata.namespace',
                      },
                    },
                  },
                  {
                    name: 'GADGET_IMAGE',
                    value: 'ghcr.io/inspektor-gadget/inspektor-gadget:v0.15.0',
                  },
                  {
                    name: 'INSPEKTOR_GADGET_VERSION',
                    value: 'v0.15.0',
                  },
                  {
                    name: 'INSPEKTOR_GADGET_OPTION_HOOK_MODE',
                    value: 'auto',
                  },
                  {
                    name: 'INSPEKTOR_GADGET_OPTION_FALLBACK_POD_INFORMER',
                    value: 'true',
                  },
                  {
                    name: 'INSPEKTOR_GADGET_CONTAINERD_SOCKETPATH',
                    value: '/run/containerd/containerd.sock',
                  },
                  {
                    name: 'INSPEKTOR_GADGET_CRIO_SOCKETPATH',
                    value: '/run/crio/crio.sock',
                  },
                  {
                    name: 'INSPEKTOR_GADGET_DOCKER_SOCKETPATH',
                    value: '/run/docker.sock',
                  },
                  {
                    name: 'HOST_ROOT',
                    value: '/host',
                  },
                ],
                image: 'ghcr.io/inspektor-gadget/inspektor-gadget:v0.15.0',
                imagePullPolicy: 'Always',
                lifecycle: {
                  preStop: {
                    exec: {
                      command: ['/cleanup.sh'],
                    },
                  },
                },
                livenessProbe: {
                  exec: {
                    command: ['/bin/gadgettracermanager', '-liveness'],
                  },
                  failureThreshold: 3,
                  periodSeconds: 5,
                  successThreshold: 1,
                  timeoutSeconds: 2,
                },
                name: 'gadget',
                readinessProbe: {
                  exec: {
                    command: ['/bin/gadgettracermanager', '-liveness'],
                  },
                  failureThreshold: 3,
                  periodSeconds: 5,
                  successThreshold: 1,
                  timeoutSeconds: 2,
                },
                resources: {},
                securityContext: {
                  capabilities: {
                    add: [
                      'NET_ADMIN',
                      'SYS_ADMIN',
                      'SYSLOG',
                      'SYS_PTRACE',
                      'SYS_RESOURCE',
                      'IPC_LOCK',
                      'SYS_MODULE',
                      'NET_RAW',
                    ],
                  },
                },
                terminationMessagePath: '/dev/termination-log',
                terminationMessagePolicy: 'FallbackToLogsOnError',
                volumeMounts: [
                  {
                    mountPath: '/host',
                    name: 'host',
                  },
                  {
                    mountPath: '/run',
                    name: 'run',
                  },
                  {
                    mountPath: '/lib/modules',
                    name: 'modules',
                  },
                  {
                    mountPath: '/sys/kernel/debug',
                    name: 'debugfs',
                  },
                  {
                    mountPath: '/sys/fs/cgroup',
                    name: 'cgroup',
                  },
                  {
                    mountPath: '/sys/fs/bpf',
                    name: 'bpffs',
                  },
                ],
              },
            ],
            dnsPolicy: 'ClusterFirst',
            hostNetwork: true,
            hostPID: true,
            nodeSelector: {
              'kubernetes.io/os': 'linux',
            },
            restartPolicy: 'Always',
            schedulerName: 'default-scheduler',
            securityContext: {},
            serviceAccount: 'gadget',
            serviceAccountName: 'gadget',
            terminationGracePeriodSeconds: 30,
            tolerations: [
              {
                effect: 'NoSchedule',
                operator: 'Exists',
              },
              {
                effect: 'NoExecute',
                operator: 'Exists',
              },
            ],
            volumes: [
              {
                hostPath: {
                  path: '/',
                  type: '',
                },
                name: 'host',
              },
              {
                hostPath: {
                  path: '/run',
                  type: '',
                },
                name: 'run',
              },
              {
                hostPath: {
                  path: '/sys/fs/cgroup',
                  type: '',
                },
                name: 'cgroup',
              },
              {
                hostPath: {
                  path: '/lib/modules',
                  type: '',
                },
                name: 'modules',
              },
              {
                hostPath: {
                  path: '/sys/fs/bpf',
                  type: '',
                },
                name: 'bpffs',
              },
              {
                hostPath: {
                  path: '/sys/kernel/debug',
                  type: '',
                },
                name: 'debugfs',
              },
            ],
          },
        },
        updateStrategy: {
          rollingUpdate: {
            maxSurge: 0,
            maxUnavailable: 1,
          },
          type: 'RollingUpdate',
        },
      },
      status: {
        currentNumberScheduled: 2,
        desiredNumberScheduled: 2,
        numberAvailable: 2,
        numberMisscheduled: 0,
        numberReady: 2,
        observedGeneration: 1,
        updatedNumberScheduled: 2,
      },
    },
  ].map((data: any) => new DaemonSet(data));
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'DaemonSet/List',
  component: List,
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
  return (
    <Container maxWidth="xl">
      <List />
    </Container>
  );
};

export const DaemonSets = Template.bind({});
