import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CRD, { KubeCRD } from '../../lib/k8s/crd';
import { Link, Loader, SectionBox } from '../common/';
import Empty from '../common/EmptyContent';
import { ResourceListView } from '../common/Resource';

interface State {
  crList: KubeCRD[];
  loading: boolean;
  crDictionary: Map<string, KubeCRD>;
}

export function CrInstanceList() {
  const { t } = useTranslation(['glossary', 'translation']);
  const [crds, crdsError] = CRD.useList();
  const [state, setState] = useState<State>({
    crList: [],
    loading: true,
    crDictionary: new Map<string, KubeCRD>(),
  });

  useEffect(() => {
    const fetchCRs = async () => {
      const allCrs: KubeCRD[] = [];
      const newCrDictionary = new Map<string, KubeCRD>();

      for (const crd of crds) {
        const crClass = crd.makeCRClass();
        const [crItems, crError] = await new Promise<[KubeCRD[] | null, any | null]>(resolve => {
          crClass.apiList(
            (items: KubeCRD[]) => resolve([items, null]),
            (err: any) => resolve([null, err])
          )();
        });

        if (crError) {
          console.error('Error fetching CRs:', crError);
          continue;
        }

        if (crItems && crItems.length > 0) {
          allCrs.push(...crItems);
          for (const item of crItems) {
            newCrDictionary.set(item.metadata.name, crd);
          }
        }
      }

      setState({
        crList: allCrs,
        loading: false,
        crDictionary: newCrDictionary,
      });
    };

    if (crds) {
      fetchCRs();
    }
  }, [crds]);

  if (crdsError) {
    return (
      <Empty color="error">
        {t('translation|Error getting custom resource definitions: {{ errorMessage }}', {
          errorMessage: crdsError,
        })}
      </Empty>
    );
  }

  if (state.loading) {
    return <Loader title={t('translation|Loading custom resource instances')} />;
  }

  if (state.crList.length === 0) {
    return <Empty>{t('translation|No custom resources found.')}</Empty>;
  }

  return (
    <SectionBox backLink>
      <ResourceListView
        title="Custom Resource Instances"
        headerProps={{
          noNamespaceFilter: false,
        }}
        data={state.crList}
        columns={[
          {
            label: 'Instance name',
            getValue: cr => {
              return cr.metadata.name;
            },
            render: cr => {
              return (
                <Link
                  routeName="customresource"
                  params={{
                    crName: cr.metadata.name,
                    crd: `${state.crDictionary.get(cr.metadata.name)?.metadata.name}`,
                    namespace: cr.metadata.namespace || '-',
                  }}
                >
                  {cr.metadata.name} {/*crd.metadata.name*/}
                </Link>
              );
            },
          },
          {
            label: 'CRD',
            getValue: cr => {
              return cr.kind;
            },
            render: cr => {
              return (
                <Link
                  routeName="crd"
                  params={{
                    name: `${state.crDictionary.get(cr.metadata.name)?.metadata.name}`,
                  }}
                >
                  {cr.kind} {/*crd.metadata.name*/}
                </Link>
              );
            },
          },
          {
            label: 'Categories',
            getValue: cr => {
              const categories = state.crDictionary.get(cr.metadata.name)?.jsonData!.status
                .acceptedNames.categories;
              return categories !== undefined ? categories.toString().split(',').join(', ') : '';
            },
          },
          'namespace',

          'age',
        ]}
      />
    </SectionBox>
  );
}
