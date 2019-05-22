function ClickAddsBlock(renderer, scene, camera, head, env, actions, root) {
  var init = function() {
    env.click = function(point) {
      actions.addBlock(point, env.color);
    };
  };

  init();
}