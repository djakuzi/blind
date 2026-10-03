import { WebAudioEngine } from '../engines/web-audio.engine';

export const WebAudioAdapter = WebAudioEngine.createAdapter(WebAudioEngine.loadWithFetch);
