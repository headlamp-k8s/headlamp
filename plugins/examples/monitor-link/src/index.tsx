import ArrowTopRightIcon from '@iconify/icons-mdi/arrow-top-right';

const pluginLib = (window as any).pluginLib;
const React = pluginLib.React;
const K8s = pluginLib.K8s.ResourceClasses;
const { InlineIcon } = pluginLib.Iconify;
const { Button } = pluginLib.MuiCore;

function MonitorLink() {
  const [ingress, setIngress] = React.useState(null);
  const [url, setUrl] = React.useState('');

  K8s.Ingress.useApiList((ingresses: (typeof K8s.Ingress)[]) => {
    if (!ingress) {
      setIngress(ingresses.find(ingress =>
        (ingress?.metadata?.labels || {})['app.kubernetes.io/name'] === 'grafana'));
    }
  });

  React.useEffect(() => {
    if (!ingress) {
      return;
    }

    if (ingress.spec.tls?.length && ingress.spec!.tls[0].hosts?.length > 0) {
      setUrl('https://' + ingress.spec.tls[0].hosts[0]);
    } else if (ingress.spec?.rules?.host?.length > 0) {
      setUrl('http://' + ingress.spec.rules[0].host[0]);
    }
  },
  [ingress]);

  return (url &&
    <Button
      href={url}
      target="_blank"
      color="primary"
      endIcon={<InlineIcon icon={ArrowTopRightIcon} />}
    >
      Monitoring
    </Button>
  );
}

class Plugin {
  initialize(register: any) {
    register.registerAppBarAction('monitor', () =>
      <MonitorLink />
    );
  }
}

(window as any).registerPlugin('top-links', new Plugin());
