import Starfield from './components/Starfield'
import Navbar from './components/Navbar'
import APOD from './components/APOD'
import MarsGallery from './components/MarsGallery'
import AsteroidWatch from './components/AsteroidWatch'
import EarthFromSpace from './components/EarthFromSpace'
import SpaceWeather from './components/SpaceWeather'
import NaturalEvents from './components/NaturalEvents'
import ImageLibrary from './components/ImageLibrary'
import LandsatExplorer from './components/LandsatExplorer'

function Divider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent max-w-7xl mx-auto" />
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Starfield />
      <Navbar />
      <main className="relative z-10">
        <APOD />
        <Divider />
        <MarsGallery />
        <Divider />
        <AsteroidWatch />
        <Divider />
        <EarthFromSpace />
        <Divider />
        <SpaceWeather />
        <Divider />
        <NaturalEvents />
        <Divider />
        <ImageLibrary />
        <Divider />
        <LandsatExplorer />
      </main>
      <footer className="relative z-10 text-center py-10 border-t border-white/[0.06] text-white/30 text-xs font-mono">
        <p>
          Built with{' '}
          <a
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noopener"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            NASA Open APIs
          </a>
        </p>
        <p className="mt-1 opacity-40">All data &amp; imagery courtesy NASA / JPL-Caltech / GSFC</p>
      </footer>
    </div>
  )
}
