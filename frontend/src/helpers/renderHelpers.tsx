import { SectionBox } from '../components/common';
import { useTypedSelector } from '../redux/reducers/reducers';

export default function DetailsViewPluginRenderer(props: { resource: any }) {
  const { resource } = props;
  const detailViews = useTypedSelector(state => state.ui.views.details.pluginAppendedDetailViews);
  return (
    <>
      {detailViews.map((item, index) => {
        const pluginDetailsObj = item.sectionFunc(resource);
        if (pluginDetailsObj) {
          const { title, component: DetailsView } = pluginDetailsObj;
          return (
            <SectionBox title={title} key={`${item.sectionName}__${index}`}>
              <DetailsView resource={resource} />
            </SectionBox>
          );
        }
      })}
    </>
  );
}
