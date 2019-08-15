import {CustomElementClassDecorator, ICustomElement} from "../../common/web-component-globals";
import {ZInput} from "../lib/input/input";
import {getLocationBase} from "../../common/globals";
import {AppRoutes} from "../root/root";

@CustomElementClassDecorator({
  selector: ZLoginForm.TAG_NAME,
  styleRequire: require('./style.less'),
  extends: 'form'
})
export class ZLoginForm extends HTMLFormElement implements ICustomElement {
  static TAG_NAME = 'z-login-form';
  templateNode: HTMLTemplateElement;

  private username: ZInput;
  private password: ZInput;

  private usernameElemClassName;
  private passwordElemClassName;

  private errorMessage;
  private showOverlay;

  constructor() {
    super();
    // You cannot use the constructor in any meaningful way if you want to ensure API consistency.
    // If you need a reliable entry point to setup your custom builtins use the connectedCallback method instead of the constructor.
  }

  connectedCallback() {
    this.usernameElemClassName = `${ZLoginForm.TAG_NAME}__username`; // z-login-form__username
    this.passwordElemClassName = `${ZLoginForm.TAG_NAME}__password`; // z-login-form__password

    this.errorMessage = '';
    this.showOverlay = false;
  }

  addEventListeners() {
    this.username.addEventListener(this.username.isModifiedEventName, this.handleIsFormControlModified.bind(this));
    this.password.addEventListener(this.password.isModifiedEventName, this.handleIsFormControlModified.bind(this));
  }

  removeEventListeners() {
    this.username.removeEventListener(this.username.isModifiedEventName, this.handleIsFormControlModified.bind(this));
    this.password.removeEventListener(this.password.isModifiedEventName, this.handleIsFormControlModified.bind(this));
  }

  private handleIsFormControlModified(event) {
    if (this.errorMessage) {
      this.errorMessage = '';
      this.render(this.username, this.password);
    }
  }

  render(username?: ZInput, password?: ZInput) {
    this.onsubmit = this.serverExchange;
    const isError = !!this.errorMessage;

    this.templateNode.innerHTML = `
            <z-input class="z-form__input  ${this.usernameElemClassName}"
                      type="text"
                      label="Username"
                      ${username == undefined ? '' : `value="${username.value}"`} 
                      ${isError ? `isError="true"` : ''}
                      ${username === undefined ? '' : (username.isFocused ? `isFocused="true"` : '')}
                      ${username === undefined ? '' : `caretPosition="${username.caretPosition}"`}
                      dispatchEventPrefix="${ZLoginForm.TAG_NAME}" 
                      minlength="3"
                      maxlength="100"
                      required="true"
            ></z-input>
            
            <z-input class="z-form__input  ${this.passwordElemClassName}"
                      type="password" 
                      label="Password"
                      ${password == undefined ? '' : `value="${password.value}"`} 
                      ${isError ? `isError="true"` : ''}
                      ${password === undefined ? '' : (password.isFocused ? `isFocused="true"` : '')}
                      ${password === undefined ? '' : `caretPosition="${password.caretPosition}"`}
                      dispatchEventPrefix="${ZLoginForm.TAG_NAME}" 
                      autocomplete="current-password"
                      required="true"
            ></z-input>
            
            <div class="z-form__submit-container  z-login-form__submit-container">
                <z-button
                    type="submit"
                    label="Войти"
                    showOverlay="${this.showOverlay}"
                ></z-button>
                <div class="z-form__error-text-wrap">
                    <span class="z-form__error-text">${this.errorMessage}</span>
                </div>
            </div>
            
            <div class="z-login-form__restore-req">
                <p class="z-root__help">
                    <a href="${getLocationBase() + '/' + AppRoutes.restoreReq}">Восстановить пароль</a>
                </p>
            </div>
        `;
    this.innerHTML = '';
    this.appendChild(this.templateNode.content.cloneNode(true));

    this.username = this.querySelector(`.${this.usernameElemClassName}`) as ZInput;
    this.password = this.querySelector(`.${this.passwordElemClassName}`) as ZInput;

    this.addEventListeners();
  }

  private async serverExchange(event) { // ранее назначено: this.onsubmit = this.serverExchange;
    event.preventDefault();
    this.showOverlay = true;
    this.errorMessage = '';
    this.render(this.username, this.password);
    // await this.serverExchanger
    //   .Login({
    //     login: this.username.value,
    //     password: this.password.value
    //   })
    //   .then(token => {
    //     this.showOverlay = false;
    //     console.log(token);
    //     location.assign(`${location.origin}/some/path#${token}`);
    //   })
    //   .catch((err: Error) => {
    //     this.showOverlay = false;
    //     this.errorMessage = err.message;
    //     this.render(this.username, this.password);
    //   });
  }
}
