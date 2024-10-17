import { useParams } from 'react-router-dom';
import MutatingWebhookConfiguration from '../../lib/k8s/mutatingWebhookConfiguration';
import WebhookConfigurationDetails from './Details';

export default function MutatingWebhookConfigList(props: { name?: string }) {
  const params = useParams<{ name: string }>();
  const name = props.name ?? params.name;

  return <WebhookConfigurationDetails resourceClass={MutatingWebhookConfiguration} name={name} />;
}
