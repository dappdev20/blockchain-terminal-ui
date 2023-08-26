/**
 * Pick background color based on the current handle position.
 * @param {number} pos The position of handle component in horizontal wise.
 * @param {number} checkedPos The position of handle component when it is in checked state in horizontal wise.
 * @param {number} uncheckedPos The position of handle component when it is in unchecked state in horizontal wise.
 * @param {string} offColor Color value of handle when it is unchecked.
 * @param {string} onColor Color value of handle when it is checked.
 * @returns {string} colorValue
 */
function createBackgroundColor(pos, checkedPos, uncheckedPos, offColor, onColor) {
  const relativePos = (pos - uncheckedPos) / (checkedPos - uncheckedPos);
  if (relativePos === 0) {
    return offColor;
  }
  if (relativePos === 1) {
    return onColor;
  }

  let newColor = '#';
  for (let i = 1; i < 6; i += 2) {
    const offComponent = parseInt(offColor.substr(i, 2), 16);
    const onComponent = parseInt(onColor.substr(i, 2), 16);
    const weightedValue = Math.round((1 - relativePos) * offComponent + relativePos * onComponent);
    let newComponent = weightedValue.toString(16);
    if (newComponent.length === 1) {
      newComponent = `0${newComponent}`;
    }
    newColor += newComponent;
  }
  return newColor;
}

function convertShorthandColor(color) {
  if (color.length === 7) {
    return color;
  }
  let sixDigitColor = '#';
  for (let i = 1; i < 4; i += 1) {
    sixDigitColor += color[i] + color[i];
  }
  return sixDigitColor;
}

export default function getBackgroundColor(pos, checkedPos, uncheckedPos, offColor, onColor) {
  const sixDigitOffColor = convertShorthandColor(offColor);
  const sixDigitOnColor = convertShorthandColor(onColor);
  return createBackgroundColor(pos, checkedPos, uncheckedPos, sixDigitOffColor, sixDigitOnColor);
}
