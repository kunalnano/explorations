// ============================================================
// EMERGENT LIFE LAB - Cellular Automata Sandbox
// ============================================================

const canvas = document.getElementById('life-canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })

// --- State ---
const CELL_SIZE = 4
let COLS, ROWS
let grid, nextGrid, ageGrid, heatGrid
let generation = 0
let population = 0
let playing = true
let targetFPS = 15
let lastFrame = 0
let frameInterval = 1000 / targetFPS
let visualMode = 'neon'
let trailAmount = 0.3
let glowAmount = 0.6
let brushSize = 2
let brushMode = 'draw'
let mutationRate = 0
let mouseDown = false

// Rule definitions: [birth set, survival set]
const RULES = {
  conway: { b: new Set([3]), s: new Set([2, 3]) },
  highlife: { b: new Set([3, 6]), s: new Set([2, 3]) },
  daynight: { b: new Set([3, 6, 7, 8]), s: new Set([3, 4, 6, 7, 8]) },
  seeds: { b: new Set([2]), s: new Set([]) },
  replicator: { b: new Set([1, 3, 5, 7]), s: new Set([1, 3, 5, 7]) },
  diamoeba: { b: new Set([3, 5, 6, 7, 8]), s: new Set([5, 6, 7, 8]) },
  anneal: { b: new Set([4, 6, 7, 8]), s: new Set([3, 5, 6, 7, 8]) },
  morley: { b: new Set([3, 6, 8]), s: new Set([2, 4, 5]) },
}
let currentRule = RULES.conway

// --- Sound Engine (vendored locally with SHA-384 SRI) ---
const TONE_URL = '/vendor/Tone.js'
const TONE_SRI = 'sha384-SV8bvcAWZTzpFew2+v18PCsH7MKFgkUqumOtYt9QTS0P6LgpEY+L5iQTXvirlWav'
let soundEnabled = false
let audioStarted = false
let toneLoadPromise = null
const synths = {}
let masterVol

function loadTone() {
  if (window.Tone) return Promise.resolve(window.Tone)
  if (toneLoadPromise) return toneLoadPromise

  toneLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = TONE_URL
    script.integrity = TONE_SRI
    script.crossOrigin = 'anonymous'
    script.async = true
    script.onload = () => resolve(window.Tone)
    script.onerror = () => reject(new Error('Tone.js failed to load'))
    document.head.appendChild(script)
  })

  return toneLoadPromise
}

function initAudio() {
  if (audioStarted) return
  const Tone = window.Tone
  if (!Tone) return
  audioStarted = true

  masterVol = new Tone.Volume(-20).toDestination()

  synths.pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.4, decay: 0.6, sustain: 0.3, release: 1.5 },
    volume: -12,
  }).connect(new Tone.Reverb({ decay: 4, wet: 0.7 }).connect(masterVol))

  synths.bass = new Tone.MonoSynth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.1, decay: 0.4, sustain: 0.5, release: 0.8 },
    filterEnvelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.3,
      release: 0.5,
      baseFrequency: 100,
      octaves: 2,
    },
    volume: -15,
  }).connect(masterVol)

  synths.perc = new Tone.MetalSynth({
    volume: -25,
    harmonicity: 5.1,
    modulationIndex: 16,
    resonance: 4000,
    envelope: { attack: 0.001, decay: 0.1, release: 0.2 },
  }).connect(new Tone.Reverb({ decay: 1.5, wet: 0.4 }).connect(masterVol))

  synths.noise = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.5, decay: 1, sustain: 0, release: 0.5 },
    volume: -30,
  }).connect(new Tone.AutoFilter({ frequency: 0.5, depth: 0.8 }).connect(masterVol))
}

const SCALE = ['C3', 'D3', 'E3', 'G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5']
let soundCooldown = 0
let lastSoundGen = -1

