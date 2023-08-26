import { TELEGRAM_AUTH_URL } from '../../config/constants';

export const login = (tgUser = {}) => {
  return fetch(TELEGRAM_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tgUser)
  })
    .then(response => response.json())
    .then(({ status, message, data }) => {
      if (status === 'fail') {
        throw Error(message);
      }

      return data;
    });
};

export default () => {
  const telegramAuthUser = JSON.parse(localStorage.getItem('telegramAuthUser') || '{}');

  if (telegramAuthUser.hash) {
    login(telegramAuthUser)
      .then(response => {
        localStorage.setItem('authClientId', response.clientId);
        localStorage.setItem('authToken', response.token);
      })
      .catch(err => {
        console.error('telegram login error', err);
      });
  }
};
