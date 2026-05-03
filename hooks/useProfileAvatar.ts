import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/utils/supabase";

type AvatarSource = "camera" | "library";

function extensionFromAsset(asset: ImagePicker.ImagePickerAsset) {
  const filenameExtension = asset.fileName?.split(".").pop()?.toLowerCase();

  if (filenameExtension) {
    return filenameExtension === "jpeg" ? "jpg" : filenameExtension;
  }

  if (asset.mimeType === "image/png") return "png";
  if (asset.mimeType === "image/webp") return "webp";
  return "jpg";
}

export function useProfileAvatar() {
  const { profile, refreshProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  const updateAvatar = useCallback(
    async (source: AvatarSource) => {
      if (!profile?.id) {
        throw new Error("Profil belum terbaca. Coba login ulang.");
      }

      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        throw new Error(
          source === "camera"
            ? "Izin kamera belum diberikan."
            : "Izin akses galeri belum diberikan.",
        );
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.82,
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            })
          : await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.82,
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      setUploading(true);

      try {
        const asset = result.assets[0];
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const extension = extensionFromAsset(asset);
        const contentType = asset.mimeType ?? `image/${extension === "jpg" ? "jpeg" : extension}`;
        const storagePath = `${profile.id}/avatar.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-avatars")
          .upload(storagePath, blob, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data } = supabase.storage
          .from("profile-avatars")
          .getPublicUrl(storagePath);

        const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ avatar_url: avatarUrl })
          .eq("id", profile.id);

        if (profileError) {
          throw new Error(profileError.message);
        }

        await refreshProfile();
        return avatarUrl;
      } finally {
        setUploading(false);
      }
    },
    [profile?.id, refreshProfile],
  );

  return { uploading, updateAvatar };
}
