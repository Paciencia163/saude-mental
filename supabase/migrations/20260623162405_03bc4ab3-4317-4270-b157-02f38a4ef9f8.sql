-- Seed demo users for each access level
DO $$
DECLARE
  patient_id uuid := '11111111-1111-1111-1111-111111111111';
  prof_id    uuid := '22222222-2222-2222-2222-222222222222';
  admin_id   uuid := '33333333-3333-3333-3333-333333333333';
BEGIN
  -- PATIENT
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = patient_id) THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', patient_id, 'authenticated', 'authenticated', 'paciente@mentesa.ao', crypt('paciente123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Paciente Demo"}', now(), now(), '', '', '', '');
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), patient_id, format('{"sub":"%s","email":"%s"}', patient_id, 'paciente@mentesa.ao')::jsonb, 'email', patient_id::text, now(), now(), now());
  END IF;

  -- PROFESSIONAL
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = prof_id) THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', prof_id, 'authenticated', 'authenticated', 'profissional@mentesa.ao', crypt('profissional123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dra. Profissional Demo"}', now(), now(), '', '', '', '');
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), prof_id, format('{"sub":"%s","email":"%s"}', prof_id, 'profissional@mentesa.ao')::jsonb, 'email', prof_id::text, now(), now(), now());
  END IF;

  -- ADMIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = admin_id) THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated', 'admin@mentesa.ao', crypt('admin123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador Demo"}', now(), now(), '', '', '', '');
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_id, format('{"sub":"%s","email":"%s"}', admin_id, 'admin@mentesa.ao')::jsonb, 'email', admin_id::text, now(), now(), now());
  END IF;

  -- Ensure profiles exist (handle_new_user trigger should have run, but make sure)
  INSERT INTO public.profiles (user_id, full_name, email, username, phone)
  VALUES
    (patient_id, 'Paciente Demo', 'paciente@mentesa.ao', 'paciente_demo', '+244900000001'),
    (prof_id, 'Dra. Profissional Demo', 'profissional@mentesa.ao', 'profissional_demo', '+244900000002'),
    (admin_id, 'Administrador Demo', 'admin@mentesa.ao', 'admin_demo', '+244900000003')
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    phone = EXCLUDED.phone;

  -- Assign roles (replace whatever default was inserted)
  DELETE FROM public.user_roles WHERE user_id IN (patient_id, prof_id, admin_id);
  INSERT INTO public.user_roles (user_id, role) VALUES
    (patient_id, 'patient'),
    (prof_id, 'professional'),
    (admin_id, 'admin');
END $$;