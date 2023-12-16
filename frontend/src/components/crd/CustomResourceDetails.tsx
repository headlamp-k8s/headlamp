import { JSONPath } from 'jsonpath-plus';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ResourceClasses } from '../../lib/k8s';
import { ApiError } from '../../lib/k8s/apiProxy';
import CustomResourceDefinition, { KubeCRD } from '../../lib/k8s/crd';
import { localeDate } from '../../lib/util';
import { HoverInfoLabel, Link, NameValueTableRow, ObjectEventList, SectionBox } from '../common';
import Empty from '../common/EmptyContent';
import Loader from '../common/Loader';
import { ConditionsTable, MainInfoSection, PageGrid } from '../common/Resource';
import DetailsViewSection from '../DetailsViewSection';

export default function CustomResourceDetailsFromURL() {
  const params = useParams<CustomResourceDetailsProps>();

  return <CustomResourceDetails {...params} />;
}

export interface CustomResourceDetailsProps {
  crd: string;
  crName: string;
  namespace: string;
}

export function CustomResourceDetails(props: CustomResourceDetailsProps) {
  const { crd: crdName, crName, namespace: ns } = props;
  const [crd, setCRD] = React.useState<CustomResourceDefinition | null>(null);
  const [error, setError] = React.useState<ApiError | null>(null);

  const { t } = useTranslation('glossary');

  const namespace = ns === '-' ? undefined : ns;
  const CRD = ResourceClasses.CustomResourceDefinition as CustomResourceDefinition;

  CRD.useApiGet(setCRD, crdName, undefined, setError);

  return !crd ? (
    !!error ? (
      <Empty color="error">
        {t(
          'translation|Error getting custom resource definition {{ crdName }}: {{ errorMessage }}',
          {
            crdName,
            errorMessage: error.message,
          }
        )}
      </Empty>
    ) : (
      <Loader title={t('translation|Loading custom resource details')} />
    )
  ) : (
    <CustomResourceDetailsRenderer crd={crd} crName={crName} namespace={namespace} />
  );
}

type AdditionalPrinterColumns = KubeCRD['spec']['versions'][0]['additionalPrinterColumns'];

function getExtraColumns(crd: CustomResourceDefinition, apiVersion: string) {
  const version = (crd.jsonData as KubeCRD).spec.versions.find(
    version => version.name === apiVersion
  );
  return version?.additionalPrinterColumns;
}

function getExtraInfo(extraInfoSpec: AdditionalPrinterColumns, item: KubeCRD) {
  const extraInfo: NameValueTableRow[] = [];
  extraInfoSpec.forEach(spec => {
    // Skip creation date because we already show it by default
    if (spec.jsonPath === '.metadata.creationTimestamp') {
      return;
    }

    let value: string | undefined;
    try {
      // Extract the value from the json item
      value = JSONPath({ path: '$' + spec.jsonPath, json: item });
    } catch (err) {
      console.error(`Failed to get value from JSONPath ${spec.jsonPath} on CR item ${item}`);
      return;
    }

    if (spec.type === 'date' && !!value) {
      value = localeDate(new Date(value));
    } else {
      // Make sure the value will be represented in string form (to account for
      // e.g. cases where we may get an array).
      value = value?.toString();
    }

    const desc = spec.description;

    extraInfo.push({
      name: spec.name,
      value: !!desc ? <HoverInfoLabel label={value || ''} hoverInfo={desc} /> : value,
      hide: value === '' || value === undefined,
    });
  });

  return extraInfo;
}

export interface CustomResourceDetailsRendererProps {
  crd: CustomResourceDefinition;
  crName: string;
  namespace?: string;
}

function CustomResourceDetailsRenderer(props: CustomResourceDetailsRendererProps) {
  const { crd, crName, namespace } = props;
  const [item, setItem] = React.useState<KubeCRD | null>(null);
  const [error, setError] = React.useState<ApiError | null>(null);

  const { t } = useTranslation('glossary');

  const CRClass = React.useMemo(() => {
    return crd.makeCRClass();
  }, [crd]);

  CRClass.useApiGet(setItem, crName, namespace, setError);

  const apiVersion = item?.jsonData.apiVersion?.split('/')[1] || '';
  const extraColumns: AdditionalPrinterColumns = getExtraColumns(crd, apiVersion) || [];

  return !item ? (
    !!error ? (
      <Empty color="error">
        {t('translation|Error getting custom resource {{ crName }}: {{ errorMessage }}', {
          crName,
          errorMessage: error.message,
        })}
      </Empty>
    ) : (
      <Loader title={t('translation|Loading custom resource details')} />
    )
  ) : (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={[
          {
            name: t('glossary|Definition'),
            value: (
              <Link
                routeName="crd"
                params={{
                  name: crd.metadata.name,
                }}
              >
                {crd.metadata.name}
              </Link>
            ),
          },
          ...getExtraInfo(extraColumns, item!.jsonData),
        ]}
        backLink=""
      />
      {item!.jsonData.status?.conditions && (
        <SectionBox>
          <ConditionsTable resource={item.jsonData} showLastUpdate={false} />
        </SectionBox>
      )}
      <DetailsViewSection resource={item} />
      {item && <ObjectEventList object={item} />}
    </PageGrid>
  );
}
