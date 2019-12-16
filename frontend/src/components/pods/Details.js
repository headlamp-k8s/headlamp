import fileDocumentBoxOutline from '@iconify/icons-mdi/file-document-box-outline';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { LogViewer } from '../common/LogViewer';
import { MainInfoSection } from '../common/Resource';

export default function PodDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);
  const [showLogs, setShowLogs] = React.useState(false);

  useConnectApi(
    api.pod.get.bind(null, namespace, name, setItem),
  );

  return (
    <React.Fragment>
      <MainInfoSection
        resource={item}
        actions={item && [
          <Tooltip title="Show Logs">
            <IconButton
              aria-label="delete"
              onClick={() => setShowLogs(true)}
            >
              <Icon icon={fileDocumentBoxOutline} />
            </IconButton>
          </Tooltip>
        ]}
        extraInfo={item && [
          {
            name: 'State',
            value: item.status.phase
          },
          {
            name: 'Host IP',
            value: item.status.hostIP,
          },
          {
            name: 'Pod IP',
            value: item.status.podIP,
          }
        ]}
      />
      {item &&
        <LogViewer
          open={showLogs}
          item={item}
          onClose={ () => setShowLogs(false) }
        />
      }
    </React.Fragment>
  );
}
