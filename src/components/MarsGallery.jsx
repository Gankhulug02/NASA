import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMarsPhotos } from '../hooks/useNASA'
import SectionHeader from './SectionHeader'
import { Spinner, ErrorCard, SkeletonCard } from './ui'
import Modal from './Modal'

const ROVERS = ['curiosity', 'perseverance', 'opportunity']
const DEFAULT_SOL = { curiosity: 1000, perseverance: 200, opportunity: 500 }

const CAMERAS = {
  curiosity: [
    { value: '', label: 'All Cameras' },
    { value: 'FHAZ', label: 'Front Hazard Cam' },
    { value: 'RHAZ', label: 'Rear Hazard Cam' },
    { value: 'MAST', label: 'Mast Camera' },
    { value: 'CHEMCAM', label: 'ChemCam' },
    { value: 'NAVCAM', label: 'Navigation Cam' },
  ],
  perseverance: [
    { value: '', label: 'All Cameras' },
    { value: 'NAVCAM_LEFT', label: 'NavCam Left' },
    { value: 'NAVCAM_RIGHT', label: 'NavCam Right' },
    { value: 'FRONT_HAZCAM_LEFT_A', label: 'Front HazCam' },
    { value: 'REAR_HAZCAM_LEFT', label: 'Rear HazCam' },
  ],
  opportunity: [
    { value: '', label: 'All Cameras' },
    { value: 'FHAZ', label: 'Front Hazard Cam' },
    { value: 'RHAZ', label: 'Rear Hazard Cam' },
    { value: 'NAVCAM', label: 'Navigation Cam' },
    { value: 'PANCAM', label: 'Panoramic Cam' },
  ],
}

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function MarsGallery() {
  const [rover, setRover] = useState('curiosity')
  const [sol, setSol] = useState(1000)
  const [camera, setCamera] = useState('')
  const [query, setQuery] = useState({ rover: 'curiosity', sol: 1000, camera: '' })
  const [selected, setSelected] = useState(null)

  const { data, isPending, isError } = useMarsPhotos(query)
  const photos = data?.photos?.slice(0, 18) || []

  function handleRoverChange(r) {
    setRover(r)
    setSol(DEFAULT_SOL[r])
    setCamera('')
  }

  const controlClass =
    'bg-white/[0.06] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50 cursor-pointer transition-colors w-full'

  return (
    <section id="mars" className="py-20 px-5 md:px-10 max-w-7xl mx-auto">
      <SectionHeader badge="Mars" color="red" title="Rover Photo Gallery" />

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-5 mb-8 flex flex-wrap gap-4 items-end"
      >
        <div className="flex flex-col gap-1.5 min-w-[130px] flex-1">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Rover</label>
          <select value={rover} onChange={e => handleRoverChange(e.target.value)} className={controlClass}>
            {ROVERS.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[130px] flex-1">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Sol (Martian Day)</label>
          <input
            type="number"
            value={sol}
            min={1}
            max={5000}
            onChange={e => setSol(e.target.value)}
            className={controlClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 min-w-[160px] flex-[2]">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Camera</label>
          <select value={camera} onChange={e => setCamera(e.target.value)} className={controlClass}>
            {(CAMERAS[rover] || CAMERAS.curiosity).map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setQuery({ rover, sol: Number(sol), camera })}
          className="shrink-0 bg-nasa-blue hover:bg-blue-700 text-white font-semibold text-sm px-7 py-2.5 rounded-xl transition-colors cursor-pointer border-0"
          style={{ background: '#0b3d91' }}
        >
          Explore Mars
        </button>
      </motion.div>

      {/* Grid */}
      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isError ? (
        <ErrorCard msg="Failed to load Mars photos" />
      ) : photos.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <p className="text-lg mb-1">No photos found</p>
          <p className="text-sm">Try a different sol or camera</p>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {photos.map(p => (
              <motion.div
                key={p.id}
                variants={{ hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                className="glass rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setSelected(p)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.img_src}
                    alt={p.camera.full_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5">
                  <div className="text-[10px] font-mono text-white/30 truncate">{p.camera.name}</div>
                  <div className="text-xs font-medium text-white/60 mt-0.5">Sol {p.sol}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <p className="text-center text-white/30 text-xs font-mono mt-6">
            Showing {photos.length} of {data.photos.length} photos · Sol {query.sol}
          </p>
        </>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <img src={selected.img_src} alt="Mars" className="w-full rounded-t-2xl block" />
            <div className="p-7">
              <p className="text-red-400 font-mono text-[11px] uppercase tracking-widest mb-2">{selected.camera.full_name}</p>
              <h3 className="text-xl font-bold mb-3">{selected.rover.name} Rover — Sol {selected.sol}</h3>
              <div className="text-sm text-white/50 space-y-1.5">
                <p>Earth date: {fmtDate(selected.earth_date)}</p>
                <p>Rover status: <span className="text-green-400 font-semibold">{selected.rover.status.toUpperCase()}</span></p>
                <p>Landing date: {fmtDate(selected.rover.landing_date)}</p>
                <p>Total photos taken: {parseInt(selected.rover.total_photos).toLocaleString()}</p>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
