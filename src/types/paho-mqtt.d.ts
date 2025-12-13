declare module "paho-mqtt" {
  export interface ConnectionOptions {
    useSSL?: boolean;
    keepAliveInterval?: number;
    cleanSession?: boolean;
    reconnect?: boolean;
    timeout?: number;
    userName?: string;
    password?: string;
    onSuccess?: () => void;
    onFailure?: (error: { errorMessage?: string }) => void;
  }

  export class Message {
    constructor(payload: string | ArrayBuffer);
    payloadString: string;
    destinationName: string;
    qos: number;
  }

  export class Client {
    constructor(host: string, port: number, path: string, clientId: string);
    onConnectionLost?: (responseObject: { errorCode: number; errorMessage?: string }) => void;
    onMessageArrived?: (message: Message) => void;
    connect(options?: ConnectionOptions): void;
    subscribe(topic: string, options?: { qos?: number }): void;
    send(message: Message): void;
    isConnected(): boolean;
    disconnect(): void;
  }
}
