import { Typography } from '@mui/material';
import { matchExpressionSimplifier, matchLabelsSimplifier } from '../../../lib/k8s';
import { LabelSelector } from '../../../lib/k8s/cluster';
import { metadataStyles } from '.';

export interface MatchExpressionsProps {
  matchLabels?: LabelSelector['matchLabels'];
  matchExpressions?: LabelSelector['matchExpressions'];
}

export function MatchExpressions(props: MatchExpressionsProps) {
  const { matchLabels = {}, matchExpressions = [] } = props;

  function prepareMatchLabelsAndExpressions(
    matchLabels: LabelSelector['matchLabels'],
    matchExpressions: LabelSelector['matchExpressions']
  ) {
    const matchLabelsSimplified = matchLabelsSimplifier(matchLabels) || [];
    const matchExpressionsSimplified = matchExpressionSimplifier(matchExpressions) || [];

    return (
      <>
        {matchLabelsSimplified.map(label => (
          <Typography sx={metadataStyles} display="inline" key={label}>
            {label}
          </Typography>
        ))}
        {matchExpressionsSimplified.map(expression => (
          <Typography sx={metadataStyles} display="inline" key={expression}>
            {expression}
          </Typography>
        ))}
      </>
    );
  }

  return <>{prepareMatchLabelsAndExpressions(matchLabels, matchExpressions)}</>;
}
