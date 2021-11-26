import { JSONPath } from 'jsonpath-plus';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import { ApiError } from '../../lib/k8s/apiProxy';
import CRD, { KubeCRD, makeCustomResourceClass } from '../../lib/k8s/crd';
import { localeDate } from '../../lib/util';
import { HoverInfoLabel, NameValueTableRow, SectionBox } from '../common';
import Empty from '../common/EmptyContent';
import Loader from '../common/Loader';
import { ConditionsTable, MainInfoSection, PageGrid } from '../common/Resource';

/* istanbul ignore next */
export default function CustomResourceDetails() {
  const {
    crd: crdName,
    namespace: ns,
    crName,
  } = useParams<{
    crd: string;
    crName: string;
    namespace: string;
  }>();
  const [crd, setCRD] = React.useState<CRD | null>(null);
  const [error, setError] = React.useState<ApiError | null>(null);

  const { t } = useTranslation('glossary');

  const namespace = ns === '-' ? undefined : ns;

  CRD.useApiGet(setCRD, crdName, undefined, setError);

  return !crd ? (
    !!error ? (
      <Empty color="error">
        {t(`crd|Error getting custom resource definition ${crdName}: ${error.message}`)}
      </Empty>
    ) : (
      <Loader title={t('crd|Loading custom resource details')} />
    )
  ) : (
    <CustomResourceDetailsRenderer crd={crd} crName={crName} namespace={namespace} />
  );
}

type AdditionalPrinterColumns = KubeCRD['spec']['versions'][0]['additionalPrinterColumns'];

/* istanbul ignore next */
function getExtraColumns(crd: CRD, apiVersion: string) {
  const version = (crd.jsonData as KubeCRD).spec.versions.find(
    version => version.name === apiVersion
  );
  return version?.additionalPrinterColumns;
}

/* istanbul ignore next */
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

/* istanbul ignore next */
function CustomResourceDetailsRenderer(props: { crd: CRD; crName: string; namespace?: string }) {
  const { crd, crName, namespace } = props;
  const [item, setItem] = React.useState<KubeCRD | null>(null);
  const [error, setError] = React.useState<ApiError | null>(null);

  const { t } = useTranslation('glossary');

  let CRClass: ReturnType<typeof makeCustomResourceClass> | null = null;

  const versions: [string, string, string][] = (crd.jsonData as KubeCRD).spec.versions.map(
    versionInfo => [crd.spec.group, versionInfo.name, crd.spec.names.plural]
  );
  CRClass = makeCustomResourceClass(versions, !!namespace);
  CRClass.useApiGet(setItem, crName, namespace, setError);

  const apiVersion = item?.jsonData.apiVersion?.split('/')[1] || '';
  const extraColumns: AdditionalPrinterColumns = getExtraColumns(crd, apiVersion) || [];

  return !item ? (
    !!error ? (
      <Empty color="error">
        {t(`crd|Error getting custom resource1 ${crName}: ${error.message}`)}
      </Empty>
    ) : (
      <Loader title={t('crd|Loading custom resource details')} />
    )
  ) : (
    <PageGrid>
      <MainInfoSection
        resource={item}
        backLink={crd.detailsRoute}
        extraInfo={getExtraInfo(extraColumns, item!.jsonData)}
      />
      {item!.jsonData.status?.conditions && (
        <SectionBox>
          <ConditionsTable resource={item.jsonData} showLastUpdate={false} />
        </SectionBox>
      )}
      <DetailsViewPluginRenderer resource={item} />
    </PageGrid>
  );
}
