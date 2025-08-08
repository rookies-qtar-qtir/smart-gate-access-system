import StatusCard from "./StatusCard";
import {
  FaDoorClosed,
  FaRuler,
  FaSlidersH,
  FaWifi,
} from 'react-icons/fa';
import { MdSignalWifiOff } from 'react-icons/md';

function SystemStatus({ deviceStatus }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Status Sistem</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard
          label="Status Device"
          value={deviceStatus.online ? "Tersambung" : "Tidak Tersambung"}
          icon={deviceStatus.online ? <FaWifi /> : <MdSignalWifiOff />}
          iconColor={deviceStatus.online ? "text-green-500" : "text-red-500"}
          borderColor={deviceStatus.online ? "border-green-500" : "border-red-500"}
          id="connection-status"
        />
        <StatusCard
          label="Status Gerbang"
          value={deviceStatus.servo === 1 ? "Terbuka" : "Tertutup"}
          icon={<FaDoorClosed />}
          iconColor="text-blue-500"
          borderColor="border-blue-500"
          id="gate-status"
        />
        <StatusCard
          label="Sensor Jarak"
          value={deviceStatus.distance ? `${deviceStatus.distance} cm` : "- cm"}
          icon={<FaRuler />}
          iconColor="text-teal-500"
          borderColor="border-teal-500"
          id="distance-reading"
        />
        <StatusCard
          label="Ambang Batas Jarak"
          value={deviceStatus.threshold ? `${deviceStatus.threshold} cm` : "- cm"}
          icon={<FaSlidersH />}
          iconColor="text-purple-500"
          borderColor="border-purple-500"
          id="distance-threshold-display"
        />
      </div>
    </section>
  );
}

export default SystemStatus;