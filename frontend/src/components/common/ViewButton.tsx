import eyeIcon from '@iconify/icons-mdi/eye';
import eyeOff from '@iconify/icons-mdi/eye-off';
import Icon from '@iconify/react';
import { IconButton, Tooltip } from '@material-ui/core';
import React from 'react';
import { KubeObject } from '../../lib/k8s/cluster';
import EditorDialog from './EditorDialog';

interface ViewButtonProps {
  item: KubeObject;
}

function ViewButton(props: ViewButtonProps) {
  const { item } = props;
  const [toggle, setToggle] = React.useState(false);
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
