function BasicLights(renderer, scene, camera, objects, head, actions, root) {
  var init = function() {
    var light = new THREE.PointLight(0xFFFFFF, 0.50);
    light.position.set(0, 100000, 0);
    scene.add(light);

    var light = new THREE.PointLight(0xFFFFFF, 0.45);
    light.position.set(0, 0, -100000);
    scene.add(light);

    var light = new THREE.PointLight(0xFFFFFF, 0.40);
    light.position.set(0, 0, 100000);
    scene.add(light);

    var light = new THREE.PointLight(0xFFFFFF, 0.35);
    light.position.set(0, 0, -100000);
    scene.add(light);

    var light = new THREE.PointLight(0xFFFFFF, 0.30);
    light.position.set(100000, 0, 0);
    scene.add(light);

    var light = new THREE.PointLight(0xFFFFFF, 0.25);
    light.position.set(-100000, 0, 0);
    scene.add(light);

    var light = new THREE.AmbientLight(0x808080);
    scene.add( light );
  }

  init();
}