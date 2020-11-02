
int LED =  9; 
int Water_Sensor =  A5; 
void setup() {
   pinMode(Water_Sensor, INPUT);
   pinMode(LED, OUTPUT); 
   Serial.begin(9600);
}

void loop() {
   
   int val = analogRead(Water_Sensor);
   Serial.println(val);

   if( val < 70) {
      digitalWrite(LED,LOW);
   }else {
      digitalWrite(LED,HIGH);
   }
 
   
}
