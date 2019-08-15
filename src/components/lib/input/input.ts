import {CustomElementClassDecorator, ICustomElement} from "../../../common/web-component-globals";
import {randomStr} from "../../../common/globals";

enum Attributes {
  value = 'value',
  type = 'type',
  label = 'label',
  isError = 'isError',
  isFocused = 'isFocused',
  caretPosition = 'caretPosition',  // позиция курсора
  dispatchEventPrefix = 'dispatchEventPrefix', // префикс нужен, чтобы не ловить чужие события
  minlength = 'minlength',
  maxlength = 'maxlength',
  placeholder = 'placeholder',
  autocomplete = 'autocomplete',
  spellcheck = 'spellcheck',
  required = 'required'
}

@CustomElementClassDecorator({
  selector: ZInput.TAG_NAME,
  styleRequire: require('./style.less')
})
export class ZInput extends HTMLElement implements ICustomElement {
  static TAG_NAME = 'z-input';
  templateNode: HTMLTemplateElement;

  private input: HTMLInputElement;
  private inputId = randomStr(5);
  private dispatchEventPrefix: string = '';

  constructor() {
    super();
  }

  get value() {
    return this.input && this.input.value || '';
  }

  get isModifiedEventName(): string {
    return `${this.dispatchEventPrefix}-isModified`;
  }

  get isFocused(): boolean {
    return this.inputId === document.activeElement.id;
  }

  get caretPosition(): number {
    return this.input.selectionStart;
  }

  static get observedAttributes() {
    return Object.keys(Attributes); // список атрибутов для отслеживания
  }

  private handleInput(event) {
    this.dispatchEvent(new CustomEvent(this.isModifiedEventName));
  }

  addEventListeners() {
    this.input.addEventListener('input', this.handleInput.bind(this));
  }

  removeEventListeners() {
    this.input.addEventListener('input', this.handleInput.bind(this));
  }

  render() {
    const value = this.getAttribute(Attributes.value);
    const label = this.getAttribute(Attributes.label);
    const type = this.getAttribute(Attributes.type);
    const isError = this.getAttribute(Attributes.isError);
    const isFocused = this.getAttribute(Attributes.isFocused);
    const caretPosition = +this.getAttribute(Attributes.caretPosition) || this.value.length || 0;
    this.dispatchEventPrefix = this.getAttribute(Attributes.dispatchEventPrefix) || '';
    const minlength = this.getAttribute(Attributes.minlength);
    const maxlength = this.getAttribute(Attributes.maxlength);
    const placeholder = this.getAttribute(Attributes.placeholder);
    const autocomplete = this.getAttribute(Attributes.autocomplete);
    const spellcheck = this.getAttribute(Attributes.spellcheck);
    const required = this.getAttribute(Attributes.required);

    this.templateNode.innerHTML = `
      <label 
          class="z-input__label  ${isError ? 'z-input__label--error' : ''}"
          for="${this.inputId}"
      >${label ? label : ''}</label>
      <input
          class="z-input__input  ${isError ? 'z-input__input--error' : ''}"
          ${value === null ? '' : `value="${value}"`}
          type="${type ? type : 'text'}"
          ${minlength === null ? '' : `minlength=${minlength}`}
          ${maxlength === null ? '' : `maxlength=${maxlength}`}
          placeholder="${placeholder ? placeholder : ''}"
          autocomplete="${autocomplete ? 'on' : 'off'}"
          spellcheck="${spellcheck ? 'true' : 'false'}"
          ${required ? 'required' : ''}
          id="${this.inputId}"
      />
    `;
    this.innerHTML = '';
    this.appendChild(this.templateNode.content.cloneNode(true));

    this.input = this.querySelector(`.${ZInput.TAG_NAME}__input`) as HTMLInputElement;
    if (isFocused) {
      this.input.focus();
      if (caretPosition) { // после фокуса может потребоваться спозиционаировать курсор
        this.input.setSelectionRange(caretPosition, caretPosition);
      }
    }

    this.addEventListeners();
  }
}
