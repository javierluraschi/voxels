function WorldsMenu(renderer, scene, camera, head, env, actions) {

  var rootX = 60;
  var rootY = 60;

  var last = 0;

  var entries = [
    {
      label: "◆",
      background: "#00AA00",
      position: [rootX, rootY],
      children: [],
      root: true
    }
  ];

  var init = function() {
    for (var i = 0; i < 20; i++) {
      var closure = function(idx) {
        return function() {
          if (last != idx) {
            actions.changeWorld(idx);
            last = idx;
          }
        }
      };

      entries[0].children.push(
        {
          label: i + 1,
          background: "#00AA00",
          position: [rootX + 55 * i + 55, rootY],
          active: closure(i),
          inactive: function() {
          }
        }
      );
    }

    var menu = new TouchMenu(
      entries
    );
  }

  init();
}