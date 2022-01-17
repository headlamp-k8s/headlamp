import { useMemo } from 'react';
import { SectionBox } from '../components/common';
import { KubeObject } from '../lib/k8s/cluster';
import { useTypedSelector } from '../redux/reducers/reducers';

export default function DetailsViewPluginRenderer(props: { resource: KubeObject }) {
  const { resource } = props;
  const detailViews = useTypedSelector(state => state.ui.views.details.pluginAppendedDetailViews);
  const memoizedComponents = useMemo(
    () =>
      detailViews.map((item, index) => {
        const pluginDetailsObj = item.sectionFunc(resource);
        if (pluginDetailsObj) {
          const { title, component: Component } = pluginDetailsObj;
          return (
            <SectionBox title={title} key={`${item.sectionName}__${index}`}>
              <Component resource={resource} />
            </SectionBox>
          );
        }
      }),
    [detailViews.length]
  );
  return <>{memoizedComponents}</>;
}
