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

  let uuids: string[] = [];
  const defaultStore: IStore = {
    beforeDaysColors: {
      [uuid()]: {
        beforeDays: 7,
        color: {
          r: 193,
          g: 225,
          b: 197,
          a: 1
        }
      },
      [uuid()]: {
        beforeDays: 3,
        color: {
          r: 254,
          g: 243,
          b: 189,
          a: 1
        }
      },
      [uuid()]: {
        beforeDays: 0,
        color: {
          r: 250,
          g: 208,
          b: 195,
          a: 1
        }
      },
      [uuid()]: {
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
      [uuid()]: '^([D|d][O|o][N|n][E|e]).*'
    }
  };

  function s4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  export function uuid(): string {
    let u = (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
    if (uuids.indexOf(u) >= 0) {
      u = uuid();
    } else { 
      uuids.push(u);
    }
    return u;
  }

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