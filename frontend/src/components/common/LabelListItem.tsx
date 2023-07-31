import React from 'react';
import { LightTooltip } from './Tooltip';

export interface LabelListItemProps {
  labels: React.ReactNode[];
}

export default function LabelListItem(props: LabelListItemProps) {
  const { labels = [] } = props;
  const [text, tooltip] = React.useMemo(() => {
    const text = labels.join(', ');
    const tooltip = labels.join('\n');
    return [text, tooltip];
  }, [labels]);

  if (!text) {
    return null;
  }

  return (
    <LightTooltip title={tooltip} interactive>
      <span>{text}</span>
    </LightTooltip>
  );
}
