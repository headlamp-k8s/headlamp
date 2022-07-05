import { Icon } from '@iconify/react';
import {
  DetailsViewSectionProps,
  registerDetailsViewHeaderAction,
  registerDetailsViewSection,
} from '@kinvolk/headlamp-plugin/lib';
import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { IconButton } from '@material-ui/core';

function IconAction() {
  return (
    <IconButton onClick={() => console.log('Hello from IconAction!')}>
      <Icon icon="mdi:comment-quote" />
    </IconButton>
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
});
