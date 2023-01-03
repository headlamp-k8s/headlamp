import {
  DetailsViewSectionProps,
  registerDetailsViewHeaderAction,
  registerDetailsViewHeaderActionFilter,
  registerDetailsViewSection,
} from '@kinvolk/headlamp-plugin/lib';
import { ActionButton, SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import React from 'react';

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

registerDetailsViewHeaderActionFilter(actions => {
  console.log('>>>>>>>>>>>>>>>>PLUGIN', actions);

  function RevealDestructiveButtons() {
    const [reveal, setReveal] = React.useState(false);
    const headerActions = React.useMemo(() =>
      actions.concat([
        <ActionButton
          description="Our action button"
          icon="mdi:cupcake"
          onClick={() => setReveal(reveal => !reveal)}
        />,
      ])
    );

    if (!reveal) {
      return (
        <ActionButton
          description="Our action button"
          icon="mdi:key-change"
          onClick={() => setReveal(reveal => !reveal)}
        />
      );
    }
    console.log('>>>>>>>>>>>>>>>>SHOWING>>', headerActions);
    return headerActions;
  }

  return [<RevealDestructiveButtons />];
});

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
