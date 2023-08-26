/* eslint-disable */
import React from 'react';
import { observable, action } from 'mobx';
import moment from 'moment';
import { to } from 'await-to-js';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';

//// import MTProto from '../lib/telegram-mtproto';
import storage from '../utils/CustomStorage';
import { timeDiffShort, getItemColor, imageExists } from '../utils';
import { getFile } from '../utils/FileManger';
import showBrowserNotification from '../utils/browserNotification';
import { TelegramTransferRequest } from '../lib/bct-ws';
import { makePasswordHash } from '../utils/cryptoUtils';

class TelegramStore {
  // MTProto Object
  client = null;
  apiId = 646203; // save this in .env later
  apiHash = 'f1fda801b954c2ee9bc8e299318133c3'; // save this in .env later

  phoneCodeHash = '';
  phoneNumber = '';

  @observable isSendingTelegramCode = false;
  @observable isLoggingInWithCode = false;
  @observable isLoggingInWith2FA = false;

  @observable isLoaded = false;
  @observable isLoggedIn = false;
  @observable is2FARequired = false;
  @observable errMsg = '';
  @observable forceUpdate = 0;

  @observable loggedInUser = null;

  @observable telDialogs = [];
  @observable activeChats = [];
  @observable lastRender = 0;
  @observable participantsCount = 0;
  @observable activeRound = 0;

  @observable isMtprotoLogin = false;
  @observable isProfileLogoExists = false;
  @observable logoURL = '';

  chats = [];
  dialogs = [];
  messages = [];
  users = [];
  yourAccountStore = null;

  activePeer = null;
  activeChat = null;
  activeChatUsers = [];
  @observable activePeerChatAvailable = false;
  @observable isFetchingActiveChats = false;
  @observable isFetchingDialogs = false;
  @observable isSendingMessage = false;

  // GetStates variables
  isGetStatesRunning = false;
  updatesStateSeq = null;
  updatesStatePts = null;
  updatesStateDate = null;
  intervalId = null;
  startGetStatesRunnerTimeout = null;
  sendCodeTimeout = null;
  retryTimeout = null;

  // Channel, chat to lastMessage hash
  lastMessages = {};
  isFirstFetch = true;

  // For lazy load limit
  limitRows = 30;

  /**
   * Constructor ==============================================================================================
   */
  constructor(yourAccountStore, snackBar) {
    //// this.initMTproto();

    this.snackBar = snackBar;
    this.isLoggedIn = localStorage.getItem('signedin') === 'true';
    this.isMtprotoLogin = localStorage.getItem('mtprotosignedin') === 'true';
    // if (localStorage.getItem("authToken") && !this.isLoggedIn) {
    //     storage.clear();
    //     window.location.reload();
    // }
    this.loggedInUser = {
      id: localStorage.getItem('userid') || '',
      username: localStorage.getItem('username') || '',
      firstname: localStorage.getItem('first_name') || '',
      lastname: localStorage.getItem('last_name') || ''
    };
    this.yourAccountStore = yourAccountStore;

    // Start getStates loop
    if (this.isMtprotoLogin) {
      setTimeout(this.startGetStatesRunner, 5000);
    } else {
      this.isLoaded = true;
    }

    if (this.isLoggedIn) {
      // this.logoURL = 'https://t.me/i/userpic/320/' + this.loggedInUser.username + '.jpg';
      this.logoURL = '';
      imageExists(this.logoURL, exists => {
        // console.log('url=' + this.logoURL + ', exists=' + exists);
        this.isProfileLogoExists = exists;
      });
    } else {
      this.logoURL = '';
    }
  }

  /**
   * Initialization of certain fields when login with telegram modal opens ====================================
   */
  @action.bound initByTelegramLogin() {
    this.errMsg = '';
    this.is2FARequired = false;
    this.forceUpdate = Math.random();
  }

  /**
   * Mtproto client call wrapper to handle exceptions =========================================================
   */
  clientWrapper = async (method, params, options = {}, retryCount = 0) => {
    if (!this.client) {
      console.log('Mtproto not inited');
      throw Error('Mtproto not inited');
    }

    if (retryCount > 3) {
      throw new Error(`Retry count exceeded ${method}`);
    } else if (retryCount > 0) {
      console.log(`Retrying ${method} after 2 seconds, ${retryCount} attempts`);

      await new Promise(resolve => {
        setTimeout(resolve, 1000);
      });
    }

    let [err, baseDcID] = await to(this.client.storage.get('dc'));
    const requestDcID = options.dcID || baseDcID;

    let res;
    [err, res] = await to(this.client(method, params, options));

    // No error, return result.
    if (!err) {
      return res;
    } else {
      if (err.code === 401 && baseDcID !== requestDcID) {
        // Do transfer authentication
        return this.client('auth.exportAuthorization', { dc_id: requestDcID }, { noErrorBox: true })
          .then(exportedAuth => {
            this.client(
              'auth.importAuthorization',
              { id: exportedAuth.id, bytes: exportedAuth.bytes },
              {
                dcID: requestDcID,
                noErrorBox: true
              }
            )
              .then(() => {
                console.log(`Successfully transferred auth from dc${baseDcID} to dc${requestDcID}`);
                return this.clientWrapper(method, params, options, retryCount + 1);
              })
              .catch(err => {
                throw err;
              });
          })
          .catch(err => {
            throw err;
          });
      } else if (err.code === 401) {
        // There was an unauthorized attempt to use functionality available only to authorized users.
        // 401 UNAUTHORIZED
        console.log('[401 error happened]', err.type);

        switch (err.type) {
          case 'AUTH_KEY_UNREGISTERED':
            break;
          case 'AUTH_KEY_INVALID':
            break;
          case 'USER_DEACTIVATED':
            storage.set('signedin', false);
            window.location.reload();
            break;
          case 'SESSION_REVOKED':
            break;
          case 'SESSION_EXPIRED':
            break;
          case 'ACTIVE_USER_REQUIRED':
            break;
          case 'AUTH_KEY_PERM_EMPTY':
            break;
          default:
            throw err;
        }
        throw err;
      } else {
        throw err;
      }
    }
  };

