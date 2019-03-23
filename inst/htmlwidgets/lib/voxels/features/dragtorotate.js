function DragToRotate(renderer, scene, camera, head, env, actions) {
  var pitch;

  var touchTracker = new TouchTracker(renderer.domElement,
    function(start, last, end, time, data) {
    },
    function(start, last, end, time, data) {
      head.rotation.y -= 4 * (end.x - last.x);
      pitch.rotation.x += 4 * (end.y - last.y);

      if (pitch.rotation.x < -Math.PI / 2) pitch.rotation.x = -Math.PI / 2;
      if (pitch.rotation.x > Math.PI / 2) pitch.rotation.x = Math.PI / 2;

      scene.changed = true;
    },
    function(start, last, end, time, data) {
    });

  var init = function() {
    pitch = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshLambertMaterial({ color: 0x00ff33 })
    );
    pitch.position.y = 0
    pitch.position.x = 0;
    pitch.position.z = -0;
    head.add(pitch);

    pitch.rotation.x = - Math.PI / 8;

    scene.remove(camera);
    pitch.add(camera);
  }

  init();
}