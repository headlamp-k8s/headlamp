import { Router } from '@kinvolk/headlamp-plugin/lib';
import {
  ActionButton,
  DateLabel,
  NameValueTable,
  SectionBox,
  SectionHeader,
  SimpleTable,
  StatusLabel,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory,useParams } from 'react-router';
import {
  deleteRelease,
  getActionStatus,
  getRelease,
  getReleaseHistory,
  rollbackRelease,
} from '../../api/releases';
import { EditorDialog } from './EditorDialog';

const { createRouteURL } = Router;
export default function ReleaseDetail() {
  const [update, setUpdate] = useState<boolean>(false);
  const { namespace, releaseName } = useParams<{ namespace: string; releaseName: string }>();
  const [release, setRelease] = useState<any>(null);
  const [releaseHistory, setReleaseHistory] = useState<any>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [rollbackPopup, setRollbackPopup] = useState<boolean>(false);
  const [revertVersion, setRevertVersion] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    getRelease(namespace, releaseName).then(response => {
      setRelease(response);
    });
  }, [update]);

  useEffect(() => {
    getReleaseHistory(namespace, releaseName).then(response => {
      setReleaseHistory(response);
    });
  }, [update]);

  function checkDeleteReleaseStatus(name: string) {
    getActionStatus(name, 'uninstall').then(response => {
      if (response.status === 'processing') {
        setTimeout(() => checkDeleteReleaseStatus(name), 1000);
      } else if (response.status !== 'success') {
        enqueueSnackbar(`Failed to delete release ${name}` + response.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar(`Successfully deleted release ${name}`, { variant: 'success' });
        setOpenDeleteAlert(false);
        history.replace(createRouteURL('/helm/releases'));
        setIsDeleting(false);
      }
    });
  }

  return (
    <>
      <EditorDialog
        openEditor={isEditorOpen}
        handleEditor={open => setIsEditorOpen(open)}
        release={release}
        releaseName={release?.name}
        releaseNamespace={release?.namespace}
      />
      <Dialog open={openDeleteAlert} maxWidth="sm">
        <DialogTitle>Uninstall Release</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to uninstall this release?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAlert(false)}>No</Button>
          <Button
            disabled={isDeleting}
            onClick={() => {
              deleteRelease(namespace, releaseName).then(() => {
                setIsDeleting(true);
                checkDeleteReleaseStatus(releaseName);
              });
            }}
          >
            {isDeleting ? 'Deleting' : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={rollbackPopup}
        maxWidth="sm"
        onClose={() => setRollbackPopup(false)}
        title="Rollback"
      >
        <DialogContent>
          <Select
            style={{ minWidth: '240px' }}
            value={revertVersion}
            onChange={event => setRevertVersion(event.target.value as string)}
          >
            {releaseHistory &&
              releaseHistory.releases.map((release: any) => {
                return (
                  <MenuItem value={release?.version}>
                    {release?.version} . {release?.info.description}
                  </MenuItem>
                );
              })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              rollbackRelease(release.namespace, release.name, revertVersion).then(() => {
                setRollbackPopup(false);
                setUpdate(!update);
              });
            }}
          >
            Revert
          </Button>
        </DialogActions>
      </Dialog>

      {release && (
        <SectionBox
          title={
            <SectionHeader
              title={release.name}
              actions={[
                <ActionButton
                  description={'Values'}
                  onClick={() => setIsEditorOpen(true)}
                  icon="mdi:file-document-box-outline"
                />,
                // <ActionButton
                //   description={'Upgrade'}
                //   onClick={() => console.log('upgrade')}
                //   icon="mdi:arrow-up-bold"
                // />,
                // <ActionButton
                //   description={'Rollback'}
                //   onClick={() => setRollbackPopup(true)}
                //   icon="mdi:undo"
                //   iconButtonProps={{ disabled: release.version === 1 }}
                // />,
                <ActionButton
                  description={'Delete'}
                  onClick={() => setOpenDeleteAlert(true)}
                  icon="mdi:delete"
                />,
              ]}
            />
          }
        >
          <NameValueTable
            rows={[
              {
                name: 'Name',
                value: release.name,
              },
              {
                name: 'Namespace',
                value: release.namespace,
              },
              {
                name: 'Revisions',
                value: release.version,
              },
              {
                name: 'Chart Version',
                value: release.chart.metadata.version,
              },
              {
                name: 'App Version',
                value: release.chart.metadata.appVersion,
              },
              {
                name: 'Status',
                value: (
                  <StatusLabel status={release?.info.status === 'deployed' ? 'success' : 'error'}>
                    {release?.info.status}
                  </StatusLabel>
                ),
              },
            ]}
          />
        </SectionBox>
      )}

      {releaseHistory && (
        <SectionBox title="History">
          <SimpleTable
            data={releaseHistory.releases}
            defaultSortingColumn={1}
            columns={[
              {
                label: 'Revision',
                getter: data => data.version,
                sort: (n1, n2) => n2.version - n1.version,
              },
              {
                label: 'Description',
                getter: data => data.info.description,
              },
              {
                label: 'Status',
                getter: data => (
                  <StatusLabel status={release?.info.status === 'deployed' ? 'success' : 'error'}>
                    {data.info.status}
                  </StatusLabel>
                ),
              },
              {
                label: 'Chart',
                getter: data => data.chart.metadata.name,
              },
              {
                label: 'App Version',
                getter: data => data.chart.metadata.appVersion,
              },
              {
                label: 'Updated',
                getter: data => <DateLabel date={data.info.last_deployed} format="mini" />,
              },
            ]}
          />
        </SectionBox>
      )}
    </>
  );
}
