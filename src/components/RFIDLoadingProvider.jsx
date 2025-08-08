import React, { useContext } from 'react';
import { MQTTContext } from '../services/MqttContext';
import LoadingOverlay from './LoadingOverlay';

const RFIDLoadingProvider = ({ children }) => {
    const { isProcessingRFID, processingMessage } = useContext(MQTTContext);

    return (
        <>
            {children}
            <LoadingOverlay
                isVisible={isProcessingRFID}
                message={processingMessage || "Processing RFID access..."}
            />
        </>
    );
};

export default RFIDLoadingProvider;