HTMLWidgets.widget({
  name: 'voxels',
  type: 'output',
  factory: function(el, width, height) {

    var Actions = function(scene, world) {
      var voxelMesher = new VoxelMesher(scene);

      var instance = this;
      var totalVoxels = 0;

      this.restoreBlockOriginal = function(point, color) {
        var objectName = point[0] + "|" + point[1] + "|" + point[2];
        var object = scene.getObjectByName(objectName);

        if (object) {
          if (object.userData.color == color) return;
          scene.remove(object);
          totalVoxels--;
        }
        
        if (color) {
          var particle = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: color })
          );

          particle.name = objectName;

          particle.userData = {
            voxel: true,
            color: color
          };

          particle.position.x = point[0] * 100 + 50;
          particle.position.y = point[1] * 100 + 50;
          particle.position.z = point[2] * 100 + 50;

          totalVoxels++;
          scene.add(particle);
        }
      };

      this.restoreBlock = function(point, color) {
        //this.restoreBlockOriginal(point, color);

        // voxelMesher.set(point, color);
        // voxelMesher.mesh();

        voxelMesher.meshIncremental(point, color);

        scene.changed = true;
      }

      this.addBlock = function(point, color) {
        instance.restoreBlock(point, color);
        proxy.setMaterial(point, color, 1.0);
      };

      this.removeBlock = function(intersects) {
        scene.remove(intersects.object);

        var point = [
          Math.floor((intersects.point.x - intersects.face.normal.x) / 100),
          Math.floor((intersects.point.y - intersects.face.normal.y) / 100),
          Math.floor((intersects.point.z - intersects.face.normal.z) / 100),
        ];

        // instance.restoreBlock(point, null);
        proxy.setMaterial(point, null, 1.0);
      };

      this.changeWorld = function(index) {
        totalVoxels = 0;
        world(index);
      };

      setInterval(function() {
        console.log("Total voxels: " + totalVoxels);
      }, 5000)
    };

    var Grid3D = function (proxy, width, height) {
      var instance = this;
      var scene, renderer, camera, light;
      var floor;
      var head;
      var lastMaterial = 0;
      var stats;

      this.setLastMaterial = function(stamp) { lastMaterial = stamp; }
      this.getLastMaterial = function(stamp) { return lastMaterial; }
      this.getObjects = function() { return scene.children; }

      var changeWorld = function(index) {
        var remove = [];
        scene.traverse(function(object) {
          if (object.userData && object.userData.voxel) {
            remove.push(object.name);
          }
        });

        for (var i = 0; i < remove.length; i++) {
          scene.remove(scene.getObjectByName(remove[i]));
        }
        
        totalVoxels = 0;
        instance.setLastMaterial(0);
        if (index !== undefined) proxy.setAltitude(index);
      };

      function init(width, height) {
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        el.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFFFF);
        scene.fog = new THREE.Fog(scene.background, 1, 10000);

        camera = new THREE.PerspectiveCamera(70, width / height, 1, 10000);

        head = new THREE.Object3D();
        head.position.y = 650;
        head.position.x = 0;
        head.position.z = 350;
        scene.add(head);
        
        var actions = new Actions(scene, changeWorld);
        proxy.onPositionChanged(changeWorld);

        var features = [{
            constructor: DragToRotate,
            enabled: true
          },{
            constructor: BasicLights,
            enabled: true
          },{
            constructor: ClickAddsBlock,
            enabled: true
          },{
            constructor: ClickAddsCube,
            enabled: false
          },{
            constructor: ClickDetection,
            enabled: true
          },{
            constructor: LongClickDeletes,
            enabled: true
          },{
            constructor: DragToMove,
            enabled: false
          },{
            constructor: GridFloor,
            enabled: true
          },{
            constructor: MoveControls,
            enabled: true
          },{
            constructor: HeightControls,
            enabled: true
          },{
            constructor: WorldsMenu,
            enabled: false
          },{
            constructor: DownloadSTL,
            enabled: false
          },{
            constructor: CommandsMenu,
            enabled: true
          }
        ];

        var env = {
          color: "#3366ff",
          menu: []
        };

        for (idx in features) {
          var feature = features[idx];
          if (feature.enabled) new feature.constructor(renderer, scene, camera, head, env, actions);
        }

        setTimeout(function() {
          var last = instance.getLastMaterial();
          proxy.getMaterials(last, function(materials, newlast) {
            for (key in materials) {
              var material = materials[key];
              actions.restoreBlock(material.place, material.color);
            }
            instance.setLastMaterial(newlast);
          });
        }, 100);

        setInterval(function() {
          console.log(renderer.info);
        }, 10000)

        stats = new Stats();
        stats.showPanel(0);
        // document.body.appendChild(stats.dom);
      }

      this.setSize = function(width, height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        scene.changed = true;
        renderer.setSize(width, height);
      }

      function animate() {
        if (scene.changed) {
          stats.begin();
          renderer.render(scene, camera);
          stats.end();

          scene.changed = false;
        }
        
        
        requestAnimationFrame(animate);
      }

      init(width, height);

      scene.changed = true;
      animate();
    };

    var proxy;
    var grid;

    return {
      renderValue: function(x) {
        proxy = new ProxyMatrix(false);
        grid = new Grid3D(proxy, width, height);
        
        if (x.data) {
          for (row = 0; row < x.data.length; row++) {
            for (col = 0; col < x.data[row].length; col++) {
              if (x.data[row][col] > 0) {
                proxy.setMaterial([row, col, 0], "0000FF", 1.0);
              }
            }
          }
        }
      },

      resize: function(width, height) {
        grid.setSize(width, height);
      }
    };
  }
});