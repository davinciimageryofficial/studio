
"use client";

import { placeholderUsers } from "@/lib/placeholder-data";
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

type User = typeof placeholderUsers[0];
type SessionType = "solo" | "team" | null;

interface WorkspaceContextType {
    sessionType: SessionType;
    isActive: boolean;
    time: number;
    participants: User[];
    setParticipants: React.Dispatch<React.SetStateAction<User[]>>;
    startSession: (type: SessionType, initialParticipants?: User[]) => void;
    endSession: () => void;
    toggleTimer: () => void;
    formatTime: (seconds: number) => string;
    isPromptOpen: boolean;
    setNextPath: (path: string | null) => void;
    confirmNavigation: () => void;
    cancelNavigation: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
};

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sessionType, setSessionType] = useState<SessionType>(null);
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0);
    const [participants, setParticipants] = useState<User[]>([]);
    
    const [nextPath, setNextPath] = useState<string | null>(null);
    const isPromptOpen = !!nextPath;

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef(0);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        clearTimer();
        startTimeRef.current = Date.now() - (time * 1000);
        timerRef.current = setInterval(() => {
            setTime(Math.round((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
    }, [time, clearTimer]);


    useEffect(() => {
        if (isActive) {
            startTimer();
        } else {
            clearTimer();
        }
        return clearTimer;
    }, [isActive, startTimer, clearTimer]);
    
    const startSession = (type: SessionType, initialParticipants: User[] = [placeholderUsers[1]]) => {
        setSessionType(type);
        setParticipants(initialParticipants);
        setIsActive(true);
        setTime(0);
    };

    const endSession = () => {
        setSessionType(null);
        setIsActive(false);
        setTime(0);
        setParticipants([]);
        clearTimer();
    };

    const toggleTimer = () => {
        setIsActive(prev => !prev);
    };

    const confirmNavigation = () => {
        if(nextPath) {
            // The actual navigation is handled by the prompt component
            setNextPath(null); // Close prompt
        }
    };
    
    const cancelNavigation = () => {
        setNextPath(null); // Close prompt
    };


    const value: WorkspaceContextType = {
        sessionType,
        isActive,
        time,
        participants,
        setParticipants,
        startSession,
        endSession,
        toggleTimer,
        formatTime,
        isPromptOpen,
        setNextPath,
        confirmNavigation,
        cancelNavigation,
    };

    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};
