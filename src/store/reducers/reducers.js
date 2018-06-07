import * as ActionTypes from '../actions/ActionTypes';

const initialState = {
	isAuth: false,
  userInfo: {
    displayName: ''
  },
  translations: {},
  message: {},
  isLoading: false
}

export const reducer = (state = initialState, action) => {
  const newState = {...state};
	switch(action.type) {
    case ActionTypes.START_LOADING:
      newState.isLoading = true;
      return newState;
    case ActionTypes.STOP_LOADING:
      newState.isLoading = false;
      return newState;
    case ActionTypes.SET_MESSAGE:
      let message = {
        type: action.is,
        text: action.text
      }
      newState.message = message;
      return newState;
    case ActionTypes.REMOVE_MESSAGE:
      newState.message = {};
      return newState;
    case ActionTypes.DELETE_TRANSLATION:
      let translations = {...newState.translations}
      delete translations[action.name];
      newState.translations = {...translations};
      localStorage.setItem('translations', JSON.stringify(translations));
      return newState;
    case ActionTypes.SAVE_TRANSLATION_TO_LOCAL:
      const newTranslations = {...newState.translations}
      newTranslations[action.name] = {...action.data}
      newState.translations = newTranslations;
      localStorage.setItem('translations', JSON.stringify(newTranslations));
      return newState
    case ActionTypes.SAVE_TRANSLATIONS:
      newState.translations = {...action.data};
      return newState;
    case ActionTypes.LOGOUT:
      newState.userInfo = {
        displayName: ''
      }
      newState.translations = {};
      newState.isAuth = false;
      return newState;
		case ActionTypes.AUTH_SUCCESS:
      const newUserInfo = {}
      if (action.data.displayName) {
        newUserInfo.displayName = action.data.displayName;
      }
      newUserInfo.userId = action.data.localId;
      newUserInfo.idToken = action.data.idToken;
      newUserInfo.refreshToken = action.data.refreshToken;
      newState.isAuth = true;
      newState.userInfo = newUserInfo;
			return newState;
		default:
			return state
	}
}