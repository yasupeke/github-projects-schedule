module Store {
  export interface IColor { 
    r: number;
    g: number;
    b: number;
    a?: number;
  }

  export interface IBeforeDaysColor {
    beforeDays: number;
    color: IColor;
  }

  export interface IStore {
    beforeDaysColors: { [itemKey: string]: Store.IBeforeDaysColor };
    ignoreColumns: { [itemKey: string]: string };
  }

  const defaultStore: IStore = {
    beforeDaysColors: {
      [1]: {
        beforeDays: 7,
        color: {
          r: 193,
          g: 225,
          b: 197,
          a: 1
        }
      },
      [2]: {
        beforeDays: 3,
        color: {
          r: 254,
          g: 243,
          b: 189,
          a: 1
        }
      },
      [3]: {
        beforeDays: 0,
        color: {
          r: 250,
          g: 208,
          b: 195,
          a: 1
        }
      },
      [4]: {
        beforeDays: -1,
        color: {
          r: 184,
          g: 0,
          b: 0,
          a: 1
        }
      }
    },
    ignoreColumns: {
      [5]: '^([D|d][O|o][N|n][E|e]).*'
    }
  };

  export async function getStore(): Promise<IStore> {
    return new Promise((resolve: (store: IStore) => void) => {
      chrome.storage.sync.get((store: IStore) => {
        if (Object.keys(store).length === 0) { 
          store = defaultStore;
        }
        resolve(store);
      });
    });
  }

  export async function setStore(store: IStore): Promise<{}> { 
    return new Promise((resolve: () => void) => {
      chrome.storage.sync.set(store, () => { 
        resolve();
      });
    });
  }
}
export default Store;