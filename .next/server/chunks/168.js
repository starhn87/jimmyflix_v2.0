"use strict";
exports.id = 168;
exports.ids = [168];
exports.modules = {

/***/ 9168:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Container": () => (/* binding */ Container),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1069);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7518);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1175);
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_common_Loading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9404);
/* harmony import */ var _components_common_Helmet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2727);
/* harmony import */ var _components_common_Infos__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1440);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);











function Home() {
  const [{
    data: nowPlaying,
    isFetched: isNowPlayingFetched,
    isError: isNowPlayingError
  }, {
    data: upcoming,
    isFetched: isUpcomingFetched,
    isError: isUpcomingError
  }, {
    data: popular,
    isFetched: isPopularFetched,
    isError: isPopularError
  }, {
    data: topRated,
    isFetched: isTopRatedFetched,
    isError: isTopRatedError
  }] = (0,react_query__WEBPACK_IMPORTED_MODULE_3__.useQueries)([{
    queryKey: ['nowPlaying'],
    queryFn: () => _api__WEBPACK_IMPORTED_MODULE_1__.moviesApi.nowPlaying()
  }, {
    queryKey: ['upcoming'],
    queryFn: () => _api__WEBPACK_IMPORTED_MODULE_1__.moviesApi.upcoming()
  }, {
    queryKey: ['popularMovie'],
    queryFn: () => _api__WEBPACK_IMPORTED_MODULE_1__.moviesApi.popular()
  }, {
    queryKey: ['topRatedMovie'],
    queryFn: () => _api__WEBPACK_IMPORTED_MODULE_1__.moviesApi.topRated()
  }]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isNowPlayingFetched || !isUpcomingFetched || !isPopularFetched || !isTopRatedFetched) {
    return /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(_components_common_Loading__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {});
  }

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(_components_common_Helmet__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, {
      content: "Movies | Jimmyflix"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(Container, {
      children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(_components_common_Infos__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
        slider: true,
        data: nowPlaying,
        title: 'Now Playing Movies',
        isError: isNowPlayingError
      }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(_components_common_Infos__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
        slider: true,
        data: topRated,
        title: 'Top Rated Movies',
        isError: isTopRatedError
      }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(_components_common_Infos__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
        slider: true,
        data: upcoming,
        title: 'Upcoming Movies',
        isError: isUpcomingError
      }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(_components_common_Infos__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
        slider: true,
        data: popular,
        title: 'Popular Movies',
        isError: isPopularError
      })]
    })]
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);
const Container = styled_components__WEBPACK_IMPORTED_MODULE_2___default().div.withConfig({
  displayName: "pages__Container",
  componentId: "sc-h4fyu7-0"
})(["padding:20px;"]);

/***/ })

};
;