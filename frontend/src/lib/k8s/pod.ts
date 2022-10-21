import { Base64 } from 'js-base64';
import { apiFactoryWithNamespace, stream, StreamArgs, StreamResultsCb } from './apiProxy';
import {
  KubeCondition,
  KubeContainer,
  KubeContainerStatus,
  KubeObjectInterface,
  makeKubeObject,
  Time,
} from './cluster';

export interface KubePod extends KubeObjectInterface {
  spec: {
    containers: KubeContainer[];
    nodeName: string;
    nodeSelector?: {
      [key: string]: string;
    };
  };
  status: {
    conditions: KubeCondition[];
    containerStatuses: KubeContainerStatus[];
    hostIP: string;
    message: string;
    phase: string;
    qosClass: string;
    reason: string;
    startTime: Time;
    [other: string]: any;
  };
}

export interface ExecOptions extends StreamArgs {
  command?: string[];
}

interface LogOptions {
  /** The number of lines to display from the end side of the log */
  tailLines?: number;
  /** Whether to show the logs from previous runs of the container (only for restarted containers) */
  showPrevious?: boolean;
  /** Whether to show the timestamps in the logs */
  showTimestamps?: boolean;
}

/**@deprecated
 * Use `container: string, onLogs: StreamResultsCb, logsOptions: LogOptions`
 * */
type oldGetLogs = (
  container: string,
  tailLines: number,
  showPrevious: boolean,
  onLogs: StreamResultsCb
) => () => void;
type newGetLogs = (
  container: string,
  onLogs: StreamResultsCb,
  logsOptions: LogOptions
) => () => void;

class Pod extends makeKubeObject<KubePod>('Pod') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'pods');

  get spec(): KubePod['spec'] {
    return this.jsonData!.spec;
  }

  get status(): KubePod['status'] {
    return this.jsonData!.status;
  }

  getLogs(...args: Parameters<oldGetLogs | newGetLogs>): () => void {
    if (args.length > 3) {
      console.warn(
        "This Pod's getLogs use will soon be deprecated! Please double check how to call the getLogs function."
      );
      const [container, tailLines, showPrevious, onLogs] = args as Parameters<oldGetLogs>;
      return this.getLogs(container, onLogs!, {
        tailLines: tailLines,
        showPrevious: showPrevious,
      });
    }

    const [container, onLogs, logsOptions] = args as Parameters<newGetLogs>;
    const { tailLines = 100, showPrevious = false, showTimestamps = false } = logsOptions;
    let logs: string[] = [];
    const url = `/api/v1/namespaces/${this.getNamespace()}/pods/${this.getName()}/log?container=${container}&previous=${showPrevious}&tailLines=${tailLines}&timestamps=${showTimestamps}&follow=true`;

    function onResults(item: string) {
      if (!item) {
        return;
      }

      logs.push(Base64.decode(item));
      onLogs(logs);
    }

    const { cancel } = stream(url, onResults, {
      isJson: false,
      connectCb: () => {
        logs = [];
      },
    });

    return cancel;
  }

  exec(container: string, onExec: StreamResultsCb, options: ExecOptions = {}) {
    const { command = ['sh'], ...streamOpts } = options;
    const commandStr = command.map(item => '&command=' + encodeURIComponent(item)).join('');
    const url = `/api/v1/namespaces/${this.getNamespace()}/pods/${this.getName()}/exec?container=${container}${commandStr}&stdin=1&stderr=1&stdout=1&tty=1`;
    const additionalProtocols = [
      'v4.channel.k8s.io',
      'v3.channel.k8s.io',
      'v2.channel.k8s.io',
      'channel.k8s.io',
    ];

    return stream(url, onExec, { additionalProtocols, isJson: false, ...streamOpts });
  }
}

export default Pod;
