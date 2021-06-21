import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ServiceAccount from '../../lib/k8s/serviceAccount';
import { Link } from '../common';
import { MainInfoSection } from '../common/Resource';

export default function ServiceAccountDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [item, setItem] = React.useState<ServiceAccount | null>(null);
  const { t } = useTranslation('glossary');

  ServiceAccount.useApiGet(setItem, name, namespace);

  return (
    <MainInfoSection
      resource={item}
      extraInfo={
        item && [
          {
            name: t('Secrets'),
            value: (
              <React.Fragment>
                {item.secrets.map(({ name }, index) => (
                  <React.Fragment key={`${name}__${index}`}>
                    <Link routeName={'secret'} params={{ namespace, name }}>
                      {name}
                    </Link>
                    {index !== item.secrets.length - 1 && ','}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ),
          },
        ]
      }
    />
  );
}