function sonify() {
  if (!soundEnabled || !audioStarted || generation === lastSoundGen) return
  lastSoundGen = generation

  const densityRatio = population / (COLS * ROWS)
  const audioVis = document.getElementById('audio-vis')
  audioVis.style.width = densityRatio * 300 + '%'

  const mode = document.getElementById('sound-mode').value
  soundCooldown--
  if (soundCooldown > 0) return

  if (mode === 'harmonic') {
    if (generation % 4 === 0) {
      const noteIdx = Math.floor(densityRatio * (SCALE.length - 1))
      const note = SCALE[Math.min(noteIdx, SCALE.length - 1)]
      const note2 = SCALE[Math.min(noteIdx + 2, SCALE.length - 1)]
      synths.pad.triggerAttackRelease([note, note2], '4n')
      soundCooldown = 3
    }
    if (generation % 8 === 0 && densityRatio > 0.05) {
      const bassNote = SCALE[Math.floor(densityRatio * 3)]
      synths.bass.triggerAttackRelease(bassNote, '2n')
    }
  } else if (mode === 'percussion') {
    const col = generation % COLS
    let colPop = 0
    for (let r = 0; r < ROWS; r++) {
      if (grid[col][r]) colPop++
    }
    if (colPop > 0) {
      synths.perc.triggerAttackRelease('8n')
      if (colPop > ROWS * 0.1) {
        const ni = Math.floor((colPop / ROWS) * (SCALE.length - 1))
        synths.pad.triggerAttackRelease(SCALE[ni], '16n')
      }
    }
  } else if (mode === 'ambient') {
    if (generation % 12 === 0) {
      const ni = Math.floor(densityRatio * (SCALE.length - 1))
      synths.pad.triggerAttackRelease([SCALE[ni], SCALE[Math.max(0, ni - 3)]], '1n')
      soundCooldown = 10
    }
    if (generation % 20 === 0 && densityRatio > 0.02) {
      synths.noise.triggerAttackRelease('2n')
    }
  } else if (mode === 'glitch') {
    if (generation % 2 === 0) {
      const ni = Math.floor(Math.random() * SCALE.length)
      synths.pad.triggerAttackRelease(SCALE[ni], '32n')
    }
    if (Math.random() < densityRatio * 2) {
      synths.perc.triggerAttackRelease('16n')
    }
  }
}

// --- Grid Management ---
function initGrids() {
  const wrap = document.querySelector('.canvas-wrap')
  const w = wrap.clientWidth
  const h = wrap.clientHeight
  COLS = Math.max(1, Math.floor(w / CELL_SIZE))
  ROWS = Math.max(1, Math.floor(h / CELL_SIZE))
  canvas.width = COLS * CELL_SIZE
  canvas.height = ROWS * CELL_SIZE

  grid = Array.from({ length: COLS }, () => new Uint8Array(ROWS))
  nextGrid = Array.from({ length: COLS }, () => new Uint8Array(ROWS))
  ageGrid = Array.from({ length: COLS }, () => new Float32Array(ROWS))
  heatGrid = Array.from({ length: COLS }, () => new Float32Array(ROWS))

  document.getElementById('grid-info').textContent = `${COLS}×${ROWS}`
  document.getElementById('cell-info').textContent = `${CELL_SIZE}px`
}

function countNeighbors(x, y) {
  let count = 0
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue
      const nx = (x + dx + COLS) % COLS
      const ny = (y + dy + ROWS) % ROWS
      count += grid[nx][ny]
    }
  }
  return count
}

function step() {
  population = 0
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const n = countNeighbors(x, y)
      const alive = grid[x][y]

      let next = 0
      if (alive) {
        next = currentRule.s.has(n) ? 1 : 0
      } else {
        next = currentRule.b.has(n) ? 1 : 0
      }

      if (mutationRate > 0 && Math.random() * 1000 < mutationRate) {
        next = next ? 0 : 1
      }

      nextGrid[x][y] = next

      if (next) {
        ageGrid[x][y] = Math.min(ageGrid[x][y] + 1, 255)
        population++
      } else {
        ageGrid[x][y] = Math.max(ageGrid[x][y] - 0.5, 0)
      }

      heatGrid[x][y] = alive !== next ? Math.min(heatGrid[x][y] + 50, 255) : Math.max(heatGrid[x][y] - 2, 0)
    }
  }

  ;[grid, nextGrid] = [nextGrid, grid]
  generation++
  updateStats()
  sonify()
}

function updateStats() {
  document.getElementById('gen-count').textContent = generation
  document.getElementById('pop-count').textContent = population
  document.getElementById('density').textContent = ((population / (COLS * ROWS)) * 100).toFixed(1) + '%'
}

// --- Rendering ---
function hslToRgb(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

function render() {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imgData.data

  const fade = 1 - trailAmount
  if (trailAmount > 0) {
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = Math.floor(pixels[i] * fade)
      pixels[i + 1] = Math.floor(pixels[i + 1] * fade)
      pixels[i + 2] = Math.floor(pixels[i + 2] * fade)
    }
  } else {
    pixels.fill(0)
  }

  const glowR = Math.floor(glowAmount * 2)

  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const alive = grid[x][y]
      const age = ageGrid[x][y]
      const heat = heatGrid[x][y]
      if (!alive && age < 1 && heat < 1) continue

      let r = 0
      let g = 0
      let b = 0
      let a = 0

      if (visualMode === 'neon') {
        if (alive) {
          const hue = (170 + age * 2) % 360
          ;[r, g, b] = hslToRgb(hue, 100, 55 + Math.min(age, 20))
          a = 255
        } else {
          ;[r, g, b] = hslToRgb(280, 60, Math.min(age * 3, 30))
          a = Math.min(age * 15, 180)
        }
      } else if (visualMode === 'heat') {
        const intensity = alive ? Math.min(age * 5 + heat, 255) : heat
        if (intensity > 180) {
          r = 255
          g = 255
          b = Math.floor(intensity * 0.8)
        } else if (intensity > 100) {
          r = 255
          g = Math.floor(intensity * 1.2)
          b = 0
        } else if (intensity > 30) {
          r = Math.floor(intensity * 2.5)
          g = 0
          b = 0
        } else {
          r = Math.floor(intensity * 1.5)
          g = 0
          b = Math.floor(intensity * 0.5)
        }
        a = alive ? 255 : Math.min(intensity * 2, 150)
      } else if (visualMode === 'psyche') {
        const hue = (generation * 3 + x * 2 + y * 2 + age * 10) % 360
        const lit = alive ? 60 : Math.min(age * 2, 25)
        ;[r, g, b] = hslToRgb(hue, 100, lit)
        a = alive ? 255 : Math.min(age * 20, 120)
      } else if (visualMode === 'ghost') {
        const v = alive ? 200 + Math.min(age, 55) : Math.min(age * 4, 80)
        r = Math.floor(v * 0.7)
        g = Math.floor(v * 0.8)
        b = v
        a = alive ? 220 : Math.min(age * 10, 100)
      } else if (visualMode === 'matrix') {
        r = 0
        b = 0
        g = alive ? Math.min(100 + age * 5, 255) : Math.min(age * 3, 60)
        a = alive ? 255 : Math.min(age * 12, 100)
      } else if (visualMode === 'plasma') {
        const wave =
          Math.sin(x * 0.1 + generation * 0.05) +
          Math.sin(y * 0.1 + generation * 0.03) +
          Math.sin((x + y) * 0.07 + generation * 0.02)
        const hue = (wave * 60 + generation * 2 + age * 5) % 360
        const lit = alive ? 55 : Math.min(age * 2 + Math.abs(wave) * 5, 25)
        ;[r, g, b] = hslToRgb((hue + 360) % 360, 90, lit)
        a = alive ? 255 : Math.min(age * 15, 100)
      }

      const px = x * CELL_SIZE
      const py = y * CELL_SIZE
      for (let dx = 0; dx < CELL_SIZE; dx++) {
        for (let dy = 0; dy < CELL_SIZE; dy++) {
          const idx = ((py + dy) * canvas.width + (px + dx)) * 4
          const existingA = pixels[idx + 3]
          if (a > existingA || alive) {
            pixels[idx] = r
            pixels[idx + 1] = g
            pixels[idx + 2] = b
            pixels[idx + 3] = Math.max(a, existingA)
          }
        }
      }

      if (alive && glowR > 0) {
        for (let gx = -glowR; gx <= glowR; gx++) {
          for (let gy = -glowR; gy <= glowR; gy++) {
            if (gx === 0 && gy === 0) continue
            const dist = Math.sqrt(gx * gx + gy * gy)
            if (dist > glowR) continue
            const falloff = (1 - dist / glowR) * 0.25
            const gpx = px + gx
            const gpy = py + gy
            if (gpx < 0 || gpx >= canvas.width || gpy < 0 || gpy >= canvas.height) continue
            const idx = (gpy * canvas.width + gpx) * 4
            pixels[idx] = Math.min(255, pixels[idx] + Math.floor(r * falloff))
            pixels[idx + 1] = Math.min(255, pixels[idx + 1] + Math.floor(g * falloff))
            pixels[idx + 2] = Math.min(255, pixels[idx + 2] + Math.floor(b * falloff))
            pixels[idx + 3] = Math.min(255, pixels[idx + 3] + Math.floor(80 * falloff))
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)
}

// --- Main Loop ---
let fpsCounter = 0
let fpsTime = performance.now()

function mainLoop(timestamp) {
  requestAnimationFrame(mainLoop)

  if (timestamp - lastFrame < frameInterval) return
  lastFrame = timestamp

  if (playing) {
    step()
  }
  render()

  fpsCounter++
  if (timestamp - fpsTime >= 1000) {
    document.getElementById('fps-display').textContent = fpsCounter
    fpsCounter = 0
    fpsTime = timestamp
  }
}

// --- Controls ---
function togglePlay() {
  playing = !playing
  const btn = document.getElementById('btn-play')
  btn.textContent = playing ? '▶ PLAY' : '⏸ PAUSE'
  btn.classList.toggle('active', playing)
}

function stepOnce() {
  playing = false
  document.getElementById('btn-play').textContent = '⏸ PAUSE'
  document.getElementById('btn-play').classList.remove('active')
  step()
  render()
}

function clearGrid() {
  grid.forEach((col) => col.fill(0))
  ageGrid.forEach((col) => col.fill(0))
  heatGrid.forEach((col) => col.fill(0))
  generation = 0
  population = 0
  updateStats()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function setSpeed(val) {
  targetFPS = parseInt(val, 10)
  frameInterval = 1000 / targetFPS
  document.getElementById('speed-val').textContent = val
}

function setRuleset(name) {
  currentRule = RULES[name]
}

function setMutation(val) {
  mutationRate = parseInt(val, 10)
  document.getElementById('mutation-val').textContent = val + '%'
}

function setVisual(mode) {
  visualMode = mode
  document.querySelectorAll('[data-vis]').forEach((b) => b.classList.toggle('active', b.dataset.vis === mode))
}

function setTrail(val) {
  trailAmount = parseInt(val, 10) / 100
  document.getElementById('trail-val').textContent = val
}

function setGlow(val) {
  glowAmount = parseInt(val, 10) / 100
  document.getElementById('glow-val').textContent = val
}

function setBrush(val) {
  brushSize = parseInt(val, 10)
  document.getElementById('brush-val').textContent = val
}

function setBrushMode(mode) {
  brushMode = mode
  document.querySelectorAll('[data-brush]').forEach((b) => b.classList.toggle('active', b.dataset.brush === mode))
}

function setVolume(val) {
  document.getElementById('volume-val').textContent = val
  if (masterVol) masterVol.volume.value = -40 + (parseInt(val, 10) / 100) * 35
}

function toggleSound() {
  if (!audioStarted) {
    document.getElementById('sound-label').textContent = 'LOADING SOUND...'
    loadTone()
      .then((Tone) => Tone.start())
      .then(() => {
        initAudio()
        soundEnabled = true
        document.getElementById('sound-indicator').classList.add('on')
        document.getElementById('sound-label').textContent = 'SOUND ON'
        setVolume(document.getElementById('volume').value)
      })
      .catch(() => {
        soundEnabled = false
        document.getElementById('sound-indicator').classList.remove('on')
        document.getElementById('sound-label').textContent = 'SOUND UNAVAILABLE'
      })
  } else {
    soundEnabled = !soundEnabled
    document.getElementById('sound-indicator').classList.toggle('on', soundEnabled)
    document.getElementById('sound-label').textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF'
  }
}

// --- Mouse Drawing ---
function getGridPos(e) {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  const px = (e.clientX - rect.left) * scaleX
  const py = (e.clientY - rect.top) * scaleY
  return [Math.floor(px / CELL_SIZE), Math.floor(py / CELL_SIZE)]
}

function paint(x, y) {
  const val = brushMode === 'draw' ? 1 : 0
  for (let dx = -brushSize + 1; dx < brushSize; dx++) {
    for (let dy = -brushSize + 1; dy < brushSize; dy++) {
      const nx = (x + dx + COLS) % COLS
      const ny = (y + dy + ROWS) % ROWS
      grid[nx][ny] = val
      ageGrid[nx][ny] = val ? 1 : 0
    }
  }
}

canvas.addEventListener('mousedown', (e) => {
  mouseDown = true
  const [x, y] = getGridPos(e)
  paint(x, y)
})
canvas.addEventListener('mousemove', (e) => {
  if (!mouseDown) return
  const [x, y] = getGridPos(e)
  paint(x, y)
})
canvas.addEventListener('mouseup', () => {
  mouseDown = false
})
canvas.addEventListener('mouseleave', () => {
  mouseDown = false
})
canvas.addEventListener('contextmenu', (e) => e.preventDefault())

// Touch support
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault()
  mouseDown = true
  const t = e.touches[0]
  const [x, y] = getGridPos(t)
  paint(x, y)
})
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault()
  if (!mouseDown) return
  const t = e.touches[0]
  const [x, y] = getGridPos(t)
  paint(x, y)
})
canvas.addEventListener('touchend', () => {
  mouseDown = false
})

