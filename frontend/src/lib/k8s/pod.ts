import { Base64 } from 'js-base64';
import { apiFactoryWithNamespace, stream, StreamResultsCb } from './apiProxy';
import { KubeCondition, KubeContainer, KubeContainerStatus, KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubePod extends KubeObjectInterface {
  spec: {
    containers: KubeContainer[];
  };
  status: {
    conditions: KubeCondition[];
    containerStatuses: KubeContainerStatus[];
    hostIP: string;
    message: string;
    phase: string;
    qosClass: string;
    reason: string;
    startTime: number;
    [other: string]: any;
  };
}

interface ExecOptions {
  command?: string[];
  reconnectOnFailure?: boolean;
}

class Pod extends makeKubeObject<KubePod>('Pod') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'pods');

  get spec(): KubePod['spec'] {
    return this.jsonData!.spec;
  }

  get status(): KubePod['status'] {
    return this.jsonData!.status;
  }

  getLogs(container: string, tailLines: number, showPrevious: boolean,
          onLogs: StreamResultsCb) {
    let logs: string[] = [];
    const url = `/api/v1/namespaces/${this.getNamespace()}/pods/${this.getName()}/log?container=${container}&previous=${showPrevious}&tailLines=${tailLines}&follow=true`;

    function onResults(item: string) {
      if (!item) {
        return;
      }

      logs.push(Base64.decode(item));
      onLogs(logs);
    }

    const { cancel } = stream(url, onResults,
                              { isJson: false,
                                connectCb: () => { logs = []; },
                              });

    return cancel;
  }

  exec(container: string, onExec: StreamResultsCb, options: ExecOptions = {}) {
    const {command = ['sh'], reconnectOnFailure = undefined} = options;
    const commandStr = command.map(item => '&command=' + encodeURIComponent(item)).join('');
    const url = `/api/v1/namespaces/${this.getNamespace()}/pods/${this.getName()}/exec?container=${container}${commandStr}&stdin=1&stderr=1&stdout=1&tty=1`;
    const additionalProtocols = ['v4.channel.k8s.io', 'v3.channel.k8s.io', 'v2.channel.k8s.io', 'channel.k8s.io'];

    return stream(url, onExec, {additionalProtocols, isJson: false, reconnectOnFailure});
  }
}

export default Pod;
