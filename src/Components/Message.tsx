import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { customMedia } from "./GlobalStyles";

const Container = styled.div`
    display: flex;
    height: 10vh;
    justify-content: center;
`;

const Text = styled.span<{ color: string }>`
    padding-top: 50px;
    font-size: 28px;
    color: ${props => props.color};

    ${customMedia.lessThan('mobile')`
        font-size: 22px;
    `}
`;

interface Props {
    text?: string,
    color: string
}

const Message: React.FunctionComponent<Props> = ({ text, color }) => (
    <Container><Text color={color}>{text}</Text></Container>
)

Message.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
};

export default Message;