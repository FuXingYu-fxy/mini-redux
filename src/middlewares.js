export const thunk = store => next => action => {
  if (typeof action === 'function') {
    // 直接调用 store.dispatch 会导致 middleware 链从头再执行一次
    // 然后下一次就会走到 next(action) 那部分去
    return action(store.dispatch, store.getState);
  }
  return next(action);
}

export const logger = store => next => action => {
  console.group(action.type);
  console.log('dispatching :>> ', action);
  next(action);
  console.log(store.getState());
  console.groupEnd(action.type);
}