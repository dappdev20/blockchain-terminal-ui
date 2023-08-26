export const animateButton = (menu, active = true) => {
  const element = document.getElementById(menu);
  if (!element) return;
  if (active) {
    element.classList.add('animated', 'pulse', 'faster');
  } else {
    element.classList.remove('animated', 'pulse', 'faster');
  }
};
