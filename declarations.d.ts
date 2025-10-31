// declarations.d.ts

// This tells TypeScript that importing a .scss file is valid
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

// This tells TypeScript that importing a .css file is valid
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// This is for the global bootstrap object
interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bootstrap: any;
}