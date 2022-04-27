"use strict";
exports.id = 145;
exports.ids = [145];
exports.modules = {

/***/ 9145:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "v": () => (/* binding */ customMedia),
  "Z": () => (/* binding */ common_Header)
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "styled-components"
var external_styled_components_ = __webpack_require__(7518);
var external_styled_components_default = /*#__PURE__*/__webpack_require__.n(external_styled_components_);
// EXTERNAL MODULE: external "react-icons/md"
var md_ = __webpack_require__(4041);
// EXTERNAL MODULE: external "recoil"
var external_recoil_ = __webpack_require__(9755);
// EXTERNAL MODULE: ./recoil/store.ts
var store = __webpack_require__(433);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
;// CONCATENATED MODULE: ./components/HeaderSearchBar.tsx








function SearchBar() {
  const {
    0: editingValue,
    1: setEditingValue
  } = (0,external_react_.useState)('');
  const {
    0: focused,
    1: setFocused
  } = (0,external_react_.useState)(false);
  const searchRef = (0,external_react_.useRef)(null);
  const router = (0,router_.useRouter)();
  const setSearchValue = (0,external_recoil_.useSetRecoilState)(store/* searchValueState */.Li);
  const setIsSearched = (0,external_recoil_.useSetRecoilState)(store/* isSearchedState */.HB);

  const onSubmit = e => {
    var _searchRef$current;

    e.preventDefault();
    setEditingValue('');

    if (editingValue.trim() === '') {
      alert('Input what you want to search!');
      return;
    }

    (_searchRef$current = searchRef.current) === null || _searchRef$current === void 0 ? void 0 : _searchRef$current.blur();
    router.push('/search');
    setSearchValue(editingValue);
    setIsSearched(true);
  };

  return /*#__PURE__*/jsx_runtime_.jsx(SearchBarWrapper, {
    className: focused ? 'active' : '',
    children: /*#__PURE__*/(0,jsx_runtime_.jsxs)(Form, {
      onSubmit: onSubmit,
      children: [/*#__PURE__*/jsx_runtime_.jsx(Search, {
        ref: searchRef,
        value: editingValue,
        onChange: e => setEditingValue(e.target.value),
        type: "text",
        placeholder: "Movie / TV Show Search",
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        spellCheck: false
      }), /*#__PURE__*/jsx_runtime_.jsx(Button, {
        type: "submit",
        children: /*#__PURE__*/jsx_runtime_.jsx(md_.MdSearch, {
          size: 18
        })
      })]
    })
  });
}
const SearchBarWrapper = external_styled_components_default().article.withConfig({
  displayName: "HeaderSearchBar__SearchBarWrapper",
  componentId: "sc-1a2thzb-0"
})(["width:195px;background:transparent;border:none;border-bottom:1px solid #fff;opacity:0.5;transition:0.3s ease;&:hover,&.active{opacity:1;}"]);
const Form = external_styled_components_default().form.withConfig({
  displayName: "HeaderSearchBar__Form",
  componentId: "sc-1a2thzb-1"
})(["display:grid;height:100%;padding:5px 0;grid-template-columns:85% 15%;align-items:center;"]);
const Search = external_styled_components_default().input.withConfig({
  displayName: "HeaderSearchBar__Search",
  componentId: "sc-1a2thzb-2"
})(["width:100%;height:100%;padding:0 0 0 10px;background-color:transparent;border:none;font-size:12px;color:white;outline:none;&::placeholder{color:white;}&:focus{}"]);
const Button = external_styled_components_default().button.withConfig({
  displayName: "HeaderSearchBar__Button",
  componentId: "sc-1a2thzb-3"
})(["position:relative;top:4px;font-size:14px;color:white;background-color:transparent;border:none;&:hover{cursor:pointer;}"]);
// EXTERNAL MODULE: ./.yarn/__virtual__/next-virtual-8b60f543a6/0/cache/next-npm-12.1.5-ad12291300-a70e70f786.zip/node_modules/next/link.js
var next_link = __webpack_require__(2963);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: external "styled-media-query"
var external_styled_media_query_ = __webpack_require__(5908);
;// CONCATENATED MODULE: ./components/common/Header.tsx











const customMedia = (0,external_styled_media_query_.generateMedia)({
  desktop: '1630px',
  mobile: '768px'
});

function Header() {
  const router = (0,router_.useRouter)();
  const resetSearchValue = (0,external_recoil_.useResetRecoilState)(store/* searchValueState */.Li);
  const resetIsSearched = (0,external_recoil_.useResetRecoilState)(store/* isSearchedState */.HB);
  const resetTimeType = (0,external_recoil_.useResetRecoilState)(store/* timeTypeState */.P$);

  const onClick = () => {
    if (router.pathname === '/search') {
      resetIsSearched();
      resetSearchValue();
      resetTimeType();
    }
  };

  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(Head, {
    className: `${router.pathname === '/404' ? 'hidden' : ''}`,
    children: [/*#__PURE__*/(0,jsx_runtime_.jsxs)(LogoWrapper, {
      onClick: () => router.push('/'),
      children: [/*#__PURE__*/jsx_runtime_.jsx(md_.MdOutlineMovie, {
        fontSize: 35
      }), /*#__PURE__*/jsx_runtime_.jsx(Logo, {
        children: "Jimmyflix"
      })]
    }), /*#__PURE__*/(0,jsx_runtime_.jsxs)(List, {
      children: [/*#__PURE__*/jsx_runtime_.jsx(Item, {
        current: router.pathname === '/' || router.pathname.includes('/movies'),
        children: /*#__PURE__*/jsx_runtime_.jsx((link_default()), {
          href: "/",
          children: /*#__PURE__*/jsx_runtime_.jsx(Anchor, {
            children: "Movies"
          })
        })
      }), /*#__PURE__*/jsx_runtime_.jsx(Item, {
        current: router.pathname === '/tvs' || router.pathname.includes('/tvs'),
        children: /*#__PURE__*/jsx_runtime_.jsx((link_default()), {
          href: "/tvs",
          children: /*#__PURE__*/jsx_runtime_.jsx(Anchor, {
            children: "TV"
          })
        })
      }), /*#__PURE__*/jsx_runtime_.jsx(Item, {
        current: router.pathname === '/trending',
        children: /*#__PURE__*/jsx_runtime_.jsx((link_default()), {
          href: "/trending",
          children: /*#__PURE__*/jsx_runtime_.jsx(Anchor, {
            children: "Trending"
          })
        })
      }), /*#__PURE__*/jsx_runtime_.jsx(Item, {
        current: router.pathname.includes('/search'),
        onClick: () => onClick(),
        children: /*#__PURE__*/jsx_runtime_.jsx((link_default()), {
          href: "/search",
          children: /*#__PURE__*/jsx_runtime_.jsx(Anchor, {
            children: "Search"
          })
        })
      })]
    }), /*#__PURE__*/jsx_runtime_.jsx(Header_SearchBarWrapper, {
      children: /*#__PURE__*/jsx_runtime_.jsx(SearchBar, {})
    })]
  });
}

/* harmony default export */ const common_Header = (/*#__PURE__*/(0,external_react_.memo)(Header));
const Head = external_styled_components_default().header.withConfig({
  displayName: "Header__Head",
  componentId: "sc-1xr1yna-0"
})(["color:white;position:fixed;top:0;left:0;width:100%;height:50px;display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;justify-items:center;padding:0 10px;background-color:rgb(20,20,20);z-index:10;box-shadow:0px 1px 5px 2px rgba(0,0,0,0.8);&.hidden{display:none;}", ""], customMedia.lessThan('mobile')`
    grid-template-columns: 1fr 1fr 1fr 1fr;
	`);
const List = external_styled_components_default().ul.withConfig({
  displayName: "Header__List",
  componentId: "sc-1xr1yna-1"
})(["display:flex;", ""], customMedia.lessThan('mobile')`
    display: contents;
	`);
const Item = external_styled_components_default().li.withConfig({
  displayName: "Header__Item",
  componentId: "sc-1xr1yna-2"
})(["width:100px;font-size:16px;text-align:center;border-bottom:5px solid ", ";transition:border-bottom 0.5s ease-in-out;", ""], props => props.current ? '#4d96fb' : 'transparent', customMedia.lessThan('mobile')`
		width: 100%;
		font-size: 15px;
	`);
const Anchor = external_styled_components_default().a.withConfig({
  displayName: "Header__Anchor",
  componentId: "sc-1xr1yna-3"
})(["height:48px;display:flex;align-items:center;justify-content:center;"]);
const LogoWrapper = external_styled_components_default().div.withConfig({
  displayName: "Header__LogoWrapper",
  componentId: "sc-1xr1yna-4"
})(["display:flex;align-items:center;", " &:hover{cursor:pointer;}"], customMedia.lessThan('mobile')`
    display: none;
	`);
const Logo = external_styled_components_default().div.withConfig({
  displayName: "Header__Logo",
  componentId: "sc-1xr1yna-5"
})(["margin-left:10px;font-family:monospace;font-size:20px;"]);
const Header_SearchBarWrapper = external_styled_components_default().div.withConfig({
  displayName: "Header__SearchBarWrapper",
  componentId: "sc-1xr1yna-6"
})(["", ""], customMedia.lessThan('mobile')`
    display: none;
	`);

/***/ }),

/***/ 433:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HB": () => (/* binding */ isSearchedState),
/* harmony export */   "Li": () => (/* binding */ searchValueState),
/* harmony export */   "P$": () => (/* binding */ timeTypeState)
/* harmony export */ });
/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9755);
/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(recoil__WEBPACK_IMPORTED_MODULE_0__);

const isSearchedState = (0,recoil__WEBPACK_IMPORTED_MODULE_0__.atom)({
  key: 'isSearched',
  default: false
});
const searchValueState = (0,recoil__WEBPACK_IMPORTED_MODULE_0__.atom)({
  key: 'searchValue',
  default: ''
});
const timeTypeState = (0,recoil__WEBPACK_IMPORTED_MODULE_0__.atom)({
  key: 'timeType',
  default: 'Day'
});

/***/ })

};
;