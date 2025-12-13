export interface BrokerConfig {
    host: string;
    port: number;
    path: string;
    useSSL: boolean;
    username?: string;
    password?: string;
}

export interface MqttTopics {
    statusTopic: string;
    rfidTopic: string;
}

export interface PublishTopics {
    controlTopic: string;
}

export interface AppConfig {
    broker: BrokerConfig;
    topics: MqttTopics;
    topicPub: PublishTopics;
}

const CONFIG: AppConfig = {
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
    topicPub: {
        controlTopic: import.meta.env.VITE_TOPIC_CONTROL,
    }
};

export default CONFIG;
