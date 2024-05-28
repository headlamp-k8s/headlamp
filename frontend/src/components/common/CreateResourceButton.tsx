import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getCluster } from '../../lib/cluster';
import { apply } from '../../lib/k8s/apiProxy';
import { KubeObjectInterface } from '../../lib/k8s/cluster';
import { KubeConfigMap } from '../../lib/k8s/configMap';
import { KubeRuntimeClass } from '../../lib/k8s/runtime';
import { KubeSecret } from '../../lib/k8s/secret';
import { clusterAction } from '../../redux/clusterActionSlice';
import { EventStatus, HeadlampEventType, useEventCallback } from '../../redux/headlampEventSlice';
import { ActionButton, EditorDialog } from '../common';

const creationTimestamp = new Date('2022-01-01').toISOString();
const BASE_EMPTY_CONFIG_MAP: KubeConfigMap = {
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    creationTimestamp: '2023-04-27T20:31:27Z',
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc-1234',
  },
  data: {},
};
const LEASE_DUMMY_DATA = [
  {
    apiVersion: 'coordination.k8s.io/v1',
    kind: 'Lease',
    metadata: {
      name: 'lease',
      namespace: 'default',
      creationTimestamp,
      uid: '123',
    },
    spec: {
      holderIdentity: 'holder',
      leaseDurationSeconds: 10,
      leaseTransitions: 1,
      renewTime: '2021-03-01T00:00:00Z',
    },
  },
];
const BASE_RC: KubeRuntimeClass = {
  apiVersion: 'node.k8s.io/v1',
  kind: 'RuntimeClass',
  metadata: {
    name: 'runtime-class',
    namespace: 'default',
    creationTimestamp,
    uid: '123',
  },
  handler: 'handler',
  overhead: {
    cpu: '100m',
    memory: '128Mi',
  },
  scheduling: {
    nodeSelector: {
      key: 'value',
    },
    tolerations: [
      {
        key: 'key',
        operator: 'Equal',
        value: 'value',
        effect: 'NoSchedule',
        tolerationSeconds: 10,
      },
    ],
  },
};
const BASE_EMPTY_SECRET: KubeSecret = {
  apiVersion: 'v1',
  kind: 'Secret',
  metadata: {
    creationTimestamp: '2023-04-27T20:31:27Z',
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc-1234',
  },
  data: {},
  type: 'bla',
};

export interface CreateResourceButtonProps {
  resource: string;
}

export function CreateResourceButton(props: CreateResourceButtonProps) {
  const { resource } = props;
  const { t } = useTranslation(['glossary', 'translation']);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const dispatchCreateEvent = useEventCallback(HeadlampEventType.CREATE_RESOURCE);
  const dispatch = useDispatch();

  const applyFunc = async (newItems: KubeObjectInterface[], clusterName: string) => {
    await Promise.allSettled(newItems.map(newItem => apply(newItem, clusterName))).then(
      (values: any) => {
        values.forEach((value: any, index: number) => {
          if (value.status === 'rejected') {
            let msg;
            const kind = newItems[index].kind;
            const name = newItems[index].metadata.name;
            const apiVersion = newItems[index].apiVersion;
            if (newItems.length === 1) {
              msg = t('translation|Failed to create {{ kind }} {{ name }}.', { kind, name });
            } else {
              msg = t('translation|Failed to create {{ kind }} {{ name }} in {{ apiVersion }}.', {
                kind,
                name,
                apiVersion,
              });
            }
            setErrorMessage(msg);
            setOpenDialog(true);
            throw msg;
          }
        });
      }
    );
  };

  function handleSave(newItemDefs: KubeObjectInterface[]) {
    let massagedNewItemDefs = newItemDefs;
    const cancelUrl = location.pathname;

    // check if all yaml objects are valid
    for (let i = 0; i < massagedNewItemDefs.length; i++) {
      if (massagedNewItemDefs[i].kind === 'List') {
        // flatten this List kind with the items that it has which is a list of valid k8s resources
        const deletedItem = massagedNewItemDefs.splice(i, 1);
        massagedNewItemDefs = massagedNewItemDefs.concat(deletedItem[0].items);
      }
      if (!massagedNewItemDefs[i].metadata?.name) {
        setErrorMessage(
          t(`translation|Invalid: One or more of resources doesn't have a name property`)
        );
        return;
      }
      if (!massagedNewItemDefs[i].kind) {
        setErrorMessage(t('translation|Invalid: Please set a kind to the resource'));
        return;
      }
    }
    // all resources name
    const resourceNames = massagedNewItemDefs.map(newItemDef => newItemDef.metadata.name);
    setOpenDialog(false);

    const clusterName = getCluster() || '';

    dispatch(
      clusterAction(() => applyFunc(massagedNewItemDefs, clusterName), {
        startMessage: t('translation|Applying {{ newItemName }}…', {
          newItemName: resourceNames.join(','),
        }),
        cancelledMessage: t('translation|Cancelled applying {{ newItemName }}.', {
          newItemName: resourceNames.join(','),
        }),
        successMessage: t('translation|Applied {{ newItemName }}.', {
          newItemName: resourceNames.join(','),
        }),
        errorMessage: t('translation|Failed to apply {{ newItemName }}.', {
          newItemName: resourceNames.join(','),
        }),
        cancelUrl,
      })
    );

    dispatchCreateEvent({
      status: EventStatus.CONFIRMED,
    });
  }

  const defaultContentMap: { [key: string]: any } = {
    'Config Map': BASE_EMPTY_CONFIG_MAP,
    Secret: BASE_EMPTY_SECRET,
    Lease: LEASE_DUMMY_DATA,
    RuntimeClass: BASE_RC,
  };

  const getDefaultContent = () => defaultContentMap[resource] || '';

  return (
    <React.Fragment>
      <ActionButton
        color="primary"
        description={t('translation|Create {{ resource }}', { resource })}
        icon={'mdi:plus-circle'}
        onClick={() => {
          setOpenDialog(true);
        }}
      />

      <EditorDialog
        item={getDefaultContent()}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        saveLabel={t('translation|Apply')}
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
        title={t('translation|Create {{ resource }}', { resource })}
      />
    </React.Fragment>
  );
}
