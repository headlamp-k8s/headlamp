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

class Pod extends makeKubeObject<KubePod>('pod') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'pods');

  get spec() {
    return this.jsonData!.spec;
  }

  get status() {
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
}

export default Pod;
