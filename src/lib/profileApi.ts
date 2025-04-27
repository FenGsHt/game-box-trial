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

export async function updateProfile(username: string, email?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const profileData: { id: string; username: string; email?: string } = { 
    id: user.id, 
    username 
  };
  
  // 如果提供了email，则一并更新
  if (email) {
    profileData.email = email;
  }
  
  const { error } = await supabase
    .from('profiles')
    .upsert(profileData);
  
  return !error;
} 