import penguinIcon from '@iconify/icons-mdi/penguin';
import { InlineIcon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeMetrics } from '../../lib/k8s/cluster';
import Node from '../../lib/k8s/node';
import { timeAgo } from '../../lib/util';
import { CpuCircularChart, MemoryCircularChart } from '../cluster/Charts';
import { HeaderLabel, StatusLabel, StatusLabelProps, ValueLabel } from '../common/Label';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import { NameValueTable } from '../common/SimpleTable';

export default function NodeDetails() {
  const { name } = useParams();
  const [item, setItem] = React.useState<Node | null>(null);
  const [nodeMetrics, setNodeMetrics] = React.useState(null);

  Node.useApiGet(setItem, name);

  useConnectApi(
    api.metrics.nodes.bind(null, setNodeMetrics)
  );

  function getAddresses(item: Node) {
    return item.status.addresses.map(({type, address}) => {
      return {
        name: type,
        value: address,
      };
    });
  }

  return (
    !item ? <Loader /> :
    <PageGrid>
      <MainInfoSection

        headerSection={
          <ChartsSection node={item} metrics={nodeMetrics} />
        }
        resource={item}
        extraInfo={item && [
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
      />
      <SystemInfoSection node={item} />
    </PageGrid>
  );
}

interface ChartsSectionProps {
  node: Node | null;
  metrics: KubeMetrics[] | null;
}

function ChartsSection(props: ChartsSectionProps) {
  const { node, metrics } = props;

  function getUptime() {
    if (!node) {
      return '…';
    }

    const readyInfo = node.status.conditions.find(({type}) => type === 'Ready');
    if (readyInfo) {
      return timeAgo((readyInfo.lastTransitionTime as string));
    }

    return 'Not ready yet!';
  }

  return (
    <Box py={2}>
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
            items={node && [node]}
            itemsMetrics={metrics}
          />
        </Grid>
        <Grid item>
          <MemoryCircularChart
            items={node && [node]}
            itemsMetrics={metrics}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

interface SystemInfoSectionProps {
  node: Node;
}

function SystemInfoSection(props: SystemInfoSectionProps) {
  const { node } = props;

  function getOSComponent(osName: string) {
    let icon = null;

    if (osName.toLowerCase() === 'linux') {
      icon = <InlineIcon icon={penguinIcon} />;
    }

    return (
      <React.Fragment>
        {icon}
        <ValueLabel>{osName}</ValueLabel>
      </React.Fragment>
    );
  }

  return (
    <SectionBox title="System Info">
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
            value: getOSComponent(node.status.nodeInfo.operatingSystem),
          },
          {
            name: 'Image',
            value: node.status.nodeInfo.osImage
          },
          {
            name: 'Kernel Version',
            value: node.status.nodeInfo.kernelVersion,
          },
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
    </SectionBox>
  );
}

interface NodeReadyLabelProps {
  node: Node;
}

export function NodeReadyLabel(props: NodeReadyLabelProps) {
  const { node } = props;
  const isReady = !!node.status.conditions
    .find(condition => condition.type === 'Ready' && condition.status === 'True');

  let status: StatusLabelProps['status'] = '';
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
