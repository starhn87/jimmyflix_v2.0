# 개선 작업 진행 기록

업데이트: 2026-09-10

이 문서는 [저장소 진단](repository-review.md)과 [UI/UX 개선 백로그](ui-ux-backlog.md)의 실행 상태를 기록한다. 진단 문서는 당시 기준선과 근거를 보존하고, 실제 반영 결과는 이 문서에 누적한다.

## 현재 상태

| 단계 | 상태 | 범위 |
| --- | --- | --- |
| 배포 복구 | 완료 | Vercel 빌드 런타임을 Node.js 24로 지정하고 프로덕션 배포 및 HTTP 200 응답 확인 |
| 1. 실행 환경·검증 복구 | 로컬 구현·검증 완료 | Node 24 명시, Yarn 3.8.7, ESLint 설정과 의존성, lint/typecheck 스크립트 |
| 2. 데이터·렌더링 정확성 | 로컬 구현·검증 완료 | 트렌드 기간값, 출연진 캐시 키, 국가 key, 상세 탭, QueryClient 수명, TV 헤더 |
| 3. 검색·상태 UX | 예정 | 모바일 재검색, URL 검색 상태, 빈 검색 안내 |
| 4. 로딩·오류 UX | 예정 | 섹션별 로딩, 재시도, 복귀 경로 |
| 5. 카드·상세 UI | 예정 | 긴 제목, 평점, 모바일 상세 정보 구조 |
| 6. 접근성·미디어 | 예정 | 탭 키보드 조작, 포커스, 이미지·예고편 최적화 |
| 7. 구조·의존성 현대화 | 예정 | 타입·API 계층, SSR 병렬화, Next.js 및 상태 관리 개선 |

## 1차 구현 내용

- `.nvmrc`와 `package.json`에서 Node.js 24를 개발·배포 기준으로 통일했다.
- Yarn PnP 로더를 3.8.7로 갱신해 Node.js 24에서 표준 스크립트를 실행할 수 있게 했다.
- `eslint-config-next` 12.1.5를 명시적으로 설치하고 잘못된 ESLint의 `next/babel` 확장을 제거했다. Babel의 `next/babel` preset은 `.babelrc`에 유지한다.
- 트렌드 API 값은 `day | week`로 제한하고 화면 라벨 `Day | Week`와 분리했다.
- 출연진 React Query 키에 `movie | tv`를 포함해 같은 숫자 ID의 캐시 충돌을 막았다.
- 제작 국가 목록은 국가 코드를 key로 사용하고, 상세 탭 메뉴는 현재 props에서 계산한다.
- QueryClient를 앱 인스턴스별로 생성하고 TV 목록의 중복 Header를 제거했다.
- `public` 이미지는 공개 경로로 참조해 구형 Next 이미지 로더와 Node.js 24의 충돌을 피하고, 카드와 IMDb 이미지에 대체 텍스트를 제공했다.

## 검증 기록

Node.js 24.17.0과 Yarn 3.8.7에서 다음 검증을 통과했다.

- `yarn lint`: ESLint 오류 및 경고 없음
- `yarn typecheck`: TypeScript 오류 없음
- `yarn build`: 전체 프로덕션 빌드 성공
- 로컬 프로덕션 화면: Next 오류 오버레이와 빈 화면 없음, `/tvs`의 `header` 1개 확인
- 트렌드 전환: 기본 `Day`와 선택된 `Week` 상태 확인, 실제 요청 경로가 각각 `/trending/.../day`, `/trending/.../week`임을 확인

로컬 브라우저에는 `NEXT_PUBLIC_API_KEY`가 설정되지 않아 TMDB 응답은 401이었다. 따라서 실제 콘텐츠 카드와 상세 데이터의 시각 검증은 배포 환경에서 추가로 수행한다.
