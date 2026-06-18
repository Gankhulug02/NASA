import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEPIC } from '../hooks/useNASA'
import SectionHeader from './SectionHeader'
import { Spinner, ErrorCard } from './ui'
import Modal from './Modal'

function epicImageUrl(img) {
  const [y, m, d] = img.date.split(' ')[0].split('-')
  return `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${d}/png/${img.image}.png`
}

function fmtDate(dateStr) {
  return new Date(dateStr.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function EarthFromSpace() {
  const { data, isPending, isError } = useEPIC()
  const [selected, setSelected] = useState(null)
  const images = data?.slice(0, 9) || []

  return (
    <section id="earth" className="py-20 px-5 md:px-10 max-w-7xl mx-auto">
      <SectionHeader
        badge="DSCOVR / EPIC"
        color="purple"
        title="Earth from Space"
        subtitle="Real full-disk photographs from the EPIC camera aboard the DSCOVR satellite at the L1 Lagrange point, ~1.5 million km from Earth."
      />

      {isPending && <Spinner text="Downloading Earth imagery…" />}
      {isError && <ErrorCard msg="Failed to load Earth imagery" />}

      {images.length > 0 && (
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
        >
          {images.map(img => {
            const src = epicImageUrl(img)
            const label = fmtDate(img.date)
            return (
              <motion.div
                key={img.identifier}
                variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.025 }}
                className="glass rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setSelected(img)}
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={src}
                    alt={`Earth — ${label}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                    <span className="text-white/90 text-sm font-medium">View full image →</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-purple-300 font-mono text-[10px] uppercase tracking-widest">{label}</p>
                  <p className="text-sm text-white/50 mt-1">DSCOVR/EPIC · Natural Color</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (() => {
          const src = epicImageUrl(selected)
          const label = fmtDate(selected.date)
          return (
            <>
              <img src={src} alt="Earth" className="w-full rounded-t-2xl block" />
              <div className="p-7">
                <p className="text-purple-300 font-mono text-[11px] uppercase tracking-widest mb-2">
                  DSCOVR / EPIC Satellite
                </p>
                <h3 className="text-xl font-bold mb-3">Earth — {label}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {selected.caption ||
                    'Full-disk natural color image of Earth photographed by the Earth Polychromatic Imaging Camera (EPIC) aboard the Deep Space Climate Observatory (DSCOVR) satellite, positioned at the L1 Lagrange point approximately 1.5 million km from Earth.'}
                </p>
              </div>
            </>
          )
        })()}
      </Modal>
    </section>
  )
}
