import React from 'react';
import ReactDOM from 'react-dom';
import { withElementWithIdDimensions } from '@/hocs/withElementWithIdDimensions';
import { PortalWrapper } from './styles';

const rootElement = document.getElementById('root');

class ApiModal extends React.Component {
  modalEle = document.createElement('div');

  componentDidMount() {
    this.modalEle.setAttribute('id', 'api-portal');
    rootElement.appendChild(this.modalEle);
  }

  componentWillUnmount() {
    rootElement.removeChild(this.modalEle);
  }

  render() {
    return ReactDOM.createPortal(
      <PortalWrapper style={{ left: this.props.xPos, width: this.props.objWidth }}>
        {this.props.children}
      </PortalWrapper>,
      this.modalEle
    );
  }
}

export default withElementWithIdDimensions(ApiModal, 'right-top');
