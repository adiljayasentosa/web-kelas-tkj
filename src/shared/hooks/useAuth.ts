"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { subscribeToIdTokenChanges } from "@/features/auth/services/authService";
import type { Role } from "@/config/roles.config";

interface AuthState {
  user: User | null;
  role: Role | undefined;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: undefined,
    isLoading: true,
  });

  useEffect(() => {
    const unsubscribe = subscribeToIdTokenChanges(async (user) => {
      if (!user) {
        setState({ user: null, role: undefined, isLoading: false });
        return;
      }

      const tokenResult = await user.getIdTokenResult();
      setState({
        user,
        role: tokenResult.claims.role as Role | undefined,
        isLoading: false,
      });
    });

    return unsubscribe;
  }, []);

  return state;
}
