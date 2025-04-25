import { supabase } from './supabase';

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(username: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, username });
  return !error;
} 