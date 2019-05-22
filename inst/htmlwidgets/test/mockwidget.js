var HTMLWidgets = {
  widget: function(data) {
    var el = document.getElementById("voxels");
    
    var voxels = data.factory(el, el.offsetWidth, el.offsetHeight, false);
    voxels.renderValue({
      data: null,
      wireframe: false
    });
  }
};