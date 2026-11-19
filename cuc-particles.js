/* 中国传媒大学元素粒子 —— “进入我们的世界”三个入口
 * 01 关于社团  → 校徽式圆章（中国传媒大学 / 1954）
 * 02 来时路    → 主楼轮廓
 * 03 灵感展览馆 → 广播塔与信号波（北京广播学院的源头）
 * 想换成正式校徽：把图片放到 /media/cuc-emblem.png（透明底、深色图形），刷新即可自动采样。
 */
(() => {
  const portal = document.getElementById('portal');
  if (!portal) return;
  const entries = [...portal.querySelectorAll('.entry')];
  if (!entries.length) return;

  const css = document.createElement('style');
  css.textContent = `
.entry{overflow:hidden}
.entry-no,.entry-arrow{position:relative;z-index:1}
.entry-particles{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}
.entry-motif-tag{position:absolute;z-index:1;right:calc(28*var(--u));bottom:calc(22*var(--u));font:400 calc(10*var(--u))/1 Antonio,sans-serif;letter-spacing:.18em;text-transform:uppercase;opacity:.42;pointer-events:none;transition:opacity .4s}
.entry:hover .entry-motif-tag,.entry:focus-visible .entry-motif-tag{opacity:.7}
.entry .entry-arrow{margin-bottom:calc(16*var(--u))}
@media (max-width:760px){.entry-motif-tag{font-size:8px;right:18px;bottom:12px}.entry .entry-arrow{margin-bottom:10px}}
`;
  document.head.appendChild(css);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FONT = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif';

  /* ---------- 图案：画在离屏画布上，再按像素采样成粒子 ---------- */
  function arcText(g, text, cx, cy, r, start, end, size, weight, inward) {
    g.font = `${weight} ${size}px ${FONT}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const chars = [...text], n = chars.length;
    chars.forEach((ch, i) => {
      const a = start + (end - start) * (n === 1 ? .5 : i / (n - 1));
      g.save();
      g.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      g.rotate(a + (inward ? -Math.PI / 2 : Math.PI / 2));
      g.fillText(ch, 0, 0);
      g.restore();
    });
  }

  const motifs = {
    seal(g, S) {
      const c = S / 2;
      g.lineWidth = S * .022;
      g.beginPath(); g.arc(c, c, S * .47, 0, 7); g.stroke();
      g.lineWidth = S * .008;
      g.beginPath(); g.arc(c, c, S * .43, 0, 7); g.stroke();
      g.beginPath(); g.arc(c, c, S * .29, 0, 7); g.stroke();
      arcText(g, '中国传媒大学', c, c, S * .36, Math.PI * 1.17, Math.PI * 1.83, S * .1, 800, false);
      arcText(g, '1954', c, c, S * .36, Math.PI * .62, Math.PI * .38, S * .085, 800, true);
      [Math.PI * .95, Math.PI * .05].forEach(a => { g.beginPath(); g.arc(c + Math.cos(a) * S * .36, c + Math.sin(a) * S * .36, S * .022, 0, 7); g.fill(); });
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = `900 ${S * .2}px "Arial Black","Helvetica Neue",Arial,sans-serif`;
      g.fillText('CUC', c, c + S * .005);
    },
    building(g, W, H) {
      const u = W / 100, base = H * .93;
      const blk = (x, y, w, h) => g.fillRect(x * u, base - y * u - h * u, w * u, h * u);
      blk(4, 0, 92, 3);                      // 台基
      blk(8, 3, 22, 22); blk(70, 3, 22, 22); // 两翼
      blk(22, 3, 17, 32); blk(61, 3, 17, 32);// 次高楼
      blk(36, 3, 28, 44);                    // 主体
      blk(41, 47, 18, 8); blk(44.5, 55, 11, 6); // 中央塔身
      blk(48, 61, 4, 4); blk(49.6, 65, .8, 9);   // 尖顶
      g.globalCompositeOperation = 'destination-out';
      const win = (x0, x1, y0, y1, dx, dy, w, h) => { for (let x = x0; x < x1; x += dx) for (let y = y0; y < y1; y += dy) blk(x, y, w, h); };
      win(11, 28, 7, 22, 5, 6, 2.4, 3.2); win(73, 90, 7, 22, 5, 6, 2.4, 3.2);
      win(25, 37, 7, 32, 4.4, 6, 2.2, 3.2); win(64, 76, 7, 32, 4.4, 6, 2.2, 3.2);
      win(39, 62, 13, 44, 4.2, 6, 2.2, 3.4); win(43.5, 57, 49, 54, 4.4, 4, 2.2, 3);
      blk(45, 3, 10, 7);                      // 大门
      g.globalCompositeOperation = 'source-over';
      blk(36, 47, 28, .9); blk(22, 35, 17, .9); blk(61, 35, 17, .9);
    },
    tower(g, W, H) {
      const cx = W * .5, top = H * .3, bot = H * .97, half = W * .12;
      g.lineCap = 'round';
      const L = (x1, y1, x2, y2, w) => { g.lineWidth = w; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); };
      const lw = W * .012;
      L(cx, top, cx - half, bot, lw); L(cx, top, cx + half, bot, lw);
      const at = t => [cx - half * t, cx + half * t, top + (bot - top) * t];
      for (let i = 1; i < 9; i++) {
        const t1 = Math.pow(i / 9, 1.15), t2 = Math.pow((i + 1) / 9, 1.15);
        const [a1, b1, y1] = at(t1), [a2, b2, y2] = at(t2);
        L(a1, y1, b1, y1, lw * .6); L(a1, y1, b2, y2, lw * .45); L(b1, y1, a2, y2, lw * .45);
      }
      L(cx, top, cx, top - H * .08, lw * .8);
      g.beginPath(); g.arc(cx, top - H * .085, W * .012, 0, 7); g.fill();
      for (let k = 1; k <= 3; k++) {
        g.lineWidth = lw * (1.1 - k * .15);
        const r = W * .07 * k + W * .02;
        g.beginPath(); g.arc(cx, top - H * .085, r, -Math.PI * .82, -Math.PI * .58); g.stroke();
        g.beginPath(); g.arc(cx, top - H * .085, r, -Math.PI * .42, -Math.PI * .18); g.stroke();
      }
      g.fillRect(W * .2, bot, W * .6, H * .012);
    }
  };

  // 采样出图案里的全部像素点（归一化坐标），之后按卡片里的可见范围再筛
  const sampleCache = {};
  function samplePoints(key, draw, aspect, img) {
    if (sampleCache[key] && !img) return sampleCache[key];
    const W = 560, H = Math.round(W / aspect);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = g.strokeStyle = '#000';
    if (img) {
      const s = Math.min(W / img.width, H / img.height);
      g.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
    } else draw(g, W, H);
    const d = g.getImageData(0, 0, W, H).data, pts = [];
    for (let y = 0; y < H; y += 1.25) for (let x = 0; x < W; x += 1.25) if (d[((y | 0) * W + (x | 0)) * 4 + 3] > 110) pts.push([x / W, y / H]);
    if (!img) sampleCache[key] = pts;
    return pts;
  }
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  /* ---------- 每个入口一个粒子场 ---------- */
  const plan = {
    // 图案故意放大、出血到卡片边缘之外，只露出一部分；size 以卡片短边为基准，(x,y) 是图案中心在卡片里的位置
    about:   { motif: 'seal',     aspect: 1,    tag: 'CUC · Since 1954',
               tall: { size: 1.3,  x: .76, y: .92 }, wide: { size: 1.75, x: .86, y: .74 } },
    story:   { motif: 'building', aspect: 1.45, tag: 'CUC · Main Building',
               tall: { size: 1.2,  x: .66, y: .82 }, wide: { size: 1.5,  x: .8,  y: .74 } },
    gallery: { motif: 'tower',    aspect: .9,   tag: 'CUC · On Air',
               tall: { size: 1.3,  x: .74, y: .7  }, wide: { size: 1.55, x: .8,  y: .7  } }
  };

  let emblemImg = null;
  const fields = [];

  entries.forEach(entry => {
    const p = plan[entry.dataset.entry];
    if (!p) return;
    const cv = document.createElement('canvas');
    cv.className = 'entry-particles'; cv.setAttribute('aria-hidden', 'true');
    entry.prepend(cv);
    const tag = document.createElement('span');
    tag.className = 'entry-motif-tag'; tag.setAttribute('aria-hidden', 'true'); tag.textContent = p.tag;
    entry.appendChild(tag);
    fields.push({ entry, cv, ctx: cv.getContext('2d'), p, parts: [], hover: 0, hoverT: 0, mx: -1e4, my: -1e4, w: 0, h: 0 });
    const f = fields[fields.length - 1];
    entry.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); f.mx = (e.clientX - r.left) * f.w / (r.width || 1); f.my = (e.clientY - r.top) * f.h / (r.height || 1); });
    entry.addEventListener('pointerenter', () => { f.hoverT = 1; });
    entry.addEventListener('pointerleave', () => { f.hoverT = 0; f.mx = f.my = -1e4; });
    entry.addEventListener('focus', () => { f.hoverT = 1; });
    entry.addEventListener('blur', () => { f.hoverT = 0; });
  });

  function layout(f) {
    const W = f.entry.offsetWidth, H = f.entry.offsetHeight;
    if (!W || !H) return false;
    if (f.parts.length && W === f.w && H === f.h) return true;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    f.w = W; f.h = H;
    f.cv.width = Math.round(W * dpr); f.cv.height = Math.round(H * dpr);
    f.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const tall = H > W * .85, a = f.p.aspect, sp = tall ? f.p.tall : f.p.wide;
    const base = Math.min(W, H) * sp.size;
    const bw = a >= 1 ? base : base * a, bh = a >= 1 ? base / a : base;
    const bx = W * sp.x - bw / 2, by = H * sp.y - bh / 2;
    const img = f.p.motif === 'seal' ? emblemImg : null;
    const all = samplePoints(f.p.motif, motifs[f.p.motif], a, img);
    // 渐隐：离图案中心越远、越靠近标题，粒子越稀越淡
    const ax = W * sp.x, ay = H * sp.y, R = Math.max(bw, bh) * .62;
    const vis = [];
    for (const q of all) {
      const hx = bx + q[0] * bw, hy = by + q[1] * bh;
      if (hx < -4 || hy < -4 || hx > W + 4 || hy > H + 4) continue;
      const fade = 1 - smooth(R * .55, R * 1.3, Math.hypot(hx - ax, hy - ay));
      if (Math.random() > .05 + .95 * fade) continue;
      vis.push([hx, hy, fade]);
    }
    for (let i = vis.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [vis[i], vis[j]] = [vis[j], vis[i]]; }
    const budget = Math.max(900, Math.min(7000, Math.round(W * H / 10)));
    const pts = vis.slice(0, budget);
    const old = f.parts;
    f.parts = pts.map(([hx, hy, fade], i) => {
      const o = old[i];
      // 少量粒子脱离图形，像被风吹散
      const loose = Math.random() < .035 + (1 - fade) * .1;
      if (loose) { const ang = Math.random() * 6.28, d = 8 + Math.random() * Math.random() * 70; hx += Math.cos(ang) * d; hy += Math.sin(ang) * d - 10; }
      return {
        hx, hy, loose,
        x: o ? o.x : Math.random() * W, y: o ? o.y : Math.random() * H,
        vx: 0, vy: 0,
        s: (loose ? .35 : .4) + Math.random() * (loose ? .5 : .7),
        al: Math.min(3, Math.floor((.25 + .75 * fade) * (loose ? .6 : 1) * 4)),
        red: Math.random() < .13,
        ph: Math.random() * 6.28, sp: .4 + Math.random() * .9,
        delay: Math.random() * .7
      };
    });
    f.cx = ax; f.cy = ay; f.rad = Math.max(W, H) * .5;
    return true;
  }

  let open = false, raf = 0, t0 = 0, last = 0;

  function scatter() {
    fields.forEach(f => f.parts.forEach(q => {
      const a = Math.random() * 6.28, d = f.rad * (1.2 + Math.random() * 1.6);
      q.x = f.cx + Math.cos(a) * d; q.y = f.cy + Math.sin(a) * d; q.vx = q.vy = 0;
    }));
  }

  const ALPHA = [.2, .4, .62, .9];
  function frame(now) {
    raf = 0;
    if (!open) return;
    const t = (now - t0) / 1000, dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
    for (const f of fields) {
      if (!f.parts.length && !layout(f)) continue;
      f.hover += (f.hoverT - f.hover) * Math.min(1, dt * 6);
      const g = f.ctx, Hv = f.hover;
      g.clearRect(0, 0, f.w, f.h);
      const wm = f.w < 520 ? .55 : 1;
      const rr = 34 + 14 * Hv, rr2 = rr * rr;
      const ic = [21 + 234 * Hv, 21 + 234 * Hv, 16 + 239 * Hv].map(Math.round).join(',');
      if (!reduce) for (const q of f.parts) {
        const on = t > q.delay ? 1 : 0;
        const amp = q.loose ? 3.5 + Hv * 3 : .5 + Hv * 1.3;
        const tx = q.hx + Math.sin(t * q.sp + q.ph) * amp;
        const ty = q.hy + Math.cos(t * q.sp * .8 + q.ph) * amp - (q.loose ? Hv * 6 : 0);
        q.vx += (tx - q.x) * 7.5 * dt * on; q.vy += (ty - q.y) * 7.5 * dt * on;
        const dx = q.x - f.mx, dy = q.y - f.my, d2 = dx * dx + dy * dy;
        if (d2 < rr2 && d2 > .01) { const d = Math.sqrt(d2), k = (1 - d / rr) * 520 * dt; q.vx += dx / d * k; q.vy += dy / d * k; }
        q.vx *= Math.pow(.02, dt); q.vy *= Math.pow(.02, dt);
        q.x += q.vx * dt * 10; q.y += q.vy * dt * 10;
      } else for (const q of f.parts) { q.x = q.hx; q.y = q.hy; }
      for (let red = 0; red < 2; red++) for (let lv = 0; lv < 4; lv++) {
        const al = ALPHA[lv] * wm * (red ? 1 : .75 + .25 * Hv);
        g.fillStyle = red ? `rgba(237,0,33,${al})` : `rgba(${ic},${al})`;
        g.beginPath();
        for (const q of f.parts) {
          if (q.red !== !!red || q.al !== lv) continue;
          const s = q.s * (1 + Hv * .15);
          g.rect(q.x - s, q.y - s, s * 1.8, s * 1.8);
        }
        g.fill();
      }
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (open) return;
    open = true;
    fields.forEach(layout);
    if (!reduce) scatter();
    t0 = last = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }
  function stop() { open = false; cancelAnimationFrame(raf); raf = 0; }

  const sync = () => {
    const vis = portal.classList.contains('is-open') && !document.body.classList.contains('room-open') && !document.hidden;
    vis ? start() : stop();
  };
  new MutationObserver(sync).observe(portal, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', sync);
  let rt; const relayout = () => { clearTimeout(rt); rt = setTimeout(() => { if (open) { fields.forEach(layout); if (reduce) frame(performance.now()); } }, 120); };
  if (window.ResizeObserver) { const ro = new ResizeObserver(relayout); entries.forEach(e => ro.observe(e)); } else addEventListener('resize', relayout);

  // 若放了正式校徽图片，自动替换 01 的圆章
  const im = new Image();
  im.onload = () => { emblemImg = im; const f = fields.find(x => x.p.motif === 'seal'); if (f) { f.parts = []; f.w = 0; if (open) layout(f); } };
  im.src = '/media/cuc-emblem.png';

  sync();
})();
