import {CustomElementClassDecorator, ICustomElement} from "../../common/web-component-globals";
import {ZLoginForm} from "../login-form/login-form";
import {getLocationBase} from "../../common/globals";

export enum AppRoutes {
  index = '',
  login = 'login',
  registerReq = 'register-req',
  register = 'register',
  restoreReq = 'restore-req',
  restore = 'restore'
}

@CustomElementClassDecorator({
  selector: ZRoot.TAG_NAME,
  styleRequire: require('./style.less'),
})
export class ZRoot extends HTMLElement implements ICustomElement {
  static TAG_NAME = 'z-root';
  templateNode: HTMLTemplateElement;

  private routerOutletElemClassName = 'z-root__form-container';

  constructor() {
    super();
  }

  private static getContent() {
    const gmFormClassName = 'z-form';
    switch (location.pathname.split('/').pop()) {
      case AppRoutes.index: {
        const elem = document.createElement('div');
        elem.innerHTML = `
          <p class="z-form__error-info">
              Index page. You can go to <a href="${getLocationBase() + '/' + AppRoutes.login}">Login</a> page
          </p>
        `;
        return elem;
      }
      case AppRoutes.login: {
        const elem = document.createElement('form', {is: ZLoginForm.TAG_NAME}) as ZLoginForm;
        elem.classList.add(gmFormClassName);
        elem.classList.add(ZLoginForm.TAG_NAME);
        return elem;
      }
      default: {
        const elem = document.createElement('div');
        elem.innerHTML = `
          <p class="z-form__error-info">
              Неизвестный URL. <a href="${getLocationBase() + '/' + AppRoutes.index}">Index</a> page
          </p>
        `;
        return elem;
      }
    }
  }

  addEventListeners() {
  }

  removeEventListeners() {
  }

  render() {
    this.templateNode.innerHTML = `
      <div class="z-root__header">
       Header
      </div>
      <div class="${this.routerOutletElemClassName}">
        <div>
          <p class="z-root__help">Additional text</p>
        </div>
      </div>
    `;
    this.innerHTML = '';
    this.appendChild(this.templateNode.content.cloneNode(true)); // root элемент добавлен в DOM

    const routerOutletElem = this.querySelector(`.${this.routerOutletElemClassName}`); // получаю 'якорь' вставки
    routerOutletElem.insertBefore(ZRoot.getContent(), routerOutletElem.children[0]); // вставляю требуемый компонент(by url path) в самое начало якоря

    this.addEventListeners();
  }
}
