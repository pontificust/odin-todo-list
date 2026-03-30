import { Element } from "./Element.js";

export const taskFormStructure = new Element('form', [
    new Element('h2', '>>system input: new objective', { className: 'popup__title' }),
    new Element('div', [
        new Element('label', 'Objective label *', { className: 'popup__label', for: 'title' }),
        new Element('input', '', {
            id: 'title',
            name: 'title',
            type: 'text',
            maxLength: '50',
            className: 'popup__input',
            required: 'true',
        }),
    ], { className: 'popup__field' }),
    new Element('div', [
        new Element('label', 'objective description', { className: 'popup__label', for: 'description' }),
        new Element('textarea', '', {
            id: 'description',
            name: 'description',
            maxLength: '200',
            className: 'popup__input',
        }),
    ], { className: 'popup__field' }),
    new Element('div', [
        new Element('label', 'timeline *', { className: 'popup__label', for: 'date' }),
        new Element('div', [
            new Element('input', '', {
                id: 'date',
                name: 'dueDate',
                type: 'date',
                className: 'popup__input',
                required: 'true',
            }),
        ], { className: 'popup__date-wrapper'})], { className: 'popup__field'}),
        new Element('div', [
        new Element('label', 'threat level *', { className: 'popup__label', for: 'priority' }),
        new Element('div', [
            new Element('select', [
                new Element('option', 'Critical', { value: 'critical'}),
                new Element('option', 'Moderate', { value: 'moderate', selected: 'true'}),
                new Element('option', 'Low', { value: 'low'}),
            ], {
                id: 'priority',
                name: 'priority',
                className: 'popup__input',
                required: 'true',
            }),
        ], { className: 'popup__select-wrapper'}),
    ], { className: 'popup__field' }),
    new Element('div', [
        new Element('button', '[execute]', { 
            className: 'popup__btn button',
            type: 'submit'
        }),
        new Element('button', '[abort]', { className: 'popup__btn button', type: 'button'})
    ], { 
        className: 'popup__btns',
        type: 'button',
        'data-id': 'closePopup',
    }),
], { className: 'popup', action: '#' });