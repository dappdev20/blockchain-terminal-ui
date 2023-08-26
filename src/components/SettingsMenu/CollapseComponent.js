import React from 'react';
import styled, { css, keyframes } from 'styled-components/macro';

const CollapseWrapper = styled.div`
  width: 100%;
  height: ${props => (props.expanded ? props.height : '0')}px;
  transition: height 0.4s;
  cursor: pointer;
  ${props =>
    props.expanded
      ? css`
          animation: ${keyframes`
            0% {
                overflow-y: auto;
            }
        `} 0.4s;
        `
      : css`
          overflow-y: auto;
        `};
`;

class CollapseComponent extends React.Component {
  innerRef = React.createRef();
  render() {
    const height = this.innerRef && this.innerRef.current && this.innerRef.current.scrollHeight;
    return (
      <CollapseWrapper ref={this.innerRef} height={height} expanded={this.props.expanded}>
        {this.props.children}
      </CollapseWrapper>
    );
  }
}

export default CollapseComponent;
