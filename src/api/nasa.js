const KEY = 'mHsOcmMF0MonJv8hDOzMXyuinHQpXWd6mDVSCIwG'
const BASE = 'https://api.nasa.gov'

async function apiFetch(path) {
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`${BASE}${path}${sep}api_key=${KEY}`)
  if (!res.ok) throw new Error(`NASA API ${res.status}`)
  return res.json()
}

export const getAPOD = () => apiFetch('/planetary/apod')

export const getAsteroids = (date) =>
  apiFetch(`/neo/rest/v1/feed?start_date=${date}&end_date=${date}`)

export const getEPIC = () => apiFetch('/EPIC/api/natural/images')

export const getMarsPhotos = ({ rover, sol, camera }) => {
  const cam = camera ? `&camera=${camera}` : ''
  return apiFetch(`/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&page=1${cam}`)
}
