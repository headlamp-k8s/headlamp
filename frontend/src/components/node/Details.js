import penguinIcon from '@iconify/icons-mdi/penguin';
import { InlineIcon } from '@iconify/react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import { CpuCircularChart, MemoryCircularChart } from '../cluster/Charts';
import { HeaderLabel, StatusLabel,ValueLabel } from '../common/Label';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid, SectionGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import { NameValueTable } from '../common/SimpleTable';

export default function NodeDetails(props) {
  const { name } = useParams();
  const [item, setItem] = React.useState(null);
  const [nodeMetrics, setNodeMetrics] = React.useState(null);

  useConnectApi(
    api.node.get.bind(null, name, setItem),
    api.metrics.nodes.bind(null, setNodeMetrics)
  );

  function getAddresses(item) {
    return item.status.addresses.map(({type, address}) => {
      return {
        name: type,
        value: address,
      };
    });
  }

  return (
    !item ? <Loader /> :
    <PageGrid
      sections={[
        <MainInfoSection
          headerSection={
            <ChartsSection node={item} metrics={nodeMetrics} />
          }
          resource={item}
          mainInfo={item && [
            {
              name: 'Ready',
              value: <NodeReadyLabel node={item} />
            },
            {
              name: 'Pod CIDR',
              value: item.spec.podCIDR,
            },
            ...getAddresses(item)
          ]}
        />,
        <SystemInfoSection node={item} />
      ]}
    />
  );
}

function ChartsSection(props) {
  const { node, metrics } = props;

  function getUptime() {
    if (!node) {
      return '…';
    }

    const readyInfo = node.status.conditions.find(({type}) => type == 'Ready');
    if (readyInfo) {
      return timeAgo(readyInfo.lastTransitionTime);
    }

    return 'Not ready yet!';
  }

  return (
    <Grid
      container
      justify="space-around"
      style={{
        marginBottom: '2rem'
      }}
    >
      <Grid item>
        <HeaderLabel
          value={getUptime()}
          label="Uptime"
        />
      </Grid>
      <Grid item>
        <CpuCircularChart
          nodes={[node]}
          nodesMetrics={metrics}
        />
      </Grid>
      <Grid item>
        <MemoryCircularChart
          nodes={[node]}
          nodesMetrics={metrics}
        />
      </Grid>
    </Grid>
  );
}

function SystemInfoSection(props) {
  const { node } = props;

  function getOSComponent(osName) {
    let icon = null;

    if (osName.toLowerCase() == 'linux') {
      icon = <InlineIcon icon={penguinIcon} fontSize="1.4rem"/>;
    }

    return (
      <React.Fragment>
        {icon}
        <ValueLabel>{osName}</ValueLabel>
      </React.Fragment>
    );
  }

  return (
    <Paper>
      <SectionHeader
        title="System Info"
      />
      <SectionBox>
        <SectionGrid
          items={[
            <NameValueTable
              rows={[
                {
                  name: 'Architecture',
                  value: node.status.nodeInfo.architecture
                },
                {
                  name: 'Boot ID',
                  value: node.status.nodeInfo.bootID
                },
                {
                  name: 'System UUID',
                  value: node.status.nodeInfo.systemUUID
                },
                {
                  name: 'OS',
                  valueComponent: getOSComponent(node.status.nodeInfo.operatingSystem),
                },
                {
                  name: 'Image',
                  value: node.status.nodeInfo.osImage
                },
                {
                  name: 'Kernel Version',
                  value: node.status.nodeInfo.kernelVersion,
                },
              ]}
            />,
            <NameValueTable
              rows={[
                {
                  name: 'Machine ID',
                  value: node.status.nodeInfo.machineID,
                },
                {
                  name: 'Kube Proxy Version',
                  value: node.status.nodeInfo.kubeProxyVersion
                },
                {
                  name: 'Kubelet Version',
                  value: node.status.nodeInfo.kubeletVersion
                },
                {
                  name: 'Container Runtime Version',
                  value: node.status.nodeInfo.containerRuntimeVersion
                },
              ]}
            />
          ]}
        />
      </SectionBox>
    </Paper>
  );
}

export function NodeReadyLabel(props) {
  const { node } = props;
  const isReady = !!node.status.conditions
    .find(condition => condition.type == 'Ready' && condition.status == 'True');

  let status = null;
  let label = null;
  if (isReady) {
    status = 'success';
    label = 'Yes';
  } else {
    status = 'error';
    label = 'No';
  }

  return (
    <StatusLabel status={status}>
      {label}
    </StatusLabel>
  );
}
