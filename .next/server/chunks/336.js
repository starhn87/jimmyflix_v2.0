"use strict";
exports.id = 336;
exports.ids = [336];
exports.modules = {

/***/ 9336:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "xu": () => (/* binding */ Box),
  "WN": () => (/* binding */ Flag),
  "TR": () => (/* binding */ Logo),
  "VG": () => (/* binding */ Name),
  "xs": () => (/* binding */ Product),
  "im": () => (/* binding */ Wrapper),
  "ZP": () => (/* binding */ detail)
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./components/common/Helmet.tsx
var Helmet = __webpack_require__(2727);
// EXTERNAL MODULE: ./components/common/Message.tsx
var Message = __webpack_require__(2886);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: ./pages/api/index.ts
var api = __webpack_require__(1069);
// EXTERNAL MODULE: external "styled-components"
var external_styled_components_ = __webpack_require__(7518);
var external_styled_components_default = /*#__PURE__*/__webpack_require__.n(external_styled_components_);
// EXTERNAL MODULE: ./components/common/Section.tsx
var Section = __webpack_require__(642);
// EXTERNAL MODULE: ./public/images/noPosterSmall.png
var noPosterSmall = __webpack_require__(1680);
;// CONCATENATED MODULE: ./public/images/imdb.png
/* harmony default export */ const imdb = ({"src":"/_next/static/media/imdb.878cf97a.png","height":1024,"width":2127,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAYAAACzzX7wAAAAgUlEQVR4nCWNuw3CQBBEZ1hMwEcWCDm7BggRKZVQBE1BB1iiCHIiJBCQ8pET+6y79dqe+M17fJ+d/xUxUVW0CwEYJUQ6E5Co+cidHvMvLtcS2VyQTgXR4M1qjO16At5PTg8G3J7eXgPQLCI0k2K/W4IvS3z+waT9Kq9dIloxWwzrBtVmLuDi+YH9AAAAAElFTkSuQmCC"});
// EXTERNAL MODULE: ./components/common/Header.tsx + 1 modules
var Header = __webpack_require__(9145);
// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
;// CONCATENATED MODULE: ./components/detail/Info.tsx






/* harmony default export */ const Info = (/*#__PURE__*/(0,external_react_.memo)(function Info({
  vote_average,
  release_date,
  first_air_date,
  runtime,
  episode_run_time,
  genres,
  overview
}) {
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
    children: [/*#__PURE__*/(0,jsx_runtime_.jsxs)(ItemContainer, {
      children: [/*#__PURE__*/(0,jsx_runtime_.jsxs)(Rating, {
        children: [/*#__PURE__*/jsx_runtime_.jsx("span", {
          role: "img",
          "aria-label": "rating",
          children: "\u2B50"
        }), "\xA0", vote_average, "/10"]
      }), (release_date || first_air_date) && /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [/*#__PURE__*/jsx_runtime_.jsx(Divider, {
          children: "\u2022"
        }), /*#__PURE__*/jsx_runtime_.jsx(Item, {
          children: release_date ? release_date.substring(0, 4) : first_air_date.substring(0, 4)
        })]
      }), runtime ? /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [/*#__PURE__*/jsx_runtime_.jsx(Divider, {
          children: "\u2022"
        }), /*#__PURE__*/(0,jsx_runtime_.jsxs)(Item, {
          children: [runtime, " min"]
        })]
      }) : null, (episode_run_time === null || episode_run_time === void 0 ? void 0 : episode_run_time.length) > 0 ? /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [/*#__PURE__*/jsx_runtime_.jsx(Divider, {
          children: "\u2022"
        }), /*#__PURE__*/(0,jsx_runtime_.jsxs)(Item, {
          children: [episode_run_time[0], " min"]
        })]
      }) : null, genres && /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [/*#__PURE__*/jsx_runtime_.jsx(Divider, {
          children: "\u2022"
        }), /*#__PURE__*/jsx_runtime_.jsx(Item, {
          children: genres.map((genre, index) => index === genres.length - 1 ? genre.name : `${genre.name} / `)
        })]
      })]
    }), /*#__PURE__*/jsx_runtime_.jsx(Overview, {
      children: overview
    })]
  });
}));
const Rating = external_styled_components_default().span.withConfig({
  displayName: "Info__Rating",
  componentId: "sc-vvsc4a-0"
})(["display:inline-flex;", ""], Header/* customMedia.lessThan */.v.lessThan('mobile')`
    `);
