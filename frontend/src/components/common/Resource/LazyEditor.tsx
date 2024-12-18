import { lazy } from 'react';

export const LazyEditor = lazy(async () => {
  const Monaco = await import('@monaco-editor/react');

  const editorWorker = await import('monaco-editor/esm/vs/editor/editor.worker?worker');
  const cssWorker = await import('monaco-editor/esm/vs/language/css/css.worker?worker');
  const htmlWorker = await import('monaco-editor/esm/vs/language/html/html.worker?worker');
  const jsonWorker = await import('monaco-editor/esm/vs/language/json/json.worker?worker');
  const tsWorker = await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker');

  (self as any).MonacoEnvironment = {
    getWorker(_: unknown, label: string) {
      if (label === 'json') {
        return new jsonWorker.default();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker.default();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker.default();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker.default();
      }
      return new editorWorker.default();
    },
  };

  return { default: Monaco.Editor };
});
