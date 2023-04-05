import {
  ActionButton,
  ConfirmDialog,
  DateLabel,
  Dialog,
  NameValueTable,
  SectionBox,
  SectionHeader,
  SimpleTable,
  StatusLabel,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Button, DialogActions, DialogContent, MenuItem, Select } from '@material-ui/core';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { deleteRelease, getRelease, getReleaseHistory, rollbackRelease } from '../../api/releases';

export default function ReleaseDetail() {
  const [update, setUpdate] = useState<boolean>(false);
  const { namespace, releaseName } = useParams<{ namespace: string; releaseName: string }>();
  const [release, setRelease] = useState<any>(null);
  const [releaseHistory, setReleaseHistory] = useState<any>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [rollbackPopup, setRollbackPopup] = useState<boolean>(false);
  const [revertVersion, setRevertVersion] = useState<string>('');
  useEffect(() => {
    getRelease(namespace, releaseName).then(response => {
      console.log('response is', response);
      setRelease(response);
    });
  }, [update]);

  useEffect(() => {
    getReleaseHistory(namespace, releaseName).then(response => {
      console.log('response is', response);
      setReleaseHistory(response);
    });
  }, [update]);

  return (
    <>
      <ConfirmDialog
        open={openDeleteAlert}
        title="Uninstall Release"
        description="Are you sure you want to uninstall this release?"
        handleClose={() => setOpenDeleteAlert(false)}
        onConfirm={() => {
          deleteRelease(namespace, releaseName).then(() => {
            // TODO:redirect to releases list
          });
        }}
      />
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
            onChange={event => setRevertVersion(event.target.value)}
          >
            {releaseHistory &&
              releaseHistory.releases.map((release: any) => {
                return (
                  <MenuItem value={release.version}>
                    {release.version} . {release.info.description}
                  </MenuItem>
                );
              })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              rollbackRelease(release.name, release.namespace, revertVersion).then(() => {
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
                  onClick={() => console.log('values')}
                  icon="mdi:file-document-box-outline"
                />,
                <ActionButton
                  description={'Upgrade'}
                  onClick={() => console.log('upgrade')}
                  icon="mdi:arrow-up-bold"
                />,
                <ActionButton
                  description={'Rollback'}
                  onClick={() => setRollbackPopup(true)}
                  icon="mdi:undo"
                  iconButtonProps={{ disabled: release.version === 1 }}
                />,
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
                  <StatusLabel status={release.info.status === 'deployed' ? 'success' : 'error'}>
                    {release.info.status}
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
                  <StatusLabel status={release.info.status === 'deployed' ? 'success' : 'error'}>
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
