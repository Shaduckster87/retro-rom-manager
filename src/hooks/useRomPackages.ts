import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type RomPackage = Tables<'rom_packages'>;
export type PackageFile = Tables<'package_files'>;

export function useRomPackages() {
  return useQuery({
    queryKey: ['rom_packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rom_packages')
        .select('*')
        .order('upload_date', { ascending: false });
      if (error) throw error;
      return data as RomPackage[];
    },
  });
}

export function useRomPackage(id: string | undefined) {
  return useQuery({
    queryKey: ['rom_package', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('rom_packages')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as RomPackage;
    },
    enabled: !!id,
  });
}

export function usePackageFiles(packageId: string | undefined) {
  return useQuery({
    queryKey: ['package_files', packageId],
    queryFn: async () => {
      if (!packageId) return [];
      const { data, error } = await supabase
        .from('package_files')
        .select('*')
        .eq('package_id', packageId)
        .order('file_path');
      if (error) throw error;
      return data as PackageFile[];
    },
    enabled: !!packageId,
  });
}
