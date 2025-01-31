import '../../../i18n/config';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Node from '../../../lib/k8s/node';
import Pod from '../../../lib/k8s/pod';
import TileChart from '../../common/TileChart';

export function PodsStatusCircleChart(props: { items: Pod[] | null }) {
  const theme = useTheme();
  const { items } = props;
  const { t } = useTranslation(['translation', 'glossary']);

  const podsReady = (items || []).filter((pod: Pod) => {
    if (pod.status!.phase === 'Succeeded') {
      return true;
    }

    const readyCondition = pod.status?.conditions?.find(condition => condition.type === 'Ready');
    return readyCondition?.status === 'True';
  });

  function getLegend() {
    if (items === null) {
      return null;
    }
    return t('translation|{{ numReady }} / {{ numItems }} Requested', {
      numReady: podsReady.length,
      numItems: items.length,
    });
  }

  function getLabel() {
    if (items === null) {
      return '…';
    }
    const percentage = ((podsReady.length / items.length) * 100).toFixed(1);
    return `${items.length === 0 ? 0 : percentage} %`;
  }

  function getData() {
    if (items === null) {
      return [];
    }

    return [
      {
        name: 'ready',
        value: podsReady.length,
      },
      {
        name: 'notReady',
        value: items.length - podsReady.length,
        fill: theme.palette.error.main,
      },
    ];
  }

  return (
    <TileChart
      data={getData()}
      total={items !== null ? items.length : -1}
      label={getLabel()}
      title={t('glossary|Pods')}
      legend={getLegend()}
    />
  );
}

export function NodesStatusCircleChart(props: { items: Node[] | null }) {
  const theme = useTheme();
  const { items } = props;
  const { t } = useTranslation(['translation', 'glossary']);

  const nodesReady = (items || []).filter((node: Node) => {
    const readyCondition = node.status?.conditions?.find(condition => condition.type === 'Ready');
    return readyCondition?.status === 'True';
  });

  function getLegend() {
    if (items === null) {
      return null;
    }
    return t('translation|{{ numReady }} / {{ numItems }} Ready', {
      numReady: nodesReady.length,
      numItems: items.length,
    });
  }

  function getLabel() {
    if (items === null) {
      return '…';
    }
    const percentage = ((nodesReady.length / items.length) * 100).toFixed(1);
    return `${items.length === 0 ? 0 : percentage} %`;
  }

  function getData() {
    if (items === null) {
      return [];
    }

    return [
      {
        name: 'ready',
        value: nodesReady.length,
      },
      {
        name: 'notReady',
        value: items.length - nodesReady.length,
        fill: theme.palette.error.main,
      },
    ];
  }

  return (
    <TileChart
      data={getData()}
      total={items !== null ? items.length : -1}
      label={getLabel()}
      title={t('glossary|Nodes')}
      legend={getLegend()}
    />
  );
}
