import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import Ingress from '../../lib/k8s/ingress';
import { LinkStringFormat, LinkStringFormatProps } from './Details';

export default {
  title: 'ingress/LinkStringFormat',
  component: LinkStringFormat,
  argTypes: {},
} as Meta;

const Template: Story<LinkStringFormatProps> = args => <LinkStringFormat {...args} />;

const noPath = new Ingress({
  kind: 'Ingress',
  metadata: {
    name: 'test',
    namespace: 'test',
    uid: '',
    creationTimestamp: '',
  },
  spec: {
    rules: [
      {
        host: 'examplehost.com',
        http: {
          paths: [
            {
              path: '/',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: 'test',
                  port: {
                    number: 80,
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
});

const onePath = new Ingress({
  kind: 'Ingress',
  metadata: {
    name: 'test',
    namespace: 'test',
    uid: '',
    creationTimestamp: '',
  },
  spec: {
    rules: [
      {
        host: 'examplehost.com',
        http: {
          paths: [
            {
              path: '/pathA',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: 'test',
                  port: {
                    number: 80,
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
});

const multiplePath = new Ingress({
  kind: 'Ingress',
  metadata: {
    name: 'test',
    namespace: 'test',
    uid: '',
    creationTimestamp: '',
  },
  spec: {
    rules: [
      {
        host: 'examplehost.com',
        http: {
          paths: [
            {
              path: '/pathA',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: 'test',
                  port: {
                    number: 80,
                  },
                },
              },
            },
            {
              path: '/pathB',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: 'test',
                  port: {
                    number: 80,
                  },
                },
              },
            },
            {
              path: '/pathC',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: 'test',
                  port: {
                    number: 80,
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
});

export const Empty = Template.bind({});
Empty.args = {
  url: 'exampleurl.com',
  item: noPath,
  urlPath: '/',
};

export const soloPath = Template.bind({});
soloPath.args = {
  url: 'exampleurl.com',
  item: onePath,
  urlPath: '/pathA',
};

export const morePath = Template.bind({});
morePath.args = {
  url: 'exampleurl.com',
  item: multiplePath,
  urlPath: '/pathB',
};
