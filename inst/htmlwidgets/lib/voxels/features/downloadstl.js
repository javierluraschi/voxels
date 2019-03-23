function DownloadSTL(renderer, scene, camera, head, env, actions) {
  var download = function() {
    var exporter = new THREE.STLExporter();

    var scene = new THREE.Scene();
    var objects = grid.getObjects();
    for (idx in objects) {
      var obj = objects[idx];
      if (obj.userData && obj.userData.voxel) {
        scene.add(obj.clone());
      }
    }

    var stlString = exporter.parse(scene);
    var blob = new Blob([stlString], {type: "text/plain"});

    saveAs(blob, "blocks.stl");
  };

  var init = function() {
    env.menu.push({
      label: "D",
      callback: download
    });
  };

  init();
}