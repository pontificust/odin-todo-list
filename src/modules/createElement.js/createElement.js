export const createElement = ({ tag, content, attributes }) => {
    const element = document.createElement(tag);
    element.classList.add(attributes.className);
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
                element[key] = attributes[key];
            }
        }
    }

    return element;
}