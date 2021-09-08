import React from 'react';
import { StoreContext } from './StoreContext';
const connect = (mapStateToProps, mapDispatchToProps) => WrappedComponent => {
  return class extends React.Component {
    static contextType = StoreContext;
    state = {
      "@@REDUX_UPDATE": {},
    }
    store = this.context;
    updateView = () => {
      this.setState({
        "@@REDUX_UPDATE": {}
      })
    }
    componentDidMount() {
      // 组件挂载时，订阅更新函数
      this.unsubscribe = this.store.subscribe(this.updateView);
    }

    // 卸载时，取消订阅
    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const mappedState = mapStateToProps 
      ? mapStateToProps(this.store.getState(), this.props)
      : {};

      const mappedDispatch = mapDispatchToProps
      ? mapDispatchToProps(this.store.dispatch, this.props)
      : {};
      return <WrappedComponent {...this.props} {...mappedState} {...mappedDispatch} />
    }
  }
}
export default connect;