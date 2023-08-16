import React from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../../lib/k8s/cluster';
import ActionButton from '../ActionButton';
import EditorDialog from './EditorDialog';

export interface ViewButtonProps {
  /** The item we want to view */
  item: KubeObject;
  /** If we want to have the view open by default */
  initialToggle?: boolean;
}

function ViewButton({ item, initialToggle = false }: ViewButtonProps) {
  const [toggle, setToggle] = React.useState(initialToggle);
  const { t } = useTranslation();

  function handleButtonClick() {
    setToggle(toggle => !toggle);
  }
  return (
    <>
      <ActionButton
        description={t('View YAML')}
        onClick={handleButtonClick}
        icon="mdi:eye"
        edge="end"
      />
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
