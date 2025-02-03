import { alpha, useTheme } from '@mui/material';
import { BaseEdge, EdgeProps } from '@xyflow/react';
import { memo } from 'react';
import { GraphEdge } from '../graph/graphModel';

/**
 * An edge between Kube Objects
 */
export const GraphEdgeComponent = memo((props: EdgeProps & { data: GraphEdge['data'] }) => {
  const theme = useTheme();

  const data = props.data;

  const parentOffset = data.parentOffset;

  const dx = parentOffset.x;
  const dy = parentOffset.y;

  const sections = data.sections;

  const { startPoint, endPoint, bendPoints } = sections[0];

  // Generate the path data string
  const svgPath = `M ${startPoint.x + dx},${startPoint.y + dy} C ${bendPoints[0].x + dx},${
    bendPoints[0].y + dy
  } ${bendPoints[1].x + dx},${bendPoints[1].y + dy} ${endPoint.x + dx},${endPoint.y + dy}`;

  return (
    <BaseEdge
      id={props.id}
      path={svgPath}
      style={{
        stroke: alpha(theme.palette.action.active, 0.8),
      }}
    />
  );
});
