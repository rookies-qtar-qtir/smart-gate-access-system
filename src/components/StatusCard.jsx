import { Progress } from "antd";
import { PiXCircleDuotone } from "react-icons/pi";

function StatusCard({ icon, label, value, iconColor, borderColor, id, progress }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-start">
        
        {/* Kiri: label, value, progress */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="text-sm text-gray-500 mb-1">{label}</div>
            <div className="text-xl font-semibold" id={id}>{value}</div>
          </div>

          {/* Optional progress bar */}
          {progress && (
            <div className="mt-2 w-full">
              <Progress
                percent={progress.percent}
                strokeWidth={10}
                showInfo={false}
                status={progress.percent >= 100 ? "exception" : "active"}
                format={() =>
                  progress.percent >= 100 ? <PiXCircleDuotone /> : " "
                }
              />
            </div>
          )}
        </div>

        {/* Kanan: ikon */}
        <div className={`text-3xl ${iconColor} ml-4`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
