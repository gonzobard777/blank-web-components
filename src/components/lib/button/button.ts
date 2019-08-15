import {CustomElementClassDecorator, ICustomElement} from "../../../common/web-component-globals";

enum Attributes {
  type = 'type',
  label = 'label',
  isDisabled = 'isDisabled',
  showOverlay = 'showOverlay'
}

@CustomElementClassDecorator({
  selector: ZButton.TAG_NAME,
  styleRequire: require('./style.less'),
})
export class ZButton extends HTMLElement implements ICustomElement {
  static TAG_NAME = 'z-button';
  templateNode: HTMLTemplateElement;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return Object.keys(Attributes); // список атрибутов для отслеживания
  }

  render() {
    const type = this.getAttribute(Attributes.type);
    const label = this.getAttribute(Attributes.label);
    let isDisabled = this.getAttribute(Attributes.isDisabled) === 'true';
    const showOverlay = this.getAttribute(Attributes.showOverlay) === 'true';

    if (showOverlay) {
      isDisabled = true;
    }

    this.templateNode.innerHTML = `
      <button
          class="z-button__button"
          type="${type ? type : 'button'}"
          ${isDisabled ? 'disabled' : ''}
      >${label ? label : 'Ok'}</button>
      
      ${showOverlay ? `
      <div class="z-button-overlay"></div>
      ` : ''}
    `;
    this.innerHTML = '';
    this.appendChild(this.templateNode.content.cloneNode(true));
  }
}
