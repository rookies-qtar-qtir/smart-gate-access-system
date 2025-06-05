const CONFIG = {
    broker: {
        host: import.meta.env.VITE_BROKER_HOST,
        port: Number(import.meta.env.VITE_BROKER_PORT),
        path: import.meta.env.VITE_BROKER_PATH,
        useSSL: import.meta.env.VITE_BROKER_SSL === 'true',
        username: import.meta.env.VITE_BROKER_USERNAME,
        password: import.meta.env.VITE_BROKER_PASSWORD,
    },
    topics: {
        statusTopic: import.meta.env.VITE_TOPIC_STATUS,
        rfidTopic: import.meta.env.VITE_TOPIC_RFID,
    },
};

export default CONFIG;