import { useQuery } from '@tanstack/react-query'
import {
  getAPOD,
  getAsteroids,
  getEPIC,
  getMarsPhotos,
  getSolarFlares,
  getCMEs,
  getGeomagneticStorms,
  getEONETEvents,
  searchImages,
} from '../api/nasa'

const todayStr = () => new Date().toISOString().slice(0, 10)
const daysAgoStr = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

export const useAPOD = () =>
  useQuery({ queryKey: ['apod'], queryFn: getAPOD })

export const useAsteroids = () =>
  useQuery({ queryKey: ['asteroids', todayStr()], queryFn: () => getAsteroids(todayStr()) })

export const useEPIC = () =>
  useQuery({ queryKey: ['epic'], queryFn: getEPIC })

export const useMarsPhotos = (params) =>
  useQuery({ queryKey: ['mars', params], queryFn: () => getMarsPhotos(params) })

export const useSolarFlares = () =>
  useQuery({ queryKey: ['flr'], queryFn: () => getSolarFlares(daysAgoStr(30), todayStr()) })

export const useCMEs = () =>
  useQuery({ queryKey: ['cme'], queryFn: () => getCMEs(daysAgoStr(30), todayStr()) })

export const useGeomagneticStorms = () =>
  useQuery({ queryKey: ['gst'], queryFn: () => getGeomagneticStorms(daysAgoStr(30), todayStr()) })

export const useEONETEvents = () =>
  useQuery({ queryKey: ['eonet'], queryFn: () => getEONETEvents(20) })

export const useImageSearch = (query) =>
  useQuery({
    queryKey: ['images-search', query],
    queryFn: () => searchImages(query),
    enabled: !!query,
  })
