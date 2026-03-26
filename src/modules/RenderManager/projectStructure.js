import { Element } from "../Element/Element.js";

export const projectStructure = new Element('li', [
        new Element('svg', [
            new Element('path', '', { d:"M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z", })
        ], { 
            className: 'aside__menu-icon',
            fill: '#ffb800',
            xmlns:"http://www.w3.org/2000/svg",
            viewBox:"0 0 24 24",
         }),
        new Element('p', '', { className: 'aside__menu-name' }),
        new Element('button', [
            new Element('svg', [
                new Element('path', '', {
                    d:"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",
                })
            ], {
                fill:"#fff",
                xmlns:"http://www.w3.org/2000/svg",
                viewBox:"0 0 24 24",
            })
        ], { className: 'aside__menu-btn-close', 'data-id': "closeProject" }),
        new Element('button', '', { className: 'aside__menu-btn-open button', 'data-id': "openProject" }),
    ], { className: 'aside__menu-project' });