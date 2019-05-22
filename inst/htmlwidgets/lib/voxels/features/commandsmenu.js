function CommandsMenu(renderer, scene, camera, head, env, actions, root) {

  var rootX = window.innerWidth - 110;
  var rootY = 60;

  var addColorEntries = function(entry, palette, level) {
    var count = 0;
    for (key in palette) {
      var newPos;
      if (level == 0)
        newPos = [entry.position[0], entry.position[1] + 55 + 55 * count];
      else if (level == 1)
        newPos = [entry.position[0] - 55, entry.position[1] - 30 + 55 * count];
      else
        newPos = [entry.position[0] - 55 * count, entry.position[1]];

      var newEntry = {
        background: key,
        position: newPos,
        active: function(key) {
          return function() {
            env.color = key;
          }
        }(key),
        children: []
      };

      entry.children.push(newEntry);
      addColorEntries(newEntry, palette[key], level + 1);

      count++;
    }
  }

  var entries = [
    {
      label: "◆",
      background: "#ffc2cd",
      position: [rootX, rootY],
      children: [
        {
          label: "C",
          background: "#ffc2cd",
          position: [rootX, rootY + 55],
          children: []
        }
      ],
      root: true
    }
  ];

  var lastEntry = entries[0];

  var addMenuEntries = function(label, callback) {
    for (var i = 0; i < env.menu.length; i++) {
      var newEntry = {
        label: env.menu[i].label,
        background: "#ffc2cd",
        position: [lastEntry.position[0] - 55, lastEntry.position[1]],
        action: function(i) {
          return env.menu[i].callback;
        }(i),
        children: []
      };

      lastEntry = newEntry;
      entries[0].children.push(newEntry);
    }
  };

  var init = function() {
    var palettes = {
      "#77aaff": {
        "#77aaff": {"#77aaff": {}, "#99ccff": {}, "#bbeeff": {}, "#5588ff": {}, "#3366ff": {}}, /* 1. Blue: blues              */
        "#efbbff": {"#efbbff": {}, "#d896ff": {}, "#be29ec": {}, "#800080": {}, "#660066": {}}, /* 4. Shades of Purple         */
      },
      "#b62020": {
        "#b62020": {"#b62020": {}, "#cb2424": {}, "#fe2e2e": {}, "#fe5757": {}, "#fe8181": {}}, /* 2. Red: Red pt1             */
        "#ffc2cd": {"#ffc2cd": {}, "#ff93ac": {}, "#ff6289": {}, "#fc3468": {}, "#ff084a": {}}, /* 10. Pink: Princess Pink     */     
      },
      "#4d7f17": {
        "#4d7f17": {"#4d7f17": {}, "#6bb120": {}, "#8ae429": {}, "#9afe2e": {}, "#aefe57": {}}, /* 3. Green pt1                */
        "#fff100": {"#fff100": {}, "#ffdf00": {}, "#ffce00": {}, "#ffac00": {}, "#ff9b00": {}}, /* 6/7. O/Y: Demons Eye Orange */ 
      },
      "#999999": {
        "#999999": {"#999999": {}, "#777777": {}, "#555555": {}, "#333333": {}, "#111111": {}}, /* 5. Shades of Gray           */
        "#ffd4e5": {"#ffd4e5": {}, "#d4ffea": {}, "#eecbff": {}, "#feffa3": {}, "#dbdcff": {}}, /* 9. White: Pastels           */
      },
      "#a67c00": {
        "#a67c00": {"#a67c00": {}, "#bf9b30": {}, "#ffbf00": {}, "#ffcf40": {}, "#ffdc73": {}}, /* 8. Gold: 24K GOLD           */
        "#8d5524": {"#8d5524": {}, "#c68642": {}, "#e0ac69": {}, "#f1c27d": {}, "#ffdbac": {}}  /* 11. Skin Tones              */ 
      }
    };

    var colorsEntry = entries[0].children[0];
    addColorEntries(colorsEntry, palettes, 0);

    addMenuEntries();

    var menu = new TouchMenu(
      root,
      entries
    );
  }

  init();
}