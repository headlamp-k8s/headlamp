import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';

export function CustomEdge(props: EdgeProps) {
  const [_, labelX, labelY] = getBezierPath(props);

  const parentOffset = props.data.parentOffset;

  const dx = parentOffset.x;
  const dy = parentOffset.y;

  const sections = props.data.sections;

  // convert sections to svg path
  let svgPath = '';
  sections?.forEach(section => {
    svgPath += `M ${section.startPoint.x + dx} ${section.startPoint.y + dy} `;
    section.bendPoints?.forEach(point => {
      svgPath += `L ${point.x + dx} ${point.y + dy} `;
    });
    svgPath += `L ${section.endPoint.x + dx} ${section.endPoint.y + dy} `;
  });

  return (
    <>
      <BaseEdge id={props.id} path={svgPath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            padding: 10,
            borderRadius: 5,
            fontSize: 8,
            textAlign: 'center',
          }}
          className="nodrag nopan"
        >
          {props.data.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
