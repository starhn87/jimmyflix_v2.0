import React from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    margin-top: 20px;
    width: 100vw;
    height: 100vh;
    font-size: 28px;
    justify-content: center;
`;

export default () =>
    <Container>
        <span role="img" aria-label="Loading">
            ⏰
        </span>
    </Container>