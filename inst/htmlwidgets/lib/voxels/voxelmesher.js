function VoxelMesher(scene) {
  var self = this;
  var store = new VoxelStore();
  
  self.wireframe = false;

  var pointToVoxel = {};

  var hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  var rgbToHex =  function(c) {
    return "#" + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
  };

  self.box = function(start, end, color, points) {
    var geometry = new THREE.BoxGeometry(
      100 * (1 + Math.abs(end[0] - start[0])),
      100 * (1 + Math.abs(end[1] - start[1])),
      100 * (1 + Math.abs(end[2] - start[2]))
    );

    var particle = null

    if (self.wireframe) {
      particle = new THREE.Mesh();

      var geo = new THREE.WireframeGeometry(geometry); // or WireframeGeometry
      var mat = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 });
      var wireframe = new THREE.LineSegments(geo, mat);

      particle.add(wireframe);
    }
    else {
      var rgb = hexToRgb(color);
      var mod = {
        r: Math.min(Math.round(rgb.r * (Math.random() * 0.02 + 0.99)), 255),
        g: Math.min(Math.round(rgb.g * (Math.random() * 0.02 + 0.99)), 255),
        b: Math.min(Math.round(rgb.b * (Math.random() * 0.02 + 0.99)), 255)
      };
      color = rgbToHex(mod);

      particle = new THREE.Mesh(
        geometry ,
        new THREE.MeshLambertMaterial({ color: color })
      );
    }

    particle.userData = {
      voxel: true,
      color: color,
      points: points
    };

    particle.position.x = (start[0] + Math.abs(end[0] - start[0]) / 2) * 100 + 50;
    particle.position.y = (start[1] + Math.abs(end[1] - start[1]) / 2) * 100 + 50;
    particle.position.z = (start[2] + Math.abs(end[2] - start[2]) / 2) * 100 + 50;

    scene.add(particle);
    self.totalVoxels += 1;

    for (var idx in points) {
      pointToVoxel[points[idx].join("|")] = particle;
    }
  };

  self.clear = function() {
    var idx = 0;
    while (idx < scene.children.length) { 
      if (scene.children[idx].userData.voxel)
        scene.remove(scene.children[idx]); 
      else
        idx++;
    }
  }

  self.meshSimple = function() {
    self.clear();

    var points = store.list();
    for (var idx in points) {
      self.box(points[idx], points[idx], store.get(points[idx]), []);
    }
  }

  self.meshIterate = function() {
    self.clear();

    var pending = new VoxelStore();
    pending.copy(store);
    
    var points = store.list();
    for (var idx in points) {
      pending.remove(points[idx]);
      self.box(points[idx], points[idx], store.get(points[idx]), []);
    }
  }

  self.longest = function(store, point, color, direction) {
    var result = {
      count: 1,
      list: [point],
      start: point,
      end: point,
      direction
    };

    // forward/backward
    for (var sign = 1; sign >= -1; sign -= 2) {
      var next = point;
      for(var max = 100; max > 0; max--) {
        next = [
          next[0] + sign * direction[0],
          next[1] + sign * direction[1],
          next[2] + sign * direction[2]
        ];

        if (store.get(next) !== color) break;

        result.count++;
        if (sign === 1)
          result.end = next;
        else
          result.start = next;
        result.list.push(next);
      }
    }

    return result;
  }

  self.directionComplement = function(direction) {
    if (direction[0]) return [[0, 1, 0], [0, 0, 1]];
    if (direction[1]) return [[1, 0, 0], [0, 0, 1]];
    if (direction[2]) return [[1, 0, 0], [0, 1, 0]];
  }

  self.longestArea = function(store, longest, color, direction) {
    var result = {
      count: longest.count,
      list: longest.list,
      start: longest.start,
      end: longest.end
    };

    var grew = false;

    // forward/backward
    for (var sign = 1; sign >= -1; sign -= 2) {
      var next = longest.start;
      for(var max = 100; max > 0; max--) {
        next = [
          next[0] + sign * direction[0],
          next[1] + sign * direction[1],
          next[2] + sign * direction[2]
        ];

        var last = next;
        var lastList = [];
        
        var canGrow = true;
        for (var idx = 0; idx < longest.count; idx++) {
          if (idx === 0) {
            last = next;
          }
          else {
            last = [last[0] + lineDir[0], last[1] + lineDir[1], last[2] + lineDir[2]];
          }

          var lineDir = longest.direction;
          if (store.get(last) !== color) {
            canGrow = false;
            break;
          }

          lastList.push(last);
        }
        if (!canGrow) break;

        grew = true;

        result.count += longest.count;
        if (sign === 1)
          result.end = last;
        else
          result.start = next;
        result.list = result.list.concat(lastList);
      }
    }

    return grew ? result : null;
  }

  self.meshLongestSubset = function(pending) {
    var points = pending.list();

    for (var idx in points) {
      var color = pending.get(points[idx]);
      if (!color) continue;

      var longestX = self.longest(pending, points[idx], color, [1, 0, 0]);
      var longestY = self.longest(pending, points[idx], color, [0, 1, 0]);
      var longestZ = self.longest(pending, points[idx], color, [0, 0, 1]);

      var longest = longestZ;
      if (longestX.count >= longestY.count && longestX.count >= longestZ.count) 
        longest = longestX;
      else if (longestY.count >= longestX.count && longestY.count >= longestZ.count)
        longest = longestY;


      if (longest.count > 1) {
        var oposites = self.directionComplement(longest.direction);

        var longestArea = self.longestArea(pending, longest, color, oposites[0])
        if (longestArea) {
            longest = longestArea;
        }
        else {
          longestArea = self.longestArea(pending, longest, color, oposites[1]);
          if (longestArea) {
            longest = longestArea;
          }
        }
      }

      for (var idxLongest in longest.list) {
        pending.remove(longest.list[idxLongest]);
      }

      self.box(longest.start, longest.end, store.get(longest.start), longest.list);
    }
  }

  self.meshLongest = function() {
    self.clear();

    var pending = new VoxelStore();
    pending.copy(store, store.list());
    
    self.meshLongestSubset(pending);
  }

  self.mesh = function() {
    self.meshLongest();
  }

  self.meshIncremental = function(point, color) {
    var recreatePoints = [point];

    // clear point
    var voxels = pointToVoxel[point.join("|")];
    if (voxels) {
      recreatePoints = recreatePoints.concat(voxels.userData.points);
      for (var idx in voxels.userData.points) {
        pointToVoxel[voxels.userData.points[idx].join("|")] = null;
      }
      scene.remove(voxels); 
    }

    // clear neighbors
    for (var dim = 0; dim < 3; dim++) {
      for (var sign = 1; sign >= -1; sign -= 2) {
        var neighbor = [point[0], point[1], point[2]];
        neighbor[dim] += sign;

        var voxels = pointToVoxel[neighbor.join("|")];
        if (voxels) {
          recreatePoints = recreatePoints.concat(voxels.userData.points);
          for (var idx in voxels.userData.points) {
            pointToVoxel[voxels.userData.points[idx].join("|")] = null;
          }
          scene.remove(voxels); 
        }
      }
    }

    self.set(point, color);

    var pending = new VoxelStore();
    pending.copy(store, recreatePoints);

    self.meshLongestSubset(pending);
  }

  self.set = function(point, color) {
    store.set(point, color);
  }
}