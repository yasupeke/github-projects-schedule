import * as React from 'react';
import Store from '../../common/storage';
import InputBeforeDays from '../components/input_before_days';

interface IProps extends React.Props<Index> {
  store: Store.IStore;
  changeState: (store: Store.IStore) => void;
}

const listStyles: React.CSSProperties = {
  listStyle: 'none'
};

const listItemStyles: React.CSSProperties = {
  display: 'flex',
  marginBottom: '4px'
};

const listItemButtonStyles: React.CSSProperties = {
  marginLeft: '8px'
};

const inputIgnoreStyles: React.CSSProperties = {
  width: '240px'
};

export default class Index extends React.Component<IProps, {}> { 
  constructor(props: IProps) { 
    super(props);
  }

  private isSameBeforeDays(beforeDaysColor: Store.IBeforeDaysColor): boolean { 
    let isSame = false;
    for (const _itemKey in this.props.store.beforeDaysColors) {
      const _beforeDaysColor = this.props.store.beforeDaysColors[_itemKey];
      if (_beforeDaysColor.beforeDays === beforeDaysColor.beforeDays) {
        isSame = true;
        break;
      }
    }
    return isSame;
  }

  private isSameIgnore(ignoreColums: string): boolean {
    let isSame = false;
    for (const _itemKey in this.props.store.ignoreColumns) {
      const _ignoreColums = this.props.store.ignoreColumns[_itemKey];
      if (_ignoreColums === ignoreColums) {
        isSame = true;
        break;
      }
    }
    return isSame;
  }

  private handleAddColor(itemKey: string): void { 
    const copyStore = Object.assign({}, this.props.store);
    const addBeforeDaysColor = (this.refs[itemKey] as InputBeforeDays).getData();
    if (this.isSameBeforeDays(addBeforeDaysColor)) { 
      return;
    }
    copyStore.beforeDaysColors[itemKey] = addBeforeDaysColor;
    this.props.changeState(copyStore);
  }

  private handleChangeColor(itemKey: string): void {
    const copyStore = Object.assign({}, this.props.store);
    copyStore.beforeDaysColors[itemKey] = (this.refs[itemKey] as InputBeforeDays).getData();
    this.props.changeState(copyStore);
  }

  private handleDeleteColor(itemKey: string): void {
    const copyStore = Object.assign({}, this.props.store);
    delete copyStore.beforeDaysColors[itemKey];
    this.props.changeState(copyStore);
  }

  private handleAddIgnore(itemKey: string): void {
    const copyStore = Object.assign({}, this.props.store);
    const addIgnoreColumn = (this.refs[itemKey] as HTMLInputElement).value;
    if (this.isSameIgnore(addIgnoreColumn) || addIgnoreColumn.length === 0) { 
      return;
    }
    copyStore.ignoreColumns[itemKey] = addIgnoreColumn;
    this.props.changeState(copyStore);
  }

  private handleChangeIgnore(itemKey: string): void {
    const copyStore = Object.assign({}, this.props.store);
    copyStore.ignoreColumns[itemKey] = (this.refs[itemKey] as HTMLInputElement).value;
    this.props.changeState(copyStore);
  }

  private handleDeleteIgnore(itemKey: string): void {
    const copyStore = Object.assign({}, this.props.store);
    delete copyStore.ignoreColumns[itemKey];
    this.props.changeState(copyStore);
  }

  public render(): JSX.Element {
    const now = Date.now();
    const beforeDaysColors = Object.assign({}, this.props.store.beforeDaysColors);
    const ignoreColumns = Object.assign({}, this.props.store.ignoreColumns);
    beforeDaysColors[now] = {
      beforeDays: 0,
      color: {
        r: 255,
        g: 255,
        b: 255,
        a: 1
      }
    };
    ignoreColumns[now + 1] = '';
    return (
      <div>
        <section>
          <h1>Color Settings</h1>
          <ul style={listStyles}>
            {
              (() => {
                const itemKeys = Object.keys(beforeDaysColors);
                const itemCnt = itemKeys.length;
                return itemKeys.map((itemKey: string, idx: number) => {
                  const beforeDaysColor = beforeDaysColors[itemKey];
                  return (
                    <li key={itemKey} style={listItemStyles}>
                      <InputBeforeDays
                        ref={itemKey}
                        beforeDaysColor={beforeDaysColor}
                      />
                      {
                        (() => {
                          if (itemCnt === idx + 1) {
                            return (
                              <button
                                type="button"
                                style={listItemButtonStyles}
                                onClick={() => { this.handleAddColor(itemKey) }}>
                                Add
                            </button>
                            );
                          } else {
                            return (
                              <div>
                                <button
                                  type="button"
                                  style={listItemButtonStyles}
                                  onClick={() => { this.handleChangeColor(itemKey) }}>
                                  Edit
                              </button>
                                <button
                                  type="button"
                                  style={listItemButtonStyles}
                                  onClick={() => { this.handleDeleteColor(itemKey) }}>
                                  Delete
                              </button>
                              </div>
                            );
                          }
                        })()
                      }
                    </li>
                  );
                })
              })()
            }
          </ul>
        </section>
        <section>
          <h1>Ignore Column Settings</h1>
          <ul style={listStyles}>
            {
              (() => { 
                const itemKeys = Object.keys(ignoreColumns);
                const itemCnt = itemKeys.length;
                return itemKeys.map((itemKey: string, idx: number) => {
                  const ignoreColumn = ignoreColumns[itemKey];
                  return (
                    <li key={itemKey} style={listItemStyles}>
                      <input
                        ref={itemKey}
                        defaultValue={ignoreColumn}
                        style={inputIgnoreStyles}
                      />
                      {
                        (() => {
                          if (itemCnt === idx + 1) {
                            return (
                              <button
                                type="button"
                                style={listItemButtonStyles}
                                onClick={() => { this.handleAddIgnore(itemKey) }}>
                                Add
                            </button>
                            );
                          } else {
                            return (
                              <div>
                                <button
                                  type="button"
                                  style={listItemButtonStyles}
                                  onClick={() => { this.handleChangeIgnore(itemKey) }}>
                                  Edit
                              </button>
                                <button
                                  type="button"
                                  style={listItemButtonStyles}
                                  onClick={() => { this.handleDeleteIgnore(itemKey) }}>
                                  Delete
                              </button>
                              </div>
                            );
                          }
                        })()
                      }
                    </li>
                  );
                });
              })()
            }
          </ul>
        </section>
      </div>
    );
  }
}