import { useParams } from 'react-router-dom';
import ValidatingWebhookConfiguration from '../../lib/k8s/validatingWebhookConfiguration';
import WebhookConfigurationDetails from './Details';

export default function ValidatingWebhookConfigurationDetails(props: { name?: string }) {
  const params = useParams<{ name: string }>();
  const { name = params.name } = props;

  return <WebhookConfigurationDetails resourceClass={ValidatingWebhookConfiguration} name={name} />;
}
