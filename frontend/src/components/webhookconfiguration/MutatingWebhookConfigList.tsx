import { useTranslation } from 'react-i18next';
import MutatingWebhookConfiguration from '../../lib/k8s/mutatingWebhookConfiguration';
import ResourceListView from '../common/Resource/ResourceListView';

export default function MutatingWebhookConfigurationList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Mutating Webhook Configurations')}
      resourceClass={MutatingWebhookConfiguration}
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