  /**
   * Init MTProto =============================================================================================
   */
  initMTproto() {
    let api = {
      layer: 57,
      initConnection: 0x69796de9,
      api_id: this.apiId
    };

    let server = {
      dev: false,
      webogram: true
    };

    let app = {
      storage
    };

    if (server.dev) {
      console.log('Warning: using dev telegram server');
    }

    //// this.client = MTProto({
    ////     server, api, app,
    //// });
  }

  /**
   *  Send confirm code =======================================================================================
   */
  @action.bound sendConfirmCode(phoneNumber) {
    if (!this.isMtprotoLogin) {
      this.errMsg = '';
      this.phoneNumber = phoneNumber;

      // Initialize MTProto client Object
      this.initMTproto();

      // Send auth code
      return this._sendCode();
    } else {
      this.errMsg = 'You are already logged in.';

      return Promise.reject(false);
    }
  }

  _sendCode = () => {
    return new Promise(async (resolve, reject) => {
      try {
        this.isSendingTelegramCode = true;

        // Try send confirmation code to user phone
        const { phone_code_hash } = await this.clientWrapper('auth.sendCode', {
          phone_number: '+' + this.phoneNumber,
          current_number: false,
          api_id: this.apiId,
          api_hash: this.apiHash
        });

        this.phoneCodeHash = phone_code_hash;
        this.errMsg = '';

        console.log('Telegram confirmation code sent.');

        this.isSendingTelegramCode = false;

        return resolve(true);
      } catch (e) {
        this.isSendingTelegramCode = false;

        console.log('Can not send confirmation code, Error JSON: ', JSON.stringify(e));

        if (e.code === 401 && e.type === 'AUTH_KEY_EMPTY') {
          // If 401: AUTH_KEY_EMPTY, try again after second
          this.isSendingTelegramCode = true;

          setTimeout(() => {
            this.initMTproto();
            this._sendCode()
              .then(res => resolve(res))
              .catch(err => reject(err));
          }, 1000);
        } else if (e.code === 500) {
          // If 500: *, clear keys
          storage.clear();
          this.errMsg = 'Error: ' + e.type;

          return reject(false);
        } else {
          this.errMsg = 'Error: ' + e.type;

          return reject(false);
        }
      }
    });
  };

  /**
   *  Login with confirmCode ==================================================================================
   */
  @action.bound loginWithCode(confirmCode) {
    if (!this.isMtprotoLogin) {
      // Login with confirmCode
      return this._loginWithCode(confirmCode);
    } else {
      console.log('[You already logged in]');
      this.errMsg = 'You already logged in.';

      return Promise.reject(false);
    }
  }

  _loginWithCode = confirmCode => {
    return new Promise(async (resolve, reject) => {
      try {
        this.isLoggingInWithCode = true;

        const { user } = await this.clientWrapper('auth.signIn', {
          phone_number: this.phoneNumber,
          phone_code_hash: this.phoneCodeHash,
          phone_code: confirmCode
        });

        this.loginFinished(user);

        this.isLoggingInWithCode = false;

        return resolve(true);
      } catch (e) {
        console.log('Can not login with code, Error JSON: ', JSON.stringify(e));
        this.isLoggingInWithCode = false;

        if (e.type === 'SESSION_PASSWORD_NEEDED') {
          this.is2FARequired = true;

          this.errMsg = '';

          return resolve(true);
        } else {
          this.errMsg = 'Error: ' + e.type;
        }

        return reject(false);
      }
    });
  };

  /**
   * Login with 2FA ===========================================================================================
   */
  @action.bound loginWith2FA(twoFactorCode) {
    if (!this.isMtprotoLogin) {
      return this._login2FA(twoFactorCode);
    } else {
      this.errMsg = 'You already logged in.';

      return Promise.reject(false);
    }
  }

  _login2FA = twoFactorCode => {
    return new Promise(async (resolve, reject) => {
      try {
        this.isLoggingInWith2FA = true;

        let [err, baseDcID] = await to(this.client.storage.get('dc'));
        const { current_salt } = await this.clientWrapper(
          'account.getPassword',
          {},
          baseDcID
            ? {
                dcID: baseDcID
              }
            : {}
        );

        const password_hash = await makePasswordHash(current_salt, twoFactorCode);

        const { user } = await this.clientWrapper(
          'auth.checkPassword',
          {
            password_hash
          },
          baseDcID ? { dcID: baseDcID } : {}
        );

        // 2FA login finished
        this.is2FARequired = false;

        this.loginFinished(user);

        this.isLoggingInWith2FA = false;

        return resolve(true);
      } catch (e) {
        this.isLoggingInWith2FA = false;

        console.log('Can not login with 2FA, Error JSON: ', JSON.stringify(e));
        this.errMsg = 'Can not login!';

        return reject(false);
      }
    });
  };

  // After login is finished, set status to mobx and storage
  loginFinished = user => {
    this.loggedInUser = {
      id: user.id || '',
      username: user.username || '',
      firstname: user.first_name || '',
      lastname: user.last_name || ''
    };

    // Set logged in user information to storage for use after page refresh
    storage.set('username', user.username || '');
    storage.set('userid', user.id || '');
    storage.set('first_name', user.first_name || '');
    storage.set('last_name', user.last_name || '');
    storage.set('signedin', true);
    storage.set('mtprotosignedin', true);

    this.logoURL = 'https://t.me/i/userpic/320/' + user.username + '.jpg';
    imageExists(this.logoURL, exists => {
      console.log('RESULT: url=' + this.logoURL + ', exists=' + exists);
      this.isProfileLogoExists = exists;
    });

    this.showCoinSendState('You are successfully logged in');

    this.isLoggedIn = true;
    this.isMtprotoLogin = true;
    this.errMsg = '';

    // Start getStates loop
    setTimeout(this.startGetStatesRunner, 5000);

    // Update contacts
    this.getDialogsFrom();
  };

  loginFinishWith = user => {
    this.loggedInUser = {
      id: user.id || '',
      username: user.username || '',
      firstname: user.first_name || '',
      lastname: user.last_name || ''
    };

    // Set logged in user information to storage for use after page refresh
    storage.set('username', user.username || '');
    storage.set('userid', user.id || '');
    storage.set('first_name', user.first_name || '');
    storage.set('last_name', user.last_name || '');
    storage.set('signedin', true);

    this.logoURL = 'https://t.me/i/userpic/320/' + user.username + '.jpg';
    imageExists(this.logoURL, exists => {
      console.log('url=' + this.logoURL + ', exists=' + exists);
      this.isProfileLogoExists = exists;
    });

    this.showCoinSendState('You are successfully logged in');

    this.isLoggedIn = true;
    this.errMsg = '';
  };

  /**
   *  getDialogs: messages.getDialogs =========================================================================
   *  to_id/channel_id, to_id/user_id
   */
  getLastMessage(targetId, isChannel) {
    if (isChannel) {
      const messages = this.messages.filter(
        m => m.to_id && (m.to_id.chat_id === targetId || m.to_id.channel_id === targetId)
      );
      if (messages.length > 0) {
        messages.sort((a, b) => b.date - a.date);
        return messages[0];
      }
    } else {
      const messages = this.messages.filter(
        m => m.from_id && m.to_id && m.to_id.user_id && (m.from_id === targetId || m.to_id.user_id === targetId)
      );
      if (messages.length > 0) {
        messages.sort((a, b) => b.date - a.date);
        return messages[0];
      }
    }
    return '';
  }

  getUnreadNum(targetId, isChannel) {
    if (isChannel) {
      for (let i = 0; i < this.dialogs.length; i++) {
        if (this.dialogs[i].peer && this.dialogs[i].peer.channel_id === targetId) {
          return this.dialogs[i].unread_count;
        }
      }
    } else {
      for (let i = 0; i < this.dialogs.length; i++) {
        if (this.dialogs[i].peer && this.dialogs[i].peer.user_id === targetId) {
          return this.dialogs[i].unread_count;
        }
      }
    }
    return 0;
  }

  getMessageText = lastMessage => {
    if (lastMessage._ === 'message') {
      if (lastMessage.message) {
        return lastMessage.message.trim();
      }

      // Analyze media for each type
      if (lastMessage.media) {
        if (lastMessage.media._ === 'messageMediaDocument') {
          if (lastMessage.media.document.dc_id === 2) {
            return 'Sticker';
          } else if (lastMessage.media.document.dc_id === 4) {
            return 'Video';
          } else if (lastMessage.media.document.dc_id === 5) {
            return 'Gif';
          }
          return 'Media';
        } else if (lastMessage.media._ === 'messageMediaWebPage') {
          return lastMessage.media.webpage.title;
        }
      }
    } else if (lastMessage._ === 'messageService') {
      return this.getMessageServiceText(this.users, this.messages, lastMessage);
    }

    return '';
  };

  getMessageServiceText = (c_users, c_messages, message_item) => {
    let message = '';
    if (message_item.action) {
      const users = message_item.action.users;
      let pinnedIdx = -1;
      // Analyze action for each type
      switch (message_item.action._) {
        case 'messageActionChatAddUser':
          let userName = this.getUserName(c_users, message_item.from_id);
          if (userName.trim().length === 0) {
            userName = 'Deleted Account';
          }

          message += userName;
          if (users.length === 1) {
            // 1 new user joined
            if (message_item.from_id === message_item.action.users[0]) {
              // Self joined
              message += ' joined the group';
            } else {
              // A added B
              let userNameAdded = this.getUserName(c_users, message_item.action.users[0]);
              if (userNameAdded.trim().length === 0) {
                userNameAdded = 'Deleted Account';
              }

              message += ` added ${userNameAdded}`;
            }
          } else {
            // several users joined
            message += ' added ';
            for (let i = 0; i < message_item.action.users.length; i++) {
              let userNameAdded = this.getUserName(c_users, message_item.action.users[i]);
              if (userNameAdded.trim().length === 0) {
                userNameAdded = 'Deleted Account';
              }

              message += userNameAdded + (i < message_item.action.users.length - 1 ? ', ' : '');
            }
          }
          break;
        case 'messageActionChatJoinedByLink':
          let userNameJoined = this.getUserName(c_users, message_item.from_id);
          if (userNameJoined.trim().length === 0) {
            userNameJoined = 'Deleted Account';
          }

          message = `${userNameJoined} joined by link`;
          break;
        case 'messageActionChannelCreate':
          message = `Channel ${message_item.action.title} created`;
          break;
        case 'messageActionPinMessage':
          message = this.getUserName(c_users, message_item.from_id) + ' pinned';
          pinnedIdx = c_messages.findIndex(m => m.id === message_item.reply_to_msg_id);
          if (pinnedIdx > -1) {
            message += ' <' + c_messages[pinnedIdx].message.substr(0, 16).trim() + '...>';
          }
          break;
        case 'messageActionChatCreate':
          message = `Chat ${message_item.action.title} created`;
          break;
        case 'messageActionEmpty':
          message = 'Chat empty';
          break;
        case 'messageActionChatEditTitle':
          message = 'Chat title edited';
          break;
        case 'messageActionChatEditPhoto':
          message = 'Chat photo edited';
          break;
        case 'messageActionChatDeletePhoto':
          message = 'Chat photo deleted';
          break;
        case 'messageActionChatDeleteUser':
          message = this.getUserName(c_users, message_item.from_id);
          message += ' left the group';
          break;
        default:
          // console.log(message_item);
          break;
      }
    } else {
      // console.log(message_item);
    }

    return message;
  };

  async getDialogs() {
    this.isFetchingDialogs = true;

    try {
      const dialogs = await this.clientWrapper('messages.getDialogs', {
        limit: 100
      });

      if (dialogs) {
        this.chats = dialogs.chats;
        this.users = dialogs.users;
        this.messages = dialogs.messages;
        this.dialogs = dialogs.dialogs;

        let res = [];
        if (this.chats && this.chats.length) {
          this.chats.map((item, key) => {
            if (!item.deactivated && !item.left && item._ !== 'chatForbidden') {
              const name = item.title || '';
              const lastMessage = this.getLastMessage(item.id, true);
              const message = this.getMessageText(lastMessage);
              const firstName = this.getUserFirstName(this.users, lastMessage.from_id);
              const unread = this.getUnreadNum(item.id, true);

              res.push({
                sysType: item._,
                sysId: item.id,
                sysAccessHash: item.access_hash,
                photo: item.photo ? item.photo.photo_small : null,
                image: '',
                name: name,
                date: timeDiffShort(moment(item.date * 1000)),
                dateUnix: item.date,
                lastMessage: lastMessage._ === 'message' ? message : '',
                from:
                  lastMessage._ === 'message'
                    ? lastMessage.out
                      ? 'You: '
                      : firstName
                      ? firstName + ': '
                      : ''
                    : message,
                unread,
                sendCoins: false,
                active: false, // false for channel, check if user.
                type: item._ === 'channel' ? 'channel' : 'chat', // Room for channel, chat,
                membersTotal: item._ === 'chat' ? item.participants_count : 0, // Only for room
                membersOnline: 0, // TODO get members online, Only for room
                color: getItemColor(name)
              });

              // Save last messages
              let messageToPush = null;
              if (lastMessage._ === 'message') {
                if (!lastMessage.out) {
                  messageToPush = {
                    from: firstName || '',
                    message,
                    unread
                  };
                }
              } else {
                messageToPush = {
                  from: '',
                  message,
                  unread
                };
              }

              if (
                !isEqual(this.lastMessages[item.id], messageToPush) &&
                !this.isFirstFetch &&
                messageToPush &&
                messageToPush.message &&
                String(messageToPush.message).includes(this.loggedInUser.username || '') &&
                unread
              ) {
                console.log('show notification!', messageToPush);
                showBrowserNotification(messageToPush.from, messageToPush.message);
              }

              this.lastMessages[item.id] = messageToPush;
            }
          });
        }

        if (this.users && this.users.length) {
          this.users.map((item, key) => {
            if (!item.bot && !item.deleted && !item.self) {
              const name = (item.first_name || '') + ' ' + (item.last_name || '');
              const lastMessage = this.getLastMessage(item.id, false);
              if (lastMessage) {
                const message = this.getMessageText(lastMessage);
                const firstName = this.getUserFirstName(this.users, lastMessage.from_id);
                const unread = this.getUnreadNum(item.id, false);

                res.push({
                  sysType: item._,
                  sysId: item.id,
                  sysAccessHash: item.access_hash,
                  photo: item.photo ? item.photo.photo_small : null,
                  image: '',
                  name: name,
                  date: timeDiffShort(lastMessage.date),
                  dateUnix: lastMessage.date,
                  lastMessage: lastMessage._ === 'message' ? message : '',
                  from: lastMessage._ === 'message' ? (lastMessage.out ? 'You: ' : '') : message,
                  unread,
                  sendCoins: item.first_name !== 'Telegram',
                  active: !(item.status && item.status._ === 'userStatusOffline'),
                  type: 'person',
                  status: item.status && item.status._ ? item.status._.substring(10) : '',
                  color: getItemColor(name)
                });

                // Save last messages
                let messageToPush = null;
                if (lastMessage._ === 'message') {
                  if (!lastMessage.out) {
                    messageToPush = {
                      from: firstName || '',
                      message,
                      unread
                    };
                  }
                } else {
                  messageToPush = {
                    from: '',
                    message,
                    unread
                  };
                }

                if (
                  !isEqual(this.lastMessages[item.id], messageToPush) &&
                  !this.isFirstFetch &&
                  messageToPush &&
                  messageToPush.message &&
                  unread
                ) {
                  console.log('show notification!', messageToPush);
                  showBrowserNotification(messageToPush.from, messageToPush.message);
                }

                this.lastMessages[item.id] = messageToPush;
              }
            }
          });
        }

        this.telDialogs = sortBy(res, item => -item.dateUnix);
      }

      this.isFetchingDialogs = false;
    } catch (e) {
      console.log('[(MTProto) getDialogs Error] ', e);
      this.telDialogs = [];

      this.isFetchingDialogs = false;
      throw e;
    }

    this.isFirstFetch = false;

    if (!this.isLoaded) this.isLoaded = true;
    return true;
  }

