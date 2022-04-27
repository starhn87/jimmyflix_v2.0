"use strict";
exports.id = 69;
exports.ids = [69];
exports.modules = {

/***/ 1069:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "collections": () => (/* binding */ collections),
/* harmony export */   "moviesApi": () => (/* binding */ moviesApi),
/* harmony export */   "trendingApi": () => (/* binding */ trendingApi),
/* harmony export */   "tvApi": () => (/* binding */ tvApi)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2167);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7936);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__);


const api = axios__WEBPACK_IMPORTED_MODULE_0___default().create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: "bf0e271a0b3e98d631a06de42a7de616",
    language: 'en-US'
  }
});
const moviesApi = {
  nowPlaying: async () => await api.get('movie/now_playing').then(res => res.data.results),
  upcoming: async () => await api.get('movie/upcoming').then(res => res.data.results),
  popular: async () => await api.get('movie/popular').then(res => res.data.results),
  topRated: async () => await api.get('movie/top_rated').then(res => res.data.results),
  movieDetail: async id => await api.get(`movie/${id}`, {
    params: {
      append_to_response: 'videos'
    }
  }).then(res => res.data),
  cast: async id => await api.get(`movie/${id}/credits`).then(res => res.data.cast),
  search: async (term, isSearched) => {
    if (!isSearched) {
      return;
    }

    if (term.trim() === '') {
      return null;
    }

    return await api.get('search/movie', {
      params: {
        query: term
      }
    }).then(res => res.data.results);
  }
};
const collections = async id => await api.get(`collection/${id}`).then(res => res.data.parts);
const tvApi = {
  topRated: async () => await api.get('tv/top_rated').then(res => res.data.results),
  popular: async () => await api.get('tv/popular').then(res => res.data.results),
  airingToday: async () => await api.get('tv/airing_today').then(res => res.data.results),
  onTheAir: async () => await api.get('tv/on_the_air').then(res => res.data.results),
  showDetail: async id => api.get(`tv/${id}`, {
    params: {
      append_to_response: 'videos'
    }
  }).then(res => res.data),
  cast: async id => await api.get(`tv/${id}/credits`).then(res => res.data.cast),
  search: async (term, isSearched) => {
    if (!isSearched) {
      return;
    }

    if (term.trim() === '') {
      return null;
    }

    return await api.get('search/tv', {
      params: {
        query: term
      }
    }).then(res => res.data.results);
  }
};
const trendingApi = {
  movie: async timeType => await api.get(`/trending/movie/${timeType}`).then(res => res.data.results),
  tv: async timeType => await api.get(`/trending/tv/${timeType}`).then(res => res.data.results)
};

/***/ })

};
;