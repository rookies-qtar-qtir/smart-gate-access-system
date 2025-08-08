import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine,
  FaChartBar
} from 'react-icons/fa';

function AccessSummaryCards({ stats }) {
  const successRate = stats.total > 0 ? ((stats.granted / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FaChartBar className="mr-2 text-blue-600" />
        Ringkasan Akses
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <FaUsers className="text-blue-600 mr-2" />
            <span className="font-medium">Total Akses</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" />
            <span className="font-medium">Akses Diterima</span>
          </div>
          <span className="text-2xl font-bold text-green-600">{stats.granted}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <FaTimesCircle className="text-red-600 mr-2" />
            <span className="font-medium">Akses Ditolak</span>
          </div>
          <span className="text-2xl font-bold text-red-600">{stats.denied}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center">
            <FaChartLine className="text-purple-600 mr-2" />
            <span className="font-medium">Success Rate</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">{successRate}%</span>
        </div>
      </div>
    </div>
  );
}

export default AccessSummaryCards;