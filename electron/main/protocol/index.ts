import {
  registerRendererProtocol,
  registerRendererProtocolScheme,
} from './renderer';

export function registerElectronProtocolSchemes() {
  registerRendererProtocolScheme();
}

export function registerElectronProtocols() {
  registerRendererProtocol();
}
