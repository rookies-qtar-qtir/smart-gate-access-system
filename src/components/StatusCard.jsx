function StatusCard({ icon, label, value, iconColor, borderColor, id, progress }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 mb-1">{label}</div>
          <div className="text-xl font-semibold" id={id}>{value}</div>
          {progress && (
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                id="distance-progress"
                className={`h-2 rounded transition-all ${progress.color}`}
                style={{ width: progress.width }}
              ></div>
            </div>
          )}
        </div>
        <div className={`text-3xl ${iconColor}`}>{icon}</div>
      </div>
    </div>
  );
}

export default StatusCard;