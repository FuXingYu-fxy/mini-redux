import compose from "./compose";
// 中间件函数的写法  const logger = store => next => action
const applyMiddlewares = (...middlewares) => createStore => (reducer, initalState) => {
  const store = createStore(reducer, initalState);

  let dispatch = store.dispatch;

  // 这里相当于是重新构建了 store, 但是只暴露了两个 api (dispatch、getState)
  const middlewareAPI = {
    getState: store.getState,
    dispatch: (action, ...args) => dispatch(action, ...args)
  }
  // middlewareAPI 当作 store 参数传入中间件, 中间件会返回剩余的 next => action 那部分函数
  const chain = middlewares.map(middleware => middleware(middlewareAPI));
  // chain 是中间件中属于 next 的那部分函数, 最初始的 dispatch 会作为 next 参数传入
  // compose 会将所有中间件组合起来, 其执行效果类似于 [a, b, c](arg) => a(b(c(arg)))
  dispatch = compose(...chain)(store.dispatch);

  // 已经将所有中间件串联起来, 然后替换 store中的 dispatch
  return {
    ...store,
    dispatch
  }
}

export default applyMiddlewares;