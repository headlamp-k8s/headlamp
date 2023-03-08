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

registerDetailsViewHeaderActionsProcessor({
  id: 'replace-default-delete-by-useless-one',
  processor: (resource, actions) => {
    if (!resource) {
      return actions;
    }

    let hasDeleteAction = false;
    const noDeleteActions = actions.filter(action => {
      if (action.id === DetailsViewDefaultHeaderActions.DELETE) {
        hasDeleteAction = true;
        return false;
      }
      return true;
    });

    if (hasDeleteAction) {
      noDeleteActions.push({
        id: 'my-custom-delete-action',
        action: (
          <ActionButton
            description="Useless button from a plugin example"
            icon="mdi:delete-off"
            onClick={() => alert(`One cannot simply delete a ${resource.kind}!`)}
          />
        ),
      });
    }

    return noDeleteActions;
  },
});
