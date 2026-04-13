
-- Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.rom_status AS ENUM ('uploading', 'hashing', 'processing', 'sorted', 'duplicate', 'unsorted');
CREATE TYPE public.package_type AS ENUM ('file', 'folder');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create rom_packages table
CREATE TABLE public.rom_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  filename TEXT NOT NULL,
  console TEXT,
  package_type package_type NOT NULL DEFAULT 'file',
  file_extension TEXT,
  file_size BIGINT NOT NULL DEFAULT 0,
  total_files INTEGER NOT NULL DEFAULT 1,
  hash_sha256 TEXT,
  status rom_status NOT NULL DEFAULT 'uploading',
  storage_path TEXT NOT NULL,
  duplicate_group_id TEXT,
  region TEXT,
  language TEXT,
  detection_source TEXT,
  file_tree JSONB,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rom_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rom_packages" ON public.rom_packages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert rom_packages" ON public.rom_packages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update rom_packages" ON public.rom_packages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete rom_packages" ON public.rom_packages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create package_files table
CREATE TABLE public.package_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.rom_packages(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_extension TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.package_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view package_files" ON public.package_files FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert package_files" ON public.package_files FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update package_files" ON public.package_files FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete package_files" ON public.package_files FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rom_packages_updated_at BEFORE UPDATE ON public.rom_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX idx_rom_packages_console ON public.rom_packages(console);
CREATE INDEX idx_rom_packages_status ON public.rom_packages(status);
CREATE INDEX idx_rom_packages_package_type ON public.rom_packages(package_type);
CREATE INDEX idx_rom_packages_duplicate_group ON public.rom_packages(duplicate_group_id);
CREATE INDEX idx_rom_packages_hash ON public.rom_packages(hash_sha256);
CREATE INDEX idx_package_files_package_id ON public.package_files(package_id);
