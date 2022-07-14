import React, { ComponentType, isValidElement, ReactElement, useMemo } from 'react';
import { KubeObject } from '../../lib/k8s/cluster';
import { useTypedSelector } from '../../redux/reducers/reducers';

export interface DetailsViewSectionProps {
  resource: KubeObject;
}
export type DetailsViewSectionType = ComponentType<DetailsViewSectionProps> | ReactElement | null;

/**
 * View components registered by plugins in the different Details views.
 *
 * @see registerDetailsViewSection
 */
export default function DetailsViewSection(props: DetailsViewSectionProps) {
  const { resource } = props;
  const detailViews = useTypedSelector(state => state.ui.views.details.pluginAppendedDetailViews);
  const memoizedComponents = useMemo(
    () =>
      detailViews.map((Component, index) => {
        if (!resource || !Component) {
          return null;
        }

        return (
          <React.Fragment key={index}>
            {isValidElement(Component) ? Component : <Component resource={resource} />}
          </React.Fragment>
        );
      }),
    [detailViews, resource]
  );
  return <>{memoizedComponents}</>;
}
