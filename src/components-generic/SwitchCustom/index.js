import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InputCheckBox, UnCheckedIcon, CheckedIcon, BackgroundWapper, Handle, RootWrapper } from './styles';
import getBackgroundColor from './getBackgroundColor';

const hexColorPropType = (props, propName, componentName) => {
  const prop = props[propName];
  if (typeof prop !== 'string' || prop[0] !== '#' || (prop.length !== 4 && prop.length !== 7)) {
    return new Error(
      `Invalid prop '${propName}' supplied to '${componentName}'. '${propName}' has to be either a 3-digit or 6-digit hex-color string. Valid examples: '#abc', '#123456'`
    );
  }
  return null;
};

const defaultUncheckedIcon = (
  <svg viewBox="-2 -5 14 20" height="100%" width="100%" style={{ position: 'absolute', top: 0 }}>
    <path
      d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12"
      fill="#fff"
      fillRule="evenodd"
    />
  </svg>
);

const defaultCheckedIcon = (
  <svg height="100%" width="100%" viewBox="-2 -5 17 21" style={{ position: 'absolute', top: 0 }}>
    <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fillRule="evenodd" />
  </svg>
);

class ReactSwitch extends Component {
  handleDiameter = this.props.handleDiameter || this.props.height - 2;
  checkedPos = Math.max(0, (this.props.height - this.handleDiameter) / 2);
  uncheckedPos = (this.props.width - (this.props.height - this.handleDiameter)) / 2;
  lastDragAt = 0;
  lastKeyUpAt = 0;

  state = {
    pos: this.props.checked ? this.checkedPos : this.uncheckedPos
  };

  componentDidUpdate(prevProps) {
    if (prevProps.checked === this.props.checked) {
      return;
    }

    const pos = this.props.checked ? this.checkedPos : this.uncheckedPos;
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({ pos });
  }

  onDragStart = clientX => {
    this.inputRef.focus();
    this.setState({
      startX: clientX,
      hasOutline: true,
      dragStartingTime: Date.now()
    });
  };

  onDrag = clientX => {
    const { startX, isDragging, pos } = this.state;
    const { checked } = this.props;
    const startPos = checked ? this.checkedPos : this.uncheckedPos;
    const mousePos = startPos + clientX - startX;
    // We need this check to fix a windows glitch where onDrag is triggered onMouseDown in some cases
    if (!isDragging && clientX !== startX) {
      this.setState({ isDragging: true });
    }
    const newPos = Math.min(this.checkedPos, Math.max(this.uncheckedPos, mousePos));
    // Prevent unnecessary rerenders
    if (newPos !== pos) {
      this.setState({ pos: newPos });
    }
  };

  onDragStop = event => {
    const { pos, isDragging, dragStartingTime } = this.state;
    const { checked } = this.props;
    const halfwayCheckpoint = (this.checkedPos + this.uncheckedPos) / 2;

    // Simulate clicking the handle
    const timeSinceStart = Date.now() - dragStartingTime;
    if (!isDragging || timeSinceStart < 250) {
      this.onChange(event);

      // Handle dragging from checked position
    } else if (checked) {
      if (pos > halfwayCheckpoint) {
        this.setState({ pos: this.checkedPos });
      } else {
        this.onChange(event);
      }
      // Handle dragging from unchecked position
    } else if (pos < halfwayCheckpoint) {
      this.setState({ pos: this.uncheckedPos });
    } else {
      this.onChange(event);
    }

    this.setState({ isDragging: false, hasOutline: false });
    this.lastDragAt = Date.now();
  };

