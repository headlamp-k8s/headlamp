import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { ConditionsTable, MainInfoSection, MetadataDictGrid, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';

export default function Deployment() {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.deployment.get.bind(null, namespace, name, setItem),
  );

  return (
    <PageGrid
      sections={[
        <MainInfoSection
          resource={item}
          extraInfo={item && [
            {
              name: 'Strategy Type',
              value: item.spec.strategy.type,
            },
            {
              name: 'Selector',
              value: <MetadataDictGrid dict={item.spec.selector.matchLabels} />,
            },
          ]}
        />
        ,
        <ReplicasSection resource={item} />
      ]}
    />
  );
}

function ReplicasSection(props) {
  const { resource } = props;

  return (
    <Paper>
      <SectionHeader
        title="Conditions"
      />
      <SectionBox>
        <ConditionsTable resource={resource} />
      </SectionBox>
    </Paper>
  );
}