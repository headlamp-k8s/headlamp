import { registerRoute, registerSidebarItem } from '@kinvolk/headlamp-plugin/lib';
import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Typography from '@material-ui/core/Typography';

registerSidebarItem(null, 'feedback', 'Feedback', '/feedback', {
  icon: 'mdi:comment-quote',
});
registerSidebarItem('cluster', 'more-feedback', 'Feedback!', '/feedback');

registerRoute({
  path: '/feedback',
  sidebar: 'Feedback',
  component: () => (
    <SectionBox title="Feedback" textAlign="center" paddingTop={2}>
      <Typography>Embed your feedback forms here</Typography>
    </SectionBox>
  ),
});