  handleMouseDown = event => {
    event.preventDefault();
    // Ignore right click and scroll
    if (typeof event.button === 'number' && event.button !== 0) {
      return;
    }

    this.onDragStart(event.clientX);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = event => {
    event.preventDefault();
    this.onDrag(event.clientX);
  };

  handleMouseUp = event => {
    this.onDragStop(event);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  };

  handleTouchStart = event => {
    this.checkedStateFromDragging = null;
    this.onDragStart(event.touches[0].clientX);
  };

  handleTouchMove = event => {
    this.onDrag(event.touches[0].clientX);
  };

  handleTouchEnd = event => {
    event.preventDefault();
    this.onDragStop(event);
  };

  onInputChange = event => {
    // This condition is unfortunately needed in some browsers where the input's change event might get triggered
    // right after the dragstop event is triggered (occurs when dropping over a label element)
    if (Date.now() - this.lastDragAt > 50) {
      this.onChange(event);
      // Prevent clicking label, but not key activation from setting outline to true - yes, this is absurd
      if (Date.now() - this.lastKeyUpAt > 50) {
        this.setState({ hasOutline: false });
      }
    }
  };

  handleKeyUp = () => {
    this.lastKeyUpAt = Date.now();
  };

  setHasOutline = () => {
    this.setState({ hasOutline: true });
  };

  unsetHasOutline = () => {
    this.setState({ hasOutline: false });
  };

  getInputRef = el => {
    this.inputRef = el;
  };

  handleClick = event => {
    event.preventDefault();
    this.inputRef.focus();
    this.onChange(event);
    this.setState({ hasOutline: false });
  };

  onChange = event => {
    const { checked, onChange, id } = this.props;
    onChange(!checked, event, id);
  };

  render() {
    const {
      disabled,
      className,
      offColor,
      onColor,
      offHandleColor,
      onHandleColor,
      checkedIcon,
      uncheckedIcon,
      boxShadow,
      activeBoxShadow,
      height,
      width,
      handleDiameter, // just to filter this prop out
      ...rest
    } = this.props;

    const { pos, isDragging, hasOutline } = this.state;

    return (
      <RootWrapper
        className={className}
        disabled={disabled}
        height={height}
        background={getBackgroundColor(pos, this.checkedPos, this.uncheckedPos, offColor, onColor)}
        isDragging={isDragging}
      >
        <Handle
          className="react-switch-handle"
          width={width}
          height={height}
          disabled={disabled}
          handleDiameter={this.handleDiameter}
          hasOutline={hasOutline}
          activeBoxShadow={activeBoxShadow}
          boxShadow={boxShadow}
          isDragging={isDragging}
          pos={pos}
          onClick={e => e.preventDefault()}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.unsetHasOutline}
        />
        <BackgroundWapper
          className="react-switch-bg"
          width={width}
          height={height}
          disabled={disabled}
          handleDiameter={this.handleDiameter}
          onClick={disabled ? null : this.handleClick}
          onMouseDown={e => e.preventDefault()}
        >
          {uncheckedIcon && (
            <UnCheckedIcon width={width} height={height} handleDiameter={this.handleDiameter}>
              {uncheckedIcon}
            </UnCheckedIcon>
          )}
          {checkedIcon && (
            <CheckedIcon width={width} height={height} handleDiameter={this.handleDiameter}>
              {checkedIcon}
            </CheckedIcon>
          )}
        </BackgroundWapper>

        <InputCheckBox
          type="checkbox"
          role="switch"
          disabled={disabled}
          {...rest}
          /* anything below should NOT get overriden by ...rest */
          ref={this.getInputRef}
          onFocus={this.setHasOutline}
          onBlur={this.unsetHasOutline}
          onKeyUp={this.handleKeyUp}
          onChange={this.onInputChange}
        />
      </RootWrapper>
    );
  }
}
ReactSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  offColor: hexColorPropType,
  onColor: hexColorPropType,
  offHandleColor: hexColorPropType,
  onHandleColor: hexColorPropType,
  handleDiameter: PropTypes.number,
  uncheckedIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  checkedIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  boxShadow: PropTypes.string,
  activeBoxShadow: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  // eslint-disable-next-line react/require-default-props
  id: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  className: PropTypes.string
};

ReactSwitch.defaultProps = {
  disabled: false,
  offColor: '#566190',
  onColor: '#566190',
  offHandleColor: '#00c6c0',
  onHandleColor: '#00c6c0',
  uncheckedIcon: defaultUncheckedIcon,
  checkedIcon: defaultCheckedIcon,
  boxShadow: null,
  activeBoxShadow: '0 0 2px 3px #3bf',
  height: 40,
  width: 80,
  handleDiameter: 38
};

export default ReactSwitch;
