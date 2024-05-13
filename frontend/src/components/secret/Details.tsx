import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Secret from '../../lib/k8s/secret';
import EmptyContent from '../common/EmptyContent';
import { DetailsGrid, SecretField } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import { NameValueTable, NameValueTableRow } from '../common/SimpleTable';

export default function SecretDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation();

  return (
    <DetailsGrid
      resourceType={Secret}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('translation|Type'),
            value: item.type,
          },
        ]
      }
      extraSections={item =>
        item && [
          {
            id: 'headlamp.secrets-data',
            section: () => {
              const itemData = item?.data || {};
              const mainRows: NameValueTableRow[] = Object.entries(itemData).map(
                (item: unknown[]) => ({
                  name: item[0] as string,
                  value: <SecretField value={item[1]} />,
                })
              );
              return (
                <SectionBox title={t('translation|Data')}>
                  {mainRows.length === 0 ? (
                    <EmptyContent>{t('No data in this secret')}</EmptyContent>
                  ) : (
                    <NameValueTable rows={mainRows} />
                  )}
                </SectionBox>
              );
            },
          },
        ]
      }
    />
  );
}
