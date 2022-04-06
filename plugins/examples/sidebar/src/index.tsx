import { Headlamp, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';
import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Typography from '@material-ui/core/Typography';
import React from 'react';

class FeedbackSidebar extends Plugin {
  initialize(registry: Registry) {
    console.log('feedback initialized');

    registry.registerSidebarItem(null, 'feedback', 'Feedback', '/feedback', {
      icon: 'mdi:comment-quote',
    });
    registry.registerSidebarItem('cluster', 'more-feedback', 'Feedback!', '/feedback');

    registry.registerRoute({
      path: '/feedback',
      sidebar: 'Feedback',
      component: () => (
        <SectionBox title="Feedback" textAlign="center" paddingTop={2}>
          <Typography>Embed your feedback forms here</Typography>
        </SectionBox>
      ),
    });

    return true;
  }
}

Headlamp.registerPlugin('sidebar', new FeedbackSidebar());
