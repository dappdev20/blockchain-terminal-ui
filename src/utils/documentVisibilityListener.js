let hidden;
let visibilityChange;

if (typeof document.hidden !== 'undefined') {
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

function handleChange(callback) {
  return () => {
    if (document[hidden]) {
      callback('hidden');
    } else {
      callback('visible');
    }
  };
}

export default function documentVisibilityListener(callback) {
  const handleVisibilityChange = handleChange(callback);
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
  return () => {
    document.removeEventListener(visibilityChange, handleVisibilityChange, false);
  };
}
