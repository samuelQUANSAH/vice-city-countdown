const canvas = document.getElementById('lockCanvas');
const ctx = canvas.getContext('2d');

const PRESETS = {
  thanksgiving: {
    tag: 'MISSION:',
    title: 'Thanksgiving Gathering',
    hudLabel: 'FEAST IN',
    date: '2026-11-26',
    caption: 'Plan • Prep • Host • Feast',
    milestones: [
      { code: 'T-14', label: 'LOCK MENU' },
      { code: 'T-7', label: 'SHOP RUN' },
      { code: 'T-3', label: 'PREP' },
      { code: 'T-1', label: 'BAKE' },
      { code: 'NOV 26', label: 'FEAST DAY' }
    ]
  },
  phoenix: {
    tag: 'MISSION:',
    title: 'Project Phoenix',
    hudLabel: 'LAUNCH IN',
    date: '2026-12-31',
    caption: 'Plan • Build • Execute • Launch',
    milestones: [
      { code: 'T-21', label: 'LOCK PLAN' },
      { code: 'T-14', label: 'BUILD' },
      { code: 'T-7', label: 'TEST' },
      { code: 'T-3', label: 'ALIGN' },
      { code: 'T-1', label: 'CHECK' }
    ]
  },
  launch: {
    tag: 'WORK DEADLINE:',
    title: 'Project Launch',
    hudLabel: 'SHIP IN',
    date: '2026-12-04',
    caption: 'Plan • Build • Test • Ship',
    milestones: [
      { code: 'T-21', label: 'OUTLINE' },
      { code: 'T-14', label: 'BUILD' },
      { code: 'T-7', label: 'TEST' },
      { code: 'T-3', label: 'POLISH' },
      { code: 'DEC 4', label: 'SHIP IT' }
    ]
  }
};

const THEMES = {
  vice: {
    primary: '#ff1e8a',
    secondary: '#00f0ff',
    skyTop: '#0b0418',
    skyMid: '#470c4e',
    asphalt: '#090312',
    useBaseHud: true
  },
  sanandreas: {
    primary: '#f5b700',
    secondary: '#26d07c',
    skyTop: '#0a140d',
    skyMid: '#2f3e1b',
    asphalt: '#070a07',
    useBaseHud: false
  },
  lossantos: {
    primary: '#00a8ff',
    secondary: '#e2e8f0',
    skyTop: '#040814',
    skyMid: '#102542',
    asphalt: '#03050a',
    useBaseHud: false
  }
};

let state = {
  milestones: structuredClone(PRESETS.thanksgiving.milestones),
  customBg: null,
  baseHudImg: null
};

// Load the Blank Vice City Neon HUD image
const baseImg = new Image();
baseImg.src = 'assets/blank-hud-base.jpg';
baseImg.onload = () => {
  state.baseHudImg = baseImg;
  renderCanvas();
};

function renderMilestoneInputs() {
  const container = document.getElementById('milestonesContainer');
  container.innerHTML = '';
  state.milestones.forEach((m, idx) => {
    const div = document.createElement('div');
    div.className = 'ms-box';
    div.innerHTML = `
      <input type="text" value="${m.code}" data-idx="${idx}" data-field="code" aria-label="Milestone code" />
      <input type="text" value="${m.label}" data-idx="${idx}" data-field="label" aria-label="Milestone action" />
    `;
    container.appendChild(div);
  });
  container.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const i = Number(e.target.dataset.idx);
      const f = e.target.dataset.field;
      state.milestones[i][f] = e.target.value;
      renderCanvas();
    });
  });
}

function formatShortDate(dateStr) {
  if (!dateStr) return 'TARGET';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
}

function getCountdownParts(dateStr) {
  const now = new Date();
  const target = new Date(dateStr + 'T00:00:00');
  const diffMs = Math.max(0, target - now);
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diffMs / (1000 * 60)) % 60);
  return { days, hours, mins };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCoverImage(img, W, H) {
  const imgRatio = img.width / img.height;
  const canvasRatio = W / H;
  let drawW = W, drawH = H, offX = 0, offY = 0;
  if (imgRatio > canvasRatio) {
    drawW = H * imgRatio;
    offX = (W - drawW) / 2;
  } else {
    drawH = W / imgRatio;
    offY = (H - drawH) / 2;
  }
  ctx.drawImage(img, offX, offY, drawW, drawH);
}

