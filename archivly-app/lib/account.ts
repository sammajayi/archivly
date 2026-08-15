import { supabase } from './supabase';

// Calls the delete-account Edge Function -- deleting an auth user needs the
// service-role key, which lives only server-side there. Signs out locally
// afterward since the server-side deletion doesn't clear this device's
// cached session.
export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.functions.invoke('delete-account');
  if (error) throw error;
  await supabase.auth.signOut();
}
