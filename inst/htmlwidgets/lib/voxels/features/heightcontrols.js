function HeightControls(renderer, scene, camera, head, env, actions) {

  var rootX = window.innerWidth - 110;
  var rootY = window.innerHeight - 110;

  var moveTo = null;

  var menu = new TouchMenu(
    [
      {
        label: "◆",
        position: [rootX, rootY],
        children: [
          {
            label: "▼",
            position: [rootX, rootY + 55],
            active: function() {
              moveTo = "D";
            },
            inactive: function() {
              if (moveTo == "D") moveTo = null;
            }
          },
          {
            label: "▲",
            position: [rootX, rootY - 55],
            active: function() {
              moveTo = "U";
            },
            inactive: function() {
              if (moveTo == "U") moveTo = null;
            }
          }
        ],
        root: true
      }
    ]
  );

  function onDocumentTouchStart(event) {
  }

  function onDocumentTouchMove(event) {
  }

  function onDocumentTouchEnd(event) {
    moveTo = null;
  }

  function mouseFromEvent(event) {
  }

  function onDocumentMouseDown(event) {
  }

  function onDocumentMouseMove(event) {
  }

  function onDocumentMouseUp(event) {
    moveTo = null;
  }

  function onMoveInterval() {
    if (moveTo) {
      if (moveTo == "D" && head.position.y > 100) {
        head.translateY(-10);

        scene.changed = true;
      } else if (moveTo == "U" && head.position.y < 4000) {
        head.translateY(10);

        scene.changed = true;
      }
    }
  };

  var init = function() {
    if ('ontouchstart' in document.documentElement) {
      renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, { passive: false });
      renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, { passive: false });
      renderer.domElement.addEventListener('touchend', onDocumentTouchEnd, { passive: false });
    } else {
      renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
      renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
      renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
    }

    setInterval(onMoveInterval, 20)
  }

  init();
}