const COOLDOWN_KEY = 'alsharma_contact_last_sent_at'
const COOLDOWN_MS = 60 * 1000
const FAVICON_INTERVAL_MS = 250 // 4 fps cap

let initialized = false
let lastSentMemory = 0

function initFavicon() {
  const link = document.querySelector("link[rel='icon']")
  if (!link) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (reducedMotion.matches) return

  const S = 32
  const H = S / 2
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let t = 0
  let timerId = null

  function draw() {
    if (document.hidden || reducedMotion.matches) {
      stop()
      return
    }
    t += 0.35
    ctx.clearRect(0, 0, S, S)
    const pulse = Math.sin(t) * 0.3 + 0.7

    ctx.beginPath()
    ctx.arc(H, H, 12, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(201,168,76,' + 0.3 * pulse + ')'
    ctx.lineWidth = 1
    ctx.stroke()

    const g = ctx.createRadialGradient(H, H, 0, H, H, 10 + pulse * 3)
    g.addColorStop(0, 'rgba(201,168,76,' + 0.35 * pulse + ')')
    g.addColorStop(1, 'transparent')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, S, S)

    ctx.beginPath()
    ctx.arc(H, H, 5 + pulse * 1.5, 0, Math.PI * 2)
    const ng = ctx.createRadialGradient(H - 2, H - 2, 0, H, H, 7)
    ng.addColorStop(0, '#e8d48b')
    ng.addColorStop(1, '#8b7a3a')
    ctx.fillStyle = ng
    ctx.fill()

    link.href = canvas.toDataURL('image/png')
  }

  function start() {
    if (timerId !== null || document.hidden || reducedMotion.matches) return
    draw()
    timerId = window.setInterval(draw, FAVICON_INTERVAL_MS)
  }

  function stop() {
    if (timerId !== null) {
      window.clearInterval(timerId)
      timerId = null
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else start()
  })
  reducedMotion.addEventListener('change', (e) => {
    if (e.matches) stop()
    else start()
  })

  start()
}

function getLastSentAt() {
  try {
    const raw = sessionStorage.getItem(COOLDOWN_KEY)
    const parsed = raw ? Number(raw) : 0
    return Math.max(lastSentMemory, Number.isFinite(parsed) ? parsed : 0)
  } catch {
    return lastSentMemory
  }
}

function recordSentAt(ts) {
  lastSentMemory = ts
  try {
    sessionStorage.setItem(COOLDOWN_KEY, String(ts))
  } catch {
    // Storage unavailable; in-memory cooldown remains active.
  }
}

function initContactPanel() {
  const panel = document.getElementById('contact-panel')
  const backdrop = document.getElementById('contact-backdrop')
  const closeBtn = document.getElementById('contact-close')
  const submitBtn = document.getElementById('cf-submit')
  const bodyEl = document.getElementById('contact-body')
  if (!panel || !backdrop || !bodyEl) return

  let contactReturnFocus = null

  function toggleContact(open) {
    if (open) {
      contactReturnFocus = document.activeElement
      panel.inert = false
      panel.style.transform = 'translateX(0)'
      panel.style.boxShadow = '-28px 0 90px rgba(5,5,8,0.12)'
      backdrop.style.opacity = '1'
      backdrop.style.pointerEvents = 'auto'
      const nameInput = document.getElementById('cf-name')
      if (nameInput) {
        window.setTimeout(() => nameInput.focus(), 60)
      }
    } else {
      panel.inert = true
      panel.style.transform = 'translateX(100%)'
      panel.style.boxShadow = 'none'
      backdrop.style.opacity = '0'
      backdrop.style.pointerEvents = 'none'
      if (contactReturnFocus && typeof contactReturnFocus.focus === 'function') {
        contactReturnFocus.focus()
      }
    }
  }

  function contactFail(msg) {
    const btn = document.getElementById('cf-submit')
    const err = document.getElementById('cf-error')
    if (btn) {
      btn.textContent = 'Send message'
      btn.style.opacity = '1'
      btn.disabled = false
    }
    if (err) {
      err.textContent = msg
      err.style.display = 'block'
    }
  }

  function renderConfirmation() {
    bodyEl.replaceChildren()

    const wrap = document.createElement('div')
    wrap.style.paddingTop = '40px'

    const heading = document.createElement('p')
    heading.style.fontFamily = "'Space Grotesk', sans-serif"
    heading.style.fontWeight = '600'
    heading.style.fontSize = '30px'
    heading.style.letterSpacing = '-0.04em'
    heading.style.color = '#050505'
    heading.style.margin = '0 0 12px'
    heading.textContent = 'Message received.'

    const copy = document.createElement('p')
    copy.style.fontFamily = "'IBM Plex Sans', sans-serif"
    copy.style.fontSize = '17px'
    copy.style.lineHeight = '1.6'
    copy.style.color = 'rgba(5,5,5,0.69)'
    copy.style.margin = '0 0 28px'
    copy.textContent = 'I will reply within 24 hours.'

    const doneBtn = document.createElement('button')
    doneBtn.type = 'button'
    doneBtn.style.fontFamily = "'JetBrains Mono', monospace"
    doneBtn.style.minHeight = '48px'
    doneBtn.style.padding = '0 22px'
    doneBtn.style.fontSize = '11px'
    doneBtn.style.fontWeight = '500'
    doneBtn.style.letterSpacing = '0.08em'
    doneBtn.style.textTransform = 'uppercase'
    doneBtn.style.borderRadius = '0'
    doneBtn.style.cursor = 'pointer'
    doneBtn.style.background = 'transparent'
    doneBtn.style.color = '#050505'
    doneBtn.style.border = '1px solid rgba(5,5,8,0.22)'
    doneBtn.textContent = 'Close'
    doneBtn.addEventListener('click', () => toggleContact(false))

    wrap.appendChild(heading)
    wrap.appendChild(copy)
    wrap.appendChild(doneBtn)
    bodyEl.appendChild(wrap)
  }

  function submitContact() {
    const nameEl = document.getElementById('cf-name')
    const emailEl = document.getElementById('cf-email')
    const msgEl = document.getElementById('cf-msg')
    const gotchaEl = document.getElementById('cf-gotcha')
    const btn = document.getElementById('cf-submit')
    const err = document.getElementById('cf-error')
    if (!nameEl || !emailEl || !msgEl || !btn || !err) return

    err.style.display = 'none'

    // Honeypot check: drop automated submissions without spending Formspree quota.
    const gotcha = gotchaEl ? gotchaEl.value.trim() : ''
    if (gotcha) {
      renderConfirmation()
      return
    }

    const now = Date.now()
    const elapsed = now - getLastSentAt()
    if (elapsed < COOLDOWN_MS) {
      const waitSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000)
      contactFail(`Please wait ${waitSec}s before sending another message.`)
      return
    }

    const n = nameEl.value.trim()
    const e = emailEl.value.trim()
    const m = msgEl.value.trim()

    if (!n || !e || !m) {
      contactFail('Name, email and a message are all needed.')
      return
    }
    if (n.length > 100 || e.length > 254 || m.length > 5000) {
      contactFail('One or more fields exceed the maximum length.')
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
      contactFail('That email address does not look right.')
      return
    }

    btn.textContent = 'Sending\u2026'
    btn.style.opacity = '0.5'
    btn.disabled = true

    fetch('https://formspree.io/f/mykboegz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: n,
        email: e,
        message: m,
        _gotcha: '',
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('Request failed')
        recordSentAt(Date.now())
        renderConfirmation()
      })
      .catch(() => {
        contactFail('That did not send. Email hello@darkvectorcognition.ai instead.')
      })
  }

  backdrop.addEventListener('click', () => toggleContact(false))
  if (closeBtn) closeBtn.addEventListener('click', () => toggleContact(false))
  if (submitBtn) submitBtn.addEventListener('click', submitContact)
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') toggleContact(false)
  })
  window.addEventListener('open-contact', () => toggleContact(true))
}

export function initSiteShell() {
  if (initialized) return
  initialized = true
  initFavicon()
  initContactPanel()
}
