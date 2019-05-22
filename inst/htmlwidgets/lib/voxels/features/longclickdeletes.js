function LongClickDeletes(renderer, scene, camera, head, env, actions, root) {
  var raycaster = new THREE.Raycaster();

  var touchTracker = new TouchTracker(renderer.domElement,
    function(start, last, end, time, data) {
      return {
        canDeleteBlock: true
      };
    },
    function(start, last, end, time, data) {
      if (Math.abs(end.x - start.x) > 0.05 || 
          Math.abs(end.y - start.y) > 0.05)
        data.canDeleteBlock = false;

      return data;
    },
    function(start, last, end, time, data) {
      if (data.canDeleteBlock && time > 150)
        deleteBlock(end);

      canDeleteBlock = false;
    });

  var deleteBlock = function(point) {
    raycaster.setFromCamera(point, camera);

    var intersects = raycaster.intersectObjects(scene.children);
    var idx = 0;

    while (idx < intersects.length &&
           (!intersects[idx].object.userData || !intersects[idx].object.userData.voxel)) {
      idx ++;
    }

    if (intersects.length > 0 && idx < intersects.length) {
      actions.removeBlock(intersects[idx]);
    }
  }
}