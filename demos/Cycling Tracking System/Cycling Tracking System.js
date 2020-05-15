(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let port;

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';

        port.onReceive = data => {
          
          let textDecoder = new TextDecoder();
          console.log(textDecoder.decode(data));
          //document.getElementById("value10").innerHTML = textDecoder.decode(data);
          let view = new Array(3);
          var string = textDecoder.decode(data);
          var reg = /\d+/g;
          var number = string.match(reg);
          int value8 = 0;
          int value9 = 0;
          int value10 = 0;
          int i = 0;

          view[0] = number[0];
          view[1] = number[1];
          view[2] = number[2];
          document.getElementById("valueDay").innerHTML = view[0];
          document.getElementById("valueL").innerHTML = view[1];
          document.getElementById("valueR").innerHTML = view[2];
          if(view[1] > 1000 && i < 500){
            i = view[1];
            if(view[0] == 8){
              value8++;
            }else if(view[0] == 9){
              value9++;
            }else{value10++;}
          }else if(view[1] < 1000 && i > 1000){i = 0;
          }
          
          
          
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
