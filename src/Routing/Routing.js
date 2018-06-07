import Auth from '../containers/Auth/Auth';
import Logout from '../containers/Auth/Logout';
import AddTranslation from '../containers/AddTranslation/AddTranslation';
import MyTranslations from '../containers/MyTranslations/MyTranslations';
import Home from '../containers/Home/Home';
import ChooseCorrect from '../containers/Training/ChooseCorrect/ChooseCorrect';
import InputTranslations from '../containers/Training/InputTranslations/InputTranslations';

export const routes = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/auth',
    component: Auth,
    unAuthOnly: true
  },
  {
    path: '/add-translation',
    component: AddTranslation,
    authOnly: true
  },
  {
    path: '/logout',
    component: Logout,
    authOnly: true
  },
  {
    path: '/my-translations',
    component: MyTranslations,
    authOnly: true
  },
  {
    path: '/choose-correct',
    component: ChooseCorrect,
    authOnly: true
  },
  {
    path: '/input-translation',
    component: InputTranslations,
    authOnly: true
  }
];