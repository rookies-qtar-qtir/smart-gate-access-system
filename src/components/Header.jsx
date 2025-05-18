const CustomHeader = () => {
    if (location.pathname === "/") {
        return null;
    }

    return (
        <header className="bg-white shadow-md p-4">
            <div className="flex items-center justify-between">
                {location.pathname === "/gate-control" && (
                    <>
                        <h1 className="text-l font-bold text-black">Sistem Kontrol Gerbang Palang</h1>
                        <div className="text-sm text-gray-500">
                            Last update: <span id="last-update">-</span>
                        </div>
                    </>
                )}

                {location.pathname === "/access-log" && (
                    <>
                        <h1 className="text-l font-bold text-black">RFID Access Logs</h1>
                        <div className="text-sm text-gray-500">
                            Last update: <span id="last-update">-</span>
                        </div>
                    </>
                )}

                {location.pathname === "/users" && (
                    <>
                        <h1 className="text-l font-bold text-black">User Management</h1>
                        <div className="text-sm text-gray-500">
                            Last update: <span id="last-update">-</span>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}

export default CustomHeader;