/*
 * motion-probe — инструмент проверки анимаций Blind в браузере.
 * Вставь содержимое файла в консоль страницы (или выполни через инструмент запуска JS браузера),
 * затем вызывай методы window.__motion. Ничего не меняет в проекте; всё снимается перезагрузкой.
 *
 *   await __motion.record(() => button.click(), 1500)
 *     — выполнить действие и собрать все анимации, которые запустились за 1500 мс:
 *       что анимируется (свойство / keyframes), на каком элементе, длительность, задержка, easing.
 *
 *   __motion.slowmo(4000) … действие … скриншоты … __motion.slowmo(false)
 *     — растянуть ВСЕ transition до 4000 мс, чтобы снять промежуточные кадры.
 *       Работает и для Vue <Transition> (Vue берёт длительность из computed style).
 *       Внимание: все длительности становятся одинаковыми — смотри форму движения, не тайминг.
 *
 *   __motion.freeze(trigger) → __motion.seek(0.5) → скриншот → __motion.release()
 *     — точная заморозка на нужном прогрессе. Только для CSS-анимаций и transitions,
 *       которыми НЕ управляет Vue <Transition> (hover, :active, циклы, переключение классов).
 *       Vue <Transition> удаляет элемент по своему таймеру — для него используй slowmo.
 *
 *   __motion.reduced() — включён ли prefers-reduced-motion в этой вкладке.
 */
(() => {
  const describe = (a) => {
    const timing = a.effect?.getComputedTiming?.() ?? {};
    const target = a.effect?.target;
    return {
      kind: a.constructor.name, // CSSTransition | CSSAnimation | Animation
      what: a.transitionProperty || a.animationName || a.id || '(web animation)',
      target: target ? `${target.tagName.toLowerCase()}.${String(target.className).trim().split(/\s+/).slice(0, 3).join('.')}` : null,
      duration: timing.duration,
      delay: timing.delay,
      iterations: timing.iterations === Infinity ? 'infinite' : timing.iterations,
      easing: a.effect?.getTiming?.().easing,
    };
  };
  const finite = (a) => Number.isFinite(a.effect?.getComputedTiming?.().duration) && a.effect.getComputedTiming().iterations !== Infinity;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  window.__motion = {
    reduced: () => matchMedia('(prefers-reduced-motion: reduce)').matches,

    list: () => document.getAnimations().map(describe),

    async record(trigger, ms = 1500) {
      const seen = new Map();
      const tick = () => document.getAnimations().forEach((a) => {
        const d = describe(a);
        const key = `${d.what}|${d.target}`;
        if (!seen.has(key)) seen.set(key, d);
      });
      const id = setInterval(tick, 4);
      await trigger?.();
      await wait(ms);
      clearInterval(id);
      return [...seen.values()];
    },

    slowmo(ms = 4000) {
      document.getElementById('__motion-slowmo')?.remove();
      if (ms === false) return 'slowmo off';
      const s = document.createElement('style');
      s.id = '__motion-slowmo';
      s.textContent = `*,*::before,*::after{transition-duration:${ms}ms!important}`;
      document.head.append(s);
      return `slowmo ${ms}ms`;
    },

    async freeze(trigger, waitMs = 1500) {
      await trigger?.();
      const t0 = performance.now();
      let anims = [];
      while (performance.now() - t0 < waitMs) {
        anims = document.getAnimations().filter(finite);
        if (anims.length) break;
        await new Promise((r) => requestAnimationFrame(r));
      }
      anims.forEach((a) => a.pause());
      this.frozen = anims;
      return anims.map(describe);
    },

    seek(progress) {
      (this.frozen || []).forEach((a) => {
        const t = a.effect.getComputedTiming();
        a.currentTime = t.delay + t.duration * progress;
      });
      return progress;
    },

    release() {
      (this.frozen || []).forEach((a) => a.play());
      this.frozen = [];
      return 'released';
    },
  };
  return 'motion-probe ready';
})();
