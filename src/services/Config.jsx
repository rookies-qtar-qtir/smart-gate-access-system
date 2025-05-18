const CONFIG = {
    broker: {
        host: 'broker.emqx.io',
        port: 8083,
        path: '/mqtt',
        clientId: `mqtt_client_${Math.random().toString(16).substr(2, 8)}`,
        useSSL: false,
    },
    topics: {
        servoTopic: '/control/servo',
        statusTopic: '/device/status',
        devicePingTopic: '/device/ping',
        devicePingResponseTopic: '/device/pong',
        distanceTopic: '/sensor/distance',
        rfidTopic: '/sensor/rfid',
        accessResultTopic: '/control/access'
    },
  };
  
  export default CONFIG;
  