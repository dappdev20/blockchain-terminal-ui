import React from 'react';
import styled from 'styled-components/macro';
import Clipboard from 'clipboard';
import IconCopy from './icon_copy.png';

const Wrapper = styled.div`
  width: ${props => (props.width ? `{props.width}px` : '100%')};
  ${props =>
    props.noContrast
      ? `
            padding: 9px 0;
        `
      : `
            border: 1px solid ${props => props.theme.palette.clrInnerBorder};
            border-radius: ${props => props.theme.palette.borderRadius};
            background: ${props => props.theme.palette.clrBackground};
            > .imgWrapper {
                border-left: 1px solid ${props => props.theme.palette.clrInnerBorder};
            }
        `}
  display: inline-flex;
  align-items: center;

  > span {
    display: flex;
    align-items: center;
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    overflow: hidden;
    height: 40px;

    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  > .copy-affiliate-link {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
`;

class InputCustom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCopied: false
    };
    this.timeOutId = null;
  }

  componentDidMount() {
    const { userId } = this.props;

    /* eslint-disable-next-line */
    new Clipboard('.copy-affiliate-link', {
      text: () => {
        return `demo.bct.trade/${userId}`;
      }
    });
  }

  componentWillUnmount() {
    if (this.timeOutId) {
      clearTimeout(this.timeOutId);
    }
  }

  copyToClipboard = () => {
    this.setState({
      isCopied: true
    });

    this.timeOutId = setTimeout(() => {
      this.setState({
        isCopied: false
      });
      this.timeOutId = null;
    }, 6000);
  };

  render() {
    const { ...props } = this.props;
    const { isCopied } = this.state;

    return (
      <Wrapper {...props}>
        {isCopied || (
          <div className="copy-affiliate-link" onClick={this.copyToClipboard} role="button" tabIndex={0}>
            <img src={IconCopy} alt="" />
          </div>
        )}
        {isCopied && (
          <span>
            <b>Affiliate Link has been copied.</b>
          </span>
        )}
      </Wrapper>
    );
  }
}

export default InputCustom;
