import { keyframes } from 'styled-components/macro';

export const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

export const zoomIn = keyframes`
  0% { transform: scale(0); }
  100% { transform: scale(1); }
`;

export const zoomOut = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(0); }
`;

export const popIn = keyframes`
  0% { transform: scale(0) translateY(-25px); opacity: 0; }
  30% { transform: scale(1) translateY(-20px); opacity: 1; }
  100% { transform: scale(1) translateY(0); }
`;

export const popOut = keyframes`
  0% { transform: scale(1) translateY(0); }
  70% { transform: scale(1) translateY(-20px); opacity: 1; }
  100% { transform: scale(0) translateY(-25px); opacity: 0; }
`;

export const slideDown = keyframes`
  0% { transform: scaleY(0); transform-origin: 0% 0%; opacity: 0; }
  100% { transform: scaleY(1); transform-origin: 0% 0%; opacity: 1; }
`;

export const slideUp = keyframes`
  0% { transform: scaleY(1); transform-origin: 0% 0%; opacity: 1; }
  100% { transform: scaleY(0); transform-origin: 0% 0%; opacity: 0; }
`;

export const slideFromBottom = keyframes`
  0% { transform: scaleY(0); transform-origin: 0% 100%; opacity: 0; }
  100% { transform: scaleY(1); transform-origin: 0% 100%; opacity: 1; }
`;

export const slideFromTop = keyframes`
  0% { transform: scaleY(1); transform-origin: 0% 100%; opacity: 1; }
  100% { transform: scaleY(0); transform-origin: 0% 100%; opacity: 0; }
`;
