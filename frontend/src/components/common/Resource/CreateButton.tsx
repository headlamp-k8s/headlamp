import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { apply } from '../../../lib/k8s/apiProxy';
import { KubeObjectInterface } from '../../../lib/k8s/cluster';
import { getClusterGroup } from '../../../lib/util';
import { clusterAction } from '../../../redux/actions/actions';
import ActionButton from '../ActionButton';
import EditorDialog from './EditorDialog';

export default function CreateButton() {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const location = useLocation();
  const { t } = useTranslation(['resource', 'frequent']);
  const clusters = getClusterGroup();
  const [targetCluster, setTargetCluster] = React.useState(clusters[0] || '');

  const applyFunc = async (newItems: KubeObjectInterface[]) => {
    await Promise.allSettled(newItems.map(newItem => apply(newItem, targetCluster))).then(
      (values: any) => {
        values.forEach((value: any, index: number) => {
          if (value.status === 'rejected') {
            let msg;
            const kind = newItems[index].kind;
            const name = newItems[index].metadata.name;
            const apiVersion = newItems[index].apiVersion;
            if (newItems.length === 1) {
              msg = t('resource|Failed to create {{ kind }} {{ name }}.', { kind, name });
            } else {
              msg = t('resource|Failed to create {{ kind }} {{ name }} in {{ apiVersion }}.', {
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
          t(`resource|Invalid: One or more of resources doesn't have a name property`)
        );
        return;
      }
      if (!massagedNewItemDefs[i].kind) {
        setErrorMessage(t('resource|Invalid: Please set a kind to the resource'));
        return;
      }
    }
    // all resources name
    const resourceNames = massagedNewItemDefs.map(newItemDef => newItemDef.metadata.name);
    setOpenDialog(false);
    dispatch(
      clusterAction(() => applyFunc(massagedNewItemDefs), {
        startMessage: t('resource|Applying {{ newItemName }}…', {
          newItemName: resourceNames.join(','),
        }),
        cancelledMessage: t('resource|Cancelled applying {{ newItemName }}.', {
          newItemName: resourceNames.join(','),
        }),
        successMessage: t('resource|Applied {{ newItemName }}.', {
          newItemName: resourceNames.join(','),
        }),
        errorMessage: t('resource|Failed to apply {{ newItemName }}.', {
          newItemName: resourceNames.join(','),
        }),
        cancelUrl,
      })
    );
  }

  const handleTargetClusterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTargetCluster(event.target.value as string);
  };

  return (
    <React.Fragment>
      <ActionButton
        description={t('frequent|Create / Apply')}
        onClick={() => setOpenDialog(true)}
        color="#adadad"
        icon="mdi:plus-circle"
        width="48"
      />
      <EditorDialog
        item={{}}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        saveLabel={t('frequent|Apply')}
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
        title={t('frequent|Create / Apply')}
        actions={[
          clusters.length > 1 && (
            <FormControl>
              <InputLabel id="edit-dialog-cluster-target">{t('glossary|Cluster')}</InputLabel>
              <Select
                labelId="edit-dialog-cluster-target"
                id="edit-dialog-cluster-target-select"
                value={targetCluster}
                onChange={handleTargetClusterChange}
              >
                {clusters.map(cluster => (
                  <MenuItem key={cluster} value={cluster}>
                    {cluster}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ),
        ]}
      />
    </React.Fragment>
  );
}
