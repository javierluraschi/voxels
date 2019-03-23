function ClickAddsCube(renderer, scene, camera, head, env, actions) {
  var init = function() {
    env.menu.push({
      label: "L",
      callback: function() {
        var previous = env.click;
        env.click = function(point) {
          for (var x = -2; x <= 2; x++)
            for (var y = 0; y <= 5; y++)
              for (var z = -2; z <= 2; z++)
                actions.addBlock([
                  point[0] + x,
                  point[1] + y,
                  point[2] + z
                ], env.color);

          env.click = previous;
        };
      }
    });
  };

  init();
}