/* ===========================
   app.js — バニラJS実装
   main.js の React ロジックを再現
   =========================== */

/* ---------- 歌詞生成ロジック (main.js と同じアルゴリズム) ---------- */
function generateLyrics(inputText) {
  let A, B;

  if (!inputText.includes('の')) {
    A = inputText;
    B = '光';
  } else {
    const firstNoIndex = inputText.indexOf('の');
    A = inputText.substring(0, firstNoIndex);
    B = inputText.substring(firstNoIndex + 1);
  }

  const line1 = `${A}の${B}の中で ah`;
  const line2 = `${A}の${B}の中で ah, ah, ah`;
  const line3 = `${B}り出す`;
  const line4 = `${A}の${B}の中で ah, ah, ah`;
  const line5 = `${A}の${B}の中で`;

  return [line1, line2, line3, line4, line5].join('\n');
}

/* ---------- DOM 要素 ---------- */
const input    = document.getElementById('keyword-input');
const btn      = document.getElementById('generate-btn');
const output   = document.getElementById('lyrics-output');
const copyBtn  = document.getElementById('copy-btn');
const copyIcon = document.getElementById('copy-icon');

/* ---------- 歌詞を反映する ---------- */
function render() {
  const text = input.value.trim() || '朝の光';
  const lyrics = generateLyrics(text);

  // フェードアウト → テキスト更新 → フェードイン
  output.classList.remove('visible');
  setTimeout(() => {
    output.textContent = lyrics;
    output.classList.add('visible');
  }, 220);
}

/* ---------- イベント ---------- */
btn.addEventListener('click', render);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') render();
});

/* ---------- コピーボタン ---------- */
copyBtn.addEventListener('click', async () => {
  const text = output.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // フォールバック
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  copyBtn.classList.add('copied');
  copyIcon.textContent = '✓';
  setTimeout(() => {
    copyBtn.classList.remove('copied');
    copyIcon.textContent = '⧉';
  }, 1800);
});

/* ---------- 文字サイズ変更 ---------- */
const sizeSlider = document.getElementById('size-slider');

// 初期サイズを反映
function updateFontSize() {
  output.style.fontSize = `${sizeSlider.value}px`;
}
updateFontSize();

sizeSlider.addEventListener('input', updateFontSize);
sizeSlider.addEventListener('change', updateFontSize);

/* ---------- 初回表示 ---------- */
render();

/* ===========================
   背景パーティクル (Canvas)
   =========================== */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let W, H, particles;

const COLORS = [
  'rgba(244,162,97,',   // warm orange
  'rgba(231,111,158,',  // pink
  'rgba(248,237,204,',  // cream
  'rgba(150,130,220,',  // lavender
];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x:    Math.random() * W,
    y:    Math.random() * H,
    r:    Math.random() * 1.6 + 0.4,
    vx:   (Math.random() - 0.5) * 0.18,
    vy:   -(Math.random() * 0.22 + 0.08),
    alpha: Math.random() * 0.5 + 0.1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    life:  Math.random() * 400 + 200,
    age:   0,
  };
}

function initParticles() {
  particles = Array.from({ length: 110 }, createParticle);
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, i) => {
    p.age++;
    p.x += p.vx;
    p.y += p.vy;

    // 生存率でフェード
    const lifeRatio = p.age / p.life;
    const fade = lifeRatio < 0.1
      ? lifeRatio / 0.1
      : lifeRatio > 0.8
        ? 1 - (lifeRatio - 0.8) / 0.2
        : 1;
    const alpha = p.alpha * fade;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + alpha + ')';
    ctx.fill();

    if (p.age >= p.life) {
      particles[i] = createParticle();
      // 下から生成しなおす
      particles[i].y = H + 10;
    }
  });
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
  resize();
  initParticles();
});

resize();
initParticles();
drawParticles();