function renderCanvas(exportMode = false) {
  const device = document.getElementById('deviceSelect').value;
  const W = device === 'samsung' ? 1440 : 1290;
  const H = device === 'samsung' ? 3120 : 2796;
  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }

  const themeKey = document.getElementById('themeSelect').value;
  const theme = THEMES[themeKey];
  const tag = document.getElementById('tagInput').value;
  const title = document.getElementById('titleInput').value;
  const hudLabel = document.getElementById('hudLabelInput').value;
  const dateStr = document.getElementById('dateInput').value;
  const format = document.getElementById('formatSelect').value;
  const caption = document.getElementById('captionInput').value;
  const showGuides = !exportMode && document.getElementById('safeZoneToggle').checked;

  // 1. Background
  if (state.customBg) {
    drawCoverImage(state.customBg, W, H);
    ctx.fillStyle = 'rgba(6, 3, 15, 0.42)';
    ctx.fillRect(0, 0, W, H);
  } else if (theme.useBaseHud && state.baseHudImg) {
    drawCoverImage(state.baseHudImg, W, H);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, theme.skyTop);
    grad.addColorStop(0.45, theme.skyMid);
    grad.addColorStop(1, theme.asphalt);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // Shift content slightly higher for Samsung ultrasonic fingerprint sensor clearance
  const yShift = device === 'samsung' ? -0.025 * H : 0;

  // 2. Title Lockup
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `italic 900 ${Math.round(W * 0.056)}px 'Anton', Impact, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 18;
  ctx.fillText(tag, W * 0.5, H * 0.165);

  ctx.font = `${Math.round(W * 0.115)}px 'Yellowtail', cursive`;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = theme.primary;
  ctx.shadowBlur = 34;
  ctx.fillText(title, W * 0.5, H * 0.228);

  ctx.shadowBlur = 14;
  ctx.shadowColor = theme.secondary;
  ctx.font = `800 ${Math.round(W * 0.028)}px 'Orbitron', sans-serif`;
  ctx.fillStyle = theme.secondary;
  ctx.fillText(`TARGET DATE: ${formatShortDate(dateStr)}`, W * 0.5, H * 0.268);
  ctx.restore();

  // 3. Center Neon HUD Frame (draw frame if custom bg or non-Vice theme; align cleanly with base HUD on Vice)
  const hudW = W * 0.77;
  const hudH = H * 0.132;
  const hudX = (W - hudW) / 2;
  const hudY = (theme.useBaseHud && !state.customBg) ? H * 0.482 : (H * 0.475 + yShift);

  if (!theme.useBaseHud || state.customBg) {
    ctx.save();
    roundRect(ctx, hudX, hudY, hudW, hudH, 38);
    ctx.fillStyle = 'rgba(8, 5, 18, 0.84)';
    ctx.fill();
    const borderGrad = ctx.createLinearGradient(hudX, hudY, hudX + hudW, hudY + hudH);
    borderGrad.addColorStop(0, theme.secondary);
    borderGrad.addColorStop(1, theme.primary);
    ctx.lineWidth = 7;
    ctx.strokeStyle = borderGrad;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 26;
    ctx.stroke();
    ctx.restore();
  }

  // HUD Countdown Text
  const { days, hours, mins } = getCountdownParts(dateStr);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `700 ${Math.round(W * 0.026)}px 'Orbitron', sans-serif`;
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(hudLabel.split('').join(' '), W * 0.5, hudY + hudH * 0.25);

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = theme.secondary;
  ctx.shadowBlur = 22;
  if (format === 'days') {
    ctx.font = `900 ${Math.round(W * 0.105)}px 'Orbitron', sans-serif`;
    ctx.fillText(`${days} DAYS`, W * 0.5, hudY + hudH * 0.76);
  } else {
    const pad = (n) => String(n).padStart(2, '0');
    ctx.font = `900 ${Math.round(W * 0.088)}px 'Orbitron', sans-serif`;
    ctx.fillText(`${pad(days)} : ${pad(hours)} : ${pad(mins)}`, W * 0.5, hudY + hudH * 0.72);
    ctx.font = `700 ${Math.round(W * 0.021)}px 'Inter', sans-serif`;
    ctx.fillStyle = theme.primary;
    ctx.shadowBlur = 0;
    ctx.fillText('DAYS              HOURS             MINUTES', W * 0.5, hudY + hudH * 0.90);
  }
  ctx.restore();

  // 4. Milestone Strip
  const msHeaderY = hudY + hudH + H * 0.042 + yShift * 0.4;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `800 ${Math.round(W * 0.026)}px 'Orbitron', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('MISSION MILESTONES', W * 0.5, msHeaderY);

  const gap = W * 0.02;
  const totalW = W * 0.88;
  const cardW = (totalW - gap * 4) / 5;
  const cardH = H * 0.095;
  const startX = (W - totalW) / 2;
  const cardY = msHeaderY + H * 0.018;

  state.milestones.forEach((m, i) => {
    const x = startX + i * (cardW + gap);
    const isFinal = i === state.milestones.length - 1;
    roundRect(ctx, x, cardY, cardW, cardH, 24);
    ctx.fillStyle = isFinal ? 'rgba(0, 240, 255, 0.20)' : 'rgba(12, 7, 26, 0.82)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = isFinal ? theme.secondary : theme.primary;
    ctx.shadowColor = isFinal ? theme.secondary : theme.primary;
    ctx.shadowBlur = 16;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = isFinal ? theme.secondary : '#ffffff';
    ctx.font = `900 ${Math.round(W * 0.030)}px 'Orbitron', sans-serif`;
    ctx.fillText(m.code, x + cardW / 2, cardY + cardH * 0.46);

    ctx.fillStyle = '#f1f5f9';
    ctx.font = `700 ${Math.round(W * 0.020)}px 'Inter', sans-serif`;
    ctx.fillText(m.label, x + cardW / 2, cardY + cardH * 0.76);
  });

  // 5. Motivational Caption
  const capY = cardY + cardH + H * 0.052;
  ctx.font = `${Math.round(W * 0.068)}px 'Yellowtail', cursive`;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = theme.primary;
  ctx.shadowBlur = 24;
  ctx.fillText(caption, W * 0.5, capY);
  ctx.restore();

  // 6. Optional Safe-Zone Guides
  if (showGuides) {
    ctx.save();
    ctx.setLineDash([14, 10]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    const clockH = device === 'samsung' ? H * 0.22 : H * 0.24;
    ctx.fillRect(40, 40, W - 80, clockH);
    ctx.strokeRect(40, 40, W - 80, clockH);
    ctx.fillStyle = '#00f0ff';
    ctx.font = `700 ${Math.round(W * 0.024)}px 'Inter', sans-serif`;
    ctx.fillText(`${device.toUpperCase()} SYSTEM CLOCK SAFE ZONE`, 70, 95);

    if (device === 'samsung') {
      const fpY = H * 0.79;
      ctx.strokeStyle = 'rgba(255, 30, 138, 0.85)';
      ctx.strokeRect(W * 0.36, fpY, W * 0.28, H * 0.07);
      ctx.fillStyle = '#ff1e8a';
      ctx.fillText('ULTRASONIC FINGERPRINT ZONE', W * 0.28, fpY - 14);
    }
    ctx.restore();
  }
}

