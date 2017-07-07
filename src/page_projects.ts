import * as Moment from 'moment';
import { extractDate } from './utils';
import Calendar from './calendar';

module PageProjects {
  const THRESHOLD_GREEN = 7;
  const THRESHOLD_YELLOW = 3;
  const THRESHOLD_RED = 0;
  const COLOR_GREEN = '#e1fbe2';
  const COLOR_YELLOW = '#fbfbe2';
  const COLOR_RED = '#fbe1e2';
  const COLOR_DANGER = '#fd6565';
  const COLOR_DEFAULT = '#000000';
  
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

  let _columsObserver: MutationObserver;
  let _popupObserver: MutationObserver;

  export function setup(): void {
    const columns = getColumuns();

    _columsObserver = new MutationObserver(onColumsMutationListener);
    _popupObserver = new MutationObserver(onPopupMutationListener);

    for(let i = 0, column: HTMLDivElement; column = columns[i]; i++) {
      _columsObserver.observe(column.querySelector('.js-project-column-cards') as Node, columsObserverConfig);
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

  function paintCard(card: HTMLDivElement, color: string): void {
    card.style.setProperty('background', color, 'important');
  }

  function getColor(dateStr: string): string {
    const now = Moment();
    const diff = now.diff(dateStr, "days");
    let color = COLOR_DEFAULT;
    if (diff > 0) {
      color = COLOR_DANGER;
    } else if (diff >= -THRESHOLD_RED) {
      color = COLOR_RED;
    } else if (diff >= -THRESHOLD_YELLOW) {
      color = COLOR_YELLOW;
    } else if (diff >= -THRESHOLD_GREEN) {
      color = COLOR_GREEN;
    }
    return color;
  }

  function setupAddNoteCalendar(): void  {
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
      if(mutation.type !== 'childList') return;
      for(let i = 0, item: HTMLElement; item = mutation.addedNodes[i] as HTMLElement; ++i) {
        if(!(item instanceof HTMLDivElement)) continue;
        if(!item.classList.contains('js-note-form-container')) continue;
        const form = item.querySelector('form') as HTMLFormElement;
        const cardId = form.dataset.cardId;
        Calendar.setup([
          {
            wrapper: form,
            input: form.querySelector(`#card_note_${cardId}`) as HTMLInputElement,
            styles: { 
              position: 'absolute',
              top: '-10px',
              left: '40px'
            },
            btnCssRules: []
          }
        ]);
      }
    });
  }

  function onColumsMutationListener(mutations: MutationRecord[], observer: MutationObserver): void {
    mutations.forEach((mutation) => {
      if(mutation.type !== 'childList') return;
      for(let i = 0, item: HTMLElement; item = mutation.addedNodes[i] as HTMLElement; ++i) {
        if(!(item instanceof HTMLDivElement)) continue;
        if(!item.classList.contains('project-card')) continue;
        const title = getCardTitle(item);
        const dateStr = extractDate(title);
        if(!dateStr) continue;
        const color = getColor(dateStr);
        if(color === COLOR_DEFAULT) continue;
        paintCard(item, color);
      }
    });
  }
}
export default PageProjects;