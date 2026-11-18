export function createContext({ root, signal }) {
  return Object.freeze({ root, signal });
}
