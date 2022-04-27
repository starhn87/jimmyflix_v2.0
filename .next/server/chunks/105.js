"use strict";
exports.id = 105;
exports.ids = [105];
exports.modules = {

/***/ 2727:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ HelmetWrapper)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_helmet_async__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8638);
/* harmony import */ var react_helmet_async__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_helmet_async__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function HelmetWrapper({
  content
}) {
  return /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(react_helmet_async__WEBPACK_IMPORTED_MODULE_1__.HelmetProvider, {
    children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(react_helmet_async__WEBPACK_IMPORTED_MODULE_1__.Helmet, {
      children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx("title", {
        children: content
      })
    })
  });
}

/***/ }),

/***/ 1440:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ Infos)
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./components/common/Message.tsx
var Message = __webpack_require__(2886);
// EXTERNAL MODULE: ./.yarn/__virtual__/next-virtual-8b60f543a6/0/cache/next-npm-12.1.5-ad12291300-a70e70f786.zip/node_modules/next/link.js
var next_link = __webpack_require__(2963);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: external "styled-components"
var external_styled_components_ = __webpack_require__(7518);
var external_styled_components_default = /*#__PURE__*/__webpack_require__.n(external_styled_components_);
// EXTERNAL MODULE: ./public/images/noPosterSmall.png
var noPosterSmall = __webpack_require__(1680);
// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
;// CONCATENATED MODULE: ./components/common/Poster.tsx







const Poster = ({
  id,
  imageUrl,
  title,
  rating,
  year,
  isMovie = false
}) => /*#__PURE__*/jsx_runtime_.jsx((link_default()), {
  href: isMovie ? `/movies/${id}` : `/tvs/${id}`,
  children: /*#__PURE__*/jsx_runtime_.jsx("a", {
    children: /*#__PURE__*/(0,jsx_runtime_.jsxs)(Container, {
      children: [/*#__PURE__*/(0,jsx_runtime_.jsxs)(ImageContainer, {
        children: [/*#__PURE__*/jsx_runtime_.jsx(Image, {
          bgUrl: imageUrl ? `https://image.tmdb.org/t/p/w300${imageUrl}` : noPosterSmall/* default.src */.Z.src
        }), /*#__PURE__*/(0,jsx_runtime_.jsxs)(Rating, {
          children: [/*#__PURE__*/jsx_runtime_.jsx("span", {
            role: "img",
            "aria-label": "rating",
            children: "\u2B50"
          }), ' ', rating, "/10"]
        })]
      }), /*#__PURE__*/jsx_runtime_.jsx(Title, {
        children: title.length > 15 ? `${title.substring(0, 15)}...` : title
      }), /*#__PURE__*/jsx_runtime_.jsx(Year, {
        children: year
      })]
    })
  })
});

/* harmony default export */ const common_Poster = (Poster);
const Container = external_styled_components_default().div.withConfig({
  displayName: "Poster__Container",
  componentId: "sc-18f1afv-0"
})(["width:95%;font-size:12px;"]);
const Image = external_styled_components_default().div.withConfig({
  displayName: "Poster__Image",
  componentId: "sc-18f1afv-1"
})(["height:220px;background-image:url(", ");background-size:cover;border-radius:4px;background-position:center center;transition:opacity 0.1s linear;"], props => props.bgUrl);
const Rating = external_styled_components_default().span.withConfig({
  displayName: "Poster__Rating",
  componentId: "sc-18f1afv-2"
})(["position:absolute;font-size:16px;bottom:7px;right:7px;opacity:0;transition:opacity 0.1s linear;"]);
const ImageContainer = external_styled_components_default().div.withConfig({
  displayName: "Poster__ImageContainer",
  componentId: "sc-18f1afv-3"
})(["position:relative;margin-bottom:7px;&:hover{", "{opacity:0.2;}", "{opacity:1;}}"], Image, Rating);
const Title = external_styled_components_default().span.withConfig({
  displayName: "Poster__Title",
  componentId: "sc-18f1afv-4"
})(["display:block;font-size:15px;margin-bottom:4px;"]);
const Year = external_styled_components_default().span.withConfig({
  displayName: "Poster__Year",
  componentId: "sc-18f1afv-5"
})(["font-size:12px;color:rgba(255,255,255,0.5);"]);
// EXTERNAL MODULE: ./components/common/Section.tsx
var Section = __webpack_require__(642);
;// CONCATENATED MODULE: ./components/common/Infos.tsx







function Infos({
  slider,
  data,
  title,
  isError
}) {
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
    children: [(data === null || data === void 0 ? void 0 : data.length) > 0 && /*#__PURE__*/jsx_runtime_.jsx(Section/* default */.Z, {
      slide: slider,
      title: title,
      children: data.map(content => {
        var _content$title;

        return /*#__PURE__*/jsx_runtime_.jsx(common_Poster, {
          id: content.id,
          imageUrl: content.poster_path,
          title: (_content$title = content.title) !== null && _content$title !== void 0 ? _content$title : content.name,
          rating: content.vote_average,
          year: content.first_air_date ? content.first_air_date.substring(0, 4) : content.release_date ? content.release_date.substring(0, 4) : '',
          isMovie: content.title ? true : false
        }, content.id);
      })
    }), isError && /*#__PURE__*/jsx_runtime_.jsx(Message/* default */.Z, {
      color: "#e74c3c",
      text: `Error in ${title}`
    })]
  });
}

/***/ }),

/***/ 9404:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7518);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);





const Loading = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(Ring, {
  children: ["LOADING", /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx("span", {})]
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Loading);
const Ring = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "Loading__Ring",
  componentId: "sc-edlvz9-0"
})(["position:fixed;width:12rem;height:12rem;top:50%;left:50%;transform:translate(-50%,-50%);border:0.7rem solid #23a2f7;border-radius:50%;text-align:center;line-height:10.5rem;font-size:1.2rem;font-weight:1000;color:#23a2f7;letter-spacing:0.3rem;z-index:99999;&:before{content:'';position:absolute;width:100%;height:100%;top:-0.7rem;left:-0.7rem;border:0.7rem solid transparent;border-top:0.7rem solid #002473;border-right:0.7rem solid #002473;border-radius:50%;animation:animateA 3s linear infinite;}span{position:absolute;display:block;width:50%;height:0.4rem;top:calc(50% - 0.2rem);left:50%;background:transparent;transform-origin:left;animation:animateB 3s linear infinite;&:before{content:'';position:absolute;width:1.7rem;height:1.7rem;top:0rem;right:-1.2rem;border-radius:50%;background:#002473;}}@keyframes animateA{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}@keyframes animateB{0%{transform:rotate(45deg);}100%{transform:rotate(405deg);}}"]);

/***/ }),

/***/ 2886:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7518);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9145);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





const Message = ({
  text,
  color
}) => /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx(Container, {
  children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx(Text, {
    color: color,
    children: text
  })
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Message);
const Container = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "Message__Container",
  componentId: "sc-1rqvo2e-0"
})(["display:flex;height:10vh;justify-content:center;"]);
const Text = styled_components__WEBPACK_IMPORTED_MODULE_1___default().span.withConfig({
  displayName: "Message__Text",
  componentId: "sc-1rqvo2e-1"
})(["padding-top:50px;font-size:28px;color:", ";", ""], props => props.color, _Header__WEBPACK_IMPORTED_MODULE_2__/* .customMedia.lessThan */ .v.lessThan('mobile')`
        font-size: 22px;
    `);

/***/ }),

/***/ 642:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "r": () => (/* binding */ Grid)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7518);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_slick__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8096);
/* harmony import */ var react_slick__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_slick__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







const Section = ({
  slide,
  title,
  children
}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 9,
    slidesToScroll: 9,
    initialSlide: 0,
    responsive: [{
      breakpoint: 1440,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 7
      }
    }, {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5
      }
    }, {
      breakpoint: 720,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    }, {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    }, {
      breakpoint: 320,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }]
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(Container, {
    children: [title && /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx(Title, {
      children: title
    }), slide ? /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx(Wrapper, {
      children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx((react_slick__WEBPACK_IMPORTED_MODULE_2___default()), _objectSpread(_objectSpread({}, settings), {}, {
        children: children
      }))
    }) : /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx(Grid, {
      children: children
    })]
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Section);
const Container = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "Section__Container",
  componentId: "sc-cd9vtp-0"
})(["margin-top:10px;:not(:last-child){margin-bottom:50px;}"]);
const Title = styled_components__WEBPACK_IMPORTED_MODULE_1___default().span.withConfig({
  displayName: "Section__Title",
  componentId: "sc-cd9vtp-1"
})(["font-size:20px;font-weight:600;"]);
const Grid = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "Section__Grid",
  componentId: "sc-cd9vtp-2"
})(["margin-top:20px;display:grid;grid-template-columns:repeat(auto-fill,150px);grid-gap:25px;"]);
const Wrapper = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "Section__Wrapper",
  componentId: "sc-cd9vtp-3"
})(["margin:35px auto;width:95%;"]);

/***/ }),

/***/ 1680:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"src":"/_next/static/media/noPosterSmall.e19d0441.png","height":274,"width":184,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAICAAAAAAUmmrnAAAANUlEQVR42gVAMQ4AEAy8/2+W69WCRGKRxmDA6wTn3XewY8VG1NkCg50DNXkqyKIckkugmfEDeNYZVpdZRAwAAAAASUVORK5CYII="});

/***/ })

};
;