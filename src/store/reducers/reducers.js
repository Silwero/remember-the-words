import * as ActionTypes from '../actions/ActionTypes';

const initialState = {
	isAuth: false,
  userInfo: {
    displayName: ''
  },
  translations: {},
  message: {}
}

export const reducer = (state = initialState, action) => {
  const newState = {...state};
	switch(action.type) {
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
      return newState;
    case ActionTypes.SAVE_TRANSLATION_TO_LOCAL:
      newState.translations[action.name] = {...action.data};
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
      if (action.data.displayName) {
        newState.userInfo.displayName = action.data.displayName;
      }
      newState.userInfo.userId = action.data.localId;
      newState.userInfo.idToken = action.data.idToken;
      newState.userInfo.refreshToken = action.data.refreshToken;
      newState.isAuth = true;
			return newState;
		default:
			return state
	}
}