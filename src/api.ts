import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: 'bf0e271a0b3e98d631a06de42a7de616',
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
  movieDetail: async (id: number) =>
    api
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