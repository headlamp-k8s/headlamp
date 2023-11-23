import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyle = makeStyles(() => ({
  editor: {
    width: '100%',
    minHeight: '40vh',
  },
}));

export interface SimpleEditorProps {
  /** Programming language. */
  language: string;
  /** The thing we are editing. */
  value: string | undefined;
  /** When things in the editor change. */
  onChange(value: string | undefined, ev: any): void;
}

/** A very basic code editor. */
function SimpleEditor({ language, value, onChange }: SimpleEditorProps) {
  const classes = useStyle();

  // TextareaAutosize doesn't react well within a dialog/tab
  return (
    <textarea
      aria-label={`${language} Code`}
      onChange={event => onChange(event.target.value, event)}
      value={value}
      className={classes.editor}
      spellCheck="false"
    />
  );
}

export default SimpleEditor;
