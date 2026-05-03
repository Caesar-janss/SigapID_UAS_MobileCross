import { useCallback, useEffect, useState } from "react";
import { FamilyMemberWithProfile } from "@/types";
import { supabase } from "@/utils/supabase";

export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMemberWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("family_members")
      .select(
        `
          id,
          owner_id,
          member_id,
          relationship_label,
          status,
          created_at,
          updated_at,
          accepted_at,
          member:profiles!family_members_member_id_fkey (
            id,
            user_code,
            full_name,
            phone,
            email,
            avatar_url
          )
        `,
      )
      .order("created_at", { ascending: false });

    if (queryError) {
      setMembers([]);
      setError(queryError.message);
      setLoading(false);
      return;
    }

    const normalizedMembers = (data ?? []).map((member) => ({
      ...member,
      member: Array.isArray(member.member) ? member.member[0] : member.member,
    }));

    setMembers(normalizedMembers as unknown as FamilyMemberWithProfile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return { members, loading, error, reload: loadMembers };
}
