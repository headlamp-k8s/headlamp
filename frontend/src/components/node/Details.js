import penguinIcon from '@iconify/icons-mdi/penguin';
import { InlineIcon } from '@iconify/react';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { ValueLabel } from '../common/Label';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid, SectionGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import { NameValueTable } from '../common/SimpleTable';

export default function NodeDetails(props) {
  const { name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.node.get.bind(null, name, setItem),
  );

  function getAddresses(item) {
    return item.status.addresses.map(({type, address}) => {
      return {
        name: type,
        value: address,
      };
    });
  }

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
    !item ? <Loader /> :
    <PageGrid
      sections={[
        <MainInfoSection
          resource={item}
          mainInfo={item && [
            {
              name: 'Pod CIDR',
              value: item.spec.podCIDR,
            },
            ...getAddresses(item)
          ]}
        />,
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
                      value: item.status.nodeInfo.architecture
                    },
                    {
                      name: 'Boot ID',
                      value: item.status.nodeInfo.bootID
                    },
                    {
                      name: 'System UUID',
                      value: item.status.nodeInfo.systemUUID
                    },
                    {
                      name: 'OS',
                      valueComponent: getOSComponent(item.status.nodeInfo.operatingSystem),
                    },
                    {
                      name: 'Image',
                      value: item.status.nodeInfo.osImage
                    },
                    {
                      name: 'Kernel Version',
                      value: item.status.nodeInfo.kernelVersion,
                    },
                  ]}
                />,
                <NameValueTable
                  rows={[
                    {
                      name: 'Machine ID',
                      value: item.status.nodeInfo.machineID,
                    },
                    {
                      name: 'Kube Proxy Version',
                      value: item.status.nodeInfo.kubeProxyVersion
                    },
                    {
                      name: 'Kubelet Version',
                      value: item.status.nodeInfo.kubeletVersion
                    },
                    {
                      name: 'Container Runtime Version',
                      value: item.status.nodeInfo.containerRuntimeVersion
                    },
                  ]}
                />
              ]}
            />
          </SectionBox>
        </Paper>
      ]}
    />
  );
}