// Auto-generate working-backward milestones from target date
document.getElementById('regenMilestonesBtn').addEventListener('click', () => {
  const dateStr = document.getElementById('dateInput').value;
  const d = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
  const shortDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  state.milestones = [
    { code: 'T-21', label: 'OUTLINE' },
    { code: 'T-14', label: 'BUILD' },
    { code: 'T-7', label: 'TEST' },
    { code: 'T-3', label: 'POLISH' },
    { code: shortDay, label: 'LAUNCH' }
  ];
  renderMilestoneInputs();
  renderCanvas();
});

// Preset buttons
document.querySelectorAll('#presetGroup .pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#presetGroup .pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const p = PRESETS[btn.dataset.preset];
    document.getElementById('tagInput').value = p.tag;
    document.getElementById('titleInput').value = p.title;
    document.getElementById('hudLabelInput').value = p.hudLabel;
    document.getElementById('dateInput').value = p.date;
    document.getElementById('captionInput').value = p.caption;
    state.milestones = structuredClone(p.milestones);
    renderMilestoneInputs();
    renderCanvas();
  });
});

// Custom background upload
document.getElementById('bgUpload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) {
    state.customBg = null;
    renderCanvas();
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      state.customBg = img;
      renderCanvas();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// Live re-render on inputs
['themeSelect', 'tagInput', 'titleInput', 'hudLabelInput', 'dateInput', 'formatSelect', 'deviceSelect', 'safeZoneToggle', 'captionInput'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => renderCanvas());
});

// Export PNG
document.getElementById('exportBtn').addEventListener('click', () => {
  renderCanvas(true);
  const link = document.createElement('a');
  const slug = document.getElementById('titleInput').value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const device = document.getElementById('deviceSelect').value;
  link.download = `vice-city-${slug}-${device}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  renderCanvas(false);
});

// Ensure web fonts render cleanly once loaded
document.fonts.ready.then(() => renderCanvas());
renderMilestoneInputs();
renderCanvas();
