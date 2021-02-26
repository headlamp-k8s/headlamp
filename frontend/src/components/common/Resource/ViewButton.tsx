import eyeIcon from '@iconify/icons-mdi/eye';
import Icon from '@iconify/react';
import { IconButton, Tooltip } from '@material-ui/core';
import React from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';
import EditorDialog from './EditorDialog';

export interface ViewButtonProps {
  /** The item we want to view */
  item: KubeObject;
  /** If we want to have the view open by default */
  initialToggle?: boolean;
}

function ViewButton({ item, initialToggle = false }: ViewButtonProps) {
  const [toggle, setToggle] = React.useState(initialToggle);
  function handleButtonClick() {
    setToggle(toggle => !toggle);
  }
  return (
    <>
      <Tooltip title="View YAML">
        <IconButton
          edge="end"
          aria-label="show yaml viewer"
          onClick={handleButtonClick}
          onMouseDown={event => event.preventDefault()}
        >
          <Icon icon={eyeIcon} />
        </IconButton>
      </Tooltip>
      <EditorDialog
        item={item.jsonData}
        open={toggle}
        onClose={() => setToggle(toggle => !toggle)}
        onSave={null}
      />
    </>
  );
}

export default ViewButton;
