// some vite specific types needed to compile the code copied from frontend
// we don't really care about exact types since we are just compiling part
// of the frontend code, which is already compiled and typechecked there

declare module '*.svg?react' {
  const content: any;
  export default content;
}

declare const vi: any;

declare module 'vitest';

interface ImportMeta {
  env: any;
  glob: any;
}

declare module '*.worker?worker' {
  const content: any;
  export default content;
}
