import React, { isValidElement, ReactElement, ReactNode, useMemo } from 'react';
import { KubeObject } from '../../lib/k8s/cluster';
import { HeadlampEventType, useEventCallback } from '../../redux/headlampEventSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';
import ErrorBoundary from '../common/ErrorBoundary';

export interface DetailsViewSectionProps {
  resource: KubeObject;
}
export type DetailsViewSectionType =
  | ((...args: any[]) => JSX.Element | null | ReactNode)
  | null
  | ReactElement
  | ReactNode;

/**
 * View components registered by plugins in the different Details views.
 *
 * @see registerDetailsViewSection
 */
export default function DetailsViewSection(props: DetailsViewSectionProps) {
  const { resource } = props;
  const detailViews = useTypedSelector(state => state.detailsViewSection.detailViews);
  const dispatchHeadlampEvent = useEventCallback(HeadlampEventType.DETAILS_VIEW);

  React.useEffect(() => {
    dispatchHeadlampEvent({ resource });
  }, [resource]);

  const memoizedComponents = useMemo(
    () =>
      detailViews.map((Component, index) => {
        if (!resource || !Component) {
          return null;
        }

        return <ErrorBoundary key={index}>{isValidElement(Component) && Component}</ErrorBoundary>;
      }),
    [detailViews, resource]
  );
  return <>{memoizedComponents}</>;
}
