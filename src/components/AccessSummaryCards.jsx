import { FaCheckCircle, FaTimesCircle, FaClipboardList } from 'react-icons/fa';

function AccessSummaryCards({ stats }) {
  const cards = [
    {
      title: 'Total Akses',
      value: stats.total || 0,
      icon: <FaClipboardList className="text-4xl" />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-500',
    },
    {
      title: 'Akses Diterima',
      value: stats.granted || 0,
      icon: <FaCheckCircle className="text-4xl" />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-500',
    },
    {
      title: 'Akses Ditolak',
      value: stats.denied || 0,
      icon: <FaTimesCircle className="text-4xl" />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-500',
    },
  ];

  return (
    <div className="col-span-1 lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${card.borderColor} hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`${card.iconBg} p-4 rounded-full ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccessSummaryCards;