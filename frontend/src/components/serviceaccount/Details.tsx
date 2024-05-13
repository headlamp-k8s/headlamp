import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ServiceAccount from '../../lib/k8s/serviceAccount';
import Link from '../common/Link';
import { DetailsGrid } from '../common/Resource';

export default function ServiceAccountDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={ServiceAccount}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={(item: ServiceAccount) =>
        item && [
          {
            name: t('Secrets'),
            value: (
              <React.Fragment>
                {item.secrets?.map(({ name }, index) => (
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
