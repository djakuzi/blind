import { onUnmounted, shallowReactive } from 'vue';
import { MediaAudio } from '@/core/media/audio';
import type { tAudioId } from '@/core/media/audio';
import { ToolAudio } from '@/core/platform';

type tAudioInput = tAudioId | readonly tAudioId[];

export function useAudio() {
  const loops = shallowReactive(new Map<tAudioId, ToolAudio.iAudioResource>());
  const loopRequests = new Map<tAudioId, Promise<void>>();

  function play(id: tAudioId, options: ToolAudio.iAudioPlayOptions = {}) {
    const audio = MediaAudio.getAudio(id);

    ToolAudio.play(audio, options).catch((error) => {
      console.error(`Failed to play audio "${id}":`, error);
    });
  }

  async function startLoop(id: tAudioId) {
    if (loops.has(id)) {
      return;
    }

    const activeRequest = loopRequests.get(id);

    if (activeRequest) {
      await activeRequest;
      return;
    }

    const audio = MediaAudio.getAudio(id);

    const request = (async () => {
      await ToolAudio.loop(audio);
      loops.set(id, audio);
    })();

    loopRequests.set(id, request);

    try {
      await request;
    } finally {
      if (loopRequests.get(id) === request) {
        loopRequests.delete(id);
      }
    }
  }

  async function loop(input: tAudioInput) {
    const ids = Array.isArray(input) ? input : [input];

    await Promise.all(ids.map((id) => startLoop(id)));
  }

  async function stop(input: tAudioInput) {
    const ids = Array.isArray(input) ? input : [input];

    await Promise.all(
      ids.map(async (id) => {
        const activeRequest = loopRequests.get(id);

        if (activeRequest) {
          await activeRequest;
        }

        const audio = loops.get(id) ?? MediaAudio.getAudio(id);

        loops.delete(id);
        await ToolAudio.stop(audio);
      }),
    );
  }

  async function clear() {
    await Promise.allSettled([...loopRequests.values()]);

    const resources = [...loops.values()];

    loops.clear();

    await Promise.all(resources.map((audio) => ToolAudio.stop(audio)));
  }

  onUnmounted(clear);

  return {
    loops,
    play,
    loop,
    stop,
    clear,
  };
}
