import { Progress } from "antd";
import { useMQTT } from "../services/MqttContext";
import { PiXCircleDuotone } from "react-icons/pi";

const DistanceBar = () => {
    const { deviceStatus } = useMQTT();


    let percentage = 0;
    percentage = Math.max(0, 100 - (((deviceStatus.distance - deviceStatus.threshold) / deviceStatus.threshold) * 100));

    return (
        <div className="bg-white shadow-sm rounded-lg mt-4 w-56">
            <h2 className="text-xl font-semibold mb-4">Distance Threshold</h2>
            <Progress
                percent={percentage}
                size="small"
                length={10}
                status={percentage >= 100 ? "exception" : "active"}
                format={() => percentage >= 100 ? <PiXCircleDuotone /> : ' '}
            />
            <p className="mt-2 text-center">{deviceStatus.distance} cm</p>
        </div>
    );
}

export default DistanceBar;