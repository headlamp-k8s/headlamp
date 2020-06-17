import Box from '@material-ui/core/Box';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeConfigMap } from '../../lib/k8s/cluster';
import Empty from '../common/EmptyContent';
import Loader from '../common/Loader';
import { DataField, MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';

export default function ConfigDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<KubeConfigMap | null>(null);
  const itemData = item?.data;

  useConnectApi(
    api.configMap.get.bind(null, namespace, name, setItem),
  );

  return (
    !item ? <Loader /> :
    <PageGrid>
      <MainInfoSection resource={item} />
      <SectionBox title="Data">
        {!itemData ?
          <Empty>No data in this config map</Empty>
          : Object.keys(itemData).map((key, i) =>
            <Box py={2} key={i}>
              <DataField label={key} value={itemData[key]} />
            </Box>
          )
        }
      </SectionBox>
    </PageGrid>
  );
}
