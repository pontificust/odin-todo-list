export const createElement = ({ tag, content, attributes }) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const isSvg = ['svg', 'path', 'circle', 'rect', 'line'].includes(tag);

    const element = isSvg ? document.createElementNS(svgNS, tag) :
        document.createElement(tag);
    if (attributes && attributes.className) {
        element.classList.add(...attributes.className.split(' '));
    }
    if (content) {
        if (typeof content === 'string') {
            element.textContent = content;
        } else {
            for (let i = 0; i < content.length; i += 1) {
                element.appendChild(createElement(content[i]));
            }
        }
    }
    if (attributes) {
        for (let key in attributes) {
            if (key !== 'className') {
                element.setAttribute(key, attributes[key]);
            }
        }
    }

    return element;
}