import Button from '@material-ui/core/Button';
import React from 'react';
import { ConfirmDialog } from './Dialog';

export default function ConfirmButton(props) {
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
