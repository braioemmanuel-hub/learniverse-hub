import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface CertificateSettings {
  signature_name: string;
  logo_url: string | null;
  organization_name: string;
}

const defaultSettings: CertificateSettings = {
  signature_name: "Heros Academy Administration",
  logo_url: null,
  organization_name: "Heros Academy",
};

export function useCertificateSettings() {
  return useQuery({
    queryKey: ["certificate-settings"],
    queryFn: async (): Promise<CertificateSettings> => {
      const { data, error } = await supabase
        .from("landing_page_content")
        .select("content")
        .eq("section_key", "certificate_settings")
        .maybeSingle();

      if (error) throw error;

      if (!data) return defaultSettings;

      const content = data.content as Record<string, Json>;
      return {
        signature_name: (content.signature_name as string) ?? defaultSettings.signature_name,
        logo_url: (content.logo_url as string | null) ?? defaultSettings.logo_url,
        organization_name: (content.organization_name as string) ?? defaultSettings.organization_name,
      };
    },
  });
}

export function useUpdateCertificateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: CertificateSettings) => {
      const { data: existing } = await supabase
        .from("landing_page_content")
        .select("id")
        .eq("section_key", "certificate_settings")
        .maybeSingle();

      const content: Json = {
        signature_name: settings.signature_name,
        logo_url: settings.logo_url,
        organization_name: settings.organization_name,
      };

      if (existing) {
        const { error } = await supabase
          .from("landing_page_content")
          .update({ content })
          .eq("section_key", "certificate_settings");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("landing_page_content")
          .insert({
            section_key: "certificate_settings",
            content,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificate-settings"] });
    },
  });
}

export async function uploadCertificateLogo(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("certificate-assets")
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("certificate-assets")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteCertificateLogo(logoUrl: string): Promise<void> {
  const fileName = logoUrl.split("/").pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from("certificate-assets")
    .remove([fileName]);

  if (error) throw error;
}
