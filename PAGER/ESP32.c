#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h> 

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

LiquidCrystal_I2C lcd(0x27, 16, 2);

AsyncWebServer server(80);
void handleMessage(AsyncWebServerRequest *request) {
  if (request->hasParam("message", true)) {
    String message = request->getParam("message", true)->value();
    
    lcd.clear();  
    lcd.setCursor(0, 0);  
    lcd.print(message);   
    
    request->send(200, "application/json", "{\"status\":\"Message received\"}");
  } else {
    request->send(400, "application/json", "{\"error\":\"No message received\"}");
  }
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  lcd.begin(16, 2); 
  lcd.backlight();  
  
  // Display initial message
  lcd.setCursor(0, 0);
  lcd.print("Waiting for msg...");
  
  server.on("/sendMessage", HTTP_POST, handleMessage);

  // Start the server
  server.begin();
}

void loop() {

}
