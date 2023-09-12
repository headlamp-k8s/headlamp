import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ClusterRole from '../../lib/k8s/clusterRole';
import Role from '../../lib/k8s/role';
import { DetailsGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function RoleDetails() {
  const { namespace = undefined, name } = useParams<{
    namespace: string | undefined;
    name: string;
  }>();
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={!namespace ? ClusterRole : Role}
      name={name}
      namespace={namespace}
      withEvents
      extraSections={item =>
        item && [
          {
            id: 'headlamp.role-rules',
            section: (
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
                  data={item.rules || []}
                  reflectInURL="rules"
                />
              </SectionBox>
            ),
          },
        ]
      }
    />
  );
}
