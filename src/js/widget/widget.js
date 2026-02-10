import "../../css/themes.css";
import "../../css/widget.css";
import "../../css/buttons.css";

export default class TrelloWidget {
  constructor(parent) {
    parent.insertAdjacentHTML("afterbegin", TrelloWidget._bodyMarkup);
    this._body = parent.querySelector(".trello-widget");
    this._controls = this._body.querySelector(".trello-controls");
    this._columnsContainer = this._body.querySelector(".trello-columns");
  }

  static get _bodyMarkup() {
    return `
      <div class="trello-widget widget">
        <div class="trello-controls"></div>
        <div class="trello-columns"></div>
      </div>
      `;
  }

  static get _controlsMarkup() {
    return `
        <div class="trello-controls-line">
          <div>Choose theme:</div>
          <div class="control-btn theme-toggle-btn widget" data-theme="latte">latte</div>
          <div class="control-btn theme-toggle-btn widget" data-theme="chocolatte">chocolatte</div>
          <div class="control-btn theme-toggle-btn widget" data-theme="cappuccino">cappuccino</div>
          <div class="control-btn theme-toggle-btn widget" data-theme="espresso">espresso</div>
        </div>
        <div class="trello-controls-line">
          <div>Control Local Storage:</div>
          <div class="control-btn widget" id="add-example-data">Replace with example data</div>
          <div class="control-btn widget" id="clean-ls-and-lists">Clean LS and task lists</div>
          <div class="control-btn widget" id="clean-lists">Clean task lists</div>
          <div class="control-btn widget" id="clean-ls">Clean LS</div>
        </div>
        
        <!--
        <div class="trello-controls-line">
          <div>Consol:</div>
          <div class="control-btn widget" id="consol-line"></div>
        </div>
        --!>
      `;
  }

  _columnMarkup(columnId, columnName) {
    return `
        <div class="trello-column widget" id="column-${columnId}">

          <div class="trello-column-title">${columnName.toUpperCase()}</div>
          <div class="trello-column-tasks" id="tasklist-${columnId}"></div>
          
          <div class="trello-adding-panel widget hidden" id="adding-panel-${columnId}">
            <div class="trello-adding-title">Add task</div>
            <input type="text" placeholder="Enter a new task here" id="input-${columnId}" class="trello-adding-input widget">
            <div class="trello-adding-buttons">
              <div class="trello-controls-line">
                <div class="control-btn control-inner-btn widget" id="confirm-${columnId}">Confirm</div>  
                <div class="control-btn control-inner-btn widget" id="cancel-${columnId}">x</div>
              </div>                              
            </div>
          </div>

          <div class="control-btn add-new-btn widget" id="add-new-${columnId}">+ Add new task</div>
        </div>
      `;
  }

  _taskMarkup(taskText) {
    return `
      <div class="trello-task widget" draggable="true">
        <p>${taskText}</p>
        <div class="control-btn control-inner-btn delete-btn">×</div>
      </div>
    `;
  }

  static get _columnNames() {
    return {
      1: "todo",
      2: "in process",
      3: "done",
    };
  }

  static get _exampleTasks() {
    return {
      1: [
        "task 1-1",
        "task 1-2",
        "task 1-3",
        "task 1-4",
        "Lorem ipsum dolor sit amet...",
      ],
      2: [
        "task 2-1",
        "...consectetuer adipiscing elit...",
        "task 2-3",
        "task 2-4",
        "task 2-5",
        "...sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
      ],
      3: [
        "task 3-1",
        "task 3-2",
        "task 3-3",
        "task 3-4",
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
        "task 3-6",
      ],
    };
  }

  _addTaskToColumn(task, taskList) {
    taskList.insertAdjacentHTML("beforeend", this._taskMarkup(task));
  }

  _fillWidgetWithJSON(data) {
    for (const columnId in data) {
      const columnEl = this._columnsContainer.querySelector(
        `#column-${columnId}`,
      );
      const taskList = columnEl.querySelector(".trello-column-tasks");
      data[columnId].forEach((task) => {
        this._addTaskToColumn(task, taskList);
      });
    }
  }

  _cleanTaskLists() {
    const taskLists = Array.from(
      this._columnsContainer.querySelectorAll(".trello-column-tasks"),
    );

    taskLists.forEach((taskList) => {
      taskList.innerHTML = "";
    });
  }

  _prepareThemeToggles() {
    if (localStorage["trelloTheme"]) {
      document.documentElement.setAttribute(
        "data-theme",
        localStorage["trelloTheme"],
      );
    }

    this._controls.insertAdjacentHTML(
      "afterbegin",
      TrelloWidget._controlsMarkup,
    );
    const themeToggleBtns = Array.from(
      this._body.querySelectorAll(".theme-toggle-btn"),
    );

    themeToggleBtns.forEach((btn) => {
      const btnTheme = btn.getAttribute("data-theme");
      if (btnTheme == localStorage["trelloTheme"]) {
        btn.classList.add("current-theme");
      }

      btn.addEventListener("click", () => {
        document.documentElement.setAttribute("data-theme", btnTheme);
        localStorage["trelloTheme"] = btnTheme;
        themeToggleBtns.forEach((btn) => btn.classList.remove("current-theme"));
        btn.classList.add("current-theme");
      });
    });
  }

  _prepareColumns() {
    const columns = TrelloWidget._columnNames;
    for (const key in columns) {
      this._columnsContainer.insertAdjacentHTML(
        "beforeend",
        this._columnMarkup(key, columns[key]),
      );
    }
  }

  _prepareLsControls() {
    const cleanLsBtn = this._controls.querySelector("#clean-ls");
    const cleanListsBtn = this._controls.querySelector("#clean-lists");
    const cleanLsAndListsBtn = this._controls.querySelector(
      "#clean-ls-and-lists",
    );
    const replaceWithExampleData =
      this._controls.querySelector("#add-example-data");

    cleanLsBtn.addEventListener("click", () => {
      localStorage["trello"] = "{}";
    });

    cleanListsBtn.addEventListener("click", () => {
      this._cleanTaskLists();
    });

    cleanLsAndListsBtn.addEventListener("click", () => {
      this._cleanTaskLists();
      localStorage["trello"] = "{}";
    });

    replaceWithExampleData.addEventListener("click", () => {
      this._cleanTaskLists();
      this._fillWidgetWithJSON(TrelloWidget._exampleTasks);
      localStorage["trello"] = JSON.stringify(TrelloWidget._exampleTasks);
    });
  }

  _runLocalStorage() {
    if (!localStorage["trello"]) {
      localStorage["trello"] = "{}";
    } else {
      const dataFromStorage = JSON.parse(localStorage["trello"]);
      this._fillWidgetWithJSON(dataFromStorage);
    }
  }

  _manageDnD() {
    this._columnsContainer.addEventListener("dragstart", (event) => {
      this._movingTask = event.target.closest(".trello-task");

      this._fantom = this._movingTask.cloneNode(true);
      this._fantom.classList.add("fantom");

      this._movingTask.style.opacity = 0.2;

      this._nextNeighboor = this._movingTask.nextElementSibling;
      this._prevNeighboor = this._movingTask.previousElementSibling;
    });

    this._columnsContainer.addEventListener("dragover", (event) => {
      event.preventDefault();

      const x = event.clientX;
      const y = event.clientY;

      function elemBelow(x, y, elemClass) {
        try {
          return document.elementFromPoint(x, y).closest(elemClass);
        } catch (error) {
          console.log(error);
          return undefined;
        }
      }

      this._closestTask =
        elemBelow(x, y, ".trello-task") ||
        elemBelow(x, y + 60, ".trello-task") ||
        elemBelow(x - 40, y, ".trello-task") ||
        elemBelow(x + 40, y, ".trello-task") ||
        elemBelow(x - 50, y + 30, ".trello-task") ||
        elemBelow(x + 50, y + 30, ".trello-task");

      if (
        this._closestTask &&
        this._closestTask != this._movingTask &&
        this._closestTask != this._fantom
      ) {
        // нашли closestTask
        this._tasksList = this._closestTask.closest(".trello-column-tasks");

        if (this._closestTask != this._nextNeighboor) {
          this._tasksList.insertBefore(this._fantom, this._closestTask);
        }

        const coords = this._closestTask.getBoundingClientRect();
        const targetMiddle = coords.bottom - coords.height / 2;
        if (y > targetMiddle) {
          this._tasksList.insertBefore(
            this._fantom,
            this._closestTask.nextElementSibling,
          );
        }
      } else {
        const closestColumn = elemBelow(x, y, ".trello-column");
        if (closestColumn) {
          // нашли closestColumn
          this._tasksList = closestColumn.querySelector(".trello-column-tasks");

          if (
            y > this._tasksList.getBoundingClientRect().bottom &&
            this._movingTask !=
              this._tasksList.children[this._tasksList.children.length - 1]
          ) {
            this._tasksList.append(this._fantom);
          }
        }
      }
    });

    this._columnsContainer.addEventListener("dragend", (event) => {
      event.preventDefault();

      const startColumnId = this._movingTask
        .closest(".trello-column")
        .id.slice(-1);
      const startTaskId = Array.from(
        this._movingTask.closest(".trello-column-tasks").children,
      ).indexOf(this._movingTask);

      try {
        this._tasksList.insertBefore(this._movingTask, this._fantom);
        this._fantom.remove();
      } catch (error) {
        console.log(error);
        if (
          this._movingTask != this._tasksList.children[0] &&
          this._movingTask != this._closestTask
        ) {
          this._tasksList.append(this._movingTask);
        }
        this._fantom.remove();
      }
      this._movingTask.style.opacity = 1;

      const endColumnId = this._movingTask
        .closest(".trello-column")
        .id.slice(-1);
      const endTaskId = Array.from(
        this._movingTask.closest(".trello-column-tasks").children,
      ).indexOf(this._movingTask);

      const taskText = this._movingTask.querySelector("p").textContent;
      const storage = JSON.parse(localStorage["trello"]);

      if (!(startColumnId == endColumnId && startTaskId == endTaskId)) {
        // same place
        if (startColumnId == endColumnId) {
          // same column
          if (startTaskId < endTaskId) {
            storage[startColumnId].splice(startTaskId, 1);
            storage[endColumnId].splice(endTaskId, 0, taskText);
          } else {
            storage[startColumnId].splice(startTaskId - 1, 1);
            storage[endColumnId].splice(endTaskId, 0, taskText);
          }
        } else {
          // different column
          storage[startColumnId].splice(startTaskId, 1);
          storage[endColumnId].splice(endTaskId, 0, taskText);
        }
      }

      localStorage["trello"] = JSON.stringify(storage);
    });
  }

  _deleteTask(taskElem) {
    const columnId = taskElem.closest(".trello-column").id.slice(-1);
    const taskId = Array.from(
      taskElem.closest(".trello-column-tasks").children,
    ).indexOf(taskElem);

    const storage = JSON.parse(localStorage["trello"]);
    storage[columnId].splice(taskId, 1);

    localStorage["trello"] = JSON.stringify(storage);

    taskElem.remove();
  }

  _prepareDeleteBtns() {
    this._columnsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        this._deleteTask(e.target.closest(".trello-task"));
      }
    });
  }

  _manageAddingTasks() {
    this._addBtns = this._columnsContainer.querySelectorAll(".add-new-btn");

    this._addBtns.forEach((btn) => {
      const columnId = btn.id.slice(-1);
      const panel = this._columnsContainer.querySelector(
        `#adding-panel-${columnId}`,
      );
      const typedText = panel.querySelector("input");
      const confirmBtn = this._columnsContainer.querySelector(
        `#confirm-${columnId}`,
      );
      const cancelBtn = this._columnsContainer.querySelector(
        `#cancel-${columnId}`,
      );

      btn.addEventListener("click", () => {
        panel.classList.remove("hidden");
        btn.classList.add("hidden");
      });

      function closePanel() {
        typedText.value = "";
        panel.classList.add("hidden");
        btn.classList.remove("hidden");
      }

      confirmBtn.addEventListener("click", () => {
        const taskList = this._columnsContainer.querySelector(
          `#tasklist-${columnId}`,
        );
        this._addTaskToColumn(typedText.value, taskList);

        const storage = JSON.parse(localStorage["trello"]);
        try {
          storage[columnId].push(typedText.value);
        } catch (error) {
          console.log(error);
          storage[columnId] = [];
          storage[columnId].push(typedText.value);
        }
        localStorage["trello"] = JSON.stringify(storage);
        closePanel();
      });

      cancelBtn.addEventListener("click", () => {
        closePanel();
      });
    });
  }

  insertWidget() {
    this._prepareThemeToggles();
    this._prepareColumns();
    this._prepareLsControls();
    this._runLocalStorage();
    this._prepareDeleteBtns();

    this._manageDnD();
    this._manageAddingTasks();
  }
}
