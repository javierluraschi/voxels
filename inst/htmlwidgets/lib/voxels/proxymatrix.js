function RemoteService(object) {
  this.request = function(action, args, success, failure) {
    var serverUrl = location.hostname === "" ? "http://localhost:3000" : "https://api.breakerofthechains.com";
    var url = serverUrl + "/" + object + "/" + action;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (success !== undefined && xhr.responseText.length > 0) success(JSON.parse(xhr.responseText));
        } else {
          console.log("RemoteService ERROR: " + xhr.status);
          if (failure !== undefined) failure(xhr.status);
        }
      }
    }
    xhr.onerror = function() {
      console.log("RemoteService ERROR: " + xhr.statusText);
      if (failure !== undefined) failure(xhr.statusText);
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(args));
  };
}

function RemoteMatrix() {
  var remote = new RemoteService("matrix");

  this.getStats = function(position, success, failure) {
    remote.request("getStats", [position], success, failure);
  }

  this.getMaterials = function(position, created, success, failure) {
    remote.request("getMaterials", [position, created], success, failure);
  }

  this.createEntity = function(position, name, place, iterations, success, failure) {
    remote.request("createEntity", [position, name, place, iterations], success, failure);
  }

  this.setMaterial = function(position, place, color, opacity, success, failure) {
    remote.request("setMaterial", [position, place, color, opacity], success, failure);
  }

  this.syncMaterials = function(position, newMaterials, snapshot, success, failure) {
    remote.request("syncMaterials", [position, newMaterials, snapshot], success, failure);
  }

  this.getLogs = function(position, success, failure) {
    remote.request("getLogs", [position], success, failure);
  }
}

var RemoteSessions = function() {
  var remote = new RemoteService("sessions");

  var session = {
    interval: 100,
    token: null
  };

  this.refresh = function(position, success) {
    remote.request("refresh", [position, session.token], function(data) {
      session = data;
      success(data)
    });
  }
}

var ProxyMatrix = function() {
  var instance = this;

  var sessions = new RemoteSessions();
  var remote = new RemoteMatrix();
  var local = new Matrix();
  var position = [0, 0, 0];

  var snapshots = {};

  var onStatusChangedCallback;
  var onPositionChangedCallback;

  this.setMaterial = function(place, color, opacity) {
    local.setMaterial(position, place, color, opacity);
  };

  this.createEntity = function(name, place, iterations) {
    local.createEntity(position, name, place, iterations);
  };

  this.getMaterials = function(created, success) {
    var materials = local.getMaterials(position, created, success);
  };

  this.getLogs = function(success) {
    var logs = local.logs(position, success);
  };

  this.getRemoteMaxLag = function() {
    return 2000;
  };

  var syncPending = false;
  this.syncMaterials = function() {
    if (syncPending) return;
    syncPending = true;

    var currentPosition = position;

    var snapshotKey = currentPosition.join("_");
    if (!snapshots[snapshotKey]) {
      snapshots[snapshotKey] = {
        remote: 0,
        local: 0
      }
    }

    console.debug("Locally retrieving materials for " + currentPosition.join(",") + ".");
    local.syncMaterials(currentPosition, [], snapshots[snapshotKey].local, (function(currentPosition, snapshotKey) {
      return function(localResponse) {            
        console.debug(localResponse.materials.length + " materials being uploaded for " + currentPosition.join(",") + "/" + snapshotKey + ".");
        remote.syncMaterials(currentPosition, localResponse.materials, Math.max(snapshots[snapshotKey].remote - instance.getRemoteMaxLag()), function(remoteResponse) {
          if (remoteResponse.snapshot < snapshots[snapshotKey].local) return;

          console.debug(remoteResponse.materials.length + " materials remotely retrieved for " + currentPosition.join(",") + "/" + snapshotKey + ".");

          snapshots[snapshotKey].local = localResponse.snapshot;
          snapshots[snapshotKey].remote = remoteResponse.snapshot;
          syncPending = false;

          console.debug(remoteResponse.materials.length + " materials being locally updated for " + currentPosition.join(",") + "/" + snapshotKey + ".");
          local.syncMaterials(currentPosition, remoteResponse.materials, localResponse.snapshot);
        }, function() {
          syncPending = false;
        });
      };
    })(currentPosition.slice(), snapshotKey));
  };

  this.onStatusChanged = function(callback) {
    onStatusChangedCallback = callback;
  }

  this.onPositionChanged = function(callback) {
    onPositionChangedCallback = callback;
  }

  this.setAltitude = function(altitude) {
    position[2] = altitude;
  }

  var changeStatus = function(message) {
    if (onStatusChangedCallback) onStatusChangedCallback(message);
  }

  var changePosition = function() {
    if (onPositionChangedCallback) onPositionChangedCallback();
  }

  var init = function() {
    sessions.refresh(position, function(session) {
      setInterval(function() {
        instance.syncMaterials(position);
      }, session.interval);
    });
  };

  var positionToGrid = function(raw) {
    return Math.floor(raw * 1000) / 1000;
  };

  var updatePosition = function(latitude, longitude) {
    var lat = positionToGrid(latitude);
    var lng = positionToGrid(longitude);

    position = [lat, lng, 0];
    init();

    changeStatus(lat + ", " + lng);
    changePosition();
  };
  
  updatePosition(0, 0);
}