import { registerRoute, registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';
import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Typography from '@material-ui/core/Typography';

// A top level item in the sidebar.
registerSidebarEntry({
  parent: null,
  name: 'feedback',
  label: 'Feedback',
  url: '/feedback',
  icon: 'mdi:comment-quote',
});

// A component to go along with the URL path.
registerRoute({
  path: '/feedback',
  sidebar: 'feedback',
  name: 'feedback',
  exact: true,
  component: () => (
    <SectionBox title="Feedback" textAlign="center" paddingTop={2}>
      <Typography>Embed your feedback forms here</Typography>
    </SectionBox>
  ),
});

// Another top level sidebar menu item.
registerSidebarEntry({
  parent: null,
  name: 'feedback2',
  label: 'Diff Feedback',
  url: '/feedback2',
  icon: 'mdi:comment-quote',
});

// Please see https://icon-sets.iconify.design/mdi/ for icons.

// Here we have some sub menus.
registerSidebarEntry({
  parent: 'feedback2',
  name: 'feedback3',
  label: 'More Feedback',
  url: '/feedback3',
});
registerSidebarEntry({
  parent: 'feedback2',
  name: 'feedback4',
  label: 'Other Feedback',
  url: '/feedback4',
});

// Add components and routes for the three different side bar items.
registerRoute({
  path: '/feedback2',
  sidebar: 'feedback2',
  name: 'feedback2',
  exact: true,
  component: () => (
    <SectionBox title="Diff Feedback" textAlign="center" paddingTop={2}>
      <Typography>Different feedback forms go here.</Typography>
    </SectionBox>
  ),
});

registerRoute({
  path: '/feedback3',
  sidebar: 'feedback3',
  name: 'feedback3',
  exact: true,
  component: () => (
    <SectionBox title="More Feedback" textAlign="center" paddingTop={2}>
      <Typography>More feedback forms go here.</Typography>
    </SectionBox>
  ),
});

registerRoute({
  path: '/feedback4',
  sidebar: 'feedback4',
  name: 'feedback4',
  exact: true,
  component: () => (
    <SectionBox title="Other Feedback" textAlign="center" paddingTop={2}>
      <Typography>Other feedback forms go here.</Typography>
    </SectionBox>
  ),
});
