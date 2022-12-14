import React from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';

export interface AuthVisibleProps extends React.PropsWithChildren<{}> {
  /** The item for which auth will be checked. */
  item: KubeObject;
  /** The verb associated with the permissions being verifying. See https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb . */
  authVerb: string;
  /** The subresource for which the permissions are being verifyied (e.g. "log" when checking for a pod's log). */
  subresource?: string;
  /** Callback for when an error occurs.
   * @param err The error that occurred.
   */
  onError?: (err: Error) => void;
  /** Callback for when the user is not authorized to perform the action. */
  onUnauthorized?: () => void;
}

/** A component that will only render its children if the user is authorized to perform the specified action on the given resource.
 * @param props The props for the component.
 */
export default function AuthVisible(props: AuthVisibleProps) {
  const { item, authVerb, subresource, onError, onUnauthorized, children } = props;
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    if (!!item) {
      item
        .getAuthorization(authVerb, { subresource })
        .then((result: any) => {
          if (isMounted) {
            if (result.status?.allowed !== visible) {
              setVisible(!!result.status?.allowed);
            }
            if (!!onUnauthorized) {
              onUnauthorized();
            }
          }
        })
        .catch((err: Error) => {
          if (isMounted) {
            if (!!onError) {
              onError(err);
            }
            setVisible(false);
          }
        });
    }

    return function cleanup() {
      isMounted = false;
    };
  }, [item]);

  if (!visible) {
    return null;
  }

  return <>{children}</>;
}
