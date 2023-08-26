import styled from 'styled-components/macro';

export const InputCheckBox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

export const UnCheckedIcon = styled.div`
  height: ${props => props.height}px;
  width: ${props => Math.min(props.height * 1.5, props.width - (props.handleDiameter + props.height) / 2 + 1)}px;
  position: absolute;
  right: 0;
  top: 0;
  pointer-events: none;
`;

export const CheckedIcon = styled.div`
  height: ${props => props.height}px;
  width: ${props => Math.min(props.height * 1.5, props.width - (props.handleDiameter + props.height) / 2 + 1)}px;
  position: relative;
  pointer-events: none;
`;

export const RootWrapper = styled.div`
  position: relative;
  margin-right: 5px;
  display: inline-block;
  text-align: left;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  direction: ltr;
  border-radius: ${props => props.height / 2}px;
  touch-action: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background: ${props => props.background};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  -webkit-transition: ${props => (props.isDragging ? null : 'background 0.25s')};
  -moz-transition: ${props => (props.isDragging ? null : 'background 0.25s')};
  transition: ${props => (props.isDragging ? null : 'background 0.25s')};
`;

export const BackgroundWapper = styled.div`
  pointer-events: none;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  margin: ${props => Math.max(0, (props.handleDiameter - props.height) / 2)}px;
  position: relative;
  border-radius: ${props => props.height / 2}px;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`;

export const Handle = styled.div`
  height: ${props => props.handleDiameter}px;
  width: ${props => props.width / 2}px;
  background: #00c6c0;
  display: inline-block;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  border-radius: ${props => props.handleDiameter / 2}px;
  position: absolute;
  transform: translateX(${props => props.pos}px);
  top: ${props => Math.max(0, (props.height - props.handleDiameter) / 2)}px;
  outline: 0;
  box-shadow: ${props => (props.hasOutline ? props.activeBoxShadow : props.boxShadow)};
  border: 0;
  -webkit-transition: ${props =>
    props.isDragging ? null : 'background-color 0.25s, transform 0.25s, box-shadow 0.15s'};
  -moz-transition: ${props => (props.isDragging ? null : 'background-color 0.25s, transform 0.25s, box-shadow 0.15s')};
  transition: ${props => (props.isDragging ? null : 'background-color 0.25s, transform 0.25s, box-shadow 0.15s')};
`;
