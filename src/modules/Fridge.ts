import { Card } from './Card';

export class Fridge {
  private cards: Map<string, Card> = new Map<string, Card>();
  private nextID: number = 0;
  private nextZIndex: INumber = { value: 1 };
  private cnt_cards_all: number = 0;
  private cnt_cards_curr: number = 0;

  constructor() {
    this.generateHTML();
  }

  private generateHTML(): void {
    const containerDiv: HTMLDivElement = document.querySelector('.container') as HTMLDivElement;

    const fridgeDiv: HTMLDivElement = document.createElement('div');
    fridgeDiv.style.width = '100vw';
    fridgeDiv.style.height = '100vh';
    fridgeDiv.style.position = 'relative';
    fridgeDiv.style.overflow = 'hidden';

    fridgeDiv.classList.add('div-fridge');

    const addCardDiv: HTMLDivElement = document.createElement('div');
    addCardDiv.style.width = '64px';
    addCardDiv.style.height = '64px';
    addCardDiv.style.backgroundImage = `url("../src/assets/add_file.png")`;
    addCardDiv.style.backgroundPosition = 'center center';
    addCardDiv.style.backgroundSize = 'cover';
    addCardDiv.style.position = 'absolute';
    addCardDiv.style.left = '5px';
    addCardDiv.style.top = '5px';
    addCardDiv.style.cursor = 'pointer';
    addCardDiv.addEventListener('click', () => this.addCard());

    fridgeDiv.appendChild(addCardDiv);

    containerDiv.appendChild(fridgeDiv);
  }

  public addCard(): void {
    if (this.cnt_cards_curr == 0 || document.querySelectorAll('.container-stats').length == 0) {
      this.createCounterHTML();
    }

    this.cards.set(
      `card-${this.nextID}`,
      new Card(this.cards, this.nextID, { width: 150, height: 150 }, this.nextZIndex)
    );
    this.nextID++;

    this.cnt_cards_all++;
    const counterDiv: HTMLDivElement = document.querySelector('.div-cnt-curr');
    this.cnt_cards_curr = Number(counterDiv.innerText) + 1;

    this.updateCounter();
  }

  private createCounterHTML(): void {
    const containerDiv: HTMLDivElement = document.querySelector('.div-fridge') as HTMLDivElement;

    const statsContainerDiv: HTMLDivElement = document.createElement('div');
    statsContainerDiv.className = 'container-stats';
    statsContainerDiv.style.position = 'absolute';
    statsContainerDiv.style.right = '5px';
    statsContainerDiv.style.top = '5px';

    const statCntAllDiv: HTMLDivElement = document.createElement('div');
    const statCntCurrDiv: HTMLDivElement = document.createElement('div');

    const pCntAll: HTMLParagraphElement = document.createElement('p');
    pCntAll.innerText = 'przebieg: ';
    pCntAll.addEventListener('ondragstart', () => {
      console.log('AHAHHA');
    });
    statCntAllDiv.appendChild(pCntAll);

    const pCntCurr: HTMLParagraphElement = document.createElement('p');
    pCntCurr.innerText = 'na lodówce: ';
    pCntCurr.addEventListener('ondragstart', () => {
      console.log('AHAHHA');
    });
    statCntCurrDiv.appendChild(pCntCurr);

    const pCntAllData: HTMLParagraphElement = document.createElement('p');
    pCntAllData.classList.add('div-cnt-all');
    pCntAllData.addEventListener('ondragstart', () => {
      console.log('AHAHHA');
    });
    statCntAllDiv.appendChild(pCntAllData);

    const pCntCurrData: HTMLParagraphElement = document.createElement('p');
    pCntCurrData.classList.add('div-cnt-curr');
    pCntCurrData.addEventListener('ondragstart', () => {
      console.log('AHAHHA');
    });
    statCntCurrDiv.appendChild(pCntCurrData);

    statCntAllDiv.style.display = 'flex';
    statCntAllDiv.style.gap = '5px';
    statCntCurrDiv.style.display = 'flex';
    statCntCurrDiv.style.gap = '5px';

    statsContainerDiv.appendChild(statCntAllDiv);
    statsContainerDiv.appendChild(statCntCurrDiv);

    containerDiv.appendChild(statsContainerDiv);
  }

  private updateCounter(): void {
    let paragraphData: HTMLParagraphElement = document.querySelector('.div-cnt-all');
    paragraphData.innerText = this.cnt_cards_all.toString();

    paragraphData = document.querySelector('.div-cnt-curr');
    paragraphData.innerText = this.cnt_cards_curr.toString();
  }
}
