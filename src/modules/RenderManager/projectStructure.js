import { Element } from "../Element/Element.js";
import folderIcon from "./folder.svg";

export const projectStructure = new Element('li', [
        new Element('img', '', { 
            className: 'aside__menu-icon',
            src: folderIcon,
            width: '35',
            height: '35',
            atl: 'folder icon',
         }),
        new Element('p', '', { className: 'aside__menu-name' }),
        new Element('button', '', { className: 'aside__menu-btn-close button', 'data-id': "closeProject" }),
        new Element('button', '', { className: 'aside__menu-btn-open button', 'data-id': "openProject" }),
    ], { className: 'aside__menu-project' });