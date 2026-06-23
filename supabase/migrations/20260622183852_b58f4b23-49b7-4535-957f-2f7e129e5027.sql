
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT,
  phone TEXT,
  email TEXT,
  bio TEXT,
  photo_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.doctors TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Admins can insert doctors" ON public.doctors FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update doctors" ON public.doctors FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete doctors" ON public.doctors FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.doctors (name, specialty, province, city, phone, email, bio) VALUES
('Dra. Maria Cabral', 'Psiquiatra', 'Luanda', 'Luanda', '+244 923 100 200', 'maria.cabral@mentesa.ao', 'Especialista em transtornos de humor e ansiedade. 15 anos de experiência clínica.'),
('Dr. António Manuel', 'Psicólogo Clínico', 'Luanda', 'Luanda', '+244 923 200 300', 'antonio.manuel@mentesa.ao', 'Foco em terapia cognitivo-comportamental e gestão do stress.'),
('Dra. Esperança Domingos', 'Psiquiatra', 'Benguela', 'Benguela', '+244 924 300 400', 'esperanca.domingos@mentesa.ao', 'Atende adultos e adolescentes com depressão e ansiedade.'),
('Dr. Joaquim Silva', 'Psicólogo Clínico', 'Huíla', 'Lubango', '+244 925 400 500', 'joaquim.silva@mentesa.ao', 'Terapia familiar e individual. Atendimento humanizado.'),
('Dra. Filomena Neto', 'Psiquiatra', 'Huambo', 'Huambo', '+244 926 500 600', 'filomena.neto@mentesa.ao', 'Especialista em saúde mental comunitária.'),
('Dr. Pedro Bastos', 'Psicólogo Clínico', 'Cabinda', 'Cabinda', '+244 927 600 700', 'pedro.bastos@mentesa.ao', 'Apoio psicológico a vítimas de trauma.'),
('Dra. Luísa Tavares', 'Psicóloga Clínica', 'Namibe', 'Moçâmedes', '+244 928 700 800', 'luisa.tavares@mentesa.ao', 'Trabalho com jovens, ansiedade e depressão.'),
('Dr. Manuel Eduardo', 'Psiquiatra', 'Malanje', 'Malanje', '+244 929 800 900', 'manuel.eduardo@mentesa.ao', 'Atendimento clínico e psicofarmacológico.');
