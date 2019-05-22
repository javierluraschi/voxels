var HTMLWidgets = {
  widget: function(data) {
    var el = document.getElementById("voxels");
    
    var voxels = data.factory(el, 400, 200, false);
    voxels.renderValue({
      data: null,
      wireframe: false
    });
  }
};