import { Typography } from '@mui/material';
import { matchExpressionSimplifier, matchLabelsSimplifier } from '../../../lib/k8s';
import { LabelSelector } from '../../../lib/k8s/cluster';
import { useMetadataDisplayStyles } from '.';

export interface MatchExpressionsProps {
  matchLabels?: LabelSelector['matchLabels'];
  matchExpressions?: LabelSelector['matchExpressions'];
}

export function MatchExpressions(props: MatchExpressionsProps) {
  const { matchLabels = {}, matchExpressions = [] } = props;
  const classes = useMetadataDisplayStyles();

  function prepareMatchLabelsAndExpressions(
    matchLabels: LabelSelector['matchLabels'],
    matchExpressions: LabelSelector['matchExpressions']
  ) {
    const matchLabelsSimplified = matchLabelsSimplifier(matchLabels) || [];
    const matchExpressionsSimplified = matchExpressionSimplifier(matchExpressions) || [];

    return (
      <>
        {matchLabelsSimplified.map(label => (
          <Typography className={classes.metadataValueLabel} display="inline">
            {label}
          </Typography>
        ))}
        {matchExpressionsSimplified.map(expression => (
          <Typography className={classes.metadataValueLabel} display="inline">
            {expression}
          </Typography>
        ))}
      </>
    );
  }

  return <>{prepareMatchLabelsAndExpressions(matchLabels, matchExpressions)}</>;
}
