
-- Allow public (unauthenticated) users to view rom_packages
DROP POLICY IF EXISTS "Authenticated users can view rom_packages" ON public.rom_packages;
CREATE POLICY "Anyone can view rom_packages" ON public.rom_packages FOR SELECT TO anon, authenticated USING (true);

-- Allow public (unauthenticated) users to view package_files
DROP POLICY IF EXISTS "Authenticated users can view package_files" ON public.package_files;
CREATE POLICY "Anyone can view package_files" ON public.package_files FOR SELECT TO anon, authenticated USING (true);
