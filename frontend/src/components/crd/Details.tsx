import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ApiError } from '../../lib/k8s/apiProxy';
import CRD, { KubeCRD, makeCustomResourceClass } from '../../lib/k8s/crd';
import { Link, ObjectEventList } from '../common';
import Loader from '../common/Loader';
import { ConditionsTable, MainInfoSection, PageGrid } from '../common/Resource';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';
import DetailsViewSection from '../DetailsViewSection';

function getAPIGroups(item: KubeCRD) {
  const group = item.spec.group;
  const version = item.spec.version;
  const name = item.spec.names.plural as string;

  let versions: any[] = [];
  if (!version && item.spec.versions.length > 0) {
    item.spec.versions.map(versionItem => {
      versions.unshift([group, versionItem.name, name]);
    });
  } else {
    versions = [[group, version, name]];
  }

  return versions;
}

const useStyle = makeStyles({
  link: {
    cursor: 'pointer',
  },
});

function CustomResourceLink(props: { resource: KubeCRD; crd: CRD; [otherProps: string]: any }) {
  const classes = useStyle();
  const { resource, crd, ...otherProps } = props;

  return (
    <Link
      className={classes.link}
      routeName="customresource"
      params={{
        crName: resource.metadata.name,
        crd: crd.metadata.name,
        namespace: resource.metadata.namespace || '-',
      }}
      {...otherProps}
    >
      {resource.metadata.name}
    </Link>
  );
}

export default function CustomResourceDefinitionDetails() {
  const { name } = useParams<{ name: string }>();
  const [item, setItem] = React.useState<CRD | null>(null);
  const [error, setError] = React.useState<ApiError | null>(null);
  const { t } = useTranslation('glossary');

  CRD.useApiGet(setItem, name, undefined, setError);

  return !item ? (
    <Loader title={t('resource|Loading resource definition details')} />
  ) : (
    <PageGrid>
      <MainInfoSection
        resource={item}
        error={error}
        extraInfo={
          item && [
            {
              name: t('frequent|Group'),
              value: item.spec.group,
            },
            {
              name: t('Version'),
              value: item.getMainAPIGroup()[1],
            },
            {
              name: t('Scope'),
              value: item.spec.scope,
            },
            {
              name: t('Subresources'),
              value: item.spec.subresources && Object.keys(item.spec.subresources).join(' & '),
              hide: !item.spec.subresources,
            },
            {
              name: t('Resource'),
              value: (
                <Link
                  routeName="customresources"
                  params={{
                    crd: item.metadata.name,
                  }}
                >
                  {item.spec.names.kind}
                </Link>
              ),
            },
          ]
        }
      />
      <SectionBox title={t('crd|Accepted Names')}>
        <SimpleTable
          data={[item.spec.names]}
          columns={[
            {
              label: t('Plural'),
              datum: 'plural',
            },
            {
              label: t('Singular'),
              datum: 'singular',
            },
            {
              label: t('glossary|Kind'),
              datum: 'kind',
            },
            {
              label: t('List Kind'),
              datum: 'listKind',
            },
          ]}
          reflectInURL="acceptedNames"
        />
      </SectionBox>
      <SectionBox title={t('frequent|Versions')}>
        <SimpleTable
          data={item.spec.versions}
          columns={[
            {
              label: t('frequent|Name'),
              datum: 'name',
            },
            {
              label: t('Served'),
              getter: version => version.storage.toString(),
            },
            {
              label: t('Storage'),
              getter: version => version.storage.toString(),
            },
          ]}
          reflectInURL="versions"
        />
      </SectionBox>
      <SectionBox title={t('Conditions')}>
        <ConditionsTable resource={item.jsonData} showLastUpdate={false} />
      </SectionBox>
      <SectionBox title={t('Objects')}>
        <CRObjectsTable crd={item} />
      </SectionBox>
      <DetailsViewSection resource={item} />
      {item && <ObjectEventList object={item} />}
    </PageGrid>
  );
}

interface CRObjectsTableProps {
  crd: CRD;
}

function CRObjectsTable(props: CRObjectsTableProps) {
  const { crd } = props;
  const { t } = useTranslation('glossary');

  const CRClass = makeCustomResourceClass(getAPIGroups(crd.jsonData), crd.metadata.namespace);

  return (
    <ResourceTable
      resourceClass={CRClass}
      columns={[
        {
          label: t('frequent|Name'),
          getter: obj => <CustomResourceLink resource={obj} crd={crd} />,
        },
        {
          label: t('glossary|Namespace'),
          getter: obj => obj.metadata.namespace || '-',
        },
        'age',
      ]}
      reflectInURL="objects"
    />
  );
}
