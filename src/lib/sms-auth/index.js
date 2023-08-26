import axios from 'axios';

import { AUTH_SERVER_URL } from '../../config/constants';

const getHeaders = token => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

export const requestDeviceToken = () =>
  axios
    .post(`${AUTH_SERVER_URL}/api/tokens/device`)
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const requestAuthenticationCode = (deviceToken, phoneNumber) =>
  axios
    .post(
      `${AUTH_SERVER_URL}/api/sms/send-code`,
      {
        phoneNumber
      },
      getHeaders(deviceToken)
    )
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const requestTwofaAuthenticationCode = deviceToken =>
  axios
    .post(`${AUTH_SERVER_URL}/api/sms/twofa-send-code`, {}, getHeaders(deviceToken))
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const confirmAuthenticationCode = (deviceToken, securityCode, scope) =>
  axios
    .post(
      `${AUTH_SERVER_URL}/api/sms/verify`,
      {
        secretCode: securityCode,
        scope
      },
      getHeaders(deviceToken)
    )
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const getTwoFAStatus = sessionToken =>
  axios
    .post(`${AUTH_SERVER_URL}/api/twofa/status`, {}, getHeaders(sessionToken))
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const requestGoogleSecret = sessionToken =>
  axios
    .post(`${AUTH_SERVER_URL}/api/twofa/setup-google`, {}, getHeaders(sessionToken))
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const verifyGoogle2FA = (sessionToken, googleToken) =>
  axios
    .post(
      `${AUTH_SERVER_URL}/api/twofa/verify-google`,
      {
        googleToken
      },
      getHeaders(sessionToken)
    )
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const disableGoogle2FA = sessionToken =>
  axios
    .post(`${AUTH_SERVER_URL}/api/twofa/disable-google`, {}, getHeaders(sessionToken))
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const requestEmailSecret = (sessionToken, baseUrl, email) =>
  axios
    .post(
      `${AUTH_SERVER_URL}/api/twofa/setup-email`,
      {
        baseUrl,
        email
      },
      getHeaders(sessionToken)
    )
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const verifyEmail2FA = secret =>
  axios
    .post(`${AUTH_SERVER_URL}/api/twofa/verify-email`, {
      secret
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const disableEmail2FA = sessionToken =>
  axios
    .post(`${AUTH_SERVER_URL}/api/twofa/disable-email`, {}, getHeaders(sessionToken))
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const refreshSecurityToken = deviceToken =>
  axios
    .post(`${AUTH_SERVER_URL}/api/tokens/session`, {}, getHeaders(deviceToken))
    .then(res => res.data)
    .catch(err => Promise.reject(err));
