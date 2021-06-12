import { createGlobalStyle } from "styled-components";
import { generateMedia } from "styled-media-query";
import reset from "styled-reset";

export const customMedia = generateMedia({
    desktop: '78em',
    tablet: '60em',
    mobile: '46em'
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
        font-size: 12px;
        background-color: rgba(20, 20, 20, 1);
        color: white;
        padding-top: 50px;
    }

    #root {
        overflow-x: hidden;
    }
`;

export default globalStyles;