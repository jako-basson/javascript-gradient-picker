/**
 * Creates a element out of a string (Single element).
 * @param html HTML representing a single element
 * @returns {Element | null} The element.
 */
const createElementFromString = html => {
    const div = document.createElement("div");
    div.innerHTML = html.trim();
    return div.firstElementChild;
};

/**
 * Generates a random HEX color
 * @returns {string} color code.
 */
const generateColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

/**
 * Wraps an element with another element
 * @param el element to wrap
 * @param wrapper wrapper element
 * @returns {Element} wrapper element
 */
const wrapElement = (el, wrapper) => {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
};

export {
    createElementFromString,
    generateColor,
    wrapElement
};
