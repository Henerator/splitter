const splitPointName = '--split-point';
const splitter = document.querySelector('#splitter');
const itemLeft = document.querySelector('#item-left');
const itemRight = document.querySelector('#item-right');

const contentLength = 10;

let lastMouseX;
let lastSplitX;

function limit(value, min, max) {
    value = Math.max(value, min);
    value = Math.min(value, max);
    return value;
}

function getSplitPoint() {
    const pageStyles = getComputedStyle(document.documentElement);
    const splitPointPx = pageStyles.getPropertyValue(splitPointName);
    return parseInt(splitPointPx);
}

function setSplitPoint(value) {
    document.documentElement.style.setProperty(splitPointName, `${value}px`);
}

function setSplitPointToCenter() {
    setSplitPoint(window.innerWidth / 2);
}

function fillItemWithContent(itemElement, length, text) {
    const content = [...Array(length).keys()].map(() => {
        return `<span>${text}</span>`;
    });
    itemElement.innerHTML = content.join('');
}

function mouseUpHandler(event) {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
}

function mouseMoveHandler(event) {
    const dx = event.clientX - lastMouseX;
    const splitPoint = limit(lastSplitX + dx, 0, window.innerWidth);
    setSplitPoint(splitPoint);
}

function mouseDownHandler(event) {
    lastMouseX = event.clientX;
    lastSplitX = getSplitPoint();
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
}

splitter.addEventListener('mousedown', mouseDownHandler);
window.addEventListener('resize', setSplitPointToCenter);

// fillItemWithContent(itemLeft, contentLength, '1');
// fillItemWithContent(itemRight, contentLength, '2');

setSplitPointToCenter();