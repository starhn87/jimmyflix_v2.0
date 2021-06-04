import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    width: 100vw;
    justify-content: center;
`;

const Text = styled.span<{ color: string }>`
    color: ${props => props.color};
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