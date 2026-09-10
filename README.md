# Jimmyflix

TMDB 데이터를 이용해 영화와 TV 프로그램을 탐색하는 반응형 웹 애플리케이션입니다. 상영작·인기작·평점순·공개 예정작·트렌드 목록, 통합 검색, 작품 상세 정보를 제공합니다.

- 운영 주소: [jimmyflix.vercel.app](https://jimmyflix.vercel.app)
- 구조 전환 기록: [App Router·Tailwind 전환 문서](docs/app-router-overhaul.md)
- 기존 진단: [저장소 구조 및 개선점 진단](docs/repository-review.md)
- UX 과제: [UI/UX 개선 백로그](docs/ui-ux-backlog.md)
- 구현 기록: [개선 작업 진행 기록](docs/improvement-progress.md)
- 언어 전환: [한국어·영어 현지화 구조](docs/localization.md)
- 브랜드 컬러: [브랜드 컬러 제안](docs/brand-color-proposal.md)

## 현재 기술 구성

| 영역 | 구성 |
| --- | --- |
| 프레임워크 | Next.js 16 App Router, React 19 |
| 언어 | TypeScript 5 strict mode |
| 스타일 | Tailwind CSS 4 |
| 데이터 | React Server Components에서 TMDB API 직접 호출, Next.js Data Cache |
| 현지화 | 영어·한국어 URL, 서버 UI 사전, TMDB 언어별 응답 |
| 이미지 | `next/image`, TMDB 크기별 이미지 URL |
| 목록 탐색 | 브라우저 기본 가로 스크롤 + CSS scroll snap |
| 배포 | Vercel, Node.js 24 |
| 패키지 관리 | Yarn 3.8.7, `node_modules` linker |

Emotion, React Query, Recoil, Axios, react-slick과 전역 polyfill은 제거했습니다. 검색어와 트렌드 기간은 URL에 저장하고, 짧은 상호작용 상태만 클라이언트 컴포넌트가 관리합니다.

## 주요 라우트

| 경로 | 역할 |
| --- | --- |
| `/{locale}` | 현재 상영·고평점·공개 예정·인기 영화 |
| `/{locale}/tv` | 고평점·인기·방송 중·오늘 방송 TV |
| `/{locale}/trend?window=day\|week` | 일간·주간 영화 및 TV 트렌드 |
| `/{locale}/search?q=...` | 제목·배우·주제 키워드 영화·TV 통합 검색 |
| `/{locale}/movies/[id]` | 영화 상세, 예고편·출연진·제작·컬렉션 |
| `/{locale}/tv/[id]` | TV 상세, 예고편·출연진·제작·시즌 |

`locale`은 영어 `en` 또는 한국어 `ko`다. 언어가 없는 기존 주소는 저장된 선택이나 브라우저 언어에 맞는 경로로 자동 이동한다.

## 로컬 실행

Node.js 24를 사용합니다.

```bash
corepack enable
corepack yarn install
```

루트에 `.env.local`을 만들고 TMDB API 키를 서버 전용 변수로 설정합니다.

```dotenv
TMDB_API_KEY=your_tmdb_api_key
```

기존 Vercel 설정과의 전환을 위해 `NEXT_PUBLIC_API_KEY`도 임시로 읽지만, 새 환경에서는 `TMDB_API_KEY`를 사용해야 합니다.

```bash
corepack yarn dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 검증

```bash
corepack yarn lint
corepack yarn typecheck
corepack yarn build
```

주요 화면 변경은 320·375·768·1440px에서 가로 넘침, 키보드 포커스, 탭 전환, 가로 목록 조작을 함께 확인합니다. 상세 예고편은 컨테이너 전체 너비의 16:9 비율을 유지하며, Credits·Production·Seasons·Collection 카드는 모바일의 홀수 항목까지 가운데 정렬합니다.

## 디렉터리 구조

```text
app/[locale]/         언어별 App Router 페이지, 화면별 로딩·오류 경계
components/           카드, 레일, 검색, 상세 탭·스켈레톤 등 재사용 UI
lib/media.ts          제목·연도·이미지·라우트 표시 규칙
lib/tmdb.ts           서버 전용 TMDB 요청과 캐시 정책
lib/dictionaries.ts   영어·한국어 서버 전용 UI 사전
lib/i18n.ts           지원 언어, 경로, TMDB 언어 코드
proxy.ts              언어 없는 URL 감지와 리다이렉트
types/tmdb.ts         TMDB 응답에 필요한 도메인 타입
public/images/        로컬 대체 이미지와 404 자산
docs/                 진단, UX 백로그, 전환 및 검증 기록
```

TMDB 요청 키는 클라이언트 컴포넌트에 전달하지 않습니다. 상세 ID가 잘못되었거나 TMDB가 404를 반환하면 App Router의 `notFound()`로 연결하고, 목록과 검색의 독립 요청은 `Promise.allSettled`로 분리해 일부 실패에도 나머지 결과를 표시합니다.

전역 고정 로더는 사용하지 않습니다. 목록과 상세는 실제 레이아웃에 맞는 가까운 라우트 스켈레톤을 사용하고, 검색·트렌드·상세 부가 정보는 `Suspense`로 나눠 이미 렌더된 검색창, 기간 선택, 핵심 상세 정보를 유지합니다.
