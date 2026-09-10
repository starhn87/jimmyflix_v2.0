import 'server-only'

import type { HeaderMessages, Locale } from '@/lib/i18n'

interface Dictionary {
  metadata: {
    title: string
    description: string
    openGraphDescription: string
  }
  header: HeaderMessages
  common: {
    untitled: string
    yearUnknown: string
    movie: string
    tvShow: string
    posterAlt: (title: string) => string
    ratingLabel: (rating: string) => string
    viewDetails: string
    catalogUnavailable: string
    sectionUnavailableTitle: (title: string) => string
    sectionUnavailableMessage: string
    sectionEmpty: string
    carouselLabel: (title: string) => string
    scrollBackward: (title: string) => string
    scrollForward: (title: string) => string
    retry: string
    retrying: string
    backToBrowse: string
    goBack: string
  }
  movies: {
    metadataTitle: string
    metadataDescription: string
    featured: string
    heading: string
    unavailable: string
    loadingFeatured: string
    loadingCatalog: string
  }
  tv: {
    metadataTitle: string
    metadataDescription: string
    featured: string
    heading: string
    unavailable: string
    loadingFeatured: string
    loadingCatalog: string
  }
  trend: {
    metadataTitle: string
    metadataDescription: string
    eyebrow: string
    heading: string
    description: string
    timeWindowLabel: string
    today: string
    week: string
    loading: string
  }
  search: {
    metadataTitle: string
    metadataDescription: string
    noMatches: (query: string) => string
    noMatchesHelp: string
    showingOne: string
    showingMany: (count: number) => string
    relatedPeople: string
    topics: string
    partialError: string
    totalError: string
    unavailableSources: (sources: string) => string
    movies: string
    tvShows: string
    movieResultsLabel: string
    tvResultsLabel: string
    eyebrow: string
    heading: string
    intro: string
    suggestionsLabel: string
    suggestions: string[]
    shorterTitle: string
    shorterMessage: (max: number) => string
    clear: string
    resultsEyebrow: string
    loadingResults: string
  }
  detail: {
    movieNotFound: string
    movieMetadataFallback: string
    movieDescriptionFallback: string
    tvNotFound: string
    tvMetadataFallback: string
    tvDescriptionFallback: string
    loadingMovie: string
    loadingTv: string
    loadingCredits: string
    loadingCollection: string
    trailer: string
    credits: string
    production: string
    collection: string
    seasons: string
    titleDetails: string
    minutes: (duration: number) => string
    noOverview: string
    imdbLabel: (title: string) => string
    tabListLabel: string
    noTrailer: string
    trailerFrameTitle: (title: string) => string
    playTrailer: (title: string) => string
    creditsErrorTitle: string
    creditsErrorMessage: string
    noCast: string
    cast: string
    castMember: string
    noProduction: string
    productionCompanies: string
    productionCountries: string
    flagAlt: (country: string) => string
    noSeasons: string
    collectionErrorTitle: string
    collectionErrorMessage: string
    noCollection: string
    collectionTitles: string
  }
  error: {
    title: string
    message: string
  }
  notFound: {
    imageAlt: string
    title: string
    message: string
    browse: string
  }
  sections: {
    movie: Array<{ id: string; title: string; description: string }>
    tv: Array<{ id: string; title: string; description: string }>
    trendingMovies: string
    trendingShows: string
    trendingMoviesDescription: (window: 'day' | 'week') => string
    trendingShowsDescription: (window: 'day' | 'week') => string
  }
}

const withKoreanObjectParticle = (value: string) => {
  const last = value.codePointAt(value.length - 1)
  if (!last || last < 0xac00 || last > 0xd7a3) return `${value}을(를)`
  return `${value}${(last - 0xac00) % 28 === 0 ? '를' : '을'}`
}

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    metadata: {
      title: 'Jimmyflix — Discover movies and TV shows',
      description: 'Browse popular, trending, top-rated, and upcoming movies and TV shows.',
      openGraphDescription: 'Discover movies and TV shows worth watching.',
    },
    header: {
      home: 'Jimmyflix home',
      primaryNavigation: 'Primary navigation',
      movies: 'Movies',
      tv: 'TV',
      trend: 'Trend',
      openSearch: 'Open search',
      closeSearch: 'Close search',
      searchLabel: 'Search by title, actor, or keyword',
      searchPlaceholder: 'Titles, actors, keywords',
      searchButton: 'Search',
      searchEmptyError: 'Enter a title, actor, or keyword.',
      darkMode: 'Dark mode',
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode',
      switchLanguage: 'Switch to Korean',
      languageButton: 'KO',
      settings: 'Settings',
      closeSettings: 'Close settings',
      language: 'Language',
      theme: 'Theme',
    },
    common: {
      untitled: 'Untitled',
      yearUnknown: 'Year unknown',
      movie: 'Movie',
      tvShow: 'TV show',
      posterAlt: (title) => `${title} poster`,
      ratingLabel: (rating) => `Rating ${rating} out of 10`,
      viewDetails: 'View details',
      catalogUnavailable: "We couldn't load the catalog right now.",
      sectionUnavailableTitle: (title) => `Couldn't load ${title.toLowerCase()}`,
      sectionUnavailableMessage: 'This section is temporarily unavailable.',
      sectionEmpty: 'No titles are available in this section yet.',
      carouselLabel: (title) => `${title} carousel`,
      scrollBackward: (title) => `Scroll ${title} backward`,
      scrollForward: (title) => `Scroll ${title} forward`,
      retry: 'Try again',
      retrying: 'Trying again…',
      backToBrowse: 'Back to browse',
      goBack: 'Go back',
    },
    movies: {
      metadataTitle: 'Movies',
      metadataDescription: 'Browse movies now playing, top rated, upcoming, and popular.',
      featured: 'Featured movie',
      heading: 'Movies',
      unavailable: 'Movies are temporarily unavailable',
      loadingFeatured: 'Loading featured movie',
      loadingCatalog: 'Loading movies',
    },
    tv: {
      metadataTitle: 'TV shows',
      metadataDescription: 'Browse top-rated, popular, currently airing, and daily TV shows.',
      featured: 'Featured series',
      heading: 'TV shows',
      unavailable: 'TV shows are temporarily unavailable',
      loadingFeatured: 'Loading featured TV show',
      loadingCatalog: 'Loading TV shows',
    },
    trend: {
      metadataTitle: 'Trending',
      metadataDescription: 'See the movies and TV shows gaining attention today and this week.',
      eyebrow: 'Live discovery',
      heading: 'What’s trending',
      description: 'Follow the movies and shows attracting the most attention right now.',
      timeWindowLabel: 'Trending time window',
      today: 'Today',
      week: 'This week',
      loading: 'Loading trending movies and TV shows',
    },
    search: {
      metadataTitle: 'Search',
      metadataDescription: 'Find movies and TV shows by title, actor, or topic on Jimmyflix.',
      noMatches: (query) => `No matches for “${query}”`,
      noMatchesHelp: 'Check the spelling, try an actor’s full name, or use a short topic such as “time travel”.',
      showingOne: 'Showing 1 title',
      showingMany: (count) => `Showing ${count} titles`,
      relatedPeople: 'Related people',
      topics: 'Topics',
      partialError: "Some results couldn't load",
      totalError: 'Search is temporarily unavailable',
      unavailableSources: (sources) => `${sources} could not be loaded. Please try again.`,
      movies: 'Movies',
      tvShows: 'TV shows',
      movieResultsLabel: 'Movie search results',
      tvResultsLabel: 'TV show search results',
      eyebrow: 'Find your next watch',
      heading: 'Search every story',
      intro: 'Use the search bar above to explore titles, actors, and topics.',
      suggestionsLabel: 'Search suggestions',
      suggestions: ['Inception', 'Tom Hanks', 'time travel'],
      shorterTitle: 'Try a shorter search',
      shorterMessage: (max) => `Use up to ${max} characters for a title, actor, or topic.`,
      clear: 'Clear search',
      resultsEyebrow: 'Search results',
      loadingResults: 'Loading search results',
    },
    detail: {
      movieNotFound: 'Movie not found',
      movieMetadataFallback: 'Movie details',
      movieDescriptionFallback: 'Movie details on Jimmyflix.',
      tvNotFound: 'TV show not found',
      tvMetadataFallback: 'TV show details',
      tvDescriptionFallback: 'TV show details on Jimmyflix.',
      loadingMovie: 'Loading movie details',
      loadingTv: 'Loading TV show details',
      loadingCredits: 'Loading credits',
      loadingCollection: 'Loading collection',
      trailer: 'Trailer',
      credits: 'Credits',
      production: 'Production',
      collection: 'Collection',
      seasons: 'Seasons',
      titleDetails: 'Title details',
      minutes: (duration) => `${duration} min`,
      noOverview: 'No overview is available for this title.',
      imdbLabel: (title) => `View ${title} on IMDb (opens in a new tab)`,
      tabListLabel: 'Title information',
      noTrailer: 'No trailer is available for this title.',
      trailerFrameTitle: (title) => `${title} official trailer`,
      playTrailer: (title) => `Play ${title} official trailer`,
      creditsErrorTitle: "Couldn't load credits",
      creditsErrorMessage: 'The cast list is temporarily unavailable.',
      noCast: 'No cast information is available.',
      cast: 'Cast',
      castMember: 'Cast member',
      noProduction: 'No production information is available.',
      productionCompanies: 'Production companies',
      productionCountries: 'Production countries',
      flagAlt: (country) => `${country} flag`,
      noSeasons: 'No season information is available.',
      collectionErrorTitle: "Couldn't load this collection",
      collectionErrorMessage: 'The collection titles are temporarily unavailable.',
      noCollection: 'No collection titles are available.',
      collectionTitles: 'Collection titles',
    },
    error: {
      title: 'Something went wrong',
      message: 'Jimmyflix couldn’t load this page. Try the request again.',
    },
    notFound: {
      imageAlt: 'Page not found illustration',
      title: 'That title slipped away',
      message: 'The page may have moved, or the title is no longer available.',
      browse: 'Browse movies',
    },
    sections: {
      movie: [
        { id: 'now-playing', title: 'Now playing', description: 'Movies playing in theaters now' },
        { id: 'top-rated-movies', title: 'Top rated', description: 'Audience favorites with lasting appeal' },
        { id: 'upcoming', title: 'Coming soon', description: 'Upcoming releases to keep on your radar' },
        { id: 'popular-movies', title: 'Popular movies', description: 'The titles people are watching right now' },
      ],
      tv: [
        { id: 'top-rated-tv', title: 'Top rated shows', description: 'Series with the strongest audience ratings' },
        { id: 'popular-tv', title: 'Popular shows', description: 'Series drawing the biggest audiences' },
        { id: 'on-the-air', title: 'On the air', description: 'Shows currently releasing new episodes' },
        { id: 'airing-today', title: 'Airing today', description: 'New episodes scheduled for today' },
      ],
      trendingMovies: 'Trending movies',
      trendingShows: 'Trending shows',
      trendingMoviesDescription: (window) => `Movies gaining attention ${window === 'day' ? 'today' : 'this week'}`,
      trendingShowsDescription: (window) => `Shows gaining attention ${window === 'day' ? 'today' : 'this week'}`,
    },
  },
  ko: {
    metadata: {
      title: 'Jimmyflix — 영화와 TV 프로그램을 발견하세요',
      description: '인기작, 트렌드, 높은 평점, 공개 예정 영화와 TV 프로그램을 둘러보세요.',
      openGraphDescription: '지금 볼 만한 영화와 TV 프로그램을 발견하세요.',
    },
    header: {
      home: 'Jimmyflix 홈',
      primaryNavigation: '주요 메뉴',
      movies: '영화',
      tv: 'TV',
      trend: '트렌드',
      openSearch: '검색 열기',
      closeSearch: '검색 닫기',
      searchLabel: '제목, 배우 또는 키워드로 검색',
      searchPlaceholder: '제목, 배우, 키워드',
      searchButton: '검색',
      searchEmptyError: '제목, 배우 또는 키워드를 입력하세요.',
      darkMode: '다크 모드',
      switchToLight: '라이트 모드로 전환',
      switchToDark: '다크 모드로 전환',
      switchLanguage: '영어로 전환',
      languageButton: 'EN',
      settings: '설정',
      closeSettings: '설정 닫기',
      language: '언어',
      theme: '테마',
    },
    common: {
      untitled: '제목 없음',
      yearUnknown: '연도 미상',
      movie: '영화',
      tvShow: 'TV 프로그램',
      posterAlt: (title) => `${title} 포스터`,
      ratingLabel: (rating) => `평점 10점 만점에 ${rating}점`,
      viewDetails: '상세 보기',
      catalogUnavailable: '지금은 콘텐츠 목록을 불러올 수 없습니다.',
      sectionUnavailableTitle: (title) => `${withKoreanObjectParticle(title)} 불러오지 못했습니다`,
      sectionUnavailableMessage: '이 섹션을 일시적으로 이용할 수 없습니다.',
      sectionEmpty: '이 섹션에 표시할 콘텐츠가 아직 없습니다.',
      carouselLabel: (title) => `${title} 슬라이드`,
      scrollBackward: (title) => `${title} 이전 항목 보기`,
      scrollForward: (title) => `${title} 다음 항목 보기`,
      retry: '다시 시도',
      retrying: '다시 시도 중…',
      backToBrowse: '목록으로 돌아가기',
      goBack: '뒤로 가기',
    },
    movies: {
      metadataTitle: '영화',
      metadataDescription: '현재 상영작, 높은 평점, 공개 예정작과 인기 영화를 둘러보세요.',
      featured: '추천 영화',
      heading: '영화',
      unavailable: '영화 목록을 일시적으로 이용할 수 없습니다',
      loadingFeatured: '추천 영화 불러오는 중',
      loadingCatalog: '영화 불러오는 중',
    },
    tv: {
      metadataTitle: 'TV 프로그램',
      metadataDescription: '높은 평점, 인기작, 방영 중인 TV 프로그램을 둘러보세요.',
      featured: '추천 시리즈',
      heading: 'TV 프로그램',
      unavailable: 'TV 프로그램 목록을 일시적으로 이용할 수 없습니다',
      loadingFeatured: '추천 TV 프로그램 불러오는 중',
      loadingCatalog: 'TV 프로그램 불러오는 중',
    },
    trend: {
      metadataTitle: '트렌드',
      metadataDescription: '오늘과 이번 주에 주목받는 영화와 TV 프로그램을 확인하세요.',
      eyebrow: '실시간 인기 콘텐츠',
      heading: '지금 뜨는 콘텐츠',
      description: '지금 가장 많은 관심을 받는 영화와 TV 프로그램을 만나보세요.',
      timeWindowLabel: '트렌드 기간',
      today: '오늘',
      week: '이번 주',
      loading: '트렌드 영화와 TV 프로그램 불러오는 중',
    },
    search: {
      metadataTitle: '검색',
      metadataDescription: 'Jimmyflix에서 제목, 배우 또는 주제로 영화와 TV 프로그램을 찾아보세요.',
      noMatches: (query) => `“${query}” 검색 결과가 없습니다`,
      noMatchesHelp: '철자를 확인하거나 배우의 전체 이름, 또는 “시간 여행” 같은 짧은 주제어로 검색해 보세요.',
      showingOne: '콘텐츠 1개를 찾았습니다',
      showingMany: (count) => `콘텐츠 ${count}개를 찾았습니다`,
      relatedPeople: '관련 인물',
      topics: '주제',
      partialError: '일부 결과를 불러오지 못했습니다',
      totalError: '검색을 일시적으로 이용할 수 없습니다',
      unavailableSources: (sources) => `${sources} 결과를 불러오지 못했습니다. 다시 시도해 주세요.`,
      movies: '영화',
      tvShows: 'TV 프로그램',
      movieResultsLabel: '영화 검색 결과',
      tvResultsLabel: 'TV 프로그램 검색 결과',
      eyebrow: '다음 볼거리 찾기',
      heading: '모든 이야기를 검색하세요',
      intro: '위 검색창에서 제목, 배우, 주제 키워드로 찾아보세요.',
      suggestionsLabel: '추천 검색어',
      suggestions: ['기생충', '송강호', '시간 여행'],
      shorterTitle: '검색어를 짧게 입력해 주세요',
      shorterMessage: (max) => `제목, 배우 또는 주제를 ${max}자 이내로 입력해 주세요.`,
      clear: '검색 지우기',
      resultsEyebrow: '검색 결과',
      loadingResults: '검색 결과 불러오는 중',
    },
    detail: {
      movieNotFound: '영화를 찾을 수 없습니다',
      movieMetadataFallback: '영화 상세 정보',
      movieDescriptionFallback: 'Jimmyflix 영화 상세 정보입니다.',
      tvNotFound: 'TV 프로그램을 찾을 수 없습니다',
      tvMetadataFallback: 'TV 프로그램 상세 정보',
      tvDescriptionFallback: 'Jimmyflix TV 프로그램 상세 정보입니다.',
      loadingMovie: '영화 상세 정보 불러오는 중',
      loadingTv: 'TV 프로그램 상세 정보 불러오는 중',
      loadingCredits: '출연진 불러오는 중',
      loadingCollection: '컬렉션 불러오는 중',
      trailer: '예고편',
      credits: '출연진',
      production: '제작',
      collection: '컬렉션',
      seasons: '시즌',
      titleDetails: '콘텐츠 정보',
      minutes: (duration) => `${duration}분`,
      noOverview: '등록된 줄거리가 없습니다.',
      imdbLabel: (title) => `IMDb에서 ${title} 보기(새 탭에서 열림)`,
      tabListLabel: '콘텐츠 상세 정보',
      noTrailer: '등록된 예고편이 없습니다.',
      trailerFrameTitle: (title) => `${title} 공식 예고편`,
      playTrailer: (title) => `${title} 공식 예고편 재생`,
      creditsErrorTitle: '출연진을 불러오지 못했습니다',
      creditsErrorMessage: '출연진 목록을 일시적으로 이용할 수 없습니다.',
      noCast: '등록된 출연진 정보가 없습니다.',
      cast: '출연진',
      castMember: '출연',
      noProduction: '등록된 제작 정보가 없습니다.',
      productionCompanies: '제작사',
      productionCountries: '제작 국가',
      flagAlt: (country) => `${country} 국기`,
      noSeasons: '등록된 시즌 정보가 없습니다.',
      collectionErrorTitle: '컬렉션을 불러오지 못했습니다',
      collectionErrorMessage: '컬렉션 콘텐츠를 일시적으로 이용할 수 없습니다.',
      noCollection: '등록된 컬렉션 콘텐츠가 없습니다.',
      collectionTitles: '컬렉션 작품',
    },
    error: {
      title: '문제가 발생했습니다',
      message: 'Jimmyflix가 이 페이지를 불러오지 못했습니다. 다시 시도해 주세요.',
    },
    notFound: {
      imageAlt: '페이지를 찾을 수 없음',
      title: '이 콘텐츠는 찾을 수 없어요',
      message: '페이지가 이동했거나 콘텐츠를 더 이상 이용할 수 없습니다.',
      browse: '영화 둘러보기',
    },
    sections: {
      movie: [
        { id: 'now-playing', title: '현재 상영작', description: '지금 극장에서 상영 중인 영화' },
        { id: 'top-rated-movies', title: '평점 높은 영화', description: '오랫동안 사랑받은 관객 추천작' },
        { id: 'upcoming', title: '공개 예정작', description: '곧 만나볼 수 있는 기대작' },
        { id: 'popular-movies', title: '인기 영화', description: '지금 사람들이 많이 찾는 영화' },
      ],
      tv: [
        { id: 'top-rated-tv', title: '평점 높은 프로그램', description: '시청자 평점이 높은 시리즈' },
        { id: 'popular-tv', title: '인기 프로그램', description: '지금 가장 많은 관심을 받는 시리즈' },
        { id: 'on-the-air', title: '방영 중', description: '새 에피소드가 공개 중인 프로그램' },
        { id: 'airing-today', title: '오늘 방영', description: '오늘 새 에피소드가 공개되는 프로그램' },
      ],
      trendingMovies: '인기 급상승 영화',
      trendingShows: '인기 급상승 TV 프로그램',
      trendingMoviesDescription: (window) => `${window === 'day' ? '오늘' : '이번 주'} 주목받는 영화`,
      trendingShowsDescription: (window) => `${window === 'day' ? '오늘' : '이번 주'} 주목받는 TV 프로그램`,
    },
  },
}

export const getDictionary = (locale: Locale) => dictionaries[locale]

export type { Dictionary }
