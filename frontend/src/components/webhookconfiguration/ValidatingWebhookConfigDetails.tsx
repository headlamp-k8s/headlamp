import { useParams } from 'react-router-dom';
import ValidatingWebhookConfiguration from '../../lib/k8s/validatingWebhookConfiguration';
import WebhookConfigurationDetails from './Details';

export default function ValidatingWebhookConfigurationDetails() {
  const { name } = useParams<{ name: string }>();

  return <WebhookConfigurationDetails resourceClass={ValidatingWebhookConfiguration} name={name} />;
}
