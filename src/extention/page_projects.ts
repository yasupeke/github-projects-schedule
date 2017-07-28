import * as Moment from 'moment';
import Store from '../common/storage';
import { extractDate } from './utils';
import Calendar from './calendar';

module PageProjects {
  // オブザーバの設定
  const columsObserverConfig = {
    childList: true,
    attributes: false,
    characterData: false,
    subtree: false,
    attributeOldValue: false,
    characterDataOldValue: false
  };

  const popupObserverConfig = {
    childList: true,
    attributes: false,
    characterData: false,
    subtree: true,
    attributeOldValue: false,
    characterDataOldValue: false
  };

  let _beforeDaysColors: Store.IBeforeDaysColor[];
  let _columsObserver: MutationObserver;
  let _popupObserver: MutationObserver;

  export function setup(store: Store.IStore): void {
    const copyStore = Object.assign({}, store);
    const columns = getColumuns();
    const regIgnoreColumns: RegExp[] = [];

    _columsObserver = new MutationObserver(onColumsMutationListener);
    _popupObserver = new MutationObserver(onPopupMutationListener);
    _beforeDaysColors = Object.keys(copyStore.beforeDaysColors)
      .map((itemKey: string) => {
        return copyStore.beforeDaysColors[itemKey];
      })
      .sort((beforeDaysColor1: Store.IBeforeDaysColor, beforeDaysColor2: Store.IBeforeDaysColor) => {
        if (beforeDaysColor1.beforeDays < beforeDaysColor2.beforeDays) {
          return -1;
        } else if (beforeDaysColor1.beforeDays < beforeDaysColor2.beforeDays) {
          return 1;
        } else { 
          return 0;
        }
      });

    for (const itemKey in copyStore.ignoreColumns) {
      regIgnoreColumns.push(new RegExp(store.ignoreColumns[itemKey]));
    }

    for (let i = 0, column: HTMLDivElement; column = columns[i]; i++) {
      const columnNameElem = column.querySelector('.js-project-column-name') as HTMLSpanElement;
      const columnName = columnNameElem && columnNameElem.innerText;
      const isIgnore = regIgnoreColumns.some((egIgnoreColumn) => {
        return egIgnoreColumn.test(columnName);
      });
      if (isIgnore) continue;
      const targetColumn = column.querySelector('.js-project-column-cards');
      _columsObserver.observe(targetColumn as Node, columsObserverConfig);
      drawColor((targetColumn as HTMLElement).childNodes);
    }

    _popupObserver.observe(document.querySelector('#facebox') as Node, popupObserverConfig);

    setupAddNoteCalendar();
  }

  export function destroy(): void {
    _columsObserver.disconnect();
    _popupObserver.disconnect();
  }

  function getColumuns(): NodeListOf<HTMLDivElement> {
    return document.querySelectorAll('.project-column') as NodeListOf<HTMLDivElement>;
  }

  function getCardTitle(card: HTMLDivElement): string {
    const title = new Function(`return ${card.dataset.cardTitle}`)();
    return title[0];
  }

  function paintCard(card: HTMLDivElement, color: Store.IColor): void {
    card.style.setProperty('background', `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a == null ? 1 : color.a})`, 'important');
  }

  function getColor(dateStr: string): Store.IColor | null {
    const now = Moment();
    const diff = Math.floor(now.diff(dateStr, "days", true));
    let color: Store.IColor | null = null;
    _beforeDaysColors.forEach((beforeDaysColor: Store.IBeforeDaysColor) => {
      if (diff >= -beforeDaysColor.beforeDays) {
        color = beforeDaysColor.color;
      }
    });
    return color;
  }

  function setupAddNoteCalendar(): void {
    const noteNewForms = document.querySelectorAll('[class="js-project-note-form"]');
    const calendarComponents: Calendar.IComponent[] = [];
    noteNewForms.forEach((noteForms: HTMLFormElement) => {
      const input = noteForms.querySelector('.form-control.input-block.js-quick-submit.js-size-to-fit') as HTMLInputElement;
      input.style.paddingLeft = '40px';
      calendarComponents.push({
        wrapper: noteForms,
        input,
        styles: {
          position: 'absolute',
          top: '10px',
          left: '4px'
        },
        btnCssRules: []
      });
    });
    Calendar.setup(calendarComponents);
  }

  function onPopupMutationListener(mutations: MutationRecord[], observer: MutationObserver): void {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList') return;
      for (let i = 0, item: HTMLElement; item = mutation.addedNodes[i] as HTMLElement; ++i) {
        let wrapper: HTMLElement;
        let input: HTMLInputElement;
        let styles: { [property: string]: string };
        if ((item instanceof HTMLDivElement) && item.classList.contains('js-note-form-container')) {
          wrapper = item.querySelector('form') as HTMLFormElement;
          input = wrapper.querySelector(`#card_note_${wrapper.dataset.cardId}`) as HTMLInputElement;
          styles = {
            position: 'absolute',
            top: '-10px',
            left: '40px'
          };
        } else if ((item instanceof HTMLFormElement) && item.classList.contains('js-convert-note-to-issue-form')) {
          wrapper = item as HTMLFormElement;
          input = wrapper.querySelector('input[name="title"]') as HTMLInputElement;
          styles = {
            position: 'absolute',
            top: '-362px',
            left: '40px'
          };
        } else {
          continue;
        }
        Calendar.setup([
          {
            wrapper,
            input,
            styles,
            btnCssRules: []
          }
        ]);
      }
    });
  }

  function onColumsMutationListener(mutations: MutationRecord[], observer: MutationObserver): void {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList') return;
      drawColor(mutation.addedNodes as NodeList);
    });
  }

  function drawColor(items: NodeList): void { 
    for (let i = 0, item: HTMLElement; item = items[i] as HTMLElement; ++i) {
      if (!(item instanceof HTMLDivElement)) continue;
      if (!item.classList.contains('project-card')) continue;
      const title = getCardTitle(item);
      const dateStr = extractDate(title);
      if (!dateStr) continue;
      const color = getColor(dateStr);
      if (!color) continue;
      paintCard(item, color);
    }
  }
}
export default PageProjects;