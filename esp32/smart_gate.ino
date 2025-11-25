#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>

const char* ssid = "LIT-2.4G-CSSU";
const char* password = "yakaligaarka2.4G";

const char* mqtt_server = "192.168.18.5";
const char* mqtt_user = "arkalit";
const char* mqtt_pass = "arkamqtt";

WiFiClient espClient;
PubSubClient client(espClient);

const char* device_control = "/device/control";
const char* device_status = "/device/status";
const char* device_rfid = "/device/rfid";

const int SS_PIN = 5;
const int RST_PIN = 0;
const int SCK_PIN = 18;
const int MOSI_PIN = 13;
const int MISO_PIN = 19;

MFRC522 rfid(SS_PIN, RST_PIN);

const int servoPin = 32;
const int TRIG_PIN = 23;
const int ECHO_PIN = 22;
Servo servoMotor;
char perintah = '0';
bool autoMode = true;

unsigned long lastStatusTime = 0;
unsigned long lastSensorTime = 0;
unsigned long lastRfidCheckTime = 0;
const long statusInterval = 3000;
const long sensorInterval = 500;
const long rfidInterval = 200;

int detectionThreshold = 10;
unsigned long lastUidTime = 0;
const long uidCooldown = 3000;

String lastUidDetected = "";

long readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  long distance = (duration * 0.0343) / 2;

  return distance;
}

void publishStatus() {
  DynamicJsonDocument root(256);
  JsonObject doc = root.to<JsonObject>();
  
  doc["online"] = true;
  doc["servo"] = perintah == '1' ? 1 : 0;
  doc["auto_mode"] = autoMode;
  doc["ip"] = WiFi.localIP().toString();
  doc["rssi"] = WiFi.RSSI();

  long distance = readDistance();
  doc["distance"] = distance;
  doc["threshold"] = detectionThreshold;
  doc["timestamp"] = millis();

  char jsonBuffer[256];
  serializeJson(doc, jsonBuffer);

  client.publish(device_status, jsonBuffer);
  Serial.println("Status published to /device/status");
  Serial.println(jsonBuffer);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received [");
  Serial.print(topic);
  Serial.print("] ");

  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  if (strcmp(topic, device_control) == 0) {
    DynamicJsonDocument doc(256);
    DeserializationError error = deserializeJson(doc, message);
    
    if (error) {
      Serial.print("JSON parsing failed: ");
      Serial.println(error.c_str());
      return;
    }

    if (doc.containsKey("servo")) {
      int servoCommand = doc["servo"];
      if (servoCommand == 1 && perintah != '1') {
        Serial.println("Opening gate (servo to 90°)");
        servoMotor.write(90);
        perintah = '1';
        publishStatus();
      } else if (servoCommand == 0 && perintah != '0') {
        Serial.println("Closing gate (servo to 0°)");
        servoMotor.write(0);
        perintah = '0';
        publishStatus();
      }
    }
    if (doc.containsKey("auto_mode")) {
      bool newAutoMode = doc["auto_mode"];
      if (newAutoMode != autoMode) {
        autoMode = newAutoMode;
        Serial.print("Auto mode changed to: ");
        Serial.println(autoMode ? "enabled" : "disabled");
        publishStatus();
      }
    }

    if (doc.containsKey("threshold")) {
      int newThreshold = doc["threshold"];
      if (newThreshold > 0 && newThreshold != detectionThreshold) {
        detectionThreshold = newThreshold;
        Serial.print("Distance threshold updated to: ");
        Serial.println(detectionThreshold);
        publishStatus();
      }
    }

    if (doc.containsKey("access_granted")) {
      bool accessGranted = doc["access_granted"];
      if (accessGranted) {
        Serial.println("Access granted!");
        if (perintah != '1') {
          Serial.println("Opening gate (servo to 90°)");
          servoMotor.write(90);
          perintah = '1';
          publishStatus();
        }
      } else {
        Serial.println("Access denied!");
      }
    }

    if (doc.containsKey("ping")) {
      if (doc["ping"] == true) {
        Serial.println("Ping received, publishing status");
        publishStatus();
      }
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println("Connected to MQTT!");
      
      client.subscribe(device_control);
      Serial.println("Subscribed to /device/control");
      
      publishStatus();
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Setting up device...");

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  rfid.PCD_Init();
  Serial.println("RFID reader initialized");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  servoMotor.attach(servoPin);
  servoMotor.write(0);
  perintah = '0';
}

unsigned long lastCommandTime = 0;
const int commandCooldown = 1000;
bool servoControlLock = false;

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long currentMillis = millis();
  unsigned long millisRfid = millis();

  if (servoControlLock && (currentMillis - lastCommandTime >= commandCooldown)) {
    servoControlLock = false;
    Serial.println("Cooldown finished, ready for new commands.");
  }

  if (autoMode && (currentMillis - lastSensorTime >= sensorInterval)) {
    lastSensorTime = currentMillis;

    long distance = readDistance();
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    if (distance < detectionThreshold && !servoControlLock) {
      if (perintah != '0') {
        Serial.println("Object detected! Closing gate (servo to 0°)");
        servoMotor.write(0);
        perintah = '0';
        publishStatus();

        servoControlLock = true;
        lastCommandTime = currentMillis;
      }
    }
  }
  if (millisRfid - lastRfidCheckTime >= rfidInterval) {
    lastRfidCheckTime = millisRfid;
    handleRfid();
  }

  if (currentMillis - lastStatusTime >= statusInterval) {
    lastStatusTime = currentMillis;
    publishStatus();
  }
}

void handleRfid() {
  if (!rfid.PICC_IsNewCardPresent()) {
    return;
  }

  if (!rfid.PICC_ReadCardSerial()) {
    return;
  }

  String uid = getUID();

  unsigned long currentTime = millis();
  if (uid == lastUidDetected && currentTime - lastUidTime < uidCooldown) {
    Serial.println("UID cooldown active, skipping repeat send");
    haltPICC();
    return;
  }

  lastUidDetected = uid;
  lastUidTime = currentTime;

  Serial.print("RFID card detected, UID: ");
  Serial.println(uid);

  if (!servoControlLock) {
    DynamicJsonDocument doc(100);
    doc["uid"] = uid;
    doc["timestamp"] = currentTime;

    char jsonBuffer[100];
    serializeJson(doc, jsonBuffer);

    client.publish(device_rfid, jsonBuffer);
    Serial.println("RFID UID published to /device/rfid");
    Serial.println(jsonBuffer);

    servoControlLock = true;
    lastCommandTime = currentTime;
  }

  haltPICC();
}

void haltPICC() {
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

String getUID() {
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) {
      uid += "0";
    }
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  return uid;
}