import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useImageSearch } from '../hooks/useNASA'
import SectionHeader from './SectionHeader'
import { ErrorCard, SkeletonCard } from './ui'
import Modal from './Modal'

function thumbnail(item) {
  return item.links?.find(l => l.rel === 'preview')?.href
}

export default function ImageLibrary() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [selected, setSelected] = useState(null)
  const { data, isFetching, isError } = useImageSearch(submitted)
  const items = data?.collection?.items || []

  return (
    <section id="library" className="py-20 px-5 md:px-10 max-w-7xl mx-auto">
      <SectionHeader
        badge="Image & Video Library"
        color="purple"
        title="Search NASA's Archive"
        subtitle="Millions of photos, videos, and audio clips from NASA missions past and present."
      />

      <form
        onSubmit={e => { e.preventDefault(); setSubmitted(query.trim()) }}
        className="flex gap-3 mb-10 max-w-xl"
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Try 'apollo 11', 'nebula', 'europa'…"
          className="flex-1 glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none border border-white/10 focus:border-purple-400/50"
        />
        <button
          type="submit"
          className="glass rounded-xl px-5 py-3 text-purple-300 hover:bg-white/[0.07] transition-colors border-0 cursor-pointer flex items-center gap-2"
        >
          <Search size={16} /> Search
        </button>
      </form>

      {isFetching && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && <ErrorCard msg="Failed to search NASA's image library" />}

      {!isFetching && submitted && items.length === 0 && !isError && (
        <p className="text-white/35 text-sm py-10 text-center">No results for "{submitted}".</p>
      )}

      {!isFetching && items.length > 0 && (
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {items.slice(0, 24).map(item => {
            const meta = item.data?.[0]
            const src = thumbnail(item)
            return (
              <motion.div
                key={meta.nasa_id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.025 }}
                className="glass rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setSelected(item)}
              >
                <div className="aspect-square overflow-hidden">
                  {src && (
                    <img
                      src={src}
                      alt={meta.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2">{meta.title}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (() => {
          const meta = selected.data?.[0]
          const src = thumbnail(selected)
          return (
            <>
              {src && <img src={src} alt={meta.title} className="w-full rounded-t-2xl block" />}
              <div className="p-7">
                <p className="text-purple-300 font-mono text-[11px] uppercase tracking-widest mb-2">
                  {meta.nasa_id}
                </p>
                <h3 className="text-xl font-bold mb-3">{meta.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{meta.description}</p>
              </div>
            </>
          )
        })()}
      </Modal>
    </section>
  )
}
