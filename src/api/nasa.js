const KEY = import.meta.env.VITE_NASA_API_KEY
const BASE = 'https://api.nasa.gov'
const EONET_BASE = 'https://eonet.gsfc.nasa.gov/api/v3'
const IMAGES_BASE = 'https://images-api.nasa.gov'

async function apiFetch(path) {
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`${BASE}${path}${sep}api_key=${KEY}`)
  if (!res.ok) throw new Error(`NASA API ${res.status}`)
  return res.json()
}

async function rawFetch(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`NASA API ${res.status}`)
  return res.json()
}

export const getAPOD = () => apiFetch('/planetary/apod')

export const getAsteroids = (date) =>
  apiFetch(`/neo/rest/v1/feed?start_date=${date}&end_date=${date}`)

export const getEPIC = () => apiFetch('/EPIC/api/images')

export const getMarsPhotos = ({ rover, sol, camera }) => {
  const cam = camera ? `&camera=${camera}` : ''
  return apiFetch(`/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&page=1${cam}`)
}

export const getSolarFlares = (start, end) =>
  apiFetch(`/DONKI/FLR?startDate=${start}&endDate=${end}`)

export const getCMEs = (start, end) =>
  apiFetch(`/DONKI/CME?startDate=${start}&endDate=${end}`)

export const getGeomagneticStorms = (start, end) =>
  apiFetch(`/DONKI/GST?startDate=${start}&endDate=${end}`)

export const getEONETEvents = (days = 20) =>
  rawFetch(`${EONET_BASE}/events?status=open&days=${days}`)

export const searchImages = (query) =>
  rawFetch(`${IMAGES_BASE}/search?q=${encodeURIComponent(query)}`)

export const buildLandsatImageUrl = ({ lat, lon, date }) =>
  `${BASE}/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=${date}&api_key=${KEY}`
