import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '#apod', label: 'Picture of the Day' },
  { href: '#mars', label: 'Mars Rover' },
  { href: '#asteroids', label: 'Asteroids' },
  { href: '#earth', label: 'Earth' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300 ${
        scrolled ? 'glass shadow-xl' : 'bg-transparent'
      }`}
    >
      <a href="#" className="flex items-center gap-3 no-underline">
        <NASAMeatball className="w-9 h-9 shrink-0" />
        <div className="leading-none">
          <div className="text-[13px] font-bold tracking-[0.18em] text-white">NASA</div>
          <div className="text-[9px] font-mono text-white/35 tracking-[0.18em] uppercase">Open Explorer</div>
        </div>
      </a>

      <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
        {links.map(l => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-white/50 hover:text-white text-[13px] font-medium px-3 py-2 rounded-lg hover:bg-white/[0.07] transition-all no-underline"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        className="md:hidden text-white/60 hover:text-white p-1 bg-transparent border-0 cursor-pointer"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 glass border-t border-white/[0.06] p-3 flex flex-col gap-1 md:hidden"
          >
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white text-sm px-4 py-3 rounded-xl hover:bg-white/[0.07] transition-all no-underline block"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function NASAMeatball({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#0b3d91" />
      <ellipse cx="50" cy="50" rx="46" ry="20" fill="none" stroke="white" strokeWidth="3.5" transform="rotate(-28 50 50)" />
      <rect x="18" y="44" width="64" height="12" fill="#fc3d21" rx="1" />
      <circle cx="50" cy="50" r="14" fill="#0b3d91" />
      <text x="50" y="55" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial,sans-serif">NASA</text>
    </svg>
  )
}
