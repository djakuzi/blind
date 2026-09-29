function createAnimationFrame() {
  let frameId: number | undefined;

  function cancel() {
    if (frameId === undefined) {
      return;
    }

    cancelAnimationFrame(frameId);
    frameId = undefined;
  }

  function request(callback: FrameRequestCallback) {
    cancel();

    frameId = requestAnimationFrame((time) => {
      frameId = undefined;
      callback(time);
    });
  }

  function isActive() {
    return frameId !== undefined;
  }

  return {
    cancel,
    isActive,
    request,
  };
}

export const moduleCreateAnimationFrame = {
  createAnimationFrame,
};
