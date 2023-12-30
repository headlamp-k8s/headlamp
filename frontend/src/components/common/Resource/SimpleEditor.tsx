import { styled } from '@mui/material/styles';

const PREFIX = 'SimpleEditor';

const classes = {
  editor: `${PREFIX}-editor`,
};

const StyledTextarea = styled('textarea')(() => ({
  [`& .${classes.editor}`]: {
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
  // TextareaAutosize doesn't react well within a dialog/tab
  return (
    <StyledTextarea
      aria-label={`${language} Code`}
      onChange={event => onChange(event.target.value, event)}
      value={value}
      className={classes.editor}
      spellCheck="false"
    />
  );
}

export default SimpleEditor;
