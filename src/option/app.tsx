import * as React from 'react';
import * as ReactDom from 'react-dom';
import Store from '../common/storage';
import Index from './containers/Index';

function changeState(store: Store.IStore): void {
  Store.setStore(store)
    .then(() => {
      render(store);
    });
}

function render(store: Store.IStore): void { 
  ReactDom.render(
    <Index
      store={store}
      changeState={changeState}
    />,
    document.getElementById('app') as HTMLElement
  )
}

Store.getStore().then((store: Store.IStore) => { 
  render(store);
})
