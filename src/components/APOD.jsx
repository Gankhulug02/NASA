import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAPOD } from '../hooks/useNASA'
import SectionHeader from './SectionHeader'
import { Spinner, ErrorCard } from './ui'

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function APOD() {
  const { data, isPending, isError } = useAPOD()

  return (
    <section id="apod" className="pt-10 pb-20 px-5 md:px-10 max-w-7xl mx-auto">
      <SectionHeader badge="✦ Live Today" color="cyan" title="Astronomy Picture of the Day" />

      {isPending && <Spinner text="Fetching today's cosmos…" />}
      {isError && <ErrorCard msg="Failed to load Picture of the Day" />}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden border border-white/[0.08] min-h-[72vh] flex items-end"
          style={{ background: '#0a0a1e' }}
        >
          {/* Media */}
          {data.media_type === 'video' ? (
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={data.url}
              allowFullScreen
              title={data.title}
            />
          ) : (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
            >
              <img
                src={data.hdurl || data.url}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/55 to-transparent" />

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative z-10 p-8 md:p-14 w-full"
          >
            <p className="text-cyan-400 font-mono text-[11px] tracking-[0.18em] uppercase mb-3">
              {fmtDate(data.date)}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl drop-shadow-lg">
              {data.title}
            </h1>
            <Description text={data.explanation} />
            {data.copyright && (
              <p className="mt-4 text-[11px] text-white/30 font-mono">
                © {data.copyright.replace(/\n/g, ' ')}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

function Description({ text }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="max-w-xl">
      <p className={`text-white/60 text-[15px] leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
        {text}
      </p>
      <button
        onClick={() => setExpanded(e => !e)}
        className="mt-2 text-cyan-400 hover:text-cyan-300 text-sm bg-transparent border-0 cursor-pointer font-sans p-0 transition-colors"
      >
        {expanded ? 'Read less ↑' : 'Read more ↓'}
      </button>
    </div>
  )
}
