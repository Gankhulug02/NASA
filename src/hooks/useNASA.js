import { useQuery } from '@tanstack/react-query'
import { getAPOD, getAsteroids, getEPIC, getMarsPhotos } from '../api/nasa'

const todayStr = () => new Date().toISOString().slice(0, 10)

export const useAPOD = () =>
  useQuery({ queryKey: ['apod'], queryFn: getAPOD })

export const useAsteroids = () =>
  useQuery({ queryKey: ['asteroids', todayStr()], queryFn: () => getAsteroids(todayStr()) })

export const useEPIC = () =>
  useQuery({ queryKey: ['epic'], queryFn: getEPIC })

export const useMarsPhotos = (params) =>
  useQuery({ queryKey: ['mars', params], queryFn: () => getMarsPhotos(params) })