// --- UI Event Listeners ---
document.getElementById('btn-play').addEventListener('click', togglePlay)
document.getElementById('btn-step').addEventListener('click', stepOnce)
document.getElementById('btn-clear').addEventListener('click', clearGrid)
document.getElementById('speed').addEventListener('input', (e) => setSpeed(e.target.value))
document.getElementById('ruleset').addEventListener('change', (e) => setRuleset(e.target.value))
document.getElementById('mutation').addEventListener('input', (e) => setMutation(e.target.value))
document.getElementById('trail').addEventListener('input', (e) => setTrail(e.target.value))
document.getElementById('glow').addEventListener('input', (e) => setGlow(e.target.value))
document.getElementById('brush-size').addEventListener('input', (e) => setBrush(e.target.value))
document.getElementById('sound-toggle').addEventListener('click', toggleSound)
document.getElementById('volume').addEventListener('input', (e) => setVolume(e.target.value))

document.querySelectorAll('[data-vis]').forEach((btn) => {
  btn.addEventListener('click', () => setVisual(btn.dataset.vis))
})
document.querySelectorAll('[data-brush]').forEach((btn) => {
  btn.addEventListener('click', () => setBrushMode(btn.dataset.brush))
})
document.querySelectorAll('[data-pattern]').forEach((btn) => {
  btn.addEventListener('click', () => seedPattern(btn.dataset.pattern))
})

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault()
    togglePlay()
  } else if (e.key === 'r' || e.key === 'R') {
    seedPattern('random')
  } else if (e.key === 'c' || e.key === 'C') {
    clearGrid()
  } else if (e.key === 's' || e.key === 'S') {
    toggleSound()
  }
})

// --- Seed Patterns ---
function seedPattern(type) {
  clearGrid()
  const cx = Math.floor(COLS / 2)
  const cy = Math.floor(ROWS / 2)

  if (type === 'random' || type === 'soup') {
    const density = type === 'soup' ? 0.35 : 0.2
    const range = type === 'soup' ? Math.min(60, Math.floor(COLS / 3)) : COLS
    const ox = type === 'soup' ? cx - Math.floor(range / 2) : 0
    const oy = type === 'soup' ? cy - Math.floor(range / 2) : 0
    const w = type === 'soup' ? range : COLS
    const h = type === 'soup' ? range : ROWS
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        if (Math.random() < density) {
          const gx = (ox + x + COLS) % COLS
          const gy = (oy + y + ROWS) % ROWS
          grid[gx][gy] = 1
          ageGrid[gx][gy] = 1
        }
      }
    }
  } else if (type === 'noise') {
    const scale = 0.08
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const val =
          Math.sin(x * scale) * Math.cos(y * scale) +
          Math.sin(x * scale * 2.3 + 1.7) * Math.cos(y * scale * 1.8 + 0.5)
        if (val > 0.3) {
          grid[x][y] = 1
          ageGrid[x][y] = 1
        }
      }
    }
  } else if (type === 'gliders') {
    const glider = [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ]
    for (let i = 0; i < 30; i++) {
      const ox = Math.floor(Math.random() * COLS)
      const oy = Math.floor(Math.random() * ROWS)
      glider.forEach(([dx, dy]) => {
        grid[(ox + dx) % COLS][(oy + dy) % ROWS] = 1
        ageGrid[(ox + dx) % COLS][(oy + dy) % ROWS] = 1
      })
    }
  } else if (type === 'pulsars') {
    const pulsar = [
      [-6, -4], [-6, -3], [-6, -2], [-6, 2], [-6, 3], [-6, 4],
      [-4, -6], [-3, -6], [-2, -6], [-4, -1], [-3, -1], [-2, -1],
      [-4, 1], [-3, 1], [-2, 1], [-4, 6], [-3, 6], [-2, 6],
      [-1, -4], [-1, -3], [-1, -2], [-1, 2], [-1, 3], [-1, 4],
      [1, -4], [1, -3], [1, -2], [1, 2], [1, 3], [1, 4],
      [2, -6], [3, -6], [4, -6], [2, -1], [3, -1], [4, -1],
      [2, 1], [3, 1], [4, 1], [2, 6], [3, 6], [4, 6],
      [6, -4], [6, -3], [6, -2], [6, 2], [6, 3], [6, 4],
    ]
    const positions = [
      [cx, cy],
      [cx - 30, cy - 20],
      [cx + 30, cy + 20],
      [cx + 25, cy - 25],
    ]
    positions.forEach(([px, py]) => {
      pulsar.forEach(([dx, dy]) => {
        const gx = (px + dx + COLS) % COLS
        const gy = (py + dy + ROWS) % ROWS
        grid[gx][gy] = 1
        ageGrid[gx][gy] = 1
      })
    })
  } else if (type === 'gosper') {
    const gun = [
      [0, 4], [0, 5], [1, 4], [1, 5],
      [10, 3], [10, 4], [10, 5], [11, 2], [11, 6], [12, 1], [12, 7], [13, 1], [13, 7],
      [14, 4], [15, 2], [15, 6], [16, 3], [16, 4], [16, 5], [17, 4],
      [20, 1], [20, 2], [20, 3], [21, 1], [21, 2], [21, 3], [22, 0], [22, 4], [24, 0], [24, -1], [24, 4], [24, 5],
      [34, 1], [34, 2], [35, 1], [35, 2],
    ]
    const ox = Math.floor(COLS * 0.1)
    const oy = cy
    gun.forEach(([dx, dy]) => {
      const gx = (ox + dx + COLS) % COLS
      const gy = (oy + dy + ROWS) % ROWS
      grid[gx][gy] = 1
      ageGrid[gx][gy] = 1
    })
  } else if (type === 'acorn') {
    const acorn = [[0, 0], [1, 0], [1, 2], [3, 1], [4, 0], [5, 0], [6, 0]]
    acorn.forEach(([dx, dy]) => {
      grid[(cx + dx) % COLS][(cy + dy) % ROWS] = 1
      ageGrid[(cx + dx) % COLS][(cy + dy) % ROWS] = 1
    })
  } else if (type === 'rpent') {
    const rpent = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 0]]
    rpent.forEach(([dx, dy]) => {
      grid[(cx + dx) % COLS][(cy + dy) % ROWS] = 1
      ageGrid[(cx + dx) % COLS][(cy + dy) % ROWS] = 1
    })
  } else if (type === 'diehard') {
    const dh = [[0, 1], [1, 0], [1, 1], [5, 0], [6, 0], [6, 2], [7, 0]]
    dh.forEach(([dx, dy]) => {
      grid[(cx + dx) % COLS][(cy + dy) % ROWS] = 1
      ageGrid[(cx + dx) % COLS][(cy + dy) % ROWS] = 1
    })
  }

  playing = true
  document.getElementById('btn-play').textContent = '▶ PLAY'
  document.getElementById('btn-play').classList.add('active')
}

// --- Init ---
function init() {
  initGrids()
  seedPattern('random')
  requestAnimationFrame(mainLoop)
}

window.addEventListener('resize', () => {
  const oldGrid = grid
  const oldAge = ageGrid
  const oldCols = COLS
  const oldRows = ROWS
  initGrids()
  const minC = Math.min(oldCols, COLS)
  const minR = Math.min(oldRows, ROWS)
  for (let x = 0; x < minC; x++) {
    for (let y = 0; y < minR; y++) {
      grid[x][y] = oldGrid[x][y]
      ageGrid[x][y] = oldAge[x][y]
    }
  }
})

init()
