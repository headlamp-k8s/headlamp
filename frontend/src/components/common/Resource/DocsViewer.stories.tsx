import { Meta, StoryFn } from '@storybook/react';
import DocsViewer, { DocsViewerProps } from './DocsViewer';

export default {
  title: 'Resource/DocsViewer',
  component: DocsViewer,
  argTypes: {},
} as Meta;

const mockFetchDocDefinitions = (apiVersion: string, kind: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    switch (`${apiVersion}/${kind}`) {
      case 'v1/Pod':
        resolve({
          properties: {
            apiVersion: {
              type: 'string',
              description: `
                  APIVersion defines the versioned schema of this representation of an object. 
                  Servers should convert recognized schemas to the latest internal value, 
                  and may reject unrecognized values. 
                  More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
                `,
            },
            kind: {
              type: 'string',
              description: `
                  Kind is a string value representing the REST resource this object represents. 
                  Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. 
                  More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds',
                `,
            },
            metadata: {
              type: 'object',
              description:
                "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
              properties: {
                annotations: {
                  type: 'object',
                  description: `Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. 
                    They are not queryable and should be preserved when modifying objects. 
                    More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations`,
                },
                creationTimestamp: {
                  type: 'string',
                  description:
                    'CreationTimestamp is a timestamp representing the server time when this object was created',
                },
                deletionTimestamp: {
                  type: 'string',
                  description:
                    'DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted.',
                },
              },
            },
            spec: {
              type: 'object',
              description:
                'Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status',
              properties: {
                containers: {
                  type: 'array',
                  description:
                    'List of containers belonging to the pod. Containers cannot currently be added or removed. There must be at least one container in a Pod. Cannot be updated.',
                },
              },
            },
          },
        });
        break;
      case '/Incomplete':
        // an incomplete documentation response (null).
        resolve(null);
        break;
      case 'v1/CommentOnly':
        resolve({
          properties: {
            note: {
              type: 'string',
              description: `
                    [DEPRECATED] This is a comment-only documentation for resource CommentOnly with apiVersion: v1. 
                    It serves as a placeholder note for additional details about the resource. 
                    Refer to the new resource at 'v2/CommentOnly' for updated documentation.`,
            },
          },
        });
        break;
      default:
        // any other kind returns an error.
        reject(new Error('Documentation not found'));
    }
  });
};

const Template: StoryFn<DocsViewerProps> = (args: DocsViewerProps) => <DocsViewer {...args} />;

export const TypicalDocumentation = Template.bind({});
TypicalDocumentation.args = {
  docSpecs: [{ apiVersion: 'v1', kind: 'Pod' }],
  fetchDocDefinitions: mockFetchDocDefinitions,
};

export const IncompleteDocumentation = Template.bind({});
IncompleteDocumentation.args = {
  docSpecs: [{ apiVersion: '', kind: 'Incomplete' }],
  fetchDocDefinitions: mockFetchDocDefinitions,
};

export const CommentOnlyDocumentation = Template.bind({});
CommentOnlyDocumentation.args = {
  docSpecs: [{ apiVersion: 'v1', kind: 'CommentOnly' }],
  fetchDocDefinitions: mockFetchDocDefinitions,
};

export const ErrorDocumentation = Template.bind({});
ErrorDocumentation.args = {
  docSpecs: [{ apiVersion: '', kind: 'NonExistent' }],
  fetchDocDefinitions: mockFetchDocDefinitions,
};
