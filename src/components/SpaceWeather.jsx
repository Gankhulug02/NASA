import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Wind, Zap } from 'lucide-react'
import { useSolarFlares, useCMEs, useGeomagneticStorms } from '../hooks/useNASA'
import SectionHeader from './SectionHeader'
import { Spinner, ErrorCard } from './ui'
import Modal from './Modal'

const TYPE_META = {
  FLR: { label: 'Solar Flare', icon: Flame, color: 'text-amber-400' },
  CME: { label: 'Coronal Mass Ejection', icon: Wind, color: 'text-cyan-400' },
  GST: { label: 'Geomagnetic Storm', icon: Zap, color: 'text-purple-300' },
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function normalize(flares, cmes, storms) {
  const events = []
  for (const f of flares || []) {
    events.push({
      id: f.flrID, type: 'FLR', time: f.peakTime || f.beginTime,
      title: `Class ${f.classType || '?'} Solar Flare`,
      detail: `Source region: ${f.sourceLocation || 'unknown'}`,
      link: f.link,
    })
  }
  for (const c of cmes || []) {
    events.push({
      id: c.activityID, type: 'CME', time: c.startTime,
      title: 'Coronal Mass Ejection',
      detail: c.note || `Source region: ${c.sourceLocation || 'unknown'}`,
      link: c.link,
    })
  }
  for (const g of storms || []) {
    const maxKp = g.allKpIndex?.length
      ? Math.max(...g.allKpIndex.map(k => k.kpIndex))
      : null
    events.push({
      id: g.gstID, type: 'GST', time: g.startTime,
      title: 'Geomagnetic Storm',
      detail: maxKp != null ? `Peak Kp index: ${maxKp}` : 'Storm detected',
      link: g.link,
    })
  }
  return events.sort((a, b) => new Date(b.time) - new Date(a.time))
}

export default function SpaceWeather() {
  const flares = useSolarFlares()
  const cmes = useCMEs()
  const storms = useGeomagneticStorms()
  const [selected, setSelected] = useState(null)

  const isPending = flares.isPending || cmes.isPending || storms.isPending
  const isError = flares.isError || cmes.isError || storms.isError

  const events = useMemo(
    () => normalize(flares.data, cmes.data, storms.data),
    [flares.data, cmes.data, storms.data]
  )

  return (
    <section id="weather" className="py-20 px-5 md:px-10 max-w-7xl mx-auto">
      <SectionHeader
        badge="DONKI"
        color="amber"
        title="Space Weather"
        subtitle="Solar flares, coronal mass ejections, and geomagnetic storms tracked over the past 30 days."
      />

      {isPending && <Spinner text="Scanning solar activity…" />}
      {isError && <ErrorCard msg="Failed to load space weather data" />}

      {!isPending && !isError && events.length === 0 && (
        <p className="text-white/35 text-sm py-10 text-center">No notable space weather events in this window.</p>
      )}

      {events.length > 0 && (
        <motion.div
          className="flex flex-col gap-2.5 max-h-[560px] overflow-y-auto pr-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {events.slice(0, 40).map(e => {
            const meta = TYPE_META[e.type]
            const Icon = meta.icon
            return (
              <motion.div
                key={e.id}
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                className="glass rounded-xl px-4 py-3 flex items-center gap-4 hover:bg-white/[0.07] transition-colors cursor-pointer"
                onClick={() => setSelected(e)}
              >
                <Icon className={`${meta.color} shrink-0`} size={20} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{e.title}</div>
                  <div className="text-[11px] text-white/40 mt-0.5">{fmt(e.time)}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-7">
            <p className="text-amber-400 font-mono text-[11px] uppercase tracking-widest mb-2">
              {TYPE_META[selected.type].label}
            </p>
            <h3 className="text-xl font-bold mb-3">{selected.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-4">{selected.detail}</p>
            <p className="text-sm text-white/35">{fmt(selected.time)}</p>
            {selected.link && (
              <a
                href={selected.link}
                target="_blank"
                rel="noopener"
                className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                View on NASA DONKI →
              </a>
            )}
          </div>
        )}
      </Modal>
    </section>
  )
}
