import { useTranslation } from 'react-i18next';
import ValidatingWebhookConfiguration from '../../lib/k8s/validatingWebhookConfiguration';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ValidatingWebhookConfigurationList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Validating Webhook Configurations')}
      resourceClass={ValidatingWebhookConfiguration}
      columns={[
        'name',
        {
          id: 'webhooks',
          label: t('Webhooks'),
          getter: mutatingWebhookConfig => mutatingWebhookConfig.webhooks?.length || 0,
        },
        'age',
      ]}
    />
  );
}
