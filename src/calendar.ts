import * as Flatpickr from 'flatpickr';
import { extractDate, replaceDate } from './utils';

module Calendar {
  export interface IComponent {
    wrapper: HTMLElement;
    input: HTMLInputElement;
    styles: { [propety:string]: string | number };
    btnCssRules: string[];
  }

  export function setup(components: IComponent[]): void {
    components.forEach((component: IComponent) => {
      setupCalendarComponent(component);
    });
  }

  function createCalendarButton(): HTMLDivElement {
    const button = document.createElement('div') as HTMLDivElement;
    button.style.backgroundImage = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEJ0lEQVRYR7VXzU4cRxCuasENzbJ+AQMvAMkNaZUsPqyYGWR+7jbGD5AEP4ADuSd2ck/M+gEIK+gGIWHWEueYvIBDHiDZXYlBltB2Rd9oetVMxqzHQN9G3dP1ddVXX1Ux5VYcx6sissTMdSIaz+9/5ndXRNrMvKO1bvp3sPuo1WrVSqWyTUQwfJfrOEmSlXa73YWRFEBm/L17sYi0iGhHKXV2G0istRNE9ISZv87u6yRJMgUQAMBxHL/JXt5l5uW9vb32bRguCO+ciPzOzBUiOtZaP+AoitaY+TciEmZ+cFfGHZg4jueICA8WEXkKADvMvEhEba01Nq+s+fn5CaUU9ssSsmutbR0cHOTDCJvHCAdCDfd3iKgCNMaYLc86Dr5g5m9vGI4XWutn/h3O6yJyBgBS4H7fONJn8/z8/NQxdxiger0+PjY2NmOt3ciI91JrvV4QhpSA/wPQaDQmR0dHkRWFYRkGIOdFuPurfr8/5cLh8aAYQBRF68z8422QMjN2RETPtNYvAe5TAMB1z5Mkuee53YVlWkSaPl8WFhbq1tpVZp4QkZ2Li4um+y/TmH9FZNMYs1EKgNZaOaEKguAnZn6C749d5lwvIu+MMV9m3wizvREAz2XQcdQK9xp4BcLyMAvX29w3BO3mAKIomhER6EEPIuK/BntKqfFMwFyYvvH4c3MA+fTxAfgZEYbhF0opqBwlSTKZ8eCzAXyPNPQNWGtHlFJjIvKBmT8UpOMMFDMVGGZfAetlOOCk8kxrveYbieMYpfpIRH4wxmy6vVqtNh4EwRtmRoZAUa/U/IwXFSf116Zhljb/FEjzIH/91+B8EARHzAye5OU8xZhJ768ura8FEIbhklJqO6cB6UXux4IsWBSRU/QQOMfM0u/3Xzvl8x61bIxpXQcAaYQCNF1UGT8CIK1sWTgg6+nKqSiI+C7rAdaHAUANgNKlqlWw0MQMDLmuquCcf4bCMNxUSj3SWk8NA9Bh5j/QrZQoOsOOpsQmovvGmMlhALaY+TER/UVEWyLyp4ikDWTZxcxoYmaYeZWIUCd+McZ89ylZALTTAMHMT8sadudFhEXkFTPfJ6LTJEnmIE5DqyHiGkWR88SxiPwM9pYAwmEYLiql0E1BO5qZpqS8uAIgiiJ0wgERreWGBlyyoZR6niNdCRxp5XSiNSBlFEVo0V+JyN8w0lJKPXRtcu52bjQaEyMjI0voG8tYZubu5eVl6/DwEFzy12AMSJtSvy1XSs3t7u6+LWOo7Fk0LyICjom1diUdTFybTEQdpdTyXYHIjGP8q7p+Mx3NZmdn71Wr1ffZxIJYoQo2rbW3MpoppdLRjIigmLDZ7fV6UycnJ53BcJqB2C6S1bJuvkZBsdXu9XorMJ5Kdp4gYCgRYRKCgCB/b7zAduiAiGzt7+8jnQcZ8R9Xm/3/nWBdLwAAAABJRU5ErkJggg==)`;
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
      for(const property in component.styles) {
        (btnCalendar.style as any)[property] = component.styles[property];
      }
      setCssRules(component.btnCssRules ||[]);
      return btnCalendar;
  }

  function  setCssRules(btnCssRules: string[]):void {
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