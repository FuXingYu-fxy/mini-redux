export default function createStore(reducer, initalState = {}, enhancer = undefined) {
  // 中间件劫持
  if (enhancer) {
    return enhancer(createStore)(reducer, initalState);
  }

  let store = initalState;
  const listeners = [];

  /**
   * 
   * @param {function} fn 注册的回调函数, 状态更新后就会调用这些回调函数
   * @returns {function} 返回的函数用于取消注册
   */
  function subscribe(fn) {
    if (typeof fn !== 'function') {
      throw new Error('"subscribe" 接受的参数必须是函数');
    }
    listeners.push(fn);
    
    return function unsubscribe() {
      if (listeners.length !== 0) {
        listeners.splice(listeners.indexOf(fn), 1);
      }
    }
  }

  /**
   * 获取最新的 
   * @returns store
   */
  function getState() {
    return store;
  }

  /**
   * 更新 store
   * @param {object} action 必须拥有 type 字段
   */
  function dispatch(action) {
    if (typeof action.type === 'undefined') {
      throw new Error('action 必须有"type"字段');
    }
    // 中间件就是注入到 action 到 reducer 之间
    store = reducer(store, action);
    // store 更新后，调用回调函数
    listeners.forEach(fn => fn());
  }

  // // 首次调用时，自动初始化
  // dispatch({
  //   type: '@@REDUX_INIT'
  // })

  return {
    subscribe,
    getState,
    dispatch,
  }
}