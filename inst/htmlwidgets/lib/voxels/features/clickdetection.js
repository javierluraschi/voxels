function ClickDetection(renderer, scene, camera, head, env, actions) {
  var raycaster = new THREE.Raycaster();

  var touchTracker = new TouchTracker(renderer.domElement,
    function(start, last, end, time, data) {
      return {
        canAddBlock: true
      }
    },
    function(start, last, end, time, data) {
      if (Math.abs(end.x - start.x) > 0.05 ||
          Math.abs(end.y - start.y) > 0.05)
        data.canAddBlock = false;

      return data;
    },
    function(start, last, end, time, data) {
      if (data.canAddBlock && time < 150)
        addBlock(end);
    });

  var addBlock = function(point) {
    raycaster.setFromCamera(point, camera);

    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      var point = [
        Math.floor(Math.round(intersects[0].point.x) / 100) - (intersects[0].face.normal.x < 0 ? 1 : 0),
        Math.floor(Math.round(intersects[0].point.y) / 100) - (intersects[0].face.normal.y < 0 ? 1 : 0),
        Math.floor(Math.round(intersects[0].point.z) / 100) - (intersects[0].face.normal.z < 0 ? 1 : 0)
      ];

      env.click(point);
    }
  }
}