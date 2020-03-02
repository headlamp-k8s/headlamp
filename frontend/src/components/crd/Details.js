import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { apiFactory, apiFactoryWithNamespace } from '../../lib/apiProxy';
import { timeAgo } from '../../lib/util';
import { ViewDialog } from '../common/EditorDialog';
import Loader from '../common/Loader';
import { ConditionsTable, MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

function getAPIForCRD(item) {
  const group = item.spec.group;
  const version = item.spec.version;
  const name = item.spec.names.plural;

  if (item.spec.scope === 'Namespaced') {
    return apiFactoryWithNamespace(group, version, name);
  }
  return apiFactory(group, version, name);
}

const useStyle = makeStyles({
  link: {
    cursor: 'pointer'
  }
});

export default function CustomResourceDefinitionDetails(props) {
  const classes = useStyle();
  const { name } = useParams();
  const [item, setItem] = React.useState(null);
  const [objToShow, setObjToShow] = React.useState(null);
  const [objects, setObjects] = React.useState([]);

  useConnectApi(
    api.crd.get.bind(null, name, setItem),
  );

  React.useEffect(() => {
    let promise = null;
    if (item) {
      promise = getAPIForCRD(item).list(setObjects);
    }

    return function cleanup () {
      if (promise) {
        promise.then(cancellable => cancellable());
      }
    };
  },
  [item]);

  return (
    !item ? <Loader /> :
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={item && [
          {
            name: 'Group',
            value: item.spec.group,
          },
          {
            name: 'Version',
            value: item.spec.version,
          },
          {
            name: 'Scope',
            value: item.spec.scope,
          },
          {
            name: 'Subresources',
            value: item.spec.subresources && Object.keys(item.spec.subresources).join(' & '),
            hide: !item.spec.subresources
          },
        ]}
      />
      <Paper>
        <SectionHeader
          title="Accepted Names"
        />
        <SectionBox>
          <SimpleTable
            data={[item.spec.names]}
            columns={[
              {
                label: 'Plural',
                datum: 'plural'
              },
              {
                label: 'Singular',
                datum: 'singular',
              },
              {
                label: 'Kind',
                datum: 'kind',
              },
              {
                label: 'List Kind',
                datum: 'listKind',
              }
            ]}
          />
        </SectionBox>
      </Paper>
      <Paper>
        <SectionHeader
          title="Versions"
        />
        <SectionBox>
          <SimpleTable
            data={item.spec.versions}
            columns={[
              {
                label: 'Name',
                datum: 'name'
              },
              {
                label: 'Served',
                getter: version => version.storage.toString(),
              },
              {
                label: 'Storage',
                getter: version => version.storage.toString(),
              }
            ]}
          />
        </SectionBox>
      </Paper>
      <Paper>
        <SectionHeader
          title="Conditions"
        />
        <SectionBox>
          <ConditionsTable
            resource={item}
            showLastUpdate={false}
          />
        </SectionBox>
      </Paper>
      <Paper>
        <SectionHeader
          title="Objects"
        />
        <SectionBox>
          <SimpleTable
            data={objects}
            columns={[
              {
                label: 'Name',
                getter: obj =>
                  <Link
                    className={classes.link}
                    onClick={() => setObjToShow(obj)}
                  >
                    {obj.metadata.name}
                  </Link>
              },
              {
                label: 'Namespace',
                getter: obj => obj.metadata.namespace || '-',
              },
              {
                label: 'Created',
                getter: obj => timeAgo(obj.metadata.creationTimestamp),
              }
            ]}
          />
        </SectionBox>
      </Paper>
      <ViewDialog
        item={objToShow}
        open={!!objToShow}
        onClose={() => setObjToShow(null)}
      />
    </PageGrid>
  );
}
