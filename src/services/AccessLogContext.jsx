import React, { createContext, useContext, useState, useEffect } from 'react';
import { accessLogsApi } from './api';
import { message } from 'antd';

const AccessLogContext = createContext();

export const useAccessLog = () => {
    const context = useContext(AccessLogContext);
    if (!context) {
        throw new Error('useAccessLog must be used within an AccessLogProvider');
    }
    return context;
};

export const AccessLogProvider = ({ children }) => {
    const [accessLogs, setAccessLogs] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        granted: 0,
        denied: 0,
    });
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    const calculateStats = (logs) => {
        const granted = logs.filter(log => log.status === 'GRANTED').length;
        const denied = logs.filter(log => log.status === 'DENIED').length;
        return {
            total: logs.length,
            granted,
            denied,
        };
    };

    const fetchAccessLogs = async () => {
        try {
            setLoading(true);
            const logs = await accessLogsApi.getAll();
            setAccessLogs(logs);
            const newStats = calculateStats(logs);
            setStats(newStats);
            return logs;
        } catch (error) {
            console.error('Failed to fetch access logs:', error);
            message.error('Failed to fetch access logs: ' + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialized) {
            fetchAccessLogs()
                .then(() => {
                    setInitialized(true);
                })
                .catch(() => {
                    setInitialized(true);
                });
        }
    }, [initialized]);

    const refreshData = () => {
        return fetchAccessLogs();
    };

    const addNewLog = (newLog) => {
        setAccessLogs(prev => {
            const updated = [newLog, ...prev];
            setStats(calculateStats(updated));
            return updated;
        });
    };

    const updateLog = (logId, updates) => {
        setAccessLogs(prev => {
            const updated = prev.map(log =>
                log.id === logId ? { ...log, ...updates } : log
            );
            setStats(calculateStats(updated));
            return updated;
        });
    };

    const value = {
        accessLogs,
        stats,
        loading,
        initialized,
        refreshData,
        addNewLog,
        updateLog,
        fetchAccessLogs
    };

    return (
        <AccessLogContext.Provider value={value}>
            {children}
        </AccessLogContext.Provider>
    );
};