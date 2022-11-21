import { Icon, IconifyIcon } from '@iconify/react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';

export interface ActionButtonProps extends Omit<IconButtonProps, 'children' | 'color'> {
  /** A short description of the action. */
  description: string;
  /** Either a string icon, or imported icon. */
  icon: string | IconifyIcon;
  /** The action when it's activated. */
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  /** A longer description of the action. Used in the tooltip. */
  longDescription?: string;
  /** The icon color. */
  color?: string | 'inherit' | 'primary' | 'secondary' | 'default';
  /** The icon width. */
  width?: string;
  /**
   * If given, uses a negative margin to counteract the padding on one side
   * (this is often helpful for aligning the left or right side of the icon
   * with content above or below, without ruining the border size and shape).
   */
  edge?: false | 'end' | 'start' | undefined;
}

/**
 * To be used for our Action buttons.
 *
 * So we implement them consistently and encapsulate the implementation.
 */
export default function ActionButton(props: ActionButtonProps) {
  const { description, longDescription, icon, onClick, color, width, edge, ...otherProps } = props;
  return (
    <Tooltip title={longDescription || description}>
      <IconButton aria-label={description} onClick={onClick} edge={edge} {...otherProps}>
        <Icon icon={icon} color={color} width={width} />
      </IconButton>
    </Tooltip>
  );
}
