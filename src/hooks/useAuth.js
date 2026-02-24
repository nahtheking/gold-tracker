import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    // Check if guest mode
    const guestMode = localStorage.getItem('guestMode');
    if (guestMode === 'true') {
      setUser({
        id: 'guest',
        email: 'guest@goldtracker.app',
        isGuest: true
      });
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    setUser({
      id: 'guest',
      email: 'guest@goldtracker.app',
      isGuest: true
    });
  };

  const signOut = async () => {
    // Clear guest mode
    localStorage.removeItem('guestMode');
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signInAsGuest,
    signOut
  };
};
