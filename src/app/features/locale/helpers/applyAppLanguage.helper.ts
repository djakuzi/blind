import { DomAttribute } from '@/core/dom/attribute';

export function applyAppLanguage(code: string) {
  DomAttribute.setAttribute('lang', code);
}
