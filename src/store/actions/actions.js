import * as actionTypes from './ActionTypes';
import axios from 'axios';

const logoutSuccess = () => {
  return {
    type: actionTypes.LOGOUT
  }
}

const setMessageToState = (type, message) => {
  return {
    type: actionTypes.SET_MESSAGE,
    is: type,
    text: message.replace(/_/ig, ' ').toLowerCase()
  }
}

const startLoading = () => {
  return {
    type: actionTypes.START_LOADING
  }
}

const stopLoading = () => {
  return {
    type: actionTypes.STOP_LOADING
  }
}

const removeMessage = () => {
  return {
    type: actionTypes.REMOVE_MESSAGE
  }
}

const setMessage = (type, message) => {
  return dispatch => {
    dispatch(setMessageToState(type, message));
    setTimeout(() => {
      dispatch(removeMessage());
    }, 2000);
  }
}

const authSuccess = (data) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    data: data
  }
};

const getMyTranslations = (user) => {
  return dispatch => {
    dispatch(startLoading());

    const url = 'https://remember-the-word-8fd71.firebaseio.com/translations.json?auth='
      + user.idToken
      + '&orderBy="userId"&equalTo="' + user.userId + '"';

    axios.get(url, {timeout: 10000})
      .then(resp => {
        dispatch(saveMyTranslations(resp.data));
        localStorage.setItem('translations', JSON.stringify(resp.data));
      })
      .catch(err => {
        console.log(err);
        dispatch(setMessage('error', 'Can not get new translations from server!'));
        dispatch(saveMyTranslations(JSON.parse(localStorage.getItem('translations'))));
      })
      .then(() => {
        dispatch(stopLoading());
      });;
  }
};

const reauth = (token, callback) => {
  return dispatch => {
    const data = {
      refresh_token: token,
      grant_type: "refresh_token"
    }

    const userInfo = {}

    axios.post('https://securetoken.googleapis.com/v1/token?key=AIzaSyD3t0fb3r3wPpByekL27K5lgUAnL2NBw6I', data, {timeout: 10000})
      .then(resp => {
        userInfo.idToken = resp.data.id_token;
        userInfo.refreshToken = resp.data.refresh_token;
        userInfo.localId = resp.data.user_id;
        userInfo.displayName = localStorage.getItem('userName');

        const expirationDate = new Date(new Date().getTime() + resp.data.expires_in * 1000);
        localStorage.setItem('token', resp.data.id_token);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', resp.data.user_id);
        localStorage.setItem('refreshToken', resp.data.refresh_token);

        dispatch(authSuccess(userInfo));
        dispatch(checkAuthTimeout(resp.data.expires_in));
        if (callback) callback(resp.data.id_token);
      })
      .catch(err => {
        console.log(err);

        userInfo.idToken = localStorage.getItem('token');
        userInfo.refreshToken = localStorage.getItem('refreshToken');
        userInfo.localId = localStorage.getItem('user_id');
        userInfo.displayName = localStorage.getItem('userName');
        dispatch(authSuccess(userInfo));
        if (callback) callback();
        const message = err.response ? err.response.data.error.message || err.response.data.error : 'Check your internet connection!';
        dispatch(setMessage('error', message));
      });
  }
}

const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(reauth(localStorage.getItem('refreshToken')));
    }, expirationTime * 1000);
  };
};

const saveTranslationToLocal = (translation, name) => {
  return {
    type: actionTypes.SAVE_TRANSLATION_TO_LOCAL,
    data: translation,
    name: name
  }
};

const saveMyTranslations = (translations) => {
  return {
    type: actionTypes.SAVE_TRANSLATIONS,
    data: translations
  }
};

const deleteTranslateFromLocal = (name) => {
  return {
    type: actionTypes.DELETE_TRANSLATION,
    name: name
  }
}

export const checkAuth = () => {
  return dispatch => {
    const userInfo = {}
    userInfo.idToken = localStorage.getItem('token');
    if (!userInfo.idToken) return;

    userInfo.refreshToken = localStorage.getItem('refreshToken');
    userInfo.expirationDate = localStorage.getItem('expirationDate');
    userInfo.localId = localStorage.getItem('userId');
    userInfo.displayName = localStorage.getItem('userName');

    if (new Date() > new Date(userInfo.expirationDate)) {
      dispatch(reauth(userInfo.refreshToken, (token) => {
        dispatch(getMyTranslations({
          idToken: token,
          userId: userInfo.localId
        }));
      }));
    } else {
      dispatch(authSuccess(userInfo));
      const expTime = (new Date(userInfo.expirationDate).getTime() - new Date().getTime()) / 1000;
      dispatch(checkAuthTimeout(expTime));
      dispatch(getMyTranslations({
        idToken: userInfo.idToken,
        userId: userInfo.localId
      }));
    }
  }
}

export const saveUser = (data) => {
  return dispatch => {
    dispatch(startLoading());

    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD3t0fb3r3wPpByekL27K5lgUAnL2NBw6I';
    if (data.displayName) {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyD3t0fb3r3wPpByekL27K5lgUAnL2NBw6I';
    }

    axios.post(url, data)
    .then(resp => {
      const expirationDate = new Date(new Date().getTime() + resp.data.expiresIn * 1000);
      localStorage.setItem('token', resp.data.idToken);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('userId', resp.data.localId);
      localStorage.setItem('refreshToken', resp.data.refreshToken);
      localStorage.setItem('userName', resp.data.displayName);
      dispatch(authSuccess(resp.data));
      dispatch(checkAuthTimeout(resp.data.expiresIn));
      dispatch(getMyTranslations({
        idToken: resp.data.idToken,
        userId: resp.data.localId
      }));
      dispatch(setMessage('success', 'Success!'));
    })
    .catch(err => {
      console.log(err);
      const message = err.response ? err.response.data.error.message || err.response.data.error : 'Check your internet connection!';
      dispatch(setMessage('error', message));
    })
    .then(() => {
      dispatch(stopLoading());
    });;
  }
};

export const logout = () => {
  return dispatch => {
    localStorage.clear();
    dispatch(logoutSuccess());
    dispatch(setMessage('success', 'Signed out!'));
  }
};

export const saveTranslation = (data, callback) => {
    return dispatch => {
      dispatch(startLoading());

      const newData = {
        userId: data.user.userId,
        translation: data.translation
      }

      const url = 'https://remember-the-word-8fd71.firebaseio.com/translations.json?auth=' + data.user.idToken;

      axios.post(url, newData, {timeout: 10000})
        .then(resp => {
          dispatch(saveTranslationToLocal(newData, resp.data.name));
          dispatch(setMessage('success', 'Saved!'));
          callback(true);
        })
        .catch(err => {
          console.log(err);
          const message = err.response ? err.response.data.error.message || err.response.data.error : 'Check your internet connection!';
          dispatch(setMessage('error', message));
          callback(false);
        })
        .then(() => {
          dispatch(stopLoading());
        });;
    }
};

export const deleteTranslate = (name, token) => {
  return dispatch => {
    dispatch(startLoading());

    axios.delete('https://remember-the-word-8fd71.firebaseio.com/translations/' + name + '.json?auth=' + token, {timeout: 10000})
      .then(resp => {
        dispatch(deleteTranslateFromLocal(name));
        dispatch(setMessage('success', 'Deleted!'));
      })
      .catch(err => {
        console.log(err);
        const message = err.response ? err.response.data.error.message || err.response.data.error : 'Check your internet connection!';
        dispatch(setMessage('error', message));
      })
      .then(() => {
          dispatch(stopLoading());
      });
  }
};