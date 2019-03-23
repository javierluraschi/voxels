function VoxelStore() {
  var self = this;

  var voxels = {};

  self.list = function() {
    var keys = Object.keys(voxels);
    var points = [];
    for (var idx in keys) {
      var key = keys[idx];
      if (voxels[key]) points.push(voxels[key].point);
    }

    return points;
  }

  self.get = function(point) {
    var objectName = point[0] + "|" + point[1] + "|" + point[2];
    var object = voxels[objectName];

    if (object) {
      return object.color;
    }
    else {
      return null;
    }
  }

  self.set = function(point, color) {
    var objectName = point[0] + "|" + point[1] + "|" + point[2];
    voxels[objectName] = {};
    voxels[objectName].color = color;
    voxels[objectName].point = point;
  }

  self.copy = function(store, points) {
    for (var idx in points) {
      self.set(points[idx], store.get(points[idx]));
    }
  }

  self.remove = function(point) {
    if (self.get(point)) {
      var objectName = point[0] + "|" + point[1] + "|" + point[2];
      voxels[objectName] = null;
    }
  }
};