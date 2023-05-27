import { K8s, registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
import Message from './Message';

function PodCounter() {
  const [pods, error] = K8s.ResourceClasses.Pod.useList();
  const msg = pods === null ? 'Loading…' : pods.length.toString();
  return <Message msg={msg} error={error} />;
}

registerAppBarAction(PodCounter);

// registerAppBarAction({
//   processor: (_, actions) => {
//     const newActions = actions.filter(action => action.id !== 'pod-counter')
//     newActions.push({action: <PodCounter />, id: 'pod-counter'})
//     return newActions;
//   },
//   id: 'pod-counter-processor',
// });
