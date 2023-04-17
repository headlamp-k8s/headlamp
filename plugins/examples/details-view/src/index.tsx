import {
  DetailsViewDefaultHeaderActions,
  DetailsViewSectionProps,
  registerDetailsViewHeaderAction,
  registerDetailsViewHeaderActionsProcessor,
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

// We can replace the section view with our own custom one.
// Here we are showing a custom view when it's a ConfigMap resource.

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

// We can replace action buttons with our own custom ones.

registerDetailsViewHeaderActionsProcessor(function replaceDeleteAction(resource, actions) {
  if (!resource || !actions.find(action => action.id === DetailsViewDefaultHeaderActions.DELETE)) {
    // There was no delete button so we do nothing.
    return actions;
  }

  const actionsDeleteRemoved = actions.filter(
    action => action.id !== DetailsViewDefaultHeaderActions.DELETE
  );
  // DetailsViewDefaultHeaderActions includes DELETE, EDIT, RESTART, SCALE, and more.

  // We add our own button as an example to show how we can replace default buttons.
  const actionsWithOurDelete = [
    ...actionsDeleteRemoved,
    {
      id: 'my-custom-delete-action',
      action: (
        <ActionButton
          description="Useless button from a plugin example from details-view example plugin"
          icon="mdi:delete"
          onClick={() => alert(`One cannot simply delete a ${resource.kind}!`)}
        />
      ),
    },
  ];
  return actionsWithOurDelete;
});
