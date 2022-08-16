import Button, { ButtonProps } from '@mui/material/Button';
import React from 'react';
import { ConfirmDialog } from './Dialog';

export interface ConfirmButtonProps extends ButtonProps {
  buttonComponent?: typeof Button;
  ariaLabel?: string;
  confirmTitle: string;
  confirmDescription: string;
  onConfirm: (...args: any[]) => void;
  [otherProps: string]: any;
}

export default function ConfirmButton(props: ConfirmButtonProps) {
  const {
    buttonComponent,
    ariaLabel,
    confirmTitle,
    confirmDescription,
    onConfirm,
    children,
    ...other
  } = props;
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const ButtonComponent = buttonComponent || Button;

  return (
    <React.Fragment>
      <ButtonComponent
        aria-label={ariaLabel}
        onClick={() => setOpenConfirm(true)}
        children={children}
        {...other}
      />
      <ConfirmDialog
        open={openConfirm}
        title={confirmTitle}
        description={confirmDescription}
        handleClose={() => setOpenConfirm(false)}
        onConfirm={onConfirm}
      />
    </React.Fragment>
  );
}
