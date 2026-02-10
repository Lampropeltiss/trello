import AuthorWidget from "./authorWidget";
import Widget from "./widget/widget";

const container1 = document.querySelector(".container1");
const container2 = document.querySelector(".container2");

const authorWidget = new AuthorWidget(container1);
authorWidget.insertWidget();

const widget = new Widget(container2);
widget.insertWidget();
