import { createStore, applyMiddleware } from 'redux';
import reducer from './ducks/user';
import promiseMiddleware from 'redux-promise-middleware';

export default createStore(
  reducer,
  // Using promise-middleware so we can use
  // Promises as payloads in our action creators
  applyMiddleware(promiseMiddleware())
);