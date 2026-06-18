import { motion } from 'framer-motion'

const badgeStyles = {
  cyan:   'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  red:    'text-red-400 bg-red-400/10 border-red-400/25',
  green:  'text-green-400 bg-green-400/10 border-green-400/25',
  purple: 'text-purple-300 bg-purple-400/10 border-purple-400/25',
}

export default function SectionHeader({ badge, color = 'cyan', title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55 }}
      className="mb-10"
    >
      <div className="flex items-center gap-4 flex-wrap mb-2">
        <span className={`text-[10px] font-mono font-bold tracking-[0.16em] uppercase px-3 py-1 rounded-full border ${badgeStyles[color]}`}>
          {badge}
        </span>
        <h2 className="text-3xl md:text-[2.5rem] font-bold leading-none text-gradient">{title}</h2>
      </div>
      {subtitle && <p className="text-white/35 text-sm leading-relaxed max-w-2xl mt-2">{subtitle}</p>}
    </motion.div>
  )
}
