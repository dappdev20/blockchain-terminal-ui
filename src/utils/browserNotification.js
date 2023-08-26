const showNotification = (title = '', body = '', icon = '', image = '', requireInteraction = false, actionCallback) => {
  Notification.requestPermission(permission => {
    if (permission === 'granted') {
      const notification = new Notification(title, {
        icon,
        image,
        body,
        requireInteraction
      });

      notification.onclick = () => {
        if (actionCallback) {
          actionCallback();
        }
      };
    }
  });
};

export default showNotification;
