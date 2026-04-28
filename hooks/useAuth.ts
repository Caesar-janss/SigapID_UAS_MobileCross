import { useState, useCallback } from "react";
import { Profile, UserRole } from "@/types";

interface AuthState {
  session: any | null;
  profile: Profile | null;
  loading: boolean;
  initializing: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    session: null,
    profile: null,
    loading: false,
    initializing: false,
  });

  const signIn = useCallback(async (email: string, _password: string) => {
    setState((s) => ({ ...s, loading: true }));
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockSession = { user: { id: "123", email } };
    const mockProfile: Profile = {
      id: "123",
      full_name: "User Pengetesan",
      role: "reporter",
      email: email,
      phone: "08123456789",
      avatar_url: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState({
      session: mockSession,
      profile: mockProfile,
      loading: false,
      initializing: false,
    });
  }, []);

  const signUp = useCallback(
    async (email: string, _password: string, fullName: string, role: UserRole) => {
      setState((s) => ({ ...s, loading: true }));
      
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockSession = { user: { id: "124", email } };
      const mockProfile: Profile = {
        id: "124",
        full_name: fullName,
        role: role,
        email: email,
        phone: "",
        avatar_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setState({
        session: mockSession,
        profile: mockProfile,
        loading: false,
        initializing: false,
      });
    },
    [],
  );

  const signOut = useCallback(async () => {
    setState({
      session: null,
      profile: null,
      loading: false,
      initializing: false,
    });
  }, []);

  return {
    ...state,
    isAuthenticated: !!state.session,
    signIn,
    signUp,
    signOut,
  };
};