#include <WebUSB.h>
#include "HX711.h"
/**
 * Creating an instance of WebUSBSerial will add an additional USB interface to
 * the device that is marked as vendor-specific (rather than USB CDC-ACM) and
 * is therefore accessible to the browser.
 *
 * The URL here provides a hint to the browser about what page the user should
 * navigate to to interact with the device.
 */
WebUSB WebUSBSerial(1 /* https:// */, "xiezuo7.github.io/demo/demos/Cycling%20Tracking%20System/index.html");

#define Serial WebUSBSerial



const int LOADCELL_DOUT_PIN_L = 3;
const int LOADCELL_SCK_PIN_L = 2;
const int LOADCELL_DOUT_PIN_R = 5;
const int LOADCELL_SCK_PIN_R = 4;

int dayChange_Weight[3] = {8};
HX711 scale_L;
HX711 scale_R;

void setup() {
    pinMode(6, INPUT);
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  Serial.write("Sketch begins.\r\n");
  scale_L.begin(LOADCELL_DOUT_PIN_L, LOADCELL_SCK_PIN_L);
  scale_R.begin(LOADCELL_DOUT_PIN_R, LOADCELL_SCK_PIN_R);
  Serial.flush();

}

void loop() {
    if (digitalRead(6)==1) {
    digitalWrite(13,HIGH);
    //Serial.println(dayChange_Weight[0]);
  }else{
    digitalWrite(13,LOW);
    //Serial.write(dayChange_Weight[0]);
    delay( 100 );
    //Serial.println(dayChange_Weight[0]);

    dayChange_Weight[0]++;
    if(dayChange_Weight[0] == 11) {dayChange_Weight[0] =8;}
  }
    if (scale_L.is_ready()) {
    long reading_L = scale_L.read();
    long reading_R = scale_R.read();
    //Serial.print("HX711 reading: ");

    dayChange_Weight[1] = (reading_L+35000)/500;
    dayChange_Weight[2] = (reading_R+60000)/500;
    if (Serial && Serial.available()) {
      Serial.println(dayChange_Weight[0]);
      Serial.println(dayChange_Weight[1]);
      Serial.println(dayChange_Weight[2]);
      Serial.flush();
    }
    //Serial.println(dayChange_Weight[1]);
    //Serial.println(dayChange_Weight[2]);
    
    //Serial.write(dayChange_Weight[1]);
    //Serial.write(dayChange_Weight[2]);
  } else {
  }
    delay(100);
  
}
