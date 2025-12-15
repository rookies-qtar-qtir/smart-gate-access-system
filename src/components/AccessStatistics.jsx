import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaChartLine } from 'react-icons/fa';
import AccessSummaryCards from './AccessSummaryCards';

function AccessStatistics({ stats, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Statistik Access Log</h2>
          <Button
            type="primary"
            icon={<FaChartLine />}
            onClick={() => navigate('/access-log')}
            className="bg-blue-600 hover:bg-blue-700 border-none"
          >
            Lihat Detail
          </Button>
        </div>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading statistics...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Statistik Access Log</h2>
        <Button
          type="primary"
          icon={<FaChartLine />}
          onClick={() => navigate('/access-log')}
          className="bg-blue-600 hover:bg-blue-700 border-none"
        >
          Lihat Detail
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccessSummaryCards stats={stats} />
      </div>
    </section>
  );
}

export default AccessStatistics;