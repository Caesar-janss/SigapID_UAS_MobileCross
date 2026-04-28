export type UserRole = "reporter" | "dispatcher";

export type EmergencyType = "police" | "ambulance" | "firefighter" | "sos";

export type EmergencyStatus =
  | "pending"
  | "accepted"
  | "on_route"
  | "resolved"
  | "cancelled"
  | "rejected";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Emergency {
  id: string;
  reporter_id: string;
  dispatcher_id: string | null;
  type: EmergencyType;
  status: EmergencyStatus;
  description: string | null;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  address: string | null;
  photo_url: string | null;
  call_room: string | null;
  fall_detected: boolean;
  created_at: string;
  accepted_at: string | null;
  resolved_at: string | null;
  updated_at: string;
}

export interface EmergencyWithReporter extends Emergency {
  reporter?: Pick<Profile, "id" | "full_name" | "phone" | "email">;
}

export interface EmergencyLocation {
  id: number;
  emergency_id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  recorded_at: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

// Navigation param lists
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ReporterStackParamList = {
  Dashboard: undefined;
  ActiveEmergency: { emergencyId: string };
  Camera: { emergencyId: string };
  Call: { emergencyId: string; roomName: string };
  History: undefined;
  Profile: undefined;
};

export type DispatcherStackParamList = {
  Dashboard: undefined;
  EmergencyDetail: { emergencyId: string };
  Call: { emergencyId: string; roomName: string };
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Reporter: undefined;
  Dispatcher: undefined;
  Splash: undefined;
};
