import "../css/author.css";

export default class AuthorWidget {
  constructor(parent) {
    this.parent = parent;
  }

  static get markup() {
    return `
        <div class="author-widget">
            <div>
                <img class="avatar" src="https://avatars.githubusercontent.com/u/188052302?v=4" alt="Lampropeltiss Avatar">
            </div>
            <div class="author-note">Homework done by Lampropeltiss</div>
        </div>`;
  }

  insertWidget() {
    this.parent.innerHTML = AuthorWidget.markup;
  }
}
