import consoleIcon from '@iconify/icons-mdi/console';
import fileDocumentBoxOutline from '@iconify/icons-mdi/file-document-box-outline';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { LogViewer } from '../common/LogViewer';
import { MainInfoSection } from '../common/Resource';
import Terminal from '../common/Terminal';

export default function PodDetails(props) {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);
  const [showLogs, setShowLogs] = React.useState(false);
  const [showTerminal, setShowTerminal] = React.useState(false);

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
          </Tooltip>,
          <Tooltip title="Terminal / Exec">
            <IconButton
              aria-label="delete"
              onClick={() => setShowTerminal(true)}
            >
              <Icon icon={consoleIcon} />
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
        [
          <LogViewer
            key="logs"
            open={showLogs}
            item={item}
            onClose={ () => setShowLogs(false) }
          />,
          <Terminal
            key="terminal"
            open={showTerminal}
            item={item}
            onClose={ () => setShowTerminal(false) }
          />
        ]
      }
    </React.Fragment>
  );
}
