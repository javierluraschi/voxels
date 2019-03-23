function DragToMove(renderer, scene, camera, head, env, actions) {
  var touchTracker = new TouchTracker(renderer.domElement,
    function(start, last, end, time, data) {
    },
    function(start, last, end, time, data) {
      camera.position.x += 400 * (end.x - last.x);
      camera.position.z += -600 * (end.y - last.y);

      scene.changed = true;
    },
    function(start, last, end, time, data) {
    });
}