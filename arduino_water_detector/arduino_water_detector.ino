
int LED =  9; // Attach an LED to Digital Pin 9 (or use onboard LED)
int Grove_Water_Sensor =  A5; // Attach Water sensor to Arduino Digital Pin 8
void setup() {
   pinMode(Grove_Water_Sensor, INPUT); // The Water Sensor is an Input
   pinMode(LED, OUTPUT); // The LED is an Output
   Serial.begin(9600);
}

void loop() {
   /* The water sensor will switch LOW when water is detected.
   Get the Arduino to illuminate the LED and activate the buzzer
   when water is detected, and switch both off when no water is present */
   Serial.print("Reading: ");
   int val = analogRead(Grove_Water_Sensor);
   Serial.print(val);
   Serial.println();
   if( val < 70) {
      digitalWrite(LED,LOW);
   }else {
      digitalWrite(LED,HIGH);
   }
   
}
