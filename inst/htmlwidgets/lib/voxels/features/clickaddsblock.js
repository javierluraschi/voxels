function ClickAddsBlock(renderer, scene, camera, head, env, actions) {
  var init = function() {
    env.click = function(point) {
      actions.addBlock(point, env.color);
    };
  };

  init();
}