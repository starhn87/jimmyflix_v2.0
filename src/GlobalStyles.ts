import { createGlobalStyle } from 'styled-components'
import { generateMedia } from 'styled-media-query'
import reset from 'styled-reset'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const customMedia = generateMedia({
  desktop: '1630px',
  mobile: '768px',
})

const globalStyles = createGlobalStyle`
    ${reset};
    
    a {
        text-decoration: none;
        color: inherit;
    }
    * {
        box-sizing: border-box;
    }
    body {
        font-family: NanumGothic;
        font-size: 12px;
        background-color: rgba(20, 20, 20, 1);
        color: white;
        padding-top: 50px;
    }
    button {
        &:hover {
            cursor: pointer;
        }
    }
    #root {
        overflow: hidden;
    }
`

export default globalStyles
