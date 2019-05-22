function GridFloor(renderer, scene, camera, head, env, actions, root) {
  var init = function() {
    var gridHelper = new THREE.GridHelper(100000, 1000, 0xF0F0F0, 0xF0F0F0);
    gridHelper.position.y = 1.5;
    gridHelper.position.x = 0;
    scene.add(gridHelper);

    floor = new THREE.Mesh(
      new THREE.BoxGeometry(100000, 1, 100000),
      new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 1.0 } )
    );
    floor.position.x = 0;
    floor.position.y = 0;
    floor.position.z = 0;
    scene.add(floor);
  }

  init();
}