import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import Loader from '../common/Loader';
import { DataField, MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';

export default function ConfigDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  console.log(item);

  useConnectApi(
    api.configMap.get.bind(null, namespace, name, setItem),
  );

  return (
    !item ? <Loader /> :
    <PageGrid
      sections={[
        <MainInfoSection resource={item} />,
        <Paper>
          <SectionHeader title="Data" />
          {Object.keys(item.data).map((key, i) =>
            <React.Fragment key={i}>
            <SectionBox marginBottom="2rem">
              <DataField label={key} value={item.data[key]} />
            </SectionBox>
            </React.Fragment>
          )
          }
        </Paper>
      ]}
    />
  );
}