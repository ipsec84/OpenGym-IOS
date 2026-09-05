import { useLayoutEffect, useRef, useState } from 'react'
import { fmtNum, fmtDate, MONTHS, isoOf } from '../lib/format.js'
import { t } from '../lib/i18n.js'

const W = 340   // viewBox width; svg stretches to container, height comes from `h`

// series: [{ id: str, name: str, color: str, unit: str, points: [{ t: ms, y: num, d?: iso }] }]
// h: height in px (default 180)
// axes: boolean (default true)
export default function MultiLineChart({ series = [], h = 180, axes = true }) {
  const svgRef = useRef(null)
  const wrapRef = useRef(null)
  const tipRef = useRef(null)
  const [hover, setHover] = useState(null)   // { x, iso, items: [{ name, color, y, unit }] }
  const [visible, setVisible] = useState({}) // { [id]: boolean }

  const toggleSeries = id => {
    setVisible(prev => ({
      ...prev,
      [id]: prev[id] === false ? true : false
    }))
  }

  // Active series with points and not hidden
  const validSeries = series.filter(s => s.points && s.points.length > 0)
  const activeSeries = validSeries.filter(s => visible[s.id] !== false)

  useLayoutEffect(() => {
    setHover(null)
  }, [series, visible])

  useLayoutEffect(() => {
    const tip = tipRef.current, wrap = wrapRef.current
    if (!hover || !tip || !wrap) return
    const cw = wrap.clientWidth, ch = wrap.clientHeight
    const tw = tip.offsetWidth, th = tip.offsetHeight
    const M = 4
    const cx = hover.x / W * cw
    tip.style.left = Math.max(M, Math.min(cw - tw - M, cx - tw / 2)) + 'px'
    tip.style.top = M + 'px'
  })

  if (!validSeries.length) {
    return <div className="empty small">{t('No data yet')}</div>
  }

  const allActivePts = activeSeries.flatMap(s => s.points)
  if (!allActivePts.length) {
    return (
      <div style={{ padding: '20px 0', textAlign: 'center' }}>
        <div className="small dim" style={{ marginBottom: 8 }}>{t('All lines are hidden.')}</div>
        <button
          type="button"
          onClick={() => setVisible({})}
          className="btn-link small"
          style={{ cursor: 'pointer', color: 'var(--acc)' }}
        >
          {t('Show all')}
        </button>
      </div>
    )
  }

  const H = h
  const P = { l: axes ? 32 : 8, r: 12, t: 14, b: axes ? 22 : 8 }

  const allTimestamps = [...new Set(allActivePts.map(p => p.t))].sort((a, b) => a - b)
  const t0 = allTimestamps[0]
  const t1 = allTimestamps[allTimestamps.length - 1] === t0 ? t0 + 1 : allTimestamps[allTimestamps.length - 1]

  const ys = allActivePts.map(p => p.y)
  let ymin = 0 // Baseline at 0 provides clear relative scale for body metrics (0 to 110)
  let ymax = Math.max(...ys)
  if (ymax <= 0) ymax = 100
  const pad = ymax * 0.1
  ymax += pad

  const X = t => (t1 === t0 ? (P.l + W - P.r) / 2 : P.l + (t - t0) / (t1 - t0) * (W - P.l - P.r))
  const Y = y => {
    const f = (y - ymin) / (ymax - ymin)
    return P.t + (1 - f) * (H - P.t - P.b)
  }

  // Gridlines
  const gridlines = []
  if (axes) {
    const range = ymax - ymin
    const step = range > 80 ? 25 : range > 40 ? 20 : range > 20 ? 10 : 5
    for (let v = 0; v <= ymax; v += step) {
      const y = Y(v)
      gridlines.push(
        <g key={'y' + v}>
          <line x1={P.l} y1={y} x2={W - P.r} y2={y} stroke="var(--sep-op)" strokeWidth="1" strokeDasharray="2 4" />
          <text x={P.l - 5} y={y + 3.5} textAnchor="end" fontSize="9" fill="var(--label-2)">{fmtNum(v)}</text>
        </g>
      )
    }

    const d0 = new Date(t0), d1 = new Date(t1)
    const ticks = []
    let m = new Date(d0.getFullYear(), d0.getMonth() + 1, 1)
    while (m <= d1) {
      ticks.push({ t: +m, txt: t(MONTHS[m.getMonth()]) })
      m = new Date(m.getFullYear(), m.getMonth() + 1, 1)
    }
    if (ticks.length === 0) {
      for (let i = 0; i <= 2; i++) {
        const tv = t0 + (t1 - t0) * i / 2, dd = new Date(tv)
        ticks.push({ t: tv, txt: dd.getDate() + ' ' + t(MONTHS[dd.getMonth()]), anchor: i === 0 ? 'start' : i === 2 ? 'end' : 'middle' })
      }
    }
    const every = Math.max(1, Math.ceil(ticks.length / 7))
    ticks.forEach((tk, i) => {
      if (i % every) return
      const x = X(tk.t)
      gridlines.push(
        <g key={'x' + i}>
          <line x1={x} y1={P.t} x2={x} y2={H - P.b} stroke="var(--sep-op)" strokeWidth="1" strokeDasharray="2 4" />
          <text x={x} y={H - 6} textAnchor={tk.anchor || 'middle'} fontSize="9" fill="var(--label-2)">{tk.txt}</text>
        </g>
      )
    })
  }

  // Hover detection across unique timestamps
  const onMove = e => {
    const c = e.touches ? e.touches[0] : e
    if (!c || c.clientX === undefined || !svgRef.current) return
    const r = svgRef.current.getBoundingClientRect()
    const w = r.width || W
    const vx = (c.clientX - r.left) / w * W

    // Find closest timestamp
    let bestT = allTimestamps[0]
    let bestDist = Math.abs(X(bestT) - vx)
    for (const t of allTimestamps) {
      const dist = Math.abs(X(t) - vx)
      if (dist < bestDist) {
        bestDist = dist
        bestT = t
      }
    }

    // Collect values from all active series around bestT (within 24h)
    const items = []
    let isoDate = null
    activeSeries.forEach(s => {
      const match = s.points.find(p => Math.abs(p.t - bestT) < 86400000)
      if (match) {
        if (!isoDate && match.d) isoDate = match.d
        items.push({
          id: s.id,
          name: s.name,
          color: s.color,
          unit: s.unit,
          y: match.y,
          py: Y(match.y)
        })
      }
    })

    if (!isoDate) isoDate = isoOf(new Date(bestT))
    setHover({ x: X(bestT), iso: isoDate, items })
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Series interactive badges / legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10, padding: '0 2px' }}>
        {validSeries.map(s => {
          const isVis = visible[s.id] !== false
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggleSeries(s.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                background: isVis ? 'var(--surface-2)' : 'transparent',
                border: `1px solid ${isVis ? s.color : 'var(--sep)'}`,
                color: isVis ? 'var(--fg)' : 'var(--label-3)',
                opacity: isVis ? 1 : 0.45,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
              <span>{s.name}</span>
            </button>
          )
        })}
      </div>

      <div
        className="chart-i"
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseDown={onMove}
        onMouseLeave={() => setHover(null)}
        onTouchStart={onMove}
        onTouchMove={onMove}
      >
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ aspectRatio: `${W}/${H}` }}>
          {gridlines}

          {/* Polylines for each active series */}
          {activeSeries.map(s => {
            const sorted = [...s.points].sort((a, b) => a.t - b.t)
            const pts = sorted.length === 1 ? [sorted[0], sorted[0]] : sorted
            const poly = pts.map(p => X(p.t).toFixed(1) + ',' + Y(p.y).toFixed(1)).join(' ')
            return (
              <g key={s.id}>
                <polyline
                  points={poly}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {sorted.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={X(p.t)}
                    cy={Y(p.y)}
                    r="3.5"
                    fill={s.color}
                    stroke="var(--card-bg)"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            )
          })}

          {/* Hover cursor and highlighted dots */}
          {hover && (
            <g>
              <line
                className="cvl"
                x1={hover.x}
                y1={P.t}
                x2={hover.x}
                y2={H - P.b}
                stroke="var(--label-3)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {hover.items.map(it => (
                <circle
                  key={it.id}
                  cx={hover.x}
                  cy={it.py}
                  r="5"
                  fill={it.color}
                  stroke="var(--card-bg)"
                  strokeWidth="2"
                />
              ))}
            </g>
          )}
        </svg>

        {/* Floating tooltip */}
        {hover && (
          <div
            className="ctip"
            ref={tipRef}
            style={{
              pointerEvents: 'none',
              minWidth: 150,
              padding: '6px 10px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              zIndex: 10
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--fg)', borderBottom: '1px solid var(--sep)', paddingBottom: 3, marginBottom: 4 }}>
              {fmtDate(hover.iso, true)}
            </div>
            {hover.items.map(it => (
              <div
                key={it.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  fontSize: 11,
                  lineHeight: 1.4
                }}
              >
                <span style={{ color: it.color, fontWeight: 600 }}>● {it.name}</span>
                <span style={{ fontWeight: 700 }}>{fmtNum(it.y)} {it.unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
