import React from 'react'
import styled from '@emotion/styled'

const Loading = () => (
  <Ring>
    LOADING
    <span></span>
  </Ring>
)

export default Loading

const Ring = styled.div`
  position: fixed;
  width: 12rem;
  height: 12rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 0.7rem solid #23a2f7;
  border-radius: 50%;
  text-align: center;
  line-height: 10.5rem;
  font-size: 1.2rem;
  font-weight: 1000;
  color: #23a2f7;
  letter-spacing: 0.3rem;
  z-index: 99999;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: -0.7rem;
    left: -0.7rem;
    border: 0.7rem solid transparent;
    border-top: 0.7rem solid #002473;
    border-right: 0.7rem solid #002473;
    border-radius: 50%;
    animation: animateA 3s linear infinite;
  }

  span {
    position: absolute;
    display: block;
    width: 50%;
    height: 0.4rem;
    top: calc(50% - 0.2rem);
    left: 50%;
    background: transparent;
    transform-origin: left;
    animation: animateB 3s linear infinite;

    &:before {
      content: '';
      position: absolute;
      width: 1.7rem;
      height: 1.7rem;
      top: 0rem;
      right: -1.2rem;
      border-radius: 50%;
      background: #002473;
    }
  }

  @keyframes animateA {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes animateB {
    0% {
      transform: rotate(45deg);
    }
    100% {
      transform: rotate(405deg);
    }
  }
`
