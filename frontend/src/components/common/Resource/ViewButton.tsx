import React from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../../lib/k8s/cluster';
import ActionButton, { ButtonStyle } from '../ActionButton';
import EditorDialog from './EditorDialog';

export interface ViewButtonProps {
  /** The item we want to view */
  item: KubeObject;
  /** If we want to have the view open by default */
  initialToggle?: boolean;
  buttonStyle?: ButtonStyle;
}

function ViewButton({ item, buttonStyle, initialToggle = false }: ViewButtonProps) {
  const [toggle, setToggle] = React.useState(initialToggle);
  const { t } = useTranslation();
  return (
    <>
      <ActionButton
        description={t('translation|View YAML')}
        buttonStyle={buttonStyle}
        onClick={() => {
          setToggle(true);
        }}
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
