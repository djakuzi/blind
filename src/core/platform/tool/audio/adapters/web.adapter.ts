import { createWebAudioEngine } from '../engines/web-audio.engine';

async function loadAudioData(src: string) {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(`Failed to load audio resource: ${src}`);
  }

  return response.arrayBuffer();
}

export const WebAudioAdapter = createWebAudioEngine(loadAudioData);
