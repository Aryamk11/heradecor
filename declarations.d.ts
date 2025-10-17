declare module '*.scss';
declare module '*.css';

// declarations.d.ts

// Define a minimal interface for the parts of bootstrap we use globally
interface Bootstrap {
  Dropdown: new (element: Element | string, options?: object) => any; 
}

declare global {
  interface Window {
    // Use the specific Bootstrap interface instead of any
    bootstrap?: Bootstrap;
  }
}

// This export is needed to treat the file as a module.
export {};