const COOLDOWN_KEY = 'alsharma_contact_last_sent_at'
const COOLDOWN_MS = 60 * 1000
const FAVICON_INTERVAL_MS = 250 // 4 fps cap
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

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
  const rootEl = document.getElementById('root')
  const panel = document.getElementById('contact-panel')
  const backdrop = document.getElementById('contact-backdrop')
  const closeBtn = document.getElementById('contact-close')
  const submitBtn = document.getElementById('cf-submit')
  const bodyEl = document.getElementById('contact-body')
  if (!panel || !backdrop || !bodyEl) return

  let contactReturnFocus = null
  let openFocusTimer = null

  function toggleContact(open) {
    if (openFocusTimer !== null) {
      window.clearTimeout(openFocusTimer)
      openFocusTimer = null
    }
    if (open) {
      contactReturnFocus = document.activeElement
      if (rootEl) rootEl.inert = true
      panel.inert = false
      panel.classList.add('is-open')
      backdrop.classList.add('is-open')
      const nameInput = document.getElementById('cf-name')
      const fallbackFocus = nameInput || closeBtn
      if (fallbackFocus) {
        openFocusTimer = window.setTimeout(() => {
          openFocusTimer = null
          if (!panel.inert) fallbackFocus.focus()
        }, 60)
      }
    } else {
      panel.inert = true
      if (rootEl) rootEl.inert = false
      panel.classList.remove('is-open')
      backdrop.classList.remove('is-open')
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
    wrap.style.paddingTop = '32px'

    const heading = document.createElement('p')
    heading.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "IBM Plex Sans", sans-serif'
    heading.style.fontWeight = '600'
    heading.style.fontSize = '28px'
    heading.style.letterSpacing = '-0.03em'
    heading.style.color = '#1d1d1f'
    heading.style.margin = '0 0 12px'
    heading.textContent = 'Message received.'

    const copy = document.createElement('p')
    copy.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "IBM Plex Sans", sans-serif'
    copy.style.fontSize = '17px'
    copy.style.lineHeight = '1.55'
    copy.style.color = '#515154'
    copy.style.margin = '0 0 28px'
    copy.textContent = 'I will reply within 24 hours.'

    const doneBtn = document.createElement('button')
    doneBtn.type = 'button'
    doneBtn.className = 'apple-btn-secondary apple-pill'
    doneBtn.textContent = 'Close'
    doneBtn.addEventListener('click', () => toggleContact(false))

    wrap.appendChild(heading)
    wrap.appendChild(copy)
    wrap.appendChild(doneBtn)
    bodyEl.appendChild(wrap)
    doneBtn.focus()
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
    btn.style.opacity = '0.55'
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
    if (panel.inert) return
    if (ev.key === 'Escape') {
      toggleContact(false)
      return
    }
    if (ev.key === 'Tab') {
      const focusables = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null
      )
      if (focusables.length === 0) {
        ev.preventDefault()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (!panel.contains(active)) {
        ev.preventDefault()
        ;(ev.shiftKey ? last : first).focus()
      } else if (ev.shiftKey && active === first) {
        ev.preventDefault()
        last.focus()
      } else if (!ev.shiftKey && active === last) {
        ev.preventDefault()
        first.focus()
      }
    }
  })
  window.addEventListener('open-contact', () => toggleContact(true))
}

export function initSiteShell() {
  if (initialized) return
  initialized = true
  initFavicon()
  initContactPanel()
}