  @action.bound getDialogsFrom() {
    if (this.isMtprotoLogin) {
      this.getDialogs();
    } else {
      this.telDialogs = [];
    }
  }

  @action.bound getImageFromTelegram(photo) {
    return new Promise((resolve, reject) => {
      if (photo !== null) {
        // if (this.isLoggedIn) {
        //     // if (window.location.hostname === 'dev.bct.trade')
        //     //     return resolve("");
        //
        //     // --- direct access to Telegram API ---
        //     getFile(this.clientWrapper, photo).then(value => {
        //         resolve(value);
        //     }).catch(err => {
        //         // console.log(err);
        //         resolve('');
        //     });
        // } else {
        // --- access to proxy server ---
        fetch('/services/api/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ location: photo })
        })
          .then(response => response.json())
          .then(({ url }) => {
            resolve(url !== '' ? '/services/' + url : '');
          })
          .catch(err => {
            resolve('');
          });
        // }
      } else {
        resolve('');
      }
    });
  }

  /**
   * ====================================================
   * Get Chat History
   */
  isUser(chat) {
    if (chat && (chat._ === 'user' || chat._ === 'userForbidden')) {
      return true;
    }
    return false;
  }

  isChannel(chat) {
    if (chat && (chat._ === 'channel' || chat._ === 'channelForbidden')) {
      return true;
    }
    return false;
  }

  getInputPeer(chat) {
    const peerid = chat.id;
    const peerhash = chat.access_hash;

    if (this.isUser(chat)) {
      return {
        _: 'inputPeerUser',
        user_id: peerid,
        access_hash: peerhash
      };
    } else if (this.isChannel(chat)) {
      return {
        _: 'inputPeerChannel',
        channel_id: peerid,
        access_hash: peerhash || 0
      };
    } else {
      return {
        _: 'inputPeerChat',
        chat_id: peerid
      };
    }
  }

  chatHistory = async (chat, maxID = 0, limit = 30, offset = 0) => {
    const history = await this.clientWrapper('messages.getHistory', {
      peer: this.getInputPeer(chat),
      offset_id: maxID || 0,
      add_offset: offset || 0,
      limit: limit || 0
    });
    return history;
  };

  getUserInfo = (c_users, userId) => {
    let activeUser = {
      name: '',
      avatar: null,
      color: '#01B067',
      background: null
    };
    for (let i = 0; i < c_users.length; i++) {
      if (c_users[i].id === userId) {
        activeUser.name =
          (c_users[i].first_name ? c_users[i].first_name : '') +
          ' ' +
          (c_users[i].last_name ? c_users[i].last_name : '');
        activeUser.avatar = c_users[i].photo ? c_users[i].photo.photo_small : null;
        activeUser.color = getItemColor(activeUser.name).hexColor; // '#01B067';
        activeUser.background = getItemColor(activeUser.name);
        break;
      }
    }
    return activeUser;
  };

  getUserName = (c_users, userId) => {
    for (let i = 0; i < c_users.length; i++) {
      if (c_users[i].id === userId) {
        return (
          (c_users[i].first_name ? c_users[i].first_name : '') +
          ' ' +
          (c_users[i].last_name ? c_users[i].last_name : '')
        );
      }
    }
    return '';
  };

  getUserFirstName = (c_users, userId) => {
    for (let i = 0; i < c_users.length; i++) {
      if (c_users[i].id === userId) {
        return c_users[i].first_name
          ? c_users[i].first_name
          : c_users[i].last_name
          ? c_users[i].last_name
          : c_users[i].username
          ? c_users[i].username
          : '';
      }
    }
    return '';
  };

  @action.bound getNextRoundHistory(round) {
    if (this.activeChat) {
      const { type, id, hash, name } = this.activeChat;

      this.getHistoryByIdHash(type, id, hash, round, name);
    }
  }

  @action.bound getHistoryByIdHash(type, id, hash, round, name) {
    this.isFetchingActiveChats = true;

    // Save id to activeId for sending Msg
    this.activePeer = {
      access_hash: hash
    };

    // Save active round
    this.activeRound = round;

    // This is just for refetching
    this.activeChat = {
      type,
      id,
      hash,
      name
    };

    switch (type) {
      case 'channel':
        this.activePeer.channel_id = id;
        this.activePeer._ = 'inputPeerChannel';
        break;
      case 'user':
        this.activePeer.user_id = id;
        this.activePeer._ = 'inputPeerUser';
        break;
      case 'chat':
        this.activePeer.chat_id = id;
        this.activePeer._ = 'inputPeerChat';
        break;
      default:
        this.activePeer._ = 'inputPeerEmpty';
    }

    // --- get chat history from (type,id,hash) ---
    const chat = {
      _: type,
      id: id,
      access_hash: hash
    };

    let _this = this;

    return this.chatHistory(chat, 0, this.limitRows * (round + 1))
      .then(function(result) {
        // {
        //     type: 'message',
        //     user: {
        //         name: 'CM | Matthew',
        //         avatar: avatar3,
        //         color: '#72c16e',
        //     },
        //     text: 'Are all tokens locked up?',
        //     date: '21:09',
        // }

        // {
        //     type: 'reply',
        //     to: {
        //         user: users[0],
        //         text: 'Are all tokens locked up?',
        //     },
        //     user: users[1],
        //     text: 'YES they are locked up for 12 months after the ICO ends or hard cap is reached.',
        //     date: '21:09',
        // }

        // {
        //     type: 'date',
        //     date: '20 June, 2018',
        // }

        // Send read signal
        if (result.messages && result.messages.length) {
          _this.sendReadSignal();
        }

        let c_messages = result.messages,
          c_chats = result.chats,
          c_users = result.users,
          resultChats = [];

        _this.activeChatUsers = c_users;

        let c_chat_photo = null;

        // Check if sending message available
        if (c_chats[0] && c_chats[0]._ && c_chats[0]._ === 'channel') {
          _this.activePeerChatAvailable = !!(c_chats[0].megagroup || c_chats[0].creator);
          c_chat_photo = c_chats[0].photo.photo_small;
        } else {
          _this.activePeerChatAvailable = true;
        }

        // iterate and display messages
        for (let i = 0; i < c_messages.length; i++) {
          let message_item = c_messages[i];
          let message_type = message_item._; // reply, message or messageService
          // console.log('[i]', message_item);
          let newItem = {};

          switch (message_type) {
            case 'message':
              newItem.type = 'message';
              newItem.text = message_item.message;
              newItem.id = message_item.id;
              newItem.date = moment(message_item.date * 1000).format('H:mm');
              newItem.user = _this.getUserInfo(c_users, message_item.from_id);
              // Get channel photo for Mute Channels
              if (!_this.activePeerChatAvailable) {
                newItem.user.avatar = c_chat_photo;
              }
              if (message_item.media) {
                newItem.media = message_item.media;
              } else {
                newItem.media = null;
              }

              if (message_item.reply_to_msg_id) {
                // case 'reply'
                newItem.type = 'reply';
                const reply_id = message_item.reply_to_msg_id;
                newItem.to = {};
                for (let j = 0; j < c_messages.length; j++) {
                  if (c_messages[j].id === reply_id) {
                    newItem.to.text = c_messages[j].message;
                    newItem.to.user = _this.getUserInfo(c_users, c_messages[j].from_id);
                    break;
                  }
                }
              }
              break;
            case 'messageService':
              newItem.type = 'extra';
              newItem.date = _this.getMessageServiceText(c_users, c_messages, message_item);
              break;
            default:
              break;
          }
          resultChats.push(newItem);

          if (
            i === c_messages.length - 1 ||
            !moment(message_item.date * 1000).isSame(moment(c_messages[i + 1].date * 1000), 'day')
          ) {
            // Input date
            resultChats.push({
              type: 'date',
              date: moment(message_item.date * 1000).format('MMMM D')
            });
          }
        }

        _this.lastRender = Date.now();
        _this.activeChats = resultChats.reverse();

        // --- get total members from channel data ---
        if (type === 'channel') {
          _this.getParticipants(id, hash).then(fullChat => {
            if (fullChat && fullChat.full_chat) {
              _this.participantsCount = fullChat.full_chat.participants_count;
            }
          });
        }

        _this.isFetchingActiveChats = false;
        return true;
      })
      .catch(err => {
        console.error('[(MTProto) Can not get Chats]', err);

        this.isFetchingActiveChats = false;
        throw err;
      });
  }

  @action.bound reFetchActivePeerHistory() {
    if (this.activeChat && this.activeChat.type && this.activeChat.id && this.activeChat.hash) {
      return this.getHistoryByIdHash(
        this.activeChat.type,
        this.activeChat.id,
        this.activeChat.hash,
        0,
        this.activeChat.name
      );
    } else {
      return false;
    }
  }

  /**
   * Get FullChannel ==========================================================================================
   */
  getChannelInput(chat) {
    if (!chat) {
      return { _: 'inputChannelEmpty' };
    }
    return {
      _: 'inputChannel',
      channel_id: chat.id,
      access_hash: chat.access_hash || 0
    };
  }

  getParticipants = async (id, hash) => {
    try {
      const channel = {
        id: id,
        access_hash: hash
      };
      return await this.clientWrapper('channels.getFullChannel', {
        channel: this.getChannelInput(channel)
      });
    } catch (err) {
      // console.log('[err]', err);
      return [];
    }
  };

  /**
   * Send Text ================================================================================================
   */
  @action.bound sendText = async (text, replyMsg = undefined) => {
    if (!text || !text.length || text.constructor !== String || !this.activePeer) {
      throw Error('Not enough data to send msg.');
    }

    // Add message to bottom of message stack
    let newItem = {};
    newItem.type = 'message';
    newItem.text = text;
    newItem.date = moment().format('H:mm');
    const userId = await storage.get('userid');
    newItem.user = this.getUserInfo(this.activeChatUsers, Number.parseInt(userId));

    if (replyMsg) {
      newItem.type = 'reply';
      newItem.to = {
        text: replyMsg.text,
        user: replyMsg.user
      };
    }

    this.activeChats = [...this.activeChats, newItem];

    // Do send
    this.isSendingMessage = true;
    let params = {
      peer: this.activePeer,
      message: text,
      random_id: Math.floor(Math.random() * 0xffffffff)
    };

    if (replyMsg) {
      params.reply_to_msg_id = replyMsg.id;
    }

    let [errSend, resSend] = await to(this.clientWrapper('messages.sendMessage', params));
    this.isSendingMessage = false;

    if (errSend) {
      console.log('[(MTProto) sendText error]');
      throw errSend;
    }

    // Refetch
    // return this.reFetchActivePeerHistory(false);

    // Just return true
    return true;
  };

  /**
   * Send Read Signal =========================================================================================
   */
  sendReceivedSignal = async max_id => {
    let [err, res] = await to(this.clientWrapper('messages.receivedMessages', { max_id: 0 }));
    if (err) {
      throw err;
    }
    return res;
  };

  sendReadSignal = async () => {
    if (!this.activePeer.user_id) {
      let [err, res] = await to(
        this.clientWrapper('channels.readHistory', {
          channel: this.activePeer,
          max_id: 0
        })
      );
    } else {
      let [err, res] = await to(
        this.clientWrapper('messages.readHistory', {
          peer: this.activePeer,
          max_id: 0
        })
      );
    }

    return true;
  };

  /**
   * Send Text via Proxy ======================================================================================
   */
  @action.bound sendWalletMsg = async (notification, symbol, amount, user = null) => {
    let targetChatHash = '';
    let targetId = '';
    let targetName = '';

    if (user) {
      if (user.id && user.hash && user.name) {
        targetChatHash = user.hash;
        targetId = user.id;
        targetName = user.name;
      } else {
        return false;
      }
    } else if (this.activeChat && this.activeChat.id && this.activeChat.hash) {
      targetChatHash = this.activeChat.hash;
      targetId = this.activeChat.id;
      targetName = this.activeChat.name;
    } else {
      return false;
    }

    const activePeer = {
      access_hash: targetChatHash,
      user_id: targetId,
      _: 'inputPeerUser'
    };

    if (!notification || !notification.length || notification.constructor !== String || !activePeer) {
      console.log('Not enough data to send msg.');
    }

    let [errSend, resSend] = await to(
      this.clientWrapper('messages.sendMessage', {
        peer: activePeer,
        message: notification,
        random_id: Math.floor(Math.random() * 0xffffffff)
      })
    );

    if (errSend) {
      console.log('[messages.sendMessage error]', errSend);
      // return false;
    }

    this.showCoinSendState('Coins sent successfully');
    // console.log("[sendText success]", resSend);

    // --- [send-coins] backend --- //
    const payload = {
      Coin: (symbol || '').toLowerCase(),
      Amount: amount || 0,
      To: targetId,
      Details: {
        name: targetName
      }
    };
    // console.log(payload);
    TelegramTransferRequest(payload).then(() => {
      this.yourAccountStore.requestPosition();
    });

    return true;

    // /**
    //  * Below codes send message "Hi" to all friends. It is just for test demo.
    //  */
    // if (this.users && this.users.length) {
    //     this.users.map(async (item, key) => {
    //         if (!item.bot && !item.deleted && !item.self && (item.id !== this.activeChat.id)) {
    //             const name = (item.first_name || '') + ' ' + (item.last_name || '');
    //             const lastMessage = this.getLastMessage(item.id, false);
    //             if (lastMessage) {
    //                 const activePeer = {
    //                     access_hash: item.access_hash,
    //                     user_id: item.id,
    //                     _: 'inputPeerUser',
    //                 };
    //
    //                 let [errSend, resSend] = await to(this.clientWrapper('messages.sendMessage', {
    //                     peer: activePeer,
    //                     message: 'Hi',
    //                     random_id: Math.floor(Math.random() * 0xFFFFFFFF),
    //                 }));
    //
    //                 if (errSend) {
    //                     console.log('[messages.sendMessage error]', errSend);
    //                 } else {
    //                     console.log("[sendText success]", resSend);
    //                 }
    //
    //                 await this.waitFor();
    //                 console.log(Date.now());
    //             }
    //         }
    //     });
    //     return true;
    // }
    // return false;
    // /**
    //  * Above codes send message "Hi" to all friends. It is just for test demo.
    //  */
  };

  waitFor = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 4000);
    });
  };

  /**
   * Get states ===============================================================================================
   */
  startGetStatesRunner = () => {
    this.isGetStatesRunning = true;
    // this.getStatesRunner();

    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.getStatesRunner, 4000);
  };

  stopGetStatesRunner = () => {
    this.isGetStatesRunning = false;

    clearInterval(this.intervalId);
    this.intervalId = null;
  };

  getStatesRunner = async () => {
    let [err, res] = await to(this.getStates());

    // if (this.isGetStatesRunning) {
    //     setTimeout(this.getStatesRunner, 2000);
    // }
  };

  getStates = async () => {
    // console.log('Checking states update');
    let [err, res] = await to(this.clientWrapper('updates.getState', {}, { noErrorBox: true }));
    if (err) {
      this.stopGetStatesRunner();
      throw Error('Can not get states');
    }

    if (res) {
      // console.log('Status', {
      //     pts: this.updatesStatePts,
      //     seq: this.updatesStateSeq,
      // }, res);
      if (this.updatesStateSeq !== res.seq || this.updatesStatePts !== res.pts) {
        // console.log('status needs update dialog and chats');
        let promises = [];

        // call if not already fetching
        // if (!this.isFetchingDialogs) {
        //     promises.push(this.getDialogs());
        // }
        // if (!this.isFetchingActiveChats) {
        //     promises.push(this.reFetchActivePeerHistory());
        // }

        // Just call
        promises.push(this.getDialogs());
        promises.push(this.reFetchActivePeerHistory());

        let [err] = await to(Promise.all(promises));
        if (err) {
          this.stopGetStatesRunner();
          throw Error('Can not get updated data, (called by state change)');
        }
      }

      // Save latest points
      if (this.updatesStatePts !== res.pts) {
        this.updatesStatePts = res.pts;
      }

      if (this.updatesStateSeq !== res.seq) {
        this.updatesStateSeq = res.seq;
      }

      if (this.updatesStateDate !== res.date) {
        this.updatesStateDate = res.date;
      }
    }
    return res;
  };

  /**
   * Join / Leave Channel with id and hash ====================================================================
   */
  joinChannel = async (type, channel_id, access_hash, name) => {
    let [err, res] = await to(
      this.clientWrapper('channels.joinChannel', {
        channel: {
          _: 'inputChannel',
          channel_id,
          access_hash
        }
      })
    );

    if (err) {
      console.log(' Can not join channel.');
      throw err;
    }

    // --- update channels, chats --- //
    let promises = [];
    promises.push(this.getDialogs());
    promises.push(this.getHistoryByIdHash(type, channel_id, access_hash, 0, name));

    let [err2] = await to(Promise.all(promises));
    if (err2) {
      throw Error('Can not get channel list');
    }

    return res;
  };

  // Leave Channel
  leaveChannel = async (channel_id, access_hash) => {
    let [err, res] = await to(
      this.clientWrapper('channels.leaveChannel', {
        channel: {
          _: 'inputChannel',
          channel_id,
          access_hash
        }
      })
    );

    if (err) {
      console.log(' Can not leave channel.');
      throw err;
    }

    // --- update channels, chats --- //
    this.getDialogs();

    return res;
  };

  checkIfSubscribed = (id, hash) => {
    if (this.chats && this.chats.length) {
      for (let i = 0; i < this.chats.length; i++) {
        let item = this.chats[i];

        if (
          !item.deactivated &&
          !item.left &&
          item._ !== 'chatForbidden' &&
          item.id === id &&
          item.access_hash === hash
        ) {
          // Subscribed
          return true;
        }
      }
    }

    return false;
  };

  // set Active channel from left drop
  setActiveChannel = (type, id, hash, name) => {
    this.activeChat = {
      type,
      id,
      hash,
      name
    };
  };

  @action.bound getActiveName() {
    if (this.activeChat && this.activeChat.name) {
      return this.activeChat.name;
    }
    return '';
  }

  @action.bound joinChannelWith() {
    const { type, id, hash, name } = this.activeChat;
    if (id && hash) {
      this.joinChannel(type, id, hash, name)
        .then(() => {
          console.log('[Successfully Joined]');
        })
        .catch(err => {
          console.log('[Join Failed]', err);
          alert('Failed to join channel');
        });
    }
  }

  @action.bound leaveChannelWith() {
    const { type, id, hash, name } = this.activeChat;
    if (id && hash) {
      this.leaveChannel(id, hash)
        .then(() => {
          console.log('[Successfully left]');
        })
        .catch(err => {
          console.log('[left Failed]', err);
          alert('Failed to left channel');
        });
    }
  }

  @action.bound showCoinSendState(msg) {
    this.snackBar({
      message: () => (
        <>
          <span>
            <b>{msg}</b>
          </span>
        </>
      )
    });
  }
}

export default (yourAccountStore, snackBar) => {
  const store = new TelegramStore(yourAccountStore, snackBar);
  return store;
};
