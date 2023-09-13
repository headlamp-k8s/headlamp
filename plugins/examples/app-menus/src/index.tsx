import { Headlamp, Plugin } from '@kinvolk/headlamp-plugin/lib';

class AppMenuDemo extends Plugin {
  static warnedOnce = false;

  initialize(): boolean {
    console.log('app-menus plugin initialized');

    if (!AppMenuDemo.warnedOnce && !Headlamp.isRunningAsApp()) {
      AppMenuDemo.warnedOnce = true;
      window.alert(
        'app-menus plugin: Headlamp is running as an app. This plugin will not do anything!'
      );
      return;
    }

    Headlamp.setAppMenu(menus => {
      let chatMenu = menus?.find(menu => menu.id === 'custom-menu-item') || null;
      if (!chatMenu) {
        chatMenu = {
          label: 'Chat with us',
          id: 'custom-menu-item',
          submenu: [
            {
              label: 'This menu is an example from the app-menus plugin',
              enabled: false,
            },
            {
              label: 'Open Headlamp Slack',
              url: 'https://kubernetes.slack.com/messages/headlamp',
            },
          ],
        };

        menus.push(chatMenu);
      }
      return menus;
    });
  }
}

Headlamp.registerPlugin('app-menus', new AppMenuDemo());
