const playCartSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o1.type = 'sine';
    o1.frequency.value = 880;
    o2.type = 'sine';
    o2.frequency.value = 1320;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o1.connect(g);
    o2.connect(g);
    g.connect(ctx.destination);
    o1.start();
    o2.start();
    o1.stop(ctx.currentTime + 0.15);
    o2.stop(ctx.currentTime + 0.15);
  } catch (_) {}
};

const playOrderSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Note 1: C5
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = 'sine';
    o1.frequency.value = 523;
    g1.gain.setValueAtTime(0.18, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o1.connect(g1);
    g1.connect(ctx.destination);
    o1.start(ctx.currentTime);
    o1.stop(ctx.currentTime + 0.2);

    // Note 2: E5
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = 'sine';
    o2.frequency.value = 659;
    g2.gain.setValueAtTime(0.18, ctx.currentTime + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
    o2.connect(g2);
    g2.connect(ctx.destination);
    o2.start(ctx.currentTime + 0.12);
    o2.stop(ctx.currentTime + 0.32);

    // Note 3: G5
    const o3 = ctx.createOscillator();
    const g3 = ctx.createGain();
    o3.type = 'sine';
    o3.frequency.value = 784;
    g3.gain.setValueAtTime(0.18, ctx.currentTime + 0.24);
    g3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.44);
    o3.connect(g3);
    g3.connect(ctx.destination);
    o3.start(ctx.currentTime + 0.24);
    o3.stop(ctx.currentTime + 0.44);

    // Note 4: C6 (higher, triumphant finish)
    const o4 = ctx.createOscillator();
    const g4 = ctx.createGain();
    o4.type = 'sine';
    o4.frequency.value = 1047;
    g4.gain.setValueAtTime(0.14, ctx.currentTime + 0.36);
    g4.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    o4.connect(g4);
    g4.connect(ctx.destination);
    o4.start(ctx.currentTime + 0.36);
    o4.stop(ctx.currentTime + 0.6);
  } catch (_) {}
};

export { playCartSound, playOrderSound };
