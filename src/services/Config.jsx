const CONFIG = {
    broker: {
        host: 'broker.emqx.io',
        port: 8083,
        path: '/mqtt',
        useSSL: false,
    },
    topics: {
        statusTopic: '/device/status',
        rfidTopic: '/sensor/rfid',
    },
};

export default CONFIG;