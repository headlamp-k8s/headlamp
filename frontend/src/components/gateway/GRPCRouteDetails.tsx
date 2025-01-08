import { useParams } from 'react-router-dom';
import GRPCRoute from '../../lib/k8s/grpcRoute';
import { DetailsGrid } from '../common/Resource';
import { GatewayParentRefSection } from './utils';

export default function GRPCRouteDetails(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;

  return (
    <DetailsGrid
      resourceType={GRPCRoute}
      name={name}
      namespace={namespace}
      withEvents
      extraSections={(item: GRPCRoute) =>
        item && [
          {
            id: 'headlamp.httproute-parentrefs',
            section: <GatewayParentRefSection parentRefs={item?.parentRefs || []} />,
          },
        ]
      }
    />
  );
}
