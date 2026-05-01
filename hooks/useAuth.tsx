import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { Profile, UserRole } from "@/types";
import { supabase } from "@/utils/supabase";

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initializing: boolean;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<Profile>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: (userId?: string) => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const emptyState: AuthState = {
  session: null,
  profile: null,
  loading: false,
  initializing: true,
};

function getReadableAuthError(error: { message?: string; status?: number }) {
  const message = error.message ?? "Terjadi kesalahan.";
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("invalid api key")) {
    return "Supabase API key invalid. Cek lagi EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY di file .env.";
  }

  if (lowerMessage.includes("user already registered")) {
    return "Email ini sudah terdaftar. Coba login atau pakai email lain.";
  }

  if (lowerMessage.includes("email")) {
    return message;
  }

  if (lowerMessage.includes("password")) {
    return message;
  }

  if (error.status === 400 && lowerMessage.includes("invalid")) {
    return `${message}. Biasanya ini karena email/password ditolak Supabase Auth atau setting provider Email belum aktif.`;
  }

  return message;
}

function getReadableDatabaseError(error: { message?: string }) {
  const message = error.message ?? "Terjadi kesalahan database.";
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("relation") && lowerMessage.includes("profiles")) {
    return "Tabel profiles belum ada di Supabase. Jalankan SQL di supabase/profiles.sql lewat Supabase SQL Editor.";
  }

  if (lowerMessage.includes("row-level security")) {
    return "Data user berhasil dibuat, tapi insert ke profiles ditolak RLS. Jalankan policy di supabase/profiles.sql.";
  }

  return message;
}

function isUserRole(value: unknown): value is UserRole {
  return value === "reporter" || value === "dispatcher";
}

async function createMissingProfile(user: User): Promise<Profile> {
  const metadata = user.user_metadata ?? {};
  const role = isUserRole(metadata.role) ? metadata.role : "reporter";
  const fullName =
    typeof metadata.full_name === "string" && metadata.full_name.trim()
      ? metadata.full_name.trim()
      : user.email ?? "User";

  const profileData = {
    id: user.id,
    email: user.email ?? "",
    full_name: fullName,
    role,
    phone: "",
    avatar_url: "",
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profileData)
    .select()
    .single();

  if (error) {
    throw new Error(getReadableDatabaseError(error));
  }

  return data as Profile;
}

async function getProfile(user: User): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(getReadableDatabaseError(error));
  }

  if (!data) {
    return createMissingProfile(user);
  }

  return data as Profile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(emptyState);
  const sessionUser = state.session?.user;

  const refreshProfile = useCallback(
    async (userId?: string) => {
      const targetUser = userId
        ? { ...sessionUser, id: userId }
        : sessionUser;

      if (!targetUser?.id) {
        setState((current) => ({ ...current, profile: null }));
        return null;
      }

      const profile = await getProfile(targetUser as User);
      setState((current) => ({ ...current, profile }));
      return profile;
    },
    [sessionUser],
  );

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error || !data.session) {
        setState({ ...emptyState, initializing: false });
        return;
      }

      try {
        const profile = await getProfile(data.session.user);
        if (!mounted) return;

        setState({
          session: data.session,
          profile,
          loading: false,
          initializing: false,
        });
      } catch {
        if (!mounted) return;

        setState({
          session: data.session,
          profile: null,
          loading: false,
          initializing: false,
        });
      }
    };

    loadSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setState((current) => ({
        ...current,
        session,
        profile: session ? current.profile : null,
        initializing: false,
      }));
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((current) => ({ ...current, loading: true }));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      setState((current) => ({ ...current, loading: false }));
      throw new Error(error ? getReadableAuthError(error) : "Login gagal.");
    }

    try {
      const profile = await getProfile(data.session.user);
      setState({
        session: data.session,
        profile,
        loading: false,
        initializing: false,
      });
      return profile;
    } catch (profileError) {
      setState((current) => ({ ...current, loading: false }));
      throw profileError;
    }
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      role: UserRole,
    ) => {
      setState((current) => ({ ...current, loading: true }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error || !data.user) {
        setState((current) => ({ ...current, loading: false }));
        throw new Error(
          error ? getReadableAuthError(error) : "Pendaftaran gagal.",
        );
      }

      if (data.session) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            phone: "",
            avatar_url: "",
          });

        if (profileError) {
          setState((current) => ({ ...current, loading: false }));
          throw new Error(getReadableDatabaseError(profileError));
        }
      }

      setState((current) => ({
        ...current,
        session: data.session,
        loading: false,
        initializing: false,
      }));
    },
    [],
  );

  const signOut = useCallback(async () => {
    setState((current) => ({ ...current, loading: true }));
    const { error } = await supabase.auth.signOut();

    if (error) {
      setState((current) => ({ ...current, loading: false }));
      throw new Error(error.message);
    }

    setState({
      session: null,
      profile: null,
      loading: false,
      initializing: false,
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: !!state.session,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [refreshProfile, signIn, signOut, signUp, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider.");
  }

  return context;
};
