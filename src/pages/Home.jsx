import StatusCard from "../components/StatusCard";
import {
  FaDoorOpen,
  FaSignal,
  FaDoorClosed,
  FaRuler,
  FaSlidersH,
  FaChartLine,
  FaClock,
} from 'react-icons/fa';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import StatusAlert from "../components/StatusAlert";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="">
      {/* Hero Banner */}
      <div
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Smart Gate Access System
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Solusi modern untuk pengelolaan akses gerbang dengan
            teknologi IoT
          </p>
          <Button
            color="primary"
            variant="filled"
            icon={<FaDoorOpen />}
            size='large'
            onClick={() => navigate('/gate-control')}
            className="px-12! py-8! bg-white text-blue-600! rounded-lg font-medium hover:bg-gray-100! transition-colors! shadow-lg! border-none!"
          >Akses Kontrol Panel</Button>
        </div>
      </div>

      <div className="container p-6">
        {/* <StatusAlert /> */}
        <StatusAlert></StatusAlert>

        {/* Status Sistem */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Status Sistem</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatusCard
              label="Status Koneksi"
              value="Mengecek..."
              icon={<FaSignal />}
              iconColor="text-green-500"
              borderColor="border-green-500"
              id="connection-status"
            />
            <StatusCard
              label="Status Gerbang"
              value="Mengecek..."
              icon={<FaDoorClosed />}
              iconColor="text-blue-500"
              borderColor="border-blue-500"
              id="gate-status"
            />
            <StatusCard
              label="Sensor Jarak"
              value="Mengecek..."
              icon={<FaRuler />}
              iconColor="text-teal-500"
              borderColor="border-teal-500"
              id="distance-reading"
              progress={{ width: '0%', color: 'bg-teal-500' }}
            />
            <StatusCard
              label="Ambang Batas Jarak"
              value="- cm"
              icon={<FaSlidersH />}
              iconColor="text-purple-500"
              borderColor="border-purple-500"
              id="distance-threshold-display"
            />
          </div>
        </section>

        {/* Ringkasan */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Ringkasan Aktivitas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusCard
              label="Akses Hari Ini"
              value=""
              icon={<FaChartLine />}
              iconColor="text-amber-500"
              borderColor="border-amber-500"
              id="today-access"
            />
            <StatusCard
              label="Update Terakhir"
              value="-"
              icon={<FaClock />}
              iconColor="text-indigo-500"
              borderColor="border-indigo-500"
              id="last-update"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;