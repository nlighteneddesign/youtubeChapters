import stl from './youtube-chapters.scss';
import htmlTemplate from './youtube-chapters.html';
import "@google-web-components/google-youtube";

class chapterCreation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(chapterCreation.template.content.cloneNode(true));
    this.shadowRoot.querySelector('.stl').appendChild(document.createTextNode(stl));

    this.dom = {};
    this.selector = 'youtube-chapters';

    const getElement = (element) => this.shadowRoot.querySelector(`.${this.selector}__${element}`);
    const getId = (id) => this.shadowRoot.getElementById(id);
    this.dom.customChapterTitle = getId('customChapterTitle');
    this.dom.add = getElement('add');
    this.dom.ul = this.shadowRoot.querySelector('ul');
  }

  connectedCallback() {
    setTimeout(() => {
      yt = document.querySelector('google-youtube');
    }, 1000);

    window.onbeforeunload = function(e) {
      var dialogText = 'Have you saved the chapter markers?';
      e.returnValue = dialogText;
      return dialogText;
    };

    this.dom.add.addEventListener('click', () => {
      var chapterDescription = yt.currenttimeformatted;

      if (this.dom.customChapterTitle.value) {
        chapterDescription += ` - ${this.dom.customChapterTitle.value}`;
        this.dom.customChapterTitle.value = null;
      }

      const listEl = document.createElement('li');
      listEl.innerText = chapterDescription;

      this.dom.ul.appendChild(listEl);
    });
  }

  static get template() {
    const chapterCreationTemplate = document.createElement('template');
    chapterCreationTemplate.innerHTML = htmlTemplate;

    return chapterCreationTemplate;
  }
}

window.customElements.define('youtube-chapters', chapterCreation);
