import { Bar } from 'react-chartjs-2';
import { FaChartLine } from 'react-icons/fa';

function AccessTrendChart({ stats, accessLogs }) {
  const getAccessTrendData = () => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
      });
    }

    const grantedData = last7Days.map(day => {
      return accessLogs.filter(log =>
        log.timestamp.split('T')[0] === day.date && log.status === 'GRANTED'
      ).length;
    });

    const deniedData = last7Days.map(day => {
      return accessLogs.filter(log =>
        log.timestamp.split('T')[0] === day.date && log.status === 'DENIED'
      ).length;
    });

    return {
      labels: last7Days.map(day => day.label),
      datasets: [
        {
          label: 'Access Granted',
          data: grantedData,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Access Denied',
          data: deniedData,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 12,
          },
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tren Akses 7 Hari Terakhir
      </h3>
      <div className="h-64">
        {stats.total > 0 ? (
          <Bar data={getAccessTrendData()} options={barOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FaChartLine className="mx-auto text-4xl mb-2" />
              <p>Belum ada data untuk ditampilkan</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccessTrendChart;