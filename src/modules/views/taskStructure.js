import { Element } from "./Element.js";

export const taskStructure = new Element(
  "li",
  [
    new Element(
      "div",
      [
        new Element(
          "div",
          [
            new Element("h3", "", { className: "tasks__name" }),
            new Element("p", "", { className: "tasks__priority" }),
          ],
          { className: "tasks__card-row" },
        ),
        new Element(
          "div",
          [
            new Element("p", "", { className: "tasks__date" }),
            new Element("p", "", { className: "tasks__xp" }),
          ],
          { className: "tasks__card-row" },
        ),
      ],
      { className: "tasks__card-wrapper" },
    ),
    new Element(
      "div",
      [
        new Element("button", "", {
          className: "tasks__card-btn button",
          "data-id": "completeTask",
        }),
        new Element("button", "", {
          className: "tasks__card-btn button",
          "data-id": "closeTask",
        }),
      ],
      { className: "tasks__card-btns" },
    ),
  ],
  { className: "tasks__card", id: "openPopup" },
);
