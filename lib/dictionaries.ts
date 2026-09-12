import 'server-only'

import type { HeaderMessages, Locale } from '@/lib/i18n'
import type { GalleryMessages } from '@/lib/gallery'

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
    loadingProduction: string
    loadingCollection: string
    loadingRelated: string
    loadingSeasons: string
    trailer: string
    credits: string
    production: string
    collection: string
    seasons: string
    gallery: string
    galleryHeading: string
    galleryUi: GalleryMessages
    themes: string
    searchTheme: (theme: string) => string
    titleDetails: string
    minutes: (duration: number) => string
    noOverview: string
    tabListLabel: string
    scrollTabsBackward: string
    scrollTabsForward: string
    noTrailer: string
    trailerSearchHint: string
    searchTrailer: string
    searchTrailerLabel: (title: string) => string
    trailerFrameTitle: (title: string) => string
    playTrailer: (title: string) => string
    creditsErrorTitle: string
    creditsErrorMessage: string
    noCast: string
    cast: string
    castMember: string
    noProduction: string
    keyCrew: string
    streamingAvailability: string
    stream: string
    rent: string
    buy: string
    watchOn: (provider: string) => string
    justWatchAttribution: string
    productionCompanies: string
    productionCountries: string
    flagAlt: (country: string) => string
    noSeasons: string
    latestSeason: string
    allSeasons: string
    upcomingEpisode: string
    latestEpisode: string
    episodeNumber: (season: number, episode: number) => string
    episodeCount: (count: number) => string
    noEpisodeOverview: string
    collectionErrorTitle: string
    collectionErrorMessage: string
    noCollection: string
    collectionTitles: string
    moreLikeThis: string
    moreLikeThisDescription: string
  }
  person: {
    notFound: string
    metadataFallback: string
    descriptionFallback: string
    loading: string
    profileAlt: (name: string) => string
    biography: string
    noBiography: string
    personalDetails: string
    knownForDepartment: string
    born: string
    died: string
    placeOfBirth: string
    alsoKnownAs: string
    actingCredits: string
    actingCreditsDescription: string
    crewCredits: string
    crewCreditsDescription: string
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
    hiddenGemMovies: string
    hiddenGemMoviesDescription: string
    shortMovies: string
    shortMoviesDescription: string
    hiddenGemShows: string
    hiddenGemShowsDescription: string
    miniseries: string
    miniseriesDescription: string
    countrySpotlight: (country: string) => string
    countrySpotlightDescription: (country: string) => string
    genreSpotlight: (genre: string) => string
    genreSpotlightDescription: (genre: string) => string
    themeSpotlight: (theme: string) => string
    themeSpotlightDescription: (theme: string) => string
    movieLensSpotlight: (lens: string) => string
    movieLensSpotlightDescription: (lens: string) => string
    tvFormatSpotlight: (format: string) => string
    tvFormatSpotlightDescription: (format: string) => string
    streamingMovies: (provider: string) => string
    streamingShows: (provider: string) => string
    providerPickerLabel: string
    justWatchDiscoveryAttribution: string
    loadingStreaming: string
    releaseCalendarDescription: string
    recentlyViewed: string
    recentlyViewedDescription: string
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
      description: 'Discover movies and TV shows through rotating themes, hidden gems, recommendations, and people.',
      openGraphDescription: 'Discover stories through thoughtful collections, related titles, and filmographies.',
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
      metadataDescription: 'Discover movies through streaming services, daily themes, hidden gems, era collections, and upcoming releases.',
      featured: "Today's movie",
      heading: 'Movies',
      unavailable: 'Movies are temporarily unavailable',
      loadingFeatured: 'Loading featured movie',
      loadingCatalog: 'Loading movies',
    },
    tv: {
      metadataTitle: 'TV shows',
      metadataDescription: 'Discover TV shows through streaming services, hidden gems, miniseries, and rotating country, genre, and format spotlights.',
      featured: "Today's series",
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
      loadingProduction: 'Loading production details',
      loadingCollection: 'Loading collection',
      loadingRelated: 'Loading related titles',
      loadingSeasons: 'Loading season episodes',
      trailer: 'Trailer',
      credits: 'Credits',
      production: 'Production',
      collection: 'Collection',
      seasons: 'Seasons',
      gallery: 'Gallery',
      galleryHeading: 'Photos',
      galleryUi: {
        photo: 'Photo', photos: 'Photos',
        hint: 'Scroll to explore. Select a photo to view it full size.',
        open: 'View full size', original: 'Open original', close: 'Close gallery',
        previous: 'Previous photo', next: 'Next photo',
        scrollPrevious: 'Scroll to previous photos', scrollNext: 'Scroll to more photos',
        viewAll: 'View all photos', loading: 'Loading original image',
        swipeHint: 'Swipe left or right to explore',
        error: 'This photo could not be loaded. Try another photo or open the original.',
      },
      themes: 'Themes',
      searchTheme: (theme) => `Search for titles about ${theme}`,
      titleDetails: 'Title details',
      minutes: (duration) => `${duration} min`,
      noOverview: 'No overview is available for this title.',
      tabListLabel: 'Title information',
      scrollTabsBackward: 'Show previous information tabs',
      scrollTabsForward: 'Show more information tabs',
      noTrailer: 'No trailer is available yet.',
      trailerSearchHint: 'Try YouTube for an official upload from the studio or distributor.',
      searchTrailer: 'Search YouTube',
      searchTrailerLabel: (title) => `Search YouTube for a ${title} trailer (opens in a new tab)`,
      trailerFrameTitle: (title) => `${title} official trailer`,
      playTrailer: (title) => `Play ${title} official trailer`,
      creditsErrorTitle: "Couldn't load credits",
      creditsErrorMessage: 'The cast list is temporarily unavailable.',
      noCast: 'No cast information is available.',
      cast: 'Cast',
      castMember: 'Cast member',
      noProduction: 'No production information is available.',
      keyCrew: 'Key crew',
      streamingAvailability: 'Where to watch',
      stream: 'Stream',
      rent: 'Rent',
      buy: 'Buy',
      watchOn: (provider) => `See availability on ${provider}`,
      justWatchAttribution: 'Streaming availability provided by JustWatch',
      productionCompanies: 'Production companies',
      productionCountries: 'Production countries',
      flagAlt: (country) => `${country} flag`,
      noSeasons: 'No season information is available.',
      latestSeason: 'Latest season',
      allSeasons: 'All seasons',
      upcomingEpisode: 'Next episode',
      latestEpisode: 'Latest episode',
      episodeNumber: (season, episode) => `S${season} E${episode}`,
      episodeCount: (count) => `${count} episode${count === 1 ? '' : 's'}`,
      noEpisodeOverview: 'No episode summary is available.',
      collectionErrorTitle: "Couldn't load this collection",
      collectionErrorMessage: 'The collection titles are temporarily unavailable.',
      noCollection: 'No collection titles are available.',
      collectionTitles: 'Collection titles',
      moreLikeThis: 'More like this',
      moreLikeThisDescription: 'Recommendations and similar stories to explore next',
    },
    person: {
      notFound: 'Person not found',
      metadataFallback: 'Person details',
      descriptionFallback: 'Discover this person’s work on Jimmyflix.',
      loading: 'Loading person details',
      profileAlt: (name) => `${name} profile photo`,
      biography: 'Biography',
      noBiography: 'No biography is available.',
      personalDetails: 'Personal details',
      knownForDepartment: 'Known for',
      born: 'Born',
      died: 'Died',
      placeOfBirth: 'Place of birth',
      alsoKnownAs: 'Also known as',
      actingCredits: 'Acting credits',
      actingCreditsDescription: 'Popular movies and series featuring this person',
      crewCredits: 'Behind the camera',
      crewCreditsDescription: 'Selected directing, writing, and production work',
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
      hiddenGemMovies: 'Hidden-gem movies',
      hiddenGemMoviesDescription: 'Highly rated stories beyond the usual blockbusters',
      shortMovies: 'Great movies under 100 minutes',
      shortMoviesDescription: 'A complete story for when time is short',
      hiddenGemShows: 'Hidden-gem series',
      hiddenGemShowsDescription: 'Acclaimed shows waiting to be discovered',
      miniseries: 'One season, one complete story',
      miniseriesDescription: 'Limited series you can finish without a long commitment',
      countrySpotlight: (country) => `Stories from ${country}`,
      countrySpotlightDescription: (country) => `Popular and acclaimed titles produced in ${country}`,
      genreSpotlight: (genre) => `${genre} spotlight`,
      genreSpotlightDescription: (genre) => `A fresh selection of ${genre.toLowerCase()} stories`,
      themeSpotlight: (theme) => `${theme} stories`,
      themeSpotlightDescription: (theme) => `Movies connected by today’s theme: ${theme.toLowerCase()}`,
      movieLensSpotlight: (lens) => lens,
      movieLensSpotlightDescription: (lens) => `A weekly collection focused on ${lens.toLowerCase()}`,
      tvFormatSpotlight: (format) => `${format} spotlight`,
      tvFormatSpotlightDescription: (format) => `A weekly selection of ${format.toLowerCase()} worth exploring`,
      streamingMovies: (provider) => `Movies on ${provider}`,
      streamingShows: (provider) => `Shows on ${provider}`,
      providerPickerLabel: 'Choose a streaming service',
      justWatchDiscoveryAttribution: 'Availability data provided by JustWatch',
      loadingStreaming: 'Loading streaming picks',
      releaseCalendarDescription: 'Theatrical releases arriving in your region over the next 45 days',
      recentlyViewed: 'Recently viewed',
      recentlyViewedDescription: 'Pick up where your browsing left off',
      trendingMovies: 'Trending movies',
      trendingShows: 'Trending shows',
      trendingMoviesDescription: (window) => `Movies gaining attention ${window === 'day' ? 'today' : 'this week'}`,
      trendingShowsDescription: (window) => `Shows gaining attention ${window === 'day' ? 'today' : 'this week'}`,
    },
  },
  ko: {
    metadata: {
      title: 'Jimmyflix — 영화와 TV 프로그램을 발견하세요',
      description: '순환 특집, 숨은 명작, 연관 작품과 인물 필모그래피로 영화와 TV 프로그램을 발견하세요.',
      openGraphDescription: '주제별 큐레이션과 연관 작품, 필모그래피로 새로운 이야기를 발견하세요.',
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
      metadataDescription: 'OTT별 영화, 오늘의 주제, 숨은 명작, 시대 컬렉션과 공개 예정작을 둘러보세요.',
      featured: '오늘의 영화',
      heading: '영화',
      unavailable: '영화 목록을 일시적으로 이용할 수 없습니다',
      loadingFeatured: '추천 영화 불러오는 중',
      loadingCatalog: '영화 불러오는 중',
    },
    tv: {
      metadataTitle: 'TV 프로그램',
      metadataDescription: 'OTT별 TV 프로그램, 숨은 명작, 미니시리즈와 순환하는 국가·장르·포맷 특집을 둘러보세요.',
      featured: '오늘의 시리즈',
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
      loadingProduction: '제작 정보 불러오는 중',
      loadingCollection: '컬렉션 불러오는 중',
      loadingRelated: '연관 작품 불러오는 중',
      loadingSeasons: '시즌 에피소드 불러오는 중',
      trailer: '예고편',
      credits: '출연진',
      production: '제작',
      collection: '컬렉션',
      seasons: '시즌',
      gallery: '갤러리',
      galleryHeading: '작품 사진',
      galleryUi: {
        photo: '사진', photos: '사진',
        hint: '좌우로 넘겨보세요. 사진을 누르면 크게 볼 수 있어요.',
        open: '크게 보기', original: '원본 열기', close: '갤러리 닫기',
        previous: '이전 사진', next: '다음 사진',
        scrollPrevious: '이전 사진 목록 보기', scrollNext: '다음 사진 목록 보기',
        viewAll: '전체 사진 보기', loading: '원본 이미지 불러오는 중',
        swipeHint: '좌우로 밀어 사진을 넘겨보세요',
        error: '사진을 불러오지 못했어요. 다른 사진을 보거나 원본을 열어보세요.',
      },
      themes: '작품 키워드',
      searchTheme: (theme) => `${theme} 관련 작품 검색`,
      titleDetails: '콘텐츠 정보',
      minutes: (duration) => `${duration}분`,
      noOverview: '등록된 줄거리가 없습니다.',
      tabListLabel: '콘텐츠 상세 정보',
      scrollTabsBackward: '이전 상세 메뉴 보기',
      scrollTabsForward: '다음 상세 메뉴 더 보기',
      noTrailer: '아직 등록된 예고편이 없습니다.',
      trailerSearchHint: 'YouTube에서 배급사나 공식 채널이 공개한 예고편을 찾아볼 수 있어요.',
      searchTrailer: 'YouTube에서 찾아보기',
      searchTrailerLabel: (title) => `YouTube에서 ${title} 예고편 찾기(새 탭에서 열림)`,
      trailerFrameTitle: (title) => `${title} 공식 예고편`,
      playTrailer: (title) => `${title} 공식 예고편 재생`,
      creditsErrorTitle: '출연진을 불러오지 못했습니다',
      creditsErrorMessage: '출연진 목록을 일시적으로 이용할 수 없습니다.',
      noCast: '등록된 출연진 정보가 없습니다.',
      cast: '출연진',
      castMember: '출연',
      noProduction: '등록된 제작 정보가 없습니다.',
      keyCrew: '주요 제작진',
      streamingAvailability: '시청 가능한 곳',
      stream: '스트리밍',
      rent: '대여',
      buy: '구매',
      watchOn: (provider) => `${provider}에서 시청 정보 보기`,
      justWatchAttribution: '스트리밍 정보 제공: JustWatch',
      productionCompanies: '제작사',
      productionCountries: '제작 국가',
      flagAlt: (country) => `${country} 국기`,
      noSeasons: '등록된 시즌 정보가 없습니다.',
      latestSeason: '최신 시즌',
      allSeasons: '전체 시즌',
      upcomingEpisode: '다음 에피소드',
      latestEpisode: '최근 에피소드',
      episodeNumber: (season, episode) => `시즌 ${season} · 에피소드 ${episode}`,
      episodeCount: (count) => `총 ${count}개 에피소드`,
      noEpisodeOverview: '등록된 에피소드 줄거리가 없습니다.',
      collectionErrorTitle: '컬렉션을 불러오지 못했습니다',
      collectionErrorMessage: '컬렉션 콘텐츠를 일시적으로 이용할 수 없습니다.',
      noCollection: '등록된 컬렉션 콘텐츠가 없습니다.',
      collectionTitles: '컬렉션 작품',
      moreLikeThis: '비슷한 콘텐츠',
      moreLikeThisDescription: '추천 작품과 비슷한 이야기를 이어서 만나보세요',
    },
    person: {
      notFound: '인물 정보를 찾을 수 없습니다',
      metadataFallback: '인물 상세 정보',
      descriptionFallback: 'Jimmyflix에서 이 인물의 작품을 살펴보세요.',
      loading: '인물 정보 불러오는 중',
      profileAlt: (name) => `${name} 프로필 사진`,
      biography: '소개',
      noBiography: '등록된 소개가 없습니다.',
      personalDetails: '인물 정보',
      knownForDepartment: '주요 분야',
      born: '출생',
      died: '사망',
      placeOfBirth: '출생지',
      alsoKnownAs: '다른 이름',
      actingCredits: '출연작',
      actingCreditsDescription: '이 인물이 출연한 인기 영화와 TV 프로그램',
      crewCredits: '제작 참여작',
      crewCreditsDescription: '연출·각본·제작으로 참여한 주요 작품',
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
      hiddenGemMovies: '숨은 명작 영화',
      hiddenGemMoviesDescription: '익숙한 흥행작 너머에서 발견한 높은 평점의 영화',
      shortMovies: '100분 안에 보기 좋은 영화',
      shortMoviesDescription: '부담 없는 러닝타임으로 완결된 이야기를 만나보세요',
      hiddenGemShows: '숨은 명작 시리즈',
      hiddenGemShowsDescription: '아직 널리 알려지지 않은 호평받는 프로그램',
      miniseries: '한 시즌으로 끝나는 이야기',
      miniseriesDescription: '긴 호흡의 부담 없이 완주할 수 있는 미니시리즈',
      countrySpotlight: (country) => `${country} 콘텐츠`,
      countrySpotlightDescription: (country) => `${country}에서 제작된 인기작과 숨은 명작`,
      genreSpotlight: (genre) => `${genre} 특집`,
      genreSpotlightDescription: (genre) => `${genre} 장르에서 새롭게 발견한 작품`,
      themeSpotlight: (theme) => `${theme}로 보는 영화`,
      themeSpotlightDescription: (theme) => `오늘의 주제 ${theme}로 이어지는 작품`,
      movieLensSpotlight: (lens) => lens,
      movieLensSpotlightDescription: (lens) => `${lens}를 중심으로 매주 새롭게 구성한 컬렉션`,
      tvFormatSpotlight: (format) => `${format} 특집`,
      tvFormatSpotlightDescription: (format) => `이번 주에 둘러보기 좋은 ${format} 프로그램`,
      streamingMovies: (provider) => `${provider} 영화`,
      streamingShows: (provider) => `${provider} 시리즈`,
      providerPickerLabel: '스트리밍 서비스 선택',
      justWatchDiscoveryAttribution: '시청 가능 정보 제공: JustWatch',
      loadingStreaming: '스트리밍 추천작 불러오는 중',
      releaseCalendarDescription: '앞으로 45일 안에 국내 극장에서 개봉하는 작품',
      recentlyViewed: '최근 본 작품',
      recentlyViewedDescription: '최근 둘러본 작품을 다시 확인해 보세요',
      trendingMovies: '인기 급상승 영화',
      trendingShows: '인기 급상승 TV 프로그램',
      trendingMoviesDescription: (window) => `${window === 'day' ? '오늘' : '이번 주'} 주목받는 영화`,
      trendingShowsDescription: (window) => `${window === 'day' ? '오늘' : '이번 주'} 주목받는 TV 프로그램`,
    },
  },
}

export const getDictionary = (locale: Locale) => dictionaries[locale]

export type { Dictionary }