const ItemContainer = external_styled_components_default().div.withConfig({
  displayName: "Info__ItemContainer",
  componentId: "sc-vvsc4a-1"
})(["margin:15px 0;line-height:20px;", ""], Header/* customMedia.lessThan */.v.lessThan('mobile')`
        width: 95%;
        margin: 0;
        padding: 0 1% 3%;
    `);
const Item = external_styled_components_default().span.withConfig({
  displayName: "Info__Item",
  componentId: "sc-vvsc4a-2"
})([""]);
const Divider = external_styled_components_default().span.withConfig({
  displayName: "Info__Divider",
  componentId: "sc-vvsc4a-3"
})(["margin:0 10px;"]);
const Overview = external_styled_components_default().p.withConfig({
  displayName: "Info__Overview",
  componentId: "sc-vvsc4a-4"
})(["line-height:1.5;font-size:12px;opacity:0.7;", ""], Header/* customMedia.lessThan */.v.lessThan('mobile')`
        width: 95%;
    `);
;// CONCATENATED MODULE: ./components/detail/Tabs.tsx




function Tabs({
  selected,
  collections,
  seasons,
  onClick
}) {
  const {
    0: menus,
    1: setMenu
  } = (0,external_react_.useState)(['Trailer', 'Credits', 'Production']);
  (0,external_react_.useEffect)(() => {
    const newMenus = [...menus];

    if (collections) {
      newMenus.push('Collection');
    }

    if (seasons) {
      newMenus.push('Season');
    }

    setMenu(newMenus);
  }, []);
  return /*#__PURE__*/jsx_runtime_.jsx(Tab, {
    children: /*#__PURE__*/jsx_runtime_.jsx(List, {
      children: menus.map(menu => /*#__PURE__*/jsx_runtime_.jsx(Li, {
        className: `${selected === menu ? 'active' : ''}`,
        onClick: () => onClick(menu),
        children: menu
      }, menu))
    })
  });
}
const Tab = external_styled_components_default().div.withConfig({
  displayName: "Tabs__Tab",
  componentId: "sc-lw2lf7-0"
})(["margin-top:20px;color:white;height:48px;display:flex;align-items:center;vertical-align:center;padding:0 10px;background-color:rgba(20,20,20,0.8);z-index:10;box-shadow:0px 1px 5px 2px rgba(0,0,0,0.8);", ""], Header/* customMedia.lessThan */.v.lessThan('mobile')`
        width: 95%;
        padding: 1%;
    `);
const List = external_styled_components_default().ul.withConfig({
  displayName: "Tabs__List",
  componentId: "sc-lw2lf7-1"
})(["display:contents;width:100%;"]);
const Li = external_styled_components_default().li.withConfig({
  displayName: "Tabs__Li",
  componentId: "sc-lw2lf7-2"
})(["width:100%;text-align:center;height:50px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;&.active{border-bottom:3px solid #b1ddf9;transition:border-bottom 0.1s;}"]);
;// CONCATENATED MODULE: ./components/detail/Trailer.tsx







function Trailer({
  videos
}) {
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
    children: [videos.results && videos.results.length > 0 && /*#__PURE__*/jsx_runtime_.jsx(Iframe, {
      src: `https://www.youtube.com/embed/${videos.results[0].key}`,
      frameBorder: "0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowFullScreen: true,
      title: "Embedded youtube official trailer"
    }, videos.results[0].key), (!videos.results || videos.results.length == 0) && /*#__PURE__*/jsx_runtime_.jsx(Message/* default */.Z, {
      color: "#eee",
      text: 'No Trailer Found'
    })]
  });
}
const Iframe = external_styled_components_default().iframe.withConfig({
  displayName: "Trailer__Iframe",
  componentId: "sc-olahhy-0"
})(["margin-top:15px;width:100%;height:80%;", ""], Header/* customMedia.lessThan */.v.lessThan('mobile')`
    width: 95%;
    height: 400px;
    margin-bottom: 30px;
    padding: 5px 0;
  `);
;// CONCATENATED MODULE: ./components/detail/Season.tsx






function Season({
  seasons
}) {
  return /*#__PURE__*/jsx_runtime_.jsx(jsx_runtime_.Fragment, {
    children: (seasons === null || seasons === void 0 ? void 0 : seasons.length) > 0 && /*#__PURE__*/jsx_runtime_.jsx(Box, {
      children: /*#__PURE__*/jsx_runtime_.jsx(Wrapper, {
        children: seasons.map(season => /*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
          children: [/*#__PURE__*/jsx_runtime_.jsx(Product, {
            children: /*#__PURE__*/jsx_runtime_.jsx(Logo, {
              src: season.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : noPosterSmall/* default.src */.Z.src,
              alt: season.name
            })
          }), /*#__PURE__*/jsx_runtime_.jsx(Name, {
            children: season.name.length > 20 ? `${season.name.substring(0, 20)}...` : season.name
          })]
        }, season.id))
      })
    })
  });
}
;// CONCATENATED MODULE: ./public/images/noPersonSmall.png
/* harmony default export */ const noPersonSmall = ({"src":"/_next/static/media/noPersonSmall.044ce936.png","height":1046,"width":1046,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAQAAABuBnYAAAAAXUlEQVR42jWMzQ1AUBgEN6Ek0YGfHlxcRSH0oImdCkQdhFKePF/snnYzGUVo3CriQmJyIjFLFKKU2MnHIVEGUfnmcZ2JMHTe2PgtrCR/ZQntRczEGUTP6MEDI730Am9dNJkR5ATQAAAAAElFTkSuQmCC"});
// EXTERNAL MODULE: external "react-query"
var external_react_query_ = __webpack_require__(1175);
// EXTERNAL MODULE: ./components/common/Loading.tsx
var Loading = __webpack_require__(9404);
;// CONCATENATED MODULE: ./components/detail/Credit.tsx










function Credit({
  isMovie,
  parsedId
}) {
  const {
    data,
    isError,
    isFetched
  } = (0,external_react_query_.useQuery)(['credit', parsedId], () => {
    if (isMovie) {
      return api.moviesApi.cast(parsedId);
    } else {
      return api.tvApi.cast(parsedId);
    }
  });

  if (!isFetched) {
    return /*#__PURE__*/jsx_runtime_.jsx(Loading/* default */.Z, {});
  }

  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
    children: [(data === null || data === void 0 ? void 0 : data.length) > 0 && /*#__PURE__*/jsx_runtime_.jsx(Box, {
      children: /*#__PURE__*/jsx_runtime_.jsx(Wrapper, {
        children: data.map(profile => /*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
          children: [/*#__PURE__*/jsx_runtime_.jsx(Product, {
            children: /*#__PURE__*/jsx_runtime_.jsx(Logo, {
              src: profile.profile_path ? `https://image.tmdb.org/t/p/original${profile.profile_path}` : noPersonSmall.src,
              alt: profile.original_name
            })
          }), /*#__PURE__*/jsx_runtime_.jsx(Name, {
            children: profile.character
          }), /*#__PURE__*/(0,jsx_runtime_.jsxs)(Name, {
            children: ["(", profile.original_name, ")"]
          })]
        }, profile.id))
      })
    }), isError && /*#__PURE__*/jsx_runtime_.jsx(Message/* default */.Z, {
      color: "#e74c3c",
      text: 'Error in credits.'
    }), !isError && data.length === 0 && /*#__PURE__*/jsx_runtime_.jsx(Message/* default */.Z, {
      color: "#eee",
      text: 'No Credits Found'
    })]
  });
}
;// CONCATENATED MODULE: ./public/images/noProductionSmall.png
/* harmony default export */ const noProductionSmall = ({"src":"/_next/static/media/noProductionSmall.04a2d8b6.png","height":636,"width":440,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAIBAMAAAAo6JMLAAAAKlBMVEXt8PPs8PPr7/Lq7vHp7fHp7fDn6+7k6ezj6Ovg5unc4uXX3uK9yM68x84McnN6AAAAKElEQVR42mNQNjZiUDZSZjBSNWIQ35XEIHF2AoNKRxCDkaAyg7KxEQBeYgYe7lffrwAAAABJRU5ErkJggg=="});
;// CONCATENATED MODULE: ./components/detail/Production.tsx








function Production({
  production_companies,
  production_countries
}) {
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
    children: [/*#__PURE__*/(0,jsx_runtime_.jsxs)(Box, {
      children: [(production_companies === null || production_companies === void 0 ? void 0 : production_companies.length) > 0 && /*#__PURE__*/jsx_runtime_.jsx(Section/* default */.Z, {
        slide: false,
        title: "Production Companies",
        children: production_companies.map(company => /*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
          children: [/*#__PURE__*/jsx_runtime_.jsx(Product, {
            children: /*#__PURE__*/jsx_runtime_.jsx(Logo, {
              logo: company.logo_path,
              src: company.logo_path ? `https://image.tmdb.org/t/p/original${company.logo_path}` : noProductionSmall.src,
              alt: `${company.name}`
            })
          }), /*#__PURE__*/jsx_runtime_.jsx(Name, {
            children: company.name.length > 17 ? `${company.name.substring(0, 17)}...` : company.name
          })]
        }, company.id))
      }), (production_countries === null || production_countries === void 0 ? void 0 : production_countries.length) > 0 && /*#__PURE__*/jsx_runtime_.jsx(Section/* default */.Z, {
        slide: false,
        title: "Production Countries",
        children: production_countries.map(country => /*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
          children: [/*#__PURE__*/jsx_runtime_.jsx(Flag, {
            src: `https://flagcdn.com/w160/${country.iso_3166_1.toLowerCase()}.png`
          }), /*#__PURE__*/jsx_runtime_.jsx(Name, {
            children: country.name.length > 17 ? `${country.name.substring(0, 17)}...` : country.name
          })]
        }, (0,external_react_.useId)()))
      })]
    }), (!production_companies || production_companies.length === 0) && (!production_countries || production_countries.length === 0) && /*#__PURE__*/jsx_runtime_.jsx(Message/* default */.Z, {
      color: "#eee",
      text: 'No Production Found'
    })]
  });
}
// EXTERNAL MODULE: ./components/common/Infos.tsx + 1 modules
var Infos = __webpack_require__(1440);
;// CONCATENATED MODULE: ./components/detail/Collection.tsx








const Collection = ({
  id
}) => {
  const {
    data,
    isError,
    isFetched
  } = (0,external_react_query_.useQuery)(['collection', id], () => (0,api.collections)(id));

  if (!isFetched) {
    return /*#__PURE__*/jsx_runtime_.jsx(Loading/* default */.Z, {});
  }

  return isError ? /*#__PURE__*/jsx_runtime_.jsx(Message/* default */.Z, {
    color: "#e74c3c",
    text: 'Error in collection.'
  }) : /*#__PURE__*/jsx_runtime_.jsx(Infos/* default */.Z, {
    slider: false,
    data: data,
    isError: isError
  });
};

/* harmony default export */ const detail_Collection = (Collection);
;// CONCATENATED MODULE: ./components/detail/index.tsx























function Detail() {
  var _data$title, _data$title2;

  const router = (0,router_.useRouter)();
  const isMovie = router.pathname.includes('/movies/');
  const {
    id
  } = router.query;
  const parsedId = Number(id);
  const {
    0: tabName,
    1: setTabName
  } = (0,external_react_.useState)('Trailer');
  const {
    data,
    isError,
    isFetched
  } = (0,external_react_query_.useQuery)(['detail', id], () => {
    if (isMovie) {
      return api.moviesApi.movieDetail(parsedId);
    } else {
      return api.tvApi.showDetail(parsedId);
    }
  });
  const tabContent = data ? {
    Trailer: /*#__PURE__*/jsx_runtime_.jsx(Trailer, {
      videos: data.videos
    }),
    Season: /*#__PURE__*/jsx_runtime_.jsx(Season, {
      seasons: data.seasons
    }),
    Credits: /*#__PURE__*/jsx_runtime_.jsx(Credit, {
      parsedId: parsedId,
      isMovie: isMovie
    }),
    Production: /*#__PURE__*/jsx_runtime_.jsx(Production, {
      production_companies: data.production_companies,
      production_countries: data.production_countries
    }),
    Collection: data.belongs_to_collection && /*#__PURE__*/jsx_runtime_.jsx(detail_Collection, {
      id: data.belongs_to_collection.id
    })
  } : {};
  (0,external_react_.useEffect)(() => {
    window.scrollTo(0, 0);
    setTabName('Trailer');

    if (isNaN(parsedId)) {
      router.push('/');
    }
  }, [id]);

  if (!isFetched) {
    return /*#__PURE__*/jsx_runtime_.jsx(Loading/* default */.Z, {});
  }

  return /*#__PURE__*/jsx_runtime_.jsx(jsx_runtime_.Fragment, {
    children: isError ? /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
      children: [/*#__PURE__*/jsx_runtime_.jsx(Helmet/* default */.Z, {
        content: "Error | Jimmyflix"
      }), /*#__PURE__*/jsx_runtime_.jsx(Message/* default */.Z, {
        color: "#e74c3c",
        text: 'Error in detail'
      })]
    }) : /*#__PURE__*/jsx_runtime_.jsx(jsx_runtime_.Fragment, {
      children: /*#__PURE__*/(0,jsx_runtime_.jsxs)(Container, {
        children: [/*#__PURE__*/jsx_runtime_.jsx(Helmet/* default */.Z, {
          content: `${(_data$title = data.title) !== null && _data$title !== void 0 ? _data$title : data.name} | Jimmyflix`
        }), /*#__PURE__*/jsx_runtime_.jsx(Backdrop, {
          bgImage: `https://image.tmdb.org/t/p/original${data.backdrop_path}`
        }), /*#__PURE__*/(0,jsx_runtime_.jsxs)(Content, {
          children: [/*#__PURE__*/jsx_runtime_.jsx(Cover, {
            bgImage: data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : noPosterSmall/* default.src */.Z.src
          }), /*#__PURE__*/(0,jsx_runtime_.jsxs)(Data, {
            children: [/*#__PURE__*/(0,jsx_runtime_.jsxs)(Title, {
              children: [/*#__PURE__*/jsx_runtime_.jsx(Text, {
                children: (_data$title2 = data.title) !== null && _data$title2 !== void 0 ? _data$title2 : data.name
              }), /*#__PURE__*/jsx_runtime_.jsx(ILink, {
                target: "_blank",
                href: `https://www.imdb.com/title/${data.imdb_id}`,
                children: /*#__PURE__*/jsx_runtime_.jsx(Img, {
                  src: imdb.src
                })
              })]
            }), /*#__PURE__*/jsx_runtime_.jsx(Info, {
              vote_average: data.vote_average,
              release_date: data.release_date,
              first_air_date: data.first_air_date,
              runtime: data.runtime,
              episode_run_time: data.episode_run_time,
              genres: data.genres,
              overview: data.overview
            }), /*#__PURE__*/jsx_runtime_.jsx(Tabs, {
              selected: tabName,
              collections: !!data.belongs_to_collection,
              seasons: !!data.seasons,
              onClick: setTabName
            }), tabContent[tabName]]
          })]
        })]
      })
    })
  });
}

/* harmony default export */ const detail = (Detail);
const Container = external_styled_components_default().div.withConfig({
  displayName: "detail__Container",
  componentId: "sc-mkchar-0"
})(["position:relative;padding:50px;width:100%;height:calc(100vh - 50px);overflow-x:hidden;overflow-y:auto;", ""], Header/* customMedia.lessThan */.v.lessThan('mobile')`
        padding: 0;
    `);
const Backdrop = external_styled_components_default().div.withConfig({
  displayName: "detail__Backdrop",
  componentId: "sc-mkchar-1"
})(["position:absolute;top:0;left:0;width:100%;height:120%;background-image:url(", ");background-position:center center;background-size:cover;filter:blur(3px);opacity:0.5;z-index:0;", ""], props => props.bgImage, Header/* customMedia.lessThan */.v.lessThan('mobile')`
        display: none;
    `);
const Content = external_styled_components_default().div.withConfig({
  displayName: "detail__Content",
  componentId: "sc-mkchar-2"
})(["position:relative;display:flex;width:100%;height:100%;z-index:1;", ""], Header/* customMedia.lessThan */.v.lessThan('mobile')`
    display: block;
  `);
const Cover = external_styled_components_default().div.withConfig({
  displayName: "detail__Cover",
  componentId: "sc-mkchar-3"
})(["width:50%;height:120%;background-image:url(", ");background-position:center center;background-size:cover;border-radius:5px;", ""], props => props.bgImage, Header/* customMedia.lessThan */.v.lessThan('mobile')`
    width: 100%;
    height: 80%;
  `);
const Data = external_styled_components_default().div.withConfig({
  displayName: "detail__Data",
  componentId: "sc-mkchar-4"
})(["overflow-y:auto;width:70%;margin-left:15px;", " ", ""], Header/* customMedia.greaterThan */.v.greaterThan('mobile')`
    height: 120%;
  `, Header/* customMedia.lessThan */.v.lessThan('mobile')`
    width: 100%;
    margin-left: 2.5%;
  `);
const Title = external_styled_components_default().h3.withConfig({
  displayName: "detail__Title",
  componentId: "sc-mkchar-5"
})(["font-size:32px;margin-bottom:5px;", ""], Header/* customMedia.lessThan */.v.lessThan('mobile')`
    float: unset;
    padding: 3% 1%;
    width: 95%;
  `);
const Text = external_styled_components_default().span.withConfig({
  displayName: "detail__Text",
  componentId: "sc-mkchar-6"
})(["margin-right:20px;"]);
const ILink = external_styled_components_default().a.withConfig({
  displayName: "detail__ILink",
  componentId: "sc-mkchar-7"
})(["width:100px;height:10px;vertical-align:super;&:hover{text-decoration:underline;}"]);
const Img = external_styled_components_default().img.withConfig({
  displayName: "detail__Img",
  componentId: "sc-mkchar-8"
})(["width:33px;height:17px;vertical-align:-4px;"]);
const Product = external_styled_components_default().div.withConfig({
  displayName: "detail__Product",
  componentId: "sc-mkchar-9"
})(["display:flex;align-items:center;height:220px;margin-bottom:8px;background-color:#f7f7f7;"]);
const Logo = external_styled_components_default().img.withConfig({
  displayName: "detail__Logo",
  componentId: "sc-mkchar-10"
})(["width:100%;max-height:220px;padding:", ";"], props => props.logo ? '5px' : 0);
const Flag = external_styled_components_default().img.withConfig({
  displayName: "detail__Flag",
  componentId: "sc-mkchar-11"
})(["width:150px;height:90px;margin-bottom:8px;"]);
const Name = external_styled_components_default().p.withConfig({
  displayName: "detail__Name",
  componentId: "sc-mkchar-12"
})(["margin-bottom:10px;justify-content:center;font-size:14px;"]);
const Box = external_styled_components_default().div.withConfig({
  displayName: "detail__Box",
  componentId: "sc-mkchar-13"
})(["width:100%;margin-top:20px;", ""], Header/* customMedia.lessThan */.v.lessThan('mobile')`
    padding-bottom: 30px;
  `);
const Wrapper = external_styled_components_default()(Section/* Grid */.r).withConfig({
  displayName: "detail__Wrapper",
  componentId: "sc-mkchar-14"
})(["margin-top:0;"]);

/***/ })

};
;