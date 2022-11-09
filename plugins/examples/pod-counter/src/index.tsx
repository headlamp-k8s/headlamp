import { K8s, registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
import Message from './Message';

function PodCounter() {
  const [pods, error] = K8s.ResourceClasses.Pod.useList();
  const msg = pods === null ? 'Loading…' : pods.length.toString();
  return <Message msg={msg} error={error} />
}

registerAppBarAction(PodCounter);
