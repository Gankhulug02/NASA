import { useState } from 'react'
import { motion } from 'framer-motion'
import { buildLandsatImageUrl } from '../api/nasa'
import SectionHeader from './SectionHeader'

const PRESETS = [
  { label: 'Grand Canyon', lat: 36.0544, lon: -112.1401 },
  { label: 'Amazon Rainforest', lat: -3.4653, lon: -62.2159 },
  { label: 'Sahara Desert', lat: 23.4162, lon: 25.6628 },
  { label: 'Great Barrier Reef', lat: -18.2871, lon: 147.6992 },
]

function daysAgoStr(n) {
  return new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)
}

export default function LandsatExplorer() {
  const [lat, setLat] = useState(PRESETS[0].lat)
  const [lon, setLon] = useState(PRESETS[0].lon)
  const [date, setDate] = useState(daysAgoStr(45))
  const [submitted, setSubmitted] = useState({ lat: PRESETS[0].lat, lon: PRESETS[0].lon, date: daysAgoStr(45) })
  const [status, setStatus] = useState('loading')

  const src = buildLandsatImageUrl(submitted)

  function go(next) {
    setSubmitted(next)
    setStatus('loading')
  }

  return (
    <section id="landsat" className="py-20 px-5 md:px-10 max-w-7xl mx-auto">
      <SectionHeader
        badge="Landsat Imagery"
        color="cyan"
        title="Earth from Orbit"
        subtitle="Satellite imagery for any point on Earth, captured by the Landsat 8 program."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => { setLat(p.lat); setLon(p.lon); go({ lat: p.lat, lon: p.lon, date }) }}
            className="glass rounded-full px-4 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.07] transition-colors border-0 cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={e => { e.preventDefault(); go({ lat: parseFloat(lat), lon: parseFloat(lon), date }) }}
        className="flex flex-wrap gap-3 mb-10 items-end"
      >
        <label className="flex flex-col gap-1 text-[11px] text-white/40 uppercase tracking-widest">
          Latitude
          <input
            type="number" step="any" value={lat} onChange={e => setLat(e.target.value)}
            className="glass rounded-xl px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-cyan-400/50 w-32"
          />
        </label>
        <label className="flex flex-col gap-1 text-[11px] text-white/40 uppercase tracking-widest">
          Longitude
          <input
            type="number" step="any" value={lon} onChange={e => setLon(e.target.value)}
            className="glass rounded-xl px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-cyan-400/50 w-32"
          />
        </label>
        <label className="flex flex-col gap-1 text-[11px] text-white/40 uppercase tracking-widest">
          Date
          <input
            type="date" value={date} onChange={e => setDate(e.target.value)}
            className="glass rounded-xl px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-cyan-400/50"
          />
        </label>
        <button
          type="submit"
          className="glass rounded-xl px-5 py-2.5 text-cyan-400 hover:bg-white/[0.07] transition-colors border-0 cursor-pointer"
        >
          View Imagery
        </button>
      </form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl overflow-hidden max-w-2xl"
      >
        {status === 'error' ? (
          <div className="text-center py-20 px-6">
            <p className="text-red-400 text-lg font-semibold mb-2">⚠ No imagery available</p>
            <p className="text-white/35 text-sm">
              Landsat has no cloud-free pass for this location and date — try a different date or preset.
            </p>
          </div>
        ) : (
          <img
            key={src}
            src={src}
            alt="Landsat satellite view"
            className="w-full block"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
          />
        )}
      </motion.div>
    </section>
  )
}
