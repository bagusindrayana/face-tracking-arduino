#include<Servo.h>

Servo x, y;
int width = 640, height = 480;  // total resolution of the video
float xpos = 90, ypos = 160;  // initial positions of both Servos
void setup() {

  Serial.begin(9600);
  x.attach(9);
  y.attach(10);
  // Serial.print(width);
  //Serial.print("\t");
  //Serial.println(height);
  x.write(xpos);
  y.write(ypos);

}
const float angle = 2;   // degree of increment or decrement

void loop() {

  if (Serial.available() >= 4)
  {
    int incoming[3];
    for (int i = 0; i < 4; i++){
      incoming[i] = Serial.read();
    }


    if (incoming[0] == 1){
        xpos += angle;
    } else if (incoming[1] == 1){
        xpos -= angle;
        
    }

    if (incoming[2] == 1){
        ypos += angle;

    } else if (incoming[3] == 1){
        ypos -= angle;
    }

    // if the servo degree is outside its range
    if (xpos >= 180)
      xpos = 180;
    else if (xpos <= 0)
      xpos = 0;
    if (ypos >= 180)
      ypos = 180;
    else if (ypos <= 0)
      ypos = 0;

    x.write(xpos);
    y.write(ypos);

    delay(15);


    // used for testing
//    Serial.print("\t");
//    Serial.print(((height / 2) + 60));
//    Serial.print("\t");
//    Serial.println(y_mid);
  }
}
