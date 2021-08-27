import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function RoleBindingDetails() {
  const { namespace = undefined, name } = useParams<{
    namespace: string | undefined;
    name: string;
  }>();
  const [item, setItem] = React.useState<RoleBinding | null>(null);
  const { t } = useTranslation('glossary');

  let cls = RoleBinding;
  if (!namespace) {
    cls = ClusterRoleBinding;
  }

  cls.useApiGet(setItem, name, namespace);

  return !item ? (
    <Loader title={t('role|Loading binding details')} />
  ) : (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={[
          {
            name: t('Reference Kind'),
            value: item.roleRef.kind,
          },
          {
            name: t('Reference Name'),
            value: item.roleRef.name,
          },
          {
            name: t('role|Ref. API Group'),
            value: item.roleRef.apiGroup,
          },
        ]}
      />
      <SectionBox title={t('Binding Info')}>
        <SimpleTable
          data={item.subjects}
          columns={[
            {
              label: t('Kind'),
              getter: item => item.kind,
            },
            {
              label: t('frequent|Name'),
              getter: item => item.name,
            },
            {
              label: t('Namespace'),
              getter: item => item.namespace,
            },
          ]}
        />
      </SectionBox>
      <DetailsViewPluginRenderer resource={item} />
    </PageGrid>
  );
}
