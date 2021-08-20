const splitPointName = "--split-point";
const splitter = document.querySelector("#splitter");
const itemLeft = document.querySelector("#item-left");
const itemRight = document.querySelector("#item-right");

const EVENT_TYPES = {
  touchStart: "touchstart",
  mouseDown: "mousedown",
};

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

class Dragger {
  listeners = [];
  lastEventX;

  constructor() {
    this.bindedOnMoveEvent = this.onMoveEvent.bind(this);
    this.bindedEndEvent = this.onEndEvent.bind(this);
  }

  init(event) {
    this.lastEventX = this.getEventX(event);
    this.setEventHandlers();
  }

  onMoveEvent(event) {
    const eventX = this.getEventX(event);
    const dx = eventX - this.lastEventX;
    this.notify(dx);
  }

  onEndEvent() {
    this.removeEventHandlers();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify(dx) {
    this.listeners.forEach((listener) => listener(dx));
  }

  getEventX(_event) {
    throw new Error('"getEventX" method is not implemented');
  }

  setEventHandlers() {
    throw new Error('"setEventHandlers" method is not implemented');
  }

  removeEventHandlers() {
    throw new Error('"removeEventHandlers" method is not implemented');
  }
}

class MouseDragger extends Dragger {
  getEventX(event) {
    return event.clientX;
  }

  setEventHandlers() {
    document.addEventListener("mousemove", this.bindedOnMoveEvent);
    document.addEventListener("mouseup", this.bindedEndEvent);
  }

  removeEventHandlers() {
    document.removeEventListener("mousemove", this.bindedOnMoveEvent);
    document.removeEventListener("mouseup", this.bindedEndEvent);
  }
}

class TouchDragger extends Dragger {
  getEventX(event) {
    return event.touches[0].clientX;
  }

  setEventHandlers() {
    document.addEventListener("touchmove", this.bindedOnMoveEvent);
    document.addEventListener("touchend", this.bindedEndEvent);
    document.addEventListener("touchcancel", this.bindedEndEvent);
  }

  removeEventHandlers() {
    document.removeEventListener("touchmove", this.bindedOnMoveEvent);
    document.removeEventListener("touchend", this.bindedEndEvent);
    document.removeEventListener("touchcancel", this.bindedEndEvent);
  }
}

function getDragHandler(startEventType) {
  switch (startEventType) {
    case EVENT_TYPES.touchStart:
      return new TouchDragger();
    case EVENT_TYPES.mouseDown:
      return new MouseDragger();
    default:
      return new MouseDragger();
  }
}

function deviceDownHandler(event) {
  lastSplitX = getSplitPoint();

  const dragHandler = getDragHandler(event.type);
  dragHandler.subscribe((dx) => {
    const splitPoint = limit(lastSplitX + dx, 0, window.innerWidth);
    setSplitPoint(splitPoint);
  });
  dragHandler.init(event);
}

setSplitPointToCenter();
window.addEventListener("resize", setSplitPointToCenter);

splitter.addEventListener("mousedown", deviceDownHandler);
splitter.addEventListener("touchstart", deviceDownHandler);
