## 📑 프로젝트 소개

현재 시점 기준으로 핫한 영화, TV 프로그램을 확인할 수 있는 어플리케이션입니다.
(노마드코더의 React 챌린지 클론코딩으로 시작하여 저만의 방식으로 더욱 발전시킨 프로젝트입니다.)

<br>

[배포링크](https://jimmyflix.netlify.app/)

<br>

## ✨ 주요 기능

- 홈 페이지
  - 현재 상영중인 영화를 확인할 수 있습니다.
  - 상영 예정인 영화를 확인할 수 있습니다.
  - 인기 있는 영화를 확인할 수 있습니다.
- TV 페이지
  - 평점이 높은 TV 프로그램을 확인할 수 있습니다.
  - 인기 있는 TV 프로그램을 확인할 수 있습니다.
  - 오늘 방송하는 TV 프로그램을 확인할 수 있습니다.
- 검색 페이지
  - 원하는 영화 혹은 TV 프로그램을 같이 검색할 수 있습니다.
- 상세 페이지
  - 포스터를 클릭하여 평점, 줄거리, 예고편, 출연 배우, 제작 회사, 시리즈 등을 알 수 있습니다.

<br>

## 🧔 메인

<br>

1. 홈 페이지

<img src="https://user-images.githubusercontent.com/36434219/161191063-7a618804-30d6-48cd-8491-361f29225c04.png" alt="홈 페이지" width="700px" height="400px">

<br>

2. TV 페이지

<img src="https://user-images.githubusercontent.com/36434219/161191121-88500cf5-f642-4e5b-9c56-b591f08de512.png" alt="전적 검색 페이지" width="700px" height="400px">

<br>

3-1. 검색 페이지 (초기)

<img src="https://user-images.githubusercontent.com/36434219/161191283-31733ca2-a4e1-4675-a72d-0e5601d375f7.png" alt="트랙 페이지" width="700px" height="400px">

<br>

3-2. 검색 페이지 (검색 후)

<img src="https://user-images.githubusercontent.com/36434219/161191384-b70b9aad-2d11-4c15-b9ab-e99fe05c96b3.png" alt="트랙 페이지" width="700px" height="400px">

<br>

4. 상세 페이지

<img src="https://user-images.githubusercontent.com/36434219/160313431-57b194a4-80bf-4b97-94f5-618e06d11667.png" alt="트랙 페이지" width="700px" height="400px">

<br>
<br>

## ⭐️ 구현한 기능 목록 및 어려웠던 점

- 클론코딩
  - 구현 내용 & 방법
    - 클래스 컴포넌트와 생명주기를 활용하여 로직을 구현하였습니다.
    - Container, Presenter 패턴을 적용하여 렌더링과 로직 부분을 분리하였습니다.
    - axios로 IMDB 오픈 API를 호출하여 데이터를 불러왔습니다.
    - styled-components로 현재의 디자인을 스타일링하였습니다.
    - 리덕스와 리덕스 툴킷으로 전역 상태를 관리하였습니다.
- 직접 추가하거나 개선한 부분
  - 구현 내용 & 방법
    - 타입스크립트를 적용하여 타입 검사를 컴파일 시점에서 할 수 있도록 하였습니다.
    - 함수형 컴포넌트와 React Hooks를 적용하여 코드를 경량화하였습니다.
    - 상세 페이지에서 예고편, 등장 인물, 시퀄 탭을 추가하여 더 다양한 정보를 볼 수 있도록 하였습니다.
    - react-slick을 사용하여 무한 슬라이드를 구현하였습니다.
    - 반응형 디자인을 도입하였습니다. (데스크탑, 모바일)
    - 렌더링 최적화를 하였습니다. (memo 적용)
    - 상세 페이지에 IMDB 링크를 삽입하여 추가적으로 정보가 필요할 시 링크를 타고 넘어갈 수 있도록 하였습니다.
  - 구현하면서 어려웠던 점
    - 타입스크립트로 타입을 최대한 좁은 범위로 지정해주는 부분에서 시행착오를 겪었습니다.
    - 클래스형 컴포넌트를 함수형 컴포넌트와 hook으로 바꾸는 데에서 어떻게 어떤 부분이 변경되었나 이해하고 적용하는데 시행착오를 겪었습니다.
    - 모바일 웹을 위한 반응형 디자인을 저만의 스타일로 구현하는 것에서 시간이 소요되었습니다.

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
│   ├── Components
│   │   ├── App.tsx
│   │   ├── GlobalStyles.tsx
│   │   ├── Header.tsx
│   │   ├── Helmet.tsx
│   │   ├── Info.tsx
│   │   ├── Layout.tsx
│   │   ├── Loader.tsx
│   │   ├── Message.tsx
│   │   ├── MovieResult.tsx
│   │   ├── Poster.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SearchResult.tsx
│   │   ├── Section.tsx
│   │   └── TVResult.tsx
│   ├── Routes
│   │   ├── Collection.tsx
│   │   ├── Detail.tsx
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   └── TV.tsx
│   ├── api.tsx
│   ├── assets
│   │   ├── images
│   │   │   ├── Spinner.gif
│   │   │   ├── imdb.png
│   │   │   ├── noPersonSmall.png
│   │   │   ├── noPosterSmall.png
│   │   │   └── noProductionSmall.png
│   │   └── styles
│   │       └── styled.d.ts
│   ├── hooks
│   │   ├── useCollection.tsx
│   │   ├── useDetail.tsx
│   │   ├── useHome.tsx
│   │   ├── useSearch.tsx
│   │   └── useTV.tsx
│   ├── index.tsx
│   ├── react-app-env.d.ts
│   ├── reducers
│   │   ├── DetailReducer.tsx
│   │   ├── HomeReducer.tsx
│   │   ├── SearchReducer.tsx
│   │   └── TVReducer.tsx
│   └── store.tsx
├── tsconfig.json
└── yarn.lock
```

<br>

## 🛠 사용 기술

front-end

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
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
