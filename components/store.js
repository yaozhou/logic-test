import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { init_state, reducer } from './reducer'
//import promiseMiddleware from 'redux-promise-middleware';
import {createMiddleware} from 'redux-promises'
const promise_middleware = createMiddleware() ;
const loggerMiddleware = createLogger()

const store = applyMiddleware(loggerMiddleware)(createStore)(reducer); 
export default store ;

// export function configureStore() {
//   return createStore(
//     reducer,
//     init_state,
//     applyMiddleware(    
//         promiseMiddleware({
//             promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'ERROR']
//         }),
// //        thunkMiddleware,         
//         loggerMiddleware,        
//     )
//   )
// }