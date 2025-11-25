import { Doughnut } from 'react-chartjs-2';
import { FaChartBar } from 'react-icons/fa';

function AccessDistributionChart({ stats }) {
  const doughnutData = {
    labels: ['Access Granted', 'Access Denied'],
    datasets: [
      {
        data: [stats.granted, stats.denied],
        backgroundColor: [
          '#10B981',
          '#EF4444',
        ],
        borderColor: [
          '#059669',
          '#DC2626',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Distribusi Status Akses
      </h3>
      <div className="h-64">
        {stats.total > 0 ? (
          <Doughnut data={doughnutData} options={doughnutOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FaChartBar className="mx-auto text-4xl mb-2" />
              <p>Belum ada data akses</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccessDistributionChart;