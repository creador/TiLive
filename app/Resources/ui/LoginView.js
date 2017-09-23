/*
 * Copyright (c) 2011-2014 YY Digital Pty Ltd. All Rights Reserved.
 * Please see the LICENSE file included with this distribution for details.
 */

/*globals, exports, require, mixin*/
var Styles = require('/ui/Styles').login;

function LoginView() {
  var view = Ti.UI.createView();
  var black = Ti.UI.createView({
     backgroundColor: 'black',
     opacity: 0.4
  });
  black.addEventListener('click', function() {
    view.parent.remove(view);
  });
  view.add(black);

  //Container
  var container = Ti.UI.createView(Styles.container);

  // "Tabs"
  var leftTab = Ti.UI.createLabel(Styles.leftTab);
  var rightTab = Ti.UI.createLabel(Styles.rightTab);
  //container.add(rightTab);
  //container.add(leftTab);


  //views
  var header = Ti.UI.createLabel(Styles.header);

  var host   = { value:'' }; // Ti.UI.createTextField(Styles.host);
  //var colon  = Ti.UI.createLabel(Styles.colon);
  var port   = { value:'' }; // Ti.UI.createTextField(Styles.port);
  var button = Ti.UI.createButton(Styles.button);
  var room   = Ti.UI.createTextField(Styles.room);

  //container.height = "210dp";

  host.value = Ti.App.Properties.getString("tishadow:address");
  if (host.value=='' || !host.value) {
  	host.value = '208.52.154.126'; // http://www.creador.cl
  	Ti.App.Properties.setString("tishadow:address", host.value);
  }
  /*host.addEventListener("change", function() {
    Ti.App.Properties.setString("tishadow:address", host.value);
  });*/

  port.value = Ti.App.Properties.getString("tishadow:port");
  if (port.value=='' || !port.value) {
  	port.value = '10000';
  	Ti.App.Properties.setString("tishadow:port", port.value);
  }

  room.value = Ti.App.Properties.getString("tishadow:room"); // nombre de usuario
  room.addEventListener("change", function() {
    Ti.App.Properties.setString("tishadow:room", room.value);
  });

  button.addEventListener('click', function() {
    if (Ti.App.Properties.getString("tishadow:port","").length === 0) {
      port.value = "10000";
    }
    Ti.App.Properties.setString("tishadow:port", port.value);
    view.fireEvent("connect"); // conectamos a server
  });

  container.add(header);
  //container.add(host);
  container.add(room); // usuario
  container.add(button); // boton conectar
  //container.add(colon);
  //container.add(port);
  view.add(container);

  return view;
};

module.exports = LoginView;
