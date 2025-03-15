#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

AsyncWebServer server(80);

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Handle POST request to receive message
void handleMessage(AsyncWebServerRequest *request) {
  if (request->hasParam("message", true)) {
    String message = request->getParam("message", true)->value();
    
    // Display the received message on the OLED
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("New Message:");
    display.println(message);
    display.display();
    
    request->send(200, "application/json", "{\"status\":\"Message received\"}");
  } else {
    request->send(400, "application/json", "{\"error\":\"No message received\"}");
  }
}

void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize the OLED display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }
  display.display();
  delay(2000); // Pause for 2 seconds

  // Define the route for receiving the message
  server.on("/sendMessage", HTTP_POST, handleMessage);

  // Start the server
  server.begin();
}

void loop() {
  // Nothing to do here, the server handles everything
}
