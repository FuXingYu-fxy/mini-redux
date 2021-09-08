import {createContext} from 'react';
const StoreContext = createContext(null);
const Provider = StoreContext.Provider;

export {
  StoreContext,
  Provider,
}
