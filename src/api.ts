import axios from 'axios'
import { TimeType } from './interface'
import 'regenerator-runtime/runtime'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: process.env.REACT_APP_API_KEY,
    language: 'en-US',
  },
})

export const moviesApi = {
  nowPlaying: async () =>
    await api.get('movie/now_playing').then((res) => res.data.results),
  upcoming: async () =>
    await api.get('movie/upcoming').then((res) => res.data.results),
  popular: async () =>
    await api.get('movie/popular').then((res) => res.data.results),
  topRated: async () =>
    await api.get('movie/top_rated').then((res) => res.data.results),
  movieDetail: async (id: number) =>
    await api
      .get(`movie/${id}`, {
        params: {
          append_to_response: 'videos',
        },
      })
      .then((res) => res.data),
  cast: async (id: number) =>
    await api.get(`movie/${id}/credits`).then((res) => res.data.cast),
  search: async (term: string, isSearched: boolean) => {
    if (!isSearched) {
      return
    }

    if (term.trim() === '') {
      return null
    }

    return await api
      .get('search/movie', {
        params: {
          query: term,
        },
      })
      .then((res) => res.data.results)
  },
}

export const collections = async (id: number) =>
  await api.get(`collection/${id}`).then((res) => res.data.parts)

export const tvApi = {
  topRated: async () =>
    await api.get('tv/top_rated').then((res) => res.data.results),
  popular: async () =>
    await api.get('tv/popular').then((res) => res.data.results),
  airingToday: async () =>
    await api.get('tv/airing_today').then((res) => res.data.results),
  onTheAir: async () =>
    await api.get('tv/on_the_air').then((res) => res.data.results),
  showDetail: async (id: number) =>
    api
      .get(`tv/${id}`, {
        params: {
          append_to_response: 'videos',
        },
      })
      .then((res) => res.data),
  cast: async (id: number) =>
    await api.get(`tv/${id}/credits`).then((res) => res.data.cast),
  search: async (term: string, isSearched: boolean) => {
    if (!isSearched) {
      return
    }

    if (term.trim() === '') {
      return null
    }

    return await api
      .get('search/tv', {
        params: {
          query: term,
        },
      })
      .then((res) => res.data.results)
  },
}

export const trendingApi = {
  movie: async (timeType: TimeType) =>
    await api
      .get(`/trending/movie/${timeType}`)
      .then((res) => res.data.results),
  tv: async (timeType: TimeType) =>
    await api.get(`/trending/tv/${timeType}`).then((res) => res.data.results),
}
