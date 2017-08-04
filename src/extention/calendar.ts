import * as Flatpickr from 'flatpickr';
import { extractDate, replaceDate } from './utils';

module Calendar {
  let _calendars: Flatpickr[] = [];

  export interface IComponent {
    wrapper: HTMLElement;
    input: HTMLInputElement;
    styles: { [propety: string]: string | number };
    btnCssRules: string[];
  }

  export function setup(components: IComponent[]): void {
    components.forEach((component: IComponent) => {
      setupCalendarComponent(component);
    });
  }

  export function destory(): void {
    _calendars.forEach((calendar: Flatpickr) => {
      calendar.destroy();
    });
  }

  function createCalendarButton(): HTMLDivElement {
    const button = document.createElement('div') as HTMLDivElement;
    button.style.backgroundImage = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC30lEQVRYR+1XS3LaQBDtHjZ8FuEGcU4QOEFgBxJV8Q2MTxBzAsMJgm8AJ4hdhQZ2lk8QcgOOQBaIldSup5pRBEEgZLvKC2ujqpnunjevv8OU43Mcx2fmbyJyrbWeHFNxHKfBzI8isgqCoO37/vqYPJ86v9frtUTkEXIwqrX+cgLAPTN/NzIDz/PGuQB0Op0LpdQVM7esgogMlFJ1CwDrnuex4zhjZv66b9jzvLZlywAeEREA/UzZ9KMomi4WixXWYgYcx+kboXraKDO3jaGYgRSA2CUHAABcsiciI6WUn76A0VnjcnAn4+alUuk3Ee0cbikUERjEPlzwoLW+dF13SUSHGLDs/DDy10qp1QEA2F6HYdiEwpCZbw/5SUSWWutmt9u9ZOZGFEUTuMQCOqAz2Gw2k2q1esPMa/jfdV0E7VWG/dEOZRlC90Q0CoJgVa1WQTv8f5ERWKB2GATBtFwu10ulEpi4yQpCEXk6CeBUlrxk/30BABoi8l9yozN0W6aw/XMBUkZrPTzDSGFRG/g7LsgDAIrIRnuy1hqFBnUka71PRJ+tvC1AhQG4rpscbosS/lnr6aIUVz3m9mw28z8AFGbA+DoJPhu0R9YRA0nRQiVFEyoMoHDY7ykeBdBqteqVSiVpNMz8V2uN5kOYDcIwTAJxPp+jdux86Bvb7dbHIILhREQ+WYHtdvvHrMf952AapgcQ09GetNbxjJAV7fYAOw0R0YPnef1CWXAuADBWq9VuwzC8U0phbuAgCBrmpjtzQ640PBcAKFdK/bIsiEjTuqwQA6ARLTflWMwEcUuFwbTDrWsAOooitO2b9NCK0Y2IYM9+2F++SRZgsrJz3qlseRMApw5N7x8FcG4M5MmOfXAfAN4dA5hyMb1OUb3OCaaisnZUF5E73nv7DfEQKWo4jx6efswcj36ojPZpZlnIY+NVZHB7FLjkdWxeP3jR/Pfme5UTjRF0QBEZz+dzVE56Bk+8Dcpk16h4AAAAAElFTkSuQmCC)`;
    button.classList.add('btn-calendar');
    button.style.position = 'relative';
    button.style.width = '32px'
    button.style.height = '32px'
    return button;
  }

  function setupCalendarComponent(component: IComponent): HTMLDivElement {
    const btnCalendar = createCalendarButton();
    component.wrapper.style.position = component.wrapper.style.position || 'relative';
    component.wrapper.appendChild(btnCalendar);

    const calendar = new Flatpickr(
      btnCalendar,
      {
        onOpen: () => {
          const dateStr = extractDate(component.input.value);
          dateStr && calendar.setDate(dateStr);
        },
        onChange: (selectedDates: Date[], dateStr: string, instance: Flatpickr) => {
          const title = component.input.value;
          component.input.value = replaceDate(title, dateStr);
        }
      }
    );
    for (const property in component.styles) {
      (btnCalendar.style as any)[property] = component.styles[property];
    }
    setCssRules(component.btnCssRules || []);
    _calendars.push(calendar);
    return btnCalendar;
  }

  function setCssRules(btnCssRules: string[]): void {
    const style = document.createElement('style') as HTMLStyleElement;
    document.head.appendChild(style);

    const styleSheet = style.sheet as CSSStyleSheet;
    style.type = 'text/css';
    btnCssRules.forEach((rules: string) => {
      styleSheet.insertRule(rules, styleSheet.cssRules.length);
    });
    styleSheet.insertRule('.btn-calendar:active { transform: scale(0.8); }', styleSheet.cssRules.length);
  }
}
export default Calendar;