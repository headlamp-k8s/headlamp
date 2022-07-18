import { useTranslation } from 'react-i18next';
import CRD from '../../lib/k8s/crd';
import { Link } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function CustomResourceDefinitionList() {
  const { t } = useTranslation('glossary');

  return (
    <SectionBox
      title={<SectionFilterHeader title={t('crd|Custom Resource Definitions')} noNamespaceFilter />}
    >
      <ResourceTable
        resourceClass={CRD}
        columns={[
          {
            label: t('frequent|Name'),
            getter: crd => (
              <Link
                routeName="crd"
                params={{
                  name: crd.metadata.name,
                }}
              >
                {crd.spec.names.kind}
              </Link>
            ),
          },
          {
            label: t('frequent|Group'),
            getter: crd => crd.spec.group,
            sort: true,
          },
          {
            label: t('Scope'),
            getter: crd => crd.spec.scope,
            sort: true,
          },
          {
            label: t('frequent|Full name'),
            getter: crd => crd.metadata.name,
            sort: (c1: CRD, c2: CRD) => {
              if (c1.metadata.name < c2.metadata.name) {
                return -1;
              } else if (c1.metadata.name > c2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
