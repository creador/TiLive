/*
 * Copyright (c) 2011-2014 YY Digital Pty Ltd. All Rights Reserved.
 * Please see the LICENSE file included with this distribution for details.
 */

var connect_button = Ti.UI.createButton({title:'Conectar', color: '#52A2D8', left: "10dp", width: Ti.UI.SIZE});

module.exports = {
  add: function(o) {
    connect_button.addEventListener('click', o.connect);
    if(Ti.Platform.osname !== "android") {
      connect_button.style = Ti.UI.iOS.SystemButtonStyle.DONE;
      var flexSpace = Ti.UI.createButton({
        systemButton:Titanium.UI.iOS.SystemButton.FLEXIBLE_SPACE
      });

      var title = Ti.UI.createLabel({
        text:"Live Tester",
        color: '#214C8F',
        font:{
          fontSize:18,
          fontWeight:'bold'
        }
      });

      var bar = Ti.UI.createToolbar({
        items:[connect_button,flexSpace, title, flexSpace],
        top:0,
        barColor:'#f8f8f8',
        height:40
      });

      o.win.add(bar);
    } else {
      var view = Ti.UI.createView({
        height: "50dp",
        width: Ti.UI.FILL,
        top: 0,
        backgroundColor: '#f8f8f8'
      });
      connect_button.backgroundColor = '#f8f8f8';
      view.add(connect_button);
      o.win.add(view);
    }
  },
  setConnected: function(val) {
    connect_button.connected = val;
    connect_button.title = val ? "Desconectar" : "Conectar";
    connect_button.width = Ti.UI.SIZE;
  }
};

