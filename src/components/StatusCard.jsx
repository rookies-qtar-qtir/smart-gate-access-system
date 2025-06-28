import { Progress } from "antd";
import DistanceBar from "./DistanceBar";
import { useMQTT } from "../services/MqttContext";
import { PiXCircleDuotone } from "react-icons/pi";
function StatusCard({ icon, label, value, iconColor, borderColor, id, progress }) {
  const { deviceStatus } = useMQTT();
  
  let percentage = 0;
  percentage = Math.max(0, 100 - (((deviceStatus.distance - deviceStatus.threshold) / deviceStatus.threshold) * 100));

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 mb-1">{label}</div>
          <div className="text-xl font-semibold" id={id}>{value}</div>
          {progress && (
            <Progress
              percent={percentage}
              size="default"
              length={10}
              status={percentage >= 100 ? "exception" : "active"}
              format={() => percentage >= 100 ? <PiXCircleDuotone
                  /> : ' '}
            />
          )}
        </div>
        <div className={`text-3xl ${iconColor}`}>{icon}</div>
      </div>
    </div>
  );
}

export default StatusCard;