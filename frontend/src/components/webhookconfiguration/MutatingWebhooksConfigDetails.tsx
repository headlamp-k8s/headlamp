import { useParams } from 'react-router-dom';
import MutatingWebhookConfiguration from '../../lib/k8s/mutatingWebhookConfiguration';
import WebhookConfigurationDetails from './Details';

export default function MutatingWebhookConfigList() {
  const { name } = useParams<{ name: string }>();

  return <WebhookConfigurationDetails resourceClass={MutatingWebhookConfiguration} name={name} />;
}
