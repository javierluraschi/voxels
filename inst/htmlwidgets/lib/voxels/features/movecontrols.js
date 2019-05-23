function MoveControls(renderer, scene, camera, head, env, actions, root) {

  var rootX = Convert.offset(root).left + 60;
  var rootY = Convert.offset(root).top + Convert.offset(root).height - 110;

  var moveTo = null;

  var menu = new TouchMenu(
    root,
    [
      {
        label: "",
        html: FontAwesome.move,
        position: [rootX, rootY],
        children: [
          {
            label: "",
            html: FontAwesome.down,
            position: [rootX, rootY + 55],
            active: function() {
              moveTo = "B";
            },
            inactive: function() {
              if (moveTo == "B") moveTo = null;
            }
          },
          {
            label: "",
            html: FontAwesome.left,
            position: [rootX - 55, rootY],
            active: function() {
              moveTo = "L";
            },
            inactive: function() {
              if (moveTo == "L") moveTo = null;
            }
          },
          {
            label: "",
            html: FontAwesome.up,
            position: [rootX, rootY - 55],
            active: function() {
              moveTo = "F";
            },
            inactive: function() {
              if (moveTo == "F") moveTo = null;
            }
          },
          {
            label: "",
            html: FontAwesome.upup,
            position: [rootX, rootY - 110],
            active: function() {
              moveTo = "FF";
            },
            inactive: function() {
              if (moveTo == "FF") moveTo = null;
            }
          },
          {
            label: "",
            html: FontAwesome.right,
            position: [rootX + 55, rootY],
            active: function() {
              moveTo = "R";
            },
            inactive: function() {
              if (moveTo == "R") moveTo = null;
            }
          }
        ],
        root: true
      }
    ]
  );

  var previousTime = null;

  function onMoveInterval() {
    if (moveTo) {
      var currentTime = new Date().getTime();
      var delta = 15;
      
      if (previousTime !== null) {
        delta = Math.floor((currentTime - previousTime) / 2);
      }

      previousTime = currentTime;

      if (moveTo == "F" || moveTo == "B") {
        head.translateZ(moveTo == "F" ? -delta : delta);

        scene.changed = true;
      } else if (moveTo == "FF") {
        head.translateZ(-3 * delta);

        scene.changed = true;
      } else if (moveTo == "L" || moveTo == "R") {
        head.translateX(moveTo == "L" ? -delta : delta);

        scene.changed = true;
      }
    }
    else {
      previousTime = null;
    }
  };

  var init = function() {
    setInterval(onMoveInterval, 30)
  }

  init();
}