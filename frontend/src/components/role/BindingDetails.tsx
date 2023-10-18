import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import { Link } from '../common';
import { DetailsGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function RoleBindingDetails() {
  const { namespace = undefined, name } = useParams<{
    namespace: string | undefined;
    name: string;
  }>();
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={!!namespace ? RoleBinding : ClusterRoleBinding}
      namespace={namespace}
      name={name}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('Reference Kind'),
            value: item.roleRef.kind,
          },
          {
            name: t('Reference Name'),
            value: item.roleRef.name,
          },
          {
            name: t('Ref. API Group'),
            value: item.roleRef.apiGroup,
          },
        ]
      }
      extraSections={item =>
        item && [
          {
            id: 'headlamp.role-binding-info',
            section: (
              <SectionBox title={t('Binding Info')}>
                <SimpleTable
                  data={item.subjects}
                  columns={[
                    {
                      label: t('Kind'),
                      getter: item => item.kind,
                    },
                    {
                      label: t('translation|Name'),
                      getter: item =>
                        // item can hold a reference to non kube Objects
                        // such as user and group names, in that case
                        // dont create a link.
                        !item?.apiGroup ? (
                          <Link
                            routeName={item.kind}
                            params={{ namespace: item.namespace || namespace, name: item.name }}
                          >
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        ),
                    },
                    {
                      label: t('Namespace'),
                      getter: item => item.namespace,
                    },
                  ]}
                  reflectInURL="bindingInfo"
                />
              </SectionBox>
            ),
          },
        ]
      }
    />
  );
}
