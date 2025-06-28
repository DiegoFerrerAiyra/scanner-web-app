import { LOGOUT } from './clearState.actions';

export function clearState(reducer: (arg0: any, arg1: any) => any) {
    return function (state: undefined, action: { type: string; }) {
  
      if (action.type === LOGOUT) {
        state = undefined;
      }
  
      return reducer(state, action);
    };
  }