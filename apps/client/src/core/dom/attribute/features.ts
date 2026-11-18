export function removeAttribute(name: string) {
  document.documentElement.removeAttribute(name);
}

export function setAttribute(name: string, value: string) {
  document.documentElement.setAttribute(name, value);
}
