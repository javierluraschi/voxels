function Entity(iterate, iterations, position, state, name) {
  this.iterate = function(matrix) {
    iterations -= 1;
    iterate(matrix, position, state);
  };

  this.getIterations = function() { return iterations; }
  this.getState = function() { return state; }
  this.getName = function() { return name; }
  this.getPosition = function() { return position; }
}

function Templates() {
  var seed = 1;
  var random = function() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
  };

  var instance = this;
  var templates = {
    random: function(matrix, position, state) {
      var trace = matrix.createEntity(
        position,
        "trace",
        state.place,
        10
      );

      state.place[0] += Math.ceil(random() * 3 - 2);
      state.place[1] += Math.ceil(random() * 3 - 2);

      if (state.place[0] < 0) state.place[0] = 0;
      if (state.place[1] < 0) state.place[1] = 0;
    },
    trace: function(matrix, position, state) {
      if (state.opacity === undefined) 
        state.opacity = 100;
      else
        state.opacity -= 10;

      if (state.opacity >= 0) {
        matrix.setMaterial(position, state.place, "#0000FF", state.opacity / 100);
      }
    }
  };

  this.createEntity = function(position, name, place, iterations) {
    var state = {
      place: place.slice()
    };

    return new Entity(templates[name], iterations, position, state, name);
  };
}

function PerfClockInstance() {
  var baseTime = Date.now();

  this.now = function() {
    return baseTime + window.performance.now();
  };
};

var PerfClock = new PerfClockInstance();

function Matrix() {
  var matrix = this;
  var templates = new Templates();

  var emptyPartition = function() {
    return {
      entities: {},
      entitiesIdx: 0,
      materials: {},
      logdata: [],
      modified: 0
    };
  };

  var partitions = {
    "0|0|0": emptyPartition()
  };

  var getPartition = function(position) {
    var key = position.join("|");
    if (partitions[key] === undefined) partitions[key] = emptyPartition();

    return partitions[key];
  }

  var log = function(position, message) {
    var logdata = getPartition(position).logdata;

    if (logdata.length > 200) logdata = logdata.splice(0, 100);
    logdata.push(message);
  };

  this.getMaterials = function(position, created, success) {
    var result = [];
    var materials = getPartition(position).materials;

    var latest = {};
    var last = created;
    for (var materialKey in materials) {
      var material = materials[materialKey];
      
      if (material.created <= created) continue;
      
      var key = material.place.join("|");
      if (!latest[key] || latest[key].created < material.created) {
        latest[key] = material;
        if (last < material.created) last = material.created;
      }
    }

    success(latest, last);
  };

  this.getEntities = function(position, success) {
    success(getPartition(position).entities);
  };

  this.getStats = function(position, success) {
    success({
      entities: Object.keys(getPartition(position).entities).length,
      materials: Object.keys(getPartition(position).materials).length
    });
  };

  this.getLogs = function(position, success) {
    success(getPartition(position).logdata);
  };

  this.createEntity = function(position, name, place, iterations, success) {
    var partition = getPartition(position);
    var entity = templates.createEntity(position, name, place, iterations);

    log(position, "created " + entity.getName() + " entity with key " + partition.entitiesIdx);
    partition.entities[partition.entitiesIdx] = entity;
    partition.entitiesIdx += 1;

    if (success !== undefined) success();
  };

  this.setMaterial = function(position, place, color, opacity, success) {
    var partition = getPartition(position);
    
    var newMaterial = {
      created: PerfClock.now(),
      place: place,
      color: color,
      opacity: opacity
    };

    while (partition.materials[newMaterial.created]) {
      newMaterial.created = PerfClock.now();
    }
    
    partition.materials[newMaterial.created] = newMaterial;
    partition.modified = newMaterial.created;
    
    if (success !== undefined) success();
  };

  this.syncMaterials = function(position, newMaterials, snapshot, success) {
    var partition = getPartition(position);

    var newerMaterials = [];
    if (snapshot < partition.modified) {
      for (var materialKey in partition.materials) {
        if (partition.materials[materialKey].created > snapshot) {
          newerMaterials.push(partition.materials[materialKey]);
        }
      }
    }

    if (newMaterials.length > 0) {
      for (var materialKey in newMaterials) {
        var material = newMaterials[materialKey];
        partition.materials[material.created] = material;
      }

      partition.modified = Date.now();
    }

    if (success !== undefined) success({
      materials: newerMaterials,
      snapshot: Date.now()
    });
  };

  var iterate = function() {
    for (partitionKey in partitions) {
      var partition = partitions[partitionKey];

      for (key in partition.entities) {
        var entity = partition.entities[key];
        entity.iterate(matrix);

        if (entity.getIterations() === 0) {
          log(entity.getPosition(), "deleted " + entity.getName() + " entity with key " + key);

          delete partition.entities[key];
        }
      }
    }
  };
 
  setInterval(iterate, 100);
}

if (typeof(module) !== "undefined") {
  module.exports = {
    Entity: Entity,
    Templates: Templates,
    Matrix: Matrix,
    PerfClock: PerfClock
  }
}
