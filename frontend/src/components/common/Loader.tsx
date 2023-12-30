import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

const PREFIX = 'Loader';

const classes = {
  loaderContainer: `${PREFIX}-loaderContainer`,
};

const StyledBox = styled(Box)({
  [`&.${classes.loaderContainer}`]: {
    textAlign: 'center',
  },
});

export interface LoaderProps {
  noContainer?: boolean;
  title: string;
}

export default function Loader(props: LoaderProps & CircularProgressProps) {
  const { noContainer = false, title, ...other } = props;
  const progress = <CircularProgress title={title} {...other} />;

  if (noContainer) return progress;

  return (
    <StyledBox className={classes.loaderContainer} py={3} px="auto">
      {progress}
    </StyledBox>
  );
}
