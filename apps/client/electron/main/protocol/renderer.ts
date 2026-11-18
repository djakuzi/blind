import { app, net, protocol } from 'electron';
import { ELECTRON_CONFIG } from '../../config';
import { HelperRenderer } from '../../shared/helpers/renderer.helper';

export function registerRendererProtocolScheme() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: ELECTRON_CONFIG.renderer.protocol.scheme,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
        stream: true,
        codeCache: true,
      },
    },
  ]);
}

export function registerRendererProtocol() {
  const rootDirectory = HelperRenderer.getRendererRootDirectory(
    app.getAppPath(),
  );

  protocol.handle(
    ELECTRON_CONFIG.renderer.protocol.scheme,
    async (request) => {
      try {
        const fileUrl = HelperRenderer.resolveRendererFileUrl(
          rootDirectory,
          request.url,
        );

        return await net.fetch(fileUrl);
      } catch (error) {
        console.error(
          'Failed to handle Electron renderer protocol request:',
          request.url,
          error,
        );

        return new Response(null, {
          status: 404,
        });
      }
    },
  );
}
