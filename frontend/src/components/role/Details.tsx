import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import ClusterRole from '../../lib/k8s/clusterRole';
import Role from '../../lib/k8s/role';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function RoleDetails() {
  const { namespace = undefined, name } = useParams<{
    namespace: string | undefined;
    name: string;
  }>();
  const [item, setItem] = React.useState<Role | null>(null);
  const { t } = useTranslation('glossary');

  let cls = Role;
  if (!namespace) {
    cls = ClusterRole;
  }

  cls.useApiGet(setItem, name!, namespace);

  return !item ? (
    <Loader title={'role|Loading role details'} />
  ) : (
    <PageGrid>
      <MainInfoSection resource={item} />
      <SectionBox title={t('Rules')}>
        <SimpleTable
          columns={[
            {
              label: t('API Groups'),
              getter: ({ apiGroups = [] }) => apiGroups.join(', '),
            },
            {
              label: t('Resources'),
              getter: ({ resources = [] }) => resources.join(', '),
            },
            {
              label: t('Non Resources'),
              getter: ({ nonResources = [] }) => nonResources.join(', '),
            },
            {
              label: t('Verbs'),
              getter: ({ verbs = [] }) => verbs.join(', '),
            },
          ]}
          data={item.rules}
        />
      </SectionBox>
      <DetailsViewPluginRenderer resource={item} />
    </PageGrid>
  );
}
