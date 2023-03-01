import React from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';

export interface AuthVisibleProps extends React.PropsWithChildren<{}> {
  /** The item for which auth will be checked or a resource class (e.g. Job). */
  item: KubeObject;
  /** The verb associated with the permissions being verifying. See https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-the-request-verb . */
  authVerb: string;
  /** The subresource for which the permissions are being verifyied (e.g. "log" when checking for a pod's log). */
  subresource?: string;
  /** The namespace for which we're checking the permission, if applied. This is mostly useful when checking "creation" using a resource class, instead of an instance. */
  namespace?: string;
  /** Callback for when an error occurs.
   * @param err The error that occurred.
   */
  onError?: (err: Error) => void;
  /** Callback for when the authorization is checked.
   * @param result The result of the authorization check. Its `allowed` member will be true if the user is authorized to perform the specified action on the given resource; false otherwise. The `reason` member will contain a string explaining why the user is authorized or not.
   */
  onAuthResult?: (result: { allowed: boolean; reason: string }) => void;
}

/** A component that will only render its children if the user is authorized to perform the specified action on the given resource.
 * @param props The props for the component.
 */
export default function AuthVisible(props: AuthVisibleProps) {
  const { item, authVerb, subresource, namespace, onError, onAuthResult, children } = props;
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    if (!!item) {
      item
        .getAuthorization(authVerb, { subresource, namespace })
        .then((result: any) => {
          if (isMounted) {
            if (result.status?.allowed !== visible) {
              setVisible(!!result.status?.allowed);
            }
            if (!!onAuthResult) {
              onAuthResult({
                allowed: result.status?.allowed,
                reason: result.status?.reason || '',
              });
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
