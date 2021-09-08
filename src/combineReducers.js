export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducer = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];

    if (typeof reducers[key] === 'function') {
      finalReducer[key] = reducers[key];
    }
  }
  // finalReducer 是所有的reducer函数
  const finalReducerKeys = Object.keys(finalReducer);
  return function combination(state, action) {
    const nextState = {};
    let hasChanged = false; // 如果最后还为 false, 就返回原来的 state
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducer[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        throw new Error(`每一个slice reducer 都必须返回一个state, 请检查 "${key}" 是否
        缺少 "default" 语句
        `);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  }
}