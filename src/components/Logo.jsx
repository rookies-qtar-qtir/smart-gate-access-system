function Logo({ className = '', collapsed = false }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            {!collapsed ? (
                <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold text-xl">
                    SMART GATE
                </h1>
            ) : (
                <div className="text-white font-bold text-lg">
                    SG
                </div>
            )}
        </div>
    );
}

export default Logo;