import {isEqualsSimple} from "./globals";

export function initDocumentHeadStyleNode(styleFileContent: any[], tagName: string): HTMLStyleElement {
    const styleText = 'style';
    const id = `${styleText}__${tagName}`;
    let styleNode = document.getElementById(id) as HTMLStyleElement;

    if (!styleNode) { // стили компонента добавляется 1 раз
        styleNode = document.createElement(styleText) as HTMLStyleElement;
        styleNode.setAttribute('id', id);
        styleNode.innerText = styleFileContent.toString();
        document.head.appendChild(styleNode);
    }
    return styleNode;
}

interface ICustomElementClassDecoratorData {
    selector: string;
    styleRequire?: any[];
    extends?: string;
}

//
// Стандарт пользовательских элементов предполагает следующий Life cycle callbacks:
//
// class MyElement extends HTMLElement {
//     constructor() {
//         super();
//         // элемент создан
//     }
//
//     connectedCallback() {
//         // браузер вызывает этот метод при добавлении элемента в документ
//         // (может вызываться много раз, если элемент многократно добавляется/удаляется)
//     }
//
//     disconnectedCallback() {
//         // браузер вызывает этот метод при удалении элемента из документа
//         // (может вызываться много раз, если элемент многократно добавляется/удаляется)
//     }
//
//     static get observedAttributes() {
//         return [/* массив имён атрибутов для отслеживания их изменений */];
//     }
//
//     attributeChangedCallback(name, oldValue, newValue) {
//         // вызывается при изменении одного из перечисленных выше атрибутов
//     }
//
//     adoptedCallback() {
//         // вызывается, когда элемент перемещается в новый документ
//         // (происходит в document.adoptNode, используется очень редко)
//     }
// }
//
//
// Особенность реализации пользовательских элементов(extends HTML..., static get observedAttributes())
// вынуждает делать декоратор(здесь это похоже на множественное наследование), чтобы хоть как-то повторно использовать код
//
export const CustomElementClassDecorator = (decoratorData: ICustomElementClassDecoratorData) =>
    (classConstructor: any) => {
        const prototype = classConstructor.prototype;

        prototype.connectedCallback = function () {
            this.templateNode = document.createElement('template') as HTMLTemplateElement;
            if (decoratorData.styleRequire) {
                this.styleNode = initDocumentHeadStyleNode(decoratorData.styleRequire, classConstructor.TAG_NAME);
            }
            this.render();
        };

        prototype.disconnectedCallback = function () {
            if (this.removeEventListeners) {
                this.removeEventListeners();
            }
        };

        prototype.attributeChangedCallback = function (name, oldValue, newValue) {
            if (isEqualsSimple(oldValue, newValue)) { // перерендер только, если входящие данные изменились
                this.render();
            }
        };

        window.customElements.define( // добавить новый пользовательский элемент в CustomElementRegistry браузера
            decoratorData.selector,
            classConstructor,
            decoratorData.extends ? {extends: decoratorData.extends} : {}
        );
    };

export interface ICustomElement {
    templateNode: HTMLTemplateElement;

    render(): void;

    addEventListeners?: () => void;
    removeEventListeners?: () => void;
}
