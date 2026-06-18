import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Waves, Mountain, CloudLightning, MapPin } from 'lucide-react'
import { useEONETEvents } from '../hooks/useNASA'
import SectionHeader from './SectionHeader'
import { Spinner, ErrorCard } from './ui'
import Modal from './Modal'

const CATEGORY_ICONS = {
  wildfires: Flame,
  floods: Waves,
  volcanoes: Mountain,
  severeStorms: CloudLightning,
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function latestGeometry(event) {
  return event.geometries?.[event.geometries.length - 1]
}

export default function NaturalEvents() {
  const { data, isPending, isError } = useEONETEvents()
  const [selected, setSelected] = useState(null)
  const events = data?.events || []

  return (
    <section id="events" className="py-20 px-5 md:px-10 max-w-7xl mx-auto">
      <SectionHeader
        badge="EONET"
        color="green"
        title="Natural Events"
        subtitle="Wildfires, storms, and volcanic activity currently being tracked by NASA's Earth Observatory Natural Event Tracker."
      />

      {isPending && <Spinner text="Scanning the planet…" />}
      {isError && <ErrorCard msg="Failed to load natural event data" />}

      {events.length > 0 && (
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {events.slice(0, 24).map(ev => {
            const cat = ev.categories?.[0]
            const Icon = CATEGORY_ICONS[cat?.id] || MapPin
            const geo = latestGeometry(ev)
            return (
              <motion.div
                key={ev.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-5 cursor-pointer"
                onClick={() => setSelected(ev)}
              >
                <Icon className="text-green-400 mb-3" size={22} />
                <h3 className="text-sm font-semibold mb-1 line-clamp-2">{ev.title}</h3>
                <p className="text-[11px] text-white/40 uppercase tracking-widest">{cat?.title || 'Event'}</p>
                {geo && <p className="text-[11px] text-white/30 mt-2">{fmt(geo.date)}</p>}
              </motion.div>
            )
          })}
        </motion.div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (() => {
          const geo = latestGeometry(selected)
          const [lon, lat] = geo?.coordinates || []
          return (
            <div className="p-7">
              <p className="text-green-400 font-mono text-[11px] uppercase tracking-widest mb-2">
                {selected.categories?.[0]?.title || 'Natural Event'}
              </p>
              <h3 className="text-xl font-bold mb-3">{selected.title}</h3>
              {selected.description && (
                <p className="text-sm text-white/50 leading-relaxed mb-4">{selected.description}</p>
              )}
              {geo && <p className="text-sm text-white/35 mb-4">Last observed {fmt(geo.date)}</p>}
              {lat != null && lon != null && (
                <a
                  href={`https://www.google.com/maps?q=${lat},${lon}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-block text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                >
                  View location on map →
                </a>
              )}
            </div>
          )
        })()}
      </Modal>
    </section>
  )
}
