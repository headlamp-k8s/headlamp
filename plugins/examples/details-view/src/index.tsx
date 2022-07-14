import {
  DetailsViewSectionProps,
  registerDetailsViewHeaderAction,
  registerDetailsViewSection,
} from '@kinvolk/headlamp-plugin/lib';
import { ActionButton, SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';

function IconAction() {
  return (
    <ActionButton
      description="Our action button"
      icon="mdi:comment-quote"
      onClick={() => console.log('Hello from IconAction!')}
    />
  );
}
registerDetailsViewHeaderAction(IconAction);

registerDetailsViewSection(({ resource }: DetailsViewSectionProps) => {
  if (resource && resource.kind === 'ConfigMap') {
    return (
      <SectionBox title="A custom very fine section title">
        The body of our custom Section for {resource.kind}
      </SectionBox>
    );
  }
  return null;
});
