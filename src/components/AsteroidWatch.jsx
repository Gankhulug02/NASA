import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAsteroids } from '../hooks/useNASA'
import SectionHeader from './SectionHeader'
import { Spinner, ErrorCard } from './ui'

const LUNAR_KM = 384400
const MAX_LD = 30
const R_EDGE = 222

function ldToR(ld) {
  return (Math.log(Math.min(ld, MAX_LD) + 1) / Math.log(MAX_LD + 1)) * R_EDGE
}

function fmt(n, dec = 0) {
  return parseFloat(n).toLocaleString('en-US', { maximumFractionDigits: dec })
}

export default function AsteroidWatch() {
  const { data, isPending, isError } = useAsteroids()

  const neos = useMemo(() => {
    if (!data) return []
    return Object.values(data.near_earth_objects).flat()
  }, [data])

  const sorted = useMemo(
    () => [...neos].sort((a, b) =>
      parseFloat(a.close_approach_data[0].miss_distance.kilometers) -
      parseFloat(b.close_approach_data[0].miss_distance.kilometers)
    ),
    [neos]
  )

  const stats = useMemo(() => {
    if (!neos.length) return null
    const haz = neos.filter(n => n.is_potentially_hazardous_asteroid)
    const missKms = neos.map(n => parseFloat(n.close_approach_data[0].miss_distance.kilometers))
    const maxDiam = Math.max(...neos.map(n => n.estimated_diameter.kilometers.estimated_diameter_max))
    return { total: neos.length, hazardous: haz.length, closest: Math.min(...missKms), maxDiam }
  }, [neos])

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <section id="asteroids" className="py-20 px-5 md:px-10 max-w-7xl mx-auto">
      <SectionHeader
        badge="Near Earth"
        color="green"
        title="Asteroid Watch"
        subtitle={`Near-Earth objects tracked for ${today}`}
      />

      {isPending && <Spinner text="Scanning for near-Earth objects…" />}
      {isError && <ErrorCard msg="Failed to load asteroid data" />}

      {stats && (
        <>
          {/* Stat cards */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {[
              { value: stats.total, label: 'Near-Earth Objects', color: 'text-cyan-400' },
              {
                value: stats.hazardous,
                label: 'Potentially Hazardous',
                color: stats.hazardous > 0 ? 'text-red-400' : 'text-green-400',
              },
              { value: `${fmt(stats.closest / 1000)}K km`, label: 'Closest Approach', color: 'text-green-400' },
              { value: `${stats.maxDiam.toFixed(2)} km`, label: 'Largest Diameter', color: 'text-cyan-400' },
            ].map(s => (
              <motion.div
                key={s.label}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className={`text-3xl font-mono font-bold mb-2 ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-white/40 uppercase tracking-widest leading-snug">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Orbit diagram + list */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <OrbitDiagram neos={neos} />
            <AsteroidList neos={sorted} />
          </div>
        </>
      )}
    </section>
  )
}

function OrbitDiagram({ neos }) {
  const [hovered, setHovered] = useState(null)

  const dots = useMemo(() => neos.map((neo, i) => {
    const missKm = parseFloat(neo.close_approach_data[0].miss_distance.kilometers)
    const ld = missKm / LUNAR_KM
    const r = ldToR(ld)
    const angle = (i * 137.508) % 360
    const rad = (angle * Math.PI) / 180
    const haz = neo.is_potentially_hazardous_asteroid
    const size = Math.max(3.5, Math.min(8, neo.estimated_diameter.meters.estimated_diameter_max / 70))
    return {
      id: neo.id,
      x: 250 + r * Math.cos(rad),
      y: 250 + r * Math.sin(rad),
      r, ld, haz, size,
      name: neo.name.replace(/[()]/g, '').trim(),
    }
  }), [neos])

  const rings = [1, 5, 10, 20]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 flex flex-col items-center"
    >
      <p className="text-[10px] font-mono text-white/35 uppercase tracking-widest mb-5">
        Orbital View — Distances Relative to Earth
      </p>

      <div className="relative w-full max-w-[360px]">
        <svg viewBox="0 0 500 500" className="w-full">
          <defs>
            <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="redGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Reference rings */}
          {rings.map(ld => {
            const r = ldToR(ld)
            return (
              <g key={ld}>
                <circle cx="250" cy="250" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3 7" />
                <text x={250 + r + 5} y="254" fill="rgba(255,255,255,0.22)" fontSize="9" fontFamily="monospace">{ld}LD</text>
              </g>
            )
          })}

          {/* Earth glow halo */}
          <circle cx="250" cy="250" r="36" fill="url(#earthGlow)" />

          {/* Asteroid dots */}
          {dots.map(d => (
            <g
              key={d.id}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {d.haz && (
                <circle cx={d.x} cy={d.y} r={d.size + 5} fill="rgba(239,68,68,0.18)">
                  <animate attributeName="r" values={`${d.size + 4};${d.size + 9};${d.size + 4}`} dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={d.x} cy={d.y}
                r={d.size}
                fill={d.haz ? '#ef4444' : '#4ade80'}
                opacity={hovered?.id === d.id ? 1 : 0.85}
                filter={d.haz ? 'url(#redGlow)' : undefined}
              />
            </g>
          ))}

          {/* Earth */}
          <circle cx="250" cy="250" r="9" fill="#3b82f6" filter="url(#glow)" />
          <circle cx="250" cy="250" r="9" fill="none" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" />
          <text x="250" y="272" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">Earth</text>

          {/* Tooltip */}
          {hovered && (
            <g>
              <rect
                x={Math.min(hovered.x + 10, 340)}
                y={hovered.y - 28}
                width={Math.min(hovered.name.length * 6.5 + 16, 160)}
                height="44"
                rx="5"
                fill="rgba(12,12,30,0.95)"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
              <text
                x={Math.min(hovered.x + 18, 348)}
                y={hovered.y - 10}
                fill="white"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {hovered.name.slice(0, 22)}
              </text>
              <text
                x={Math.min(hovered.x + 18, 348)}
                y={hovered.y + 5}
                fill="rgba(255,255,255,0.5)"
                fontSize="9"
                fontFamily="monospace"
              >
                {hovered.ld.toFixed(1)} lunar dist
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="flex items-center gap-6 mt-4 text-[11px] text-white/35 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Safe
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Potentially Hazardous
        </span>
        <span>LD = Lunar Distance</span>
      </div>
    </motion.div>
  )
}

function AsteroidList({ neos }) {
  return (
    <div className="flex flex-col gap-2.5 max-h-[520px] overflow-y-auto pr-1">
      {neos.slice(0, 20).map((neo, i) => {
        const ca = neo.close_approach_data[0]
        const haz = neo.is_potentially_hazardous_asteroid
        const diam = neo.estimated_diameter.meters
        return (
          <motion.div
            key={neo.id}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.035, duration: 0.35 }}
            className={`glass rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/[0.07] transition-colors ${
              haz ? 'border-l-[3px] border-l-red-500/60' : ''
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{neo.name.replace(/[()]/g, '').trim()}</div>
              <div className="text-[11px] text-white/40 mt-1 flex flex-wrap gap-x-3 gap-y-0.5 leading-snug">
                <span>🔭 {fmt(ca.miss_distance.kilometers)} km</span>
                <span>⚡ {fmt(ca.relative_velocity.kilometers_per_hour)} km/h</span>
                <span>📏 {fmt(diam.estimated_diameter_min)}–{fmt(diam.estimated_diameter_max)} m</span>
              </div>
            </div>
            <span
              className={`shrink-0 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                haz
                  ? 'text-red-400 bg-red-400/10 border-red-400/30'
                  : 'text-green-400 bg-green-400/10 border-green-400/20'
              }`}
            >
              {haz ? '⚠ HAZ' : '✓ SAFE'}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
