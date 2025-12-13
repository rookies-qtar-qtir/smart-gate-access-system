import React, { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";
import { accessLogsApi } from "./api";
import type { ReactNode } from "react";
import type { AccessLogEntry, AccessLogStats } from "../domain/accessLog";
import type { ApiError } from "./api";

interface AccessLogContextValue {
  accessLogs: AccessLogEntry[];
  stats: AccessLogStats;
  loading: boolean;
  initialized: boolean;
  refreshData: () => Promise<AccessLogEntry[]>;
  addNewLog: (newLog: AccessLogEntry) => void;
  updateLog: (logId: string | number, updates: Partial<AccessLogEntry>) => void;
  fetchAccessLogs: () => Promise<AccessLogEntry[]>;
}

interface AccessLogProviderProps {
  children: ReactNode;
}

const AccessLogContext = createContext<AccessLogContextValue | null>(null);

const calculateStats = (logs: AccessLogEntry[]): AccessLogStats => {
  const granted = logs.filter((log) => log.status === "GRANTED").length;
  const denied = logs.filter((log) => log.status === "DENIED").length;
  return {
    total: logs.length,
    granted,
    denied,
  };
};

export const useAccessLog = (): AccessLogContextValue => {
  const context = useContext(AccessLogContext);
  if (!context) {
    throw new Error("useAccessLog must be used within an AccessLogProvider");
  }
  return context;
};

export const AccessLogProvider = ({ children }: AccessLogProviderProps) => {
  const [accessLogs, setAccessLogs] = useState<AccessLogEntry[]>([]);
  const [stats, setStats] = useState<AccessLogStats>({
    total: 0,
    granted: 0,
    denied: 0,
  });
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchAccessLogs = async () => {
    try {
      setLoading(true);
      const logs = await accessLogsApi.getAll();
      setAccessLogs(logs);
      const newStats = calculateStats(logs);
      setStats(newStats);
      return logs;
    } catch (error) {
      const normalized = error as ApiError;
      console.error("Failed to fetch access logs:", error);
      message.error("Failed to fetch access logs: " + (normalized.message || "Unknown error"));
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

  const refreshData = () => fetchAccessLogs();

  const addNewLog = (newLog: AccessLogEntry) => {
    setAccessLogs((prev) => {
      const updated = [newLog, ...prev];
      setStats(calculateStats(updated));
      return updated;
    });
  };

  const updateLog = (logId: string | number, updates: Partial<AccessLogEntry>) => {
    setAccessLogs((prev) => {
      const updated = prev.map((log) => (log.id === logId ? { ...log, ...updates } : log));
      setStats(calculateStats(updated));
      return updated;
    });
  };

  const value: AccessLogContextValue = {
    accessLogs,
    stats,
    loading,
    initialized,
    refreshData,
    addNewLog,
    updateLog,
    fetchAccessLogs,
  };

  return <AccessLogContext.Provider value={value}>{children}</AccessLogContext.Provider>;
};
