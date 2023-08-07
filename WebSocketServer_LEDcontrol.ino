/*
 * WebSocketServer_LEDcontrol.ino
 *
 *  Created on: 2023.8.1
 *
 */

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <Hash.h>


#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;

ESP8266WebServer server(80);
WebSocketsServer webSocket = WebSocketsServer(81);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length)
{

    switch (type)
    {
    case WStype_DISCONNECTED:
        // USE_SERIAL.printf("[%u] Disconnected!\n", num);
        break;
    case WStype_CONNECTED:
    {
        IPAddress ip = webSocket.remoteIP(num);
        // USE_SERIAL.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);

        // send message to client
        webSocket.sendTXT(num, "Connected");
    }
    break;
    case WStype_TEXT:
        // USE_SERIAL.printf("[%u] get Text: %s\n", num, payload);
        // 分割payload字符串为每个16进制字节，并转换为整数值
        for (size_t i = 0; i < length; i += 3) // 每个16进制数之间有一个空格，所以长度为3
        {
            char hexStr[3];
            memcpy(hexStr, &payload[i], 2); // 提取每个16进制字节的部分
            hexStr[2] = '\0';               // 添加字符串结束符

            // 将hex字符串转换为整数值
            int hexValue = strtol(hexStr, NULL, 16);

            // 以16进制形式输出每个字节
            USE_SERIAL.write((uint8_t)hexValue);
        }

        break;
    }
}

void setup()
{
    // USE_SERIAL.begin(921600);
    USE_SERIAL.begin(115200);

    // USE_SERIAL.setDebugOutput(true);

    for (uint8_t t = 4; t > 0; t--)
    {
        // USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }

    // WiFiMulti.addAP("LL", "12345678");
    // while(WiFiMulti.run() != WL_CONNECTED) {
    //     delay(100);
    // }
    // 设置ESP8266为AP模式，并指定AP的名称和密码
    WiFi.mode(WIFI_AP);
    const char *ssid = "ESP8266";      // 设置AP名称为"ESP8266"
    const char *password = "12345678"; // 设置AP的密码为"12345678"
    WiFi.softAP(ssid, password);

    IPAddress myIP = WiFi.softAPIP();
    USE_SERIAL.print("AP IP address: ");
    USE_SERIAL.println(myIP);
    // start webSocket server
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);

    if (MDNS.begin("esp8266"))
    {
        USE_SERIAL.println("MDNS responder started");
    }

    // handle index
    server.on("/", []()
              {
        // send index.html
        server.send(200, "text/html", "<html><head><script>var connection = new WebSocket('ws://'+location.hostname+':81/', ['arduino']);connection.onopen = function () {  connection.send('Connect ' + new Date()); }; connection.onerror = function (error) {    console.log('WebSocket Error ', error);};connection.onmessage = function (e) {  console.log('Server: ', e.data);};function sendRGB() {  var r = parseInt(document.getElementById('r').value).toString(16);  var g = parseInt(document.getElementById('g').value).toString(16);  var b = parseInt(document.getElementById('b').value).toString(16);  if(r.length < 2) { r = '0' + r; }   if(g.length < 2) { g = '0' + g; }   if(b.length < 2) { b = '0' + b; }   var rgb = '#'+r+g+b;    console.log('RGB: ' + rgb); connection.send(rgb); }</script></head><body>LED Control:<br/><br/>R: <input id=\"r\" type=\"range\" min=\"0\" max=\"255\" step=\"1\" oninput=\"sendRGB();\" /><br/>G: <input id=\"g\" type=\"range\" min=\"0\" max=\"255\" step=\"1\" oninput=\"sendRGB();\" /><br/>B: <input id=\"b\" type=\"range\" min=\"0\" max=\"255\" step=\"1\" oninput=\"sendRGB();\" /><br/></body></html>"); });

    server.begin();

    // Add service to MDNS
    MDNS.addService("http", "tcp", 80);
    MDNS.addService("ws", "tcp", 81);
}

int i = 0;

void loop()
{
    webSocket.loop();
    server.handleClient();

    // Read data from Serial and send it to the client
    if (Serial.available() >= 7) // 只有当至少有7个字节可用时才读取数据
    {
        char data[7];
        for (int i = 0; i < 7; i++)
        {
            data[i] = Serial.read(); // 逐个读取7个字节
        }
        // USE_SERIAL.print(data);
        //  将data转换为字符串
        char hexString[14]; // 根据您的数据长度适当调整字符串长度
        sprintf(hexString, "%02X%02X%02X%02X%02X%02X%02X", data[0], data[1], data[2], data[3], data[4], data[5], data[6]);

        // 将字符串作为文本数据发送给所有连接的客户端
        webSocket.broadcastTXT(hexString);
        // webSocket.broadcastTXT(data); // 将数据作为字符串发送给所有连接的客户端
    }

    // webSocket.sendAll("hello");
    // webSocket.sendTXT(0, "Connected");
    // delay(1000);
}
