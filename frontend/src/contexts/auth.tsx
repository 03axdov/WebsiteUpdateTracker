import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, ensureCsrfCookie } from "../api";
import type { User } from "../types/auth";


type AuthState = {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    login: (payload: { email?: string; username?: string; password: string }) => Promise<void>;
    register: (payload: {
        username: string;
        email: string;
        password1: string;
        password2: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshUser() {
        try {
            const u = await apiFetch("/api/auth/user/");
            setUser(u);
        } catch {
            setUser(null);
        }
    }

    async function login(payload: { email?: string; username?: string; password: string }) {
        await ensureCsrfCookie();

        // dj-rest-auth commonly supports either email or username based on allauth config
        await apiFetch("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify(payload),
        });

        await refreshUser();
    }

    async function register(payload: {
        username: string;
        email: string;
        password1: string;
        password2: string;
    }) {
        await ensureCsrfCookie();

        await apiFetch("/api/auth/registration/", {
            method: "POST",
            body: JSON.stringify(payload),
    });

    await refreshUser();
    }

    async function logout() {
        await ensureCsrfCookie();
        await apiFetch("/api/auth/logout/", { method: "POST" });
        setUser(null);
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            await refreshUser();
            setLoading(false);
        })();
    }, []);

    const value = useMemo(
        () => ({ user, loading, refreshUser, login, register, logout }),
        [user, loading]
    );

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
