## 📑 프로젝트 소개

현재 시점 기준으로 핫한 영화, TV 프로그램을 확인할 수 있는 어플리케이션입니다.
(노마드코더의 React 챌린지 클론코딩으로 시작하여 저만의 방식으로 더욱 발전시킨 프로젝트입니다.)

<br>

[배포링크](https://jimmyflix.netlify.app/)

<br>

## ✨ 주요 기능

- 홈 페이지
  - 현재 상영중인 영화를 확인할 수 있습니다.
  - 평점이 높은 영화를 확인할 수 있습니다.
  - 상영 예정인 영화를 확인할 수 있습니다.
  - 인기 있는 영화를 확인할 수 있습니다.
- TV 페이지
  - 평점이 높은 TV 프로그램을 확인할 수 있습니다.
  - 인기 있는 TV 프로그램을 확인할 수 있습니다.
  - 방송 중인 TV 프로그램을 확인할 수 있습니다.
  - 오늘 방송하는 TV 프로그램을 확인할 수 있습니다.
- Trending 페이지
  - Day or Week 기준으로 구분하여 확인할 수 있습니다.
  - Trendy한 영화를 볼 수 있습니다.
  - Trendy한 TV 프로그램을 볼 수 있습니다.
- 검색 페이지
  - 원하는 영화 혹은 TV 프로그램을 같이 검색할 수 있습니다.
- 상세 페이지
  - 포스터를 클릭하여 평점, 줄거리, 예고편, 출연 배우, 제작 회사, 시리즈 등을 알 수 있습니다.
- 404 페이지
  - 잘못된 경로 접근시 보여주는 페이지이며, 5초 후 자동으로 홈 페이지로 이동하도록 하였습니다.

<br>

## 🧔 메인

<br>

1. 홈 페이지

<img src="https://user-images.githubusercontent.com/36434219/163531551-b603e7f4-b1dd-486a-871c-ca5a6e819484.png" alt="홈 페이지" width="700px" height="400px">

<br>

2. TV 페이지

<img src="https://user-images.githubusercontent.com/36434219/163531632-a9e0ebc3-d8a8-4d25-a804-3b4228fa99f4.png" alt="TV 페이지" width="700px" height="400px">

<br>

3. Trending 페이지

<img src="https://user-images.githubusercontent.com/36434219/163531731-39dde8e3-8b02-4556-9f69-ff961590557d.png" alt="Trending 페이지" width="700px" height="400px">

<br>

4-1. 검색 페이지 (초기)

<img src="https://user-images.githubusercontent.com/36434219/163531867-204c8bba-3499-4b33-b4fe-c18f8ee65db3.png" alt="검색 페이지" width="700px" height="400px">

<br>

4-2. 검색 페이지 (검색 후)

<img src="https://user-images.githubusercontent.com/36434219/163531998-d790a10c-9d97-436d-ab43-6aad81725c4c.png" alt="검색 결과 페이지" width="700px" height="400px">

<br>

5. 상세 페이지

<img src="https://user-images.githubusercontent.com/36434219/163532220-1ea9bad0-aafc-40db-b04e-3c0443af1134.png" alt="상세 페이지" width="700px" height="400px">

<br>

6. 404 페이지

<img src="https://user-images.githubusercontent.com/36434219/164255280-a49c6b32-2f4a-47b8-a619-645a265696df.png" alt="잘못된 경로 접근시 보여주는 페이지" width="700px" height="400px">

<br>
<br>

## ⭐️ 구현한 기능 목록 및 어려웠던 점

- 클론코딩
  - 구현 내용 & 방법
    - 클래스 컴포넌트와 생명주기를 활용하여 로직을 구현하였습니다.
    - Container, Presenter 패턴을 적용하여 렌더링과 로직 부분을 분리하였습니다.
    - axios로 IMDB 오픈 API를 호출하여 데이터를 불러왔습니다.
    - styled-components로 현재의 디자인을 스타일링하였습니다.
    - redux와 redux toolkit으로 전역 상태를 관리하였습니다.
- 직접 추가하거나 개선한 부분
  - 구현 내용 & 방법
    - 타입스크립트를 적용하여 타입 검사를 컴파일 시점에서 할 수 있도록 하였습니다.
    - 함수 컴포넌트와 React Hooks를 적용하여 Container, Presenter 패턴을 없애고 코드를 경량화하였습니다.
    - 리액트 쿼리를 적용하여 캐싱을 통해 API 호출을 최적화하였습니다.
    - 캐싱으로 인해 필요 없어진 전역 상태를 없애고 코드를 경량화하였습니다. (redux -> recoil)
    - react-slick을 사용하여 무한 슬라이드를 구현하였습니다.
    - 상세 페이지에서 크레딧, 컬렉션, 시즌 탭 등을 추가하여 더 다양한 정보를 볼 수 있도록 하였습니다.
    - 검색 페이지 초기 화면 및 헤더 디자인을 변경하였습니다. (로고, 서치바 추가)
    - Trending 페이지를 추가하여 더 다양한 정보를 확인할 수 있도록 하였습니다.
    - 404 페이지를 추가하여 잘못된 경로로 접근하였음을 보여주었습니다.
    - 로딩 바를 보여주어 비동기 작업 중임을 사용자에게 알렸습니다.
    - 반응형 디자인을 도입하였습니다. (데스크탑, 모바일)
    - Yarn berry를 적용하여 의존성 깨짐 없이 zero install로 의존성을 관리하였습니다.
  - 구현하면서 어려웠던 점
    - 타입스크립트로 타입을 최대한 좁은 범위로 지정해주는 부분에서 시행착오를 겪었습니다.
    - 클래스 컴포넌트를 함수 컴포넌트와 hook으로 바꾸는 데에서 어떻게 어떤 부분이 변경되었나 이해하고 적용하는데 시행착오를 겪었습니다.
    - 모바일 웹을 위한 반응형 디자인을 저만의 스타일로 구현하는 것에서 시간이 소요되었습니다.
    - 리액트 쿼리를 적용하여 기존에 axios로 호출하던 부분에 캐싱을 적용하는 데에 시행착오를 겪었습니다.

<br>

## 🗂 프로젝트 구조

```
├── README.md
├── node_modules
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.tsx
│   ├── GlobalStyles.ts
│   ├── api.ts
│   ├── assets
│   │   └── images
│   │       ├── 404.svg
│   │       ├── imdb.png
│   │       ├── noPersonSmall.png
│   │       ├── noPosterSmall.png
│   │       └── noProductionSmall.png
│   ├── components
│   │   ├── HeaderSearchBar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TimeTypeSwitch.tsx
│   │   ├── common
│   │   │   ├── Header.tsx
│   │   │   ├── Helmet.tsx
│   │   │   ├── Infos.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── Poster.tsx
│   │   │   └── Section.tsx
│   │   └── detail
│   │       ├── Collection.tsx
│   │       ├── Credit.tsx
│   │       ├── Info.tsx
│   │       ├── Production.tsx
│   │       ├── Season.tsx
│   │       ├── Tabs.tsx
│   │       └── Trailer.tsx
│   ├── index.tsx
│   ├── interface.d.ts
│   ├── pages
│   │   ├── 404.tsx
│   │   ├── Detail.tsx
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   ├── TV.tsx
│   │   └── Trending.tsx
│   ├── react-app-env.d.ts
│   └── recoil
│       └── index.ts
├── tsconfig.json
└── yarn.lock
```

<br>

## 🛠 사용 기술

front-end

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

dev-ops

![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)

package manage

![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)

community

![Discord](https://img.shields.io/badge/DISCORD-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Apple](https://img.shields.io/badge/-APPLE-black?style=for-the-badge&logo=apple)
![Ubuntu](https://img.shields.io/badge/-UBUNTU-gray?style=for-the-badge&logo=Ubuntu)
