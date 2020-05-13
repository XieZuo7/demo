(function() {
  'use strict';
var infoConsole = document.getElementById('info');
if (infoConsole) {
    if (console) {
        var _console = {
            log: console.log
        }
        console.log = function (attr) {
            _console.log(attr);
            var str = JSON.stringify(attr, null, 4);
            var node = document.createElement("H1");
            var textnode = document.createTextNode(str);
 
            node.appendChild(textnode);
            infoConsole.appendChild(node);
        }
    }
 
    function show() {
        var type = infoConsole.getAttribute("type");
        if (type === "0") {
            infoConsole.style.cssText = "width:100vw;height:40vh;";
            infoConsole.setAttribute("type", "1");
        } else {
            infoConsole.removeAttribute('style');
            infoConsole.setAttribute("type", "0");
        }
    }
}
  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let redSlider = document.querySelector('#red');
    let greenSlider = document.querySelector('#green');
    let blueSlider = document.querySelector('#blue');
    let port;

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          console.log(textDecoder.decode(data));
        }
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error;
      });
    }

    function onUpdate() {
      if (!port) {
        return;
      }

      let view = new Uint8Array(3);
      view[0] = parseInt(redSlider.value);
      view[1] = parseInt(greenSlider.value);
      view[2] = parseInt(blueSlider.value);
      port.send(view);
    };

    redSlider.addEventListener('input', onUpdate);
    greenSlider.addEventListener('input', onUpdate);
    blueSlider.addEventListener('input', onUpdate);

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = error;
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        statusDisplay.textContent = 'No device found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });
  });
})();
