function TouchTracker(root, touchStart, touchMove, touchEnd) {
  var debug = false;
  var debugElem;

  var dataMap = {};

  var mouseFromEvent = function(event) {
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    return {
      x: ((event.clientX - (Convert.offset(root).left - scrollLeft)) / Convert.offset(root).width) * 2 - 1,
      y: - ((event.clientY - (Convert.offset(root).top - scrollTop)) / Convert.offset(root).height) * 2 + 1,
      clientX: event.clientX,
      clientY: event.clientY
    };
  }

  var onDebug = function(e) {
    if (!debug) return;

    var c = mouseFromEvent(e);
    debugElem.style.display = "block";
    debugElem.style.top = (c.clientY - 50) + "px";
    debugElem.style.left = (c.clientX - 50) + "px";
    // debugElem.innerText = e.touches.length;
  }

  var onDocumentTouchStart = function(event) {
    var touch = event.changedTouches[0];
    event.preventDefault();

    onDebug(event);

    event.clientX = touch.clientX;
    event.clientY = touch.clientY;

    onTouchDown(event, touch.identifier);
  }

  var onDocumentTouchMove = function(event) {
    var touch = event.changedTouches[0];
    event.preventDefault();

    if (dataMap[touch.identifier] &&
        dataMap[touch.identifier].touchStartEvent != undefined) {
      onDebug(event);
    }

    event.clientX = touch.clientX;
    event.clientY = touch.clientY;

    onTouchMove(event, touch.identifier);
  }

  var onDocumentTouchEnd = function(event) {
    var touch = event.changedTouches[0];
    event.preventDefault();

    event.clientX = touch.clientX;
    event.clientY = touch.clientY;

    onTouchEnd(event, touch.identifier);
  }

  var onDocumentMouseDown = function(event) {
    onTouchDown(event, 0);
  }

  var onDocumentMouseMove = function(event) {
    onTouchMove(event, 0);
  }

  var onDocumentMouseUp = function(event) {
    onTouchEnd(event, 0);
  }

  var onTouchDown = function(event, touchId) {
    var touchStartEvent = mouseFromEvent(event);
    var touchLastEvent = touchStartEvent;
    var touchStartTime = window.performance.now();

    dataMap[touchId] = {
      custom: touchStart(touchStartEvent, touchLastEvent, touchStartEvent, 0, null),
      touchStartEvent: touchStartEvent,
      touchLastEvent: touchLastEvent,
      touchStartTime: touchStartTime
    };
  }

  var onTouchMove = function(event, touchId) {
    var touchMoveEvent = mouseFromEvent(event);
    var data = dataMap[touchId];

    if (!data) return;

    if (data.touchStartEvent != undefined) {
      dataMap[touchId].custom = touchMove(
        data.touchStartEvent,
        data.touchLastEvent,
        touchMoveEvent,
        window.performance.now() - data.touchStartTime,
        data.custom
      );
    }

    dataMap[touchId].touchLastEvent = touchMoveEvent;
  }

  var onTouchEnd = function(event, touchId) {
    var touchEndEvent = mouseFromEvent(event);
    var data = dataMap[touchId];

    if (!data) return;

    if (debug) debugElem.style.display = "none";

    if (data.touchStartEvent != undefined) {
      touchEnd(
        data.touchStartEvent,
        data.touchLastEvent,
        touchEndEvent,
        window.performance.now() - data.touchStartTime,
        data.custom
      );
    }

    dataMap[touchId] = undefined;
  }

  var init = function() {
    if (debug) {
      debugElem = document.createElement("div");
      debugElem.setAttribute("style", "" +
        "width: 100px;" +
        "height: 100px;" +
        "background: #" + Math.round((0x1000000 + 0xffffff * Math.random())).toString(16).slice(1) + ";" +
        "position: absolute;" +
        "display: none;" +
        "pointer-events:none;" +
        "border-radius: 50px;" +
        "opacity: 0.3;" +
        "font-size: 20px;"
      );

      root.appendChild(debugElem);
    }

    if ('ontouchstart' in document.documentElement) {
      root.addEventListener('touchstart', onDocumentTouchStart, { passive: false });
      root.addEventListener('touchmove', onDocumentTouchMove, { passive: false });
      root.addEventListener('touchend', onDocumentTouchEnd, { passive: false });
    } else {
      root.addEventListener('mousedown', onDocumentMouseDown, false);
      root.addEventListener('mousemove', onDocumentMouseMove, false);
      root.addEventListener('mouseup', onDocumentMouseUp, false);
    }
  }

  init();
};