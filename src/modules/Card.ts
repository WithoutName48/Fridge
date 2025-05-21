import * as tinymce from 'tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/code';
import { Editor } from '../../node_modules/tinymce/tinymce';
import { forEachTrailingCommentRange } from '../../node_modules/typescript/lib/typescript';

export class Card {
  private element: HTMLDivElement;
  private resizer: HTMLDivElement;
  private remover: HTMLDivElement;
  private editor: HTMLDivElement;
  private workplace: HTMLDivElement;
  private cards: Map<string, Card>;
  private cardName: string;
  private nextZIndex: INumber;

  constructor(cards: Map<string, Card>, cardId: number, size: ISize, nextZIndex: INumber) {
    this.cardName = `card-${cardId}`;
    this.cards = cards;
    this.nextZIndex = nextZIndex;

    this.createHTML(size);

    this.addMoveFunctionality();
    this.addResizeFunctionality();
    this.addRemoveFunctionality();
    this.addEditFunctionality();
  }

  private createHTML(size: ISize) {
    this.element = document.createElement('div');
    this.element.className = this.cardName;
    this.element.style.width = `${size.width}px`;
    this.element.style.height = `${size.height}px`;
    this.element.style.minWidth = `${size.width}px`;
    this.element.style.minHeight = `${size.height}px`;
    this.element.style.position = 'absolute';
    this.element.style.top = '25%';
    this.element.style.right = '25%';
    this.element.style.zIndex = '0';
    this.element.style.border = '2px solid black';
    this.element.style.backgroundColor = 'lightblue';

    this.remover = document.createElement('div');
    this.remover.className = `remover-${this.cardName}`;
    this.remover.style.width = '24px';
    this.remover.style.height = '24px';
    this.remover.style.position = 'absolute';
    this.remover.style.top = '0';
    this.remover.style.right = '0';
    this.remover.style.cursor = 'pointer';
    this.remover.style.backgroundImage = `url("../src/assets/remove_icon.png")`;
    this.remover.style.backgroundPosition = 'center center';
    this.remover.style.backgroundSize = 'cover';
    this.element.appendChild(this.remover);

    this.resizer = document.createElement('div');
    this.resizer.className = `resizer-${this.cardName}`;
    this.resizer.style.width = '24px';
    this.resizer.style.height = '24px';
    this.resizer.style.position = 'absolute';
    this.resizer.style.bottom = '0';
    this.resizer.style.right = '0';
    this.resizer.style.cursor = 'se-resize';
    this.resizer.style.backgroundImage = `url("../src/assets/resize_icon.jpg")`;
    this.resizer.style.backgroundPosition = 'center center';
    this.resizer.style.backgroundSize = 'cover';
    this.element.appendChild(this.resizer);

    this.editor = document.createElement('div');
    this.editor.className = `editor-${this.cardName}`;
    this.editor.style.width = '24px';
    this.editor.style.height = '24px';
    this.editor.style.position = 'absolute';
    this.editor.style.top = '0';
    this.editor.style.left = '0';
    this.editor.style.cursor = 'pointer';
    this.editor.style.backgroundImage = `url("../src/assets/edit_icon.ico")`;
    this.editor.style.backgroundPosition = 'center center';
    this.editor.style.backgroundSize = 'cover';
    this.element.appendChild(this.editor);

    this.workplace = document.createElement('div');
    this.workplace.className = `workplace-${this.cardName}`;
    this.workplace.style.width = '100%';
    this.workplace.style.height = '100%';
    this.workplace.style.overflow = 'auto';

    const workplaceContainer: HTMLDivElement = document.createElement('div');
    workplaceContainer.style.padding = '25px';
    workplaceContainer.style.height = '100%';
    workplaceContainer.style.width = '100%';

    workplaceContainer.appendChild(this.workplace);
    this.element.appendChild(workplaceContainer);

    document.querySelector('.div-fridge').appendChild(this.element);
  }

  private addMoveFunctionality() {
    this.element.addEventListener('mousedown', (e: MouseEvent) => {
      e.stopPropagation();

      this.element.style.backgroundColor = 'lightyellow';
      this.element.style.zIndex = `${this.nextZIndex.value}`;
      this.nextZIndex.value++;

      const startPosition = this.element.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (e: MouseEvent) => {
        const newLeft = startPosition.x + e.clientX - startX;
        const newTop = startPosition.y + e.clientY - startY;

        this.element.style.left = `${newLeft}px`;
        this.element.style.top = `${newTop}px`;
      };

      const onMouseUp = () => {
        this.element.style.backgroundColor = 'lightblue';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  private addResizeFunctionality() {
    this.resizer.addEventListener('mousedown', (e: MouseEvent) => {
      e.stopPropagation();
      if (document.querySelectorAll('.tox-tinymce').length != 0) return;

      const startPosition = this.element.getBoundingClientRect();
      const startWidth = this.element.offsetWidth;
      const startHeight = this.element.offsetHeight;
      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (e: MouseEvent) => {
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);

        this.element.style.width = `${newWidth}px`;
        this.element.style.height = `${newHeight}px`;
        this.element.style.top = `${startPosition.y}px`;
        this.element.style.left = `${startPosition.x}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  private addEditFunctionality() {
    const onClick = (e: MouseEvent) => {
      e.stopPropagation();
      if (document.querySelectorAll('.tox-tinymce').length != 0) return;

      const initialContent: string = this.workplace.innerHTML;

      tinymce.init({
        selector: `.workplace-${this.cardName}`,
        body_id: `tinymce-${this.cardName}`,
        plugins: [
          'anchor',
          'autolink',
          'charmap',
          'codesample',
          'emoticons',
          'image',
          'link',
          'lists',
          'media',
          'searchreplace',
          'table',
          'visualblocks',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        init_instance_callback: (editor) => {
          const footer: HTMLDivElement = document.querySelector('.tox-statusbar__text-container');

          const buttonsDiv: HTMLDivElement = document.createElement('div');
          buttonsDiv.className = 'TinyMCE-buttons';

          const saveButton: HTMLButtonElement = document.createElement('button');
          saveButton.className = 'TinyMCE-save-button';

          const quitButton: HTMLButtonElement = document.createElement('button');
          quitButton.className = 'TinyMCE-quit-button';

          saveButton.addEventListener('click', () => {
            editor.save(this.workplace);
            editor.destroy();
          });

          quitButton.addEventListener('click', () => {
            editor.destroy();
            this.workplace.innerHTML = initialContent;
          });

          buttonsDiv.appendChild(saveButton);
          buttonsDiv.appendChild(quitButton);

          footer.appendChild(buttonsDiv);
        },
      });
    };

    this.editor.addEventListener('click', onClick);
  }

  private addRemoveFunctionality() {
    const onClick = (e: MouseEvent) => {
      e.stopPropagation();
      if (document.querySelectorAll('.tox-tinymce').length != 0) return;

      const counterDiv: HTMLParagraphElement = document.querySelector('.div-cnt-curr');

      counterDiv.innerText = String(Number(counterDiv.innerText) - 1);
      if (Number(counterDiv.innerText) == 0) {
        document.querySelector('.container-stats').remove();
      }

      this.cards.delete(this.cardName);
      this.element.remove();
    };

    this.remover.addEventListener('click', onClick);
  }
}
