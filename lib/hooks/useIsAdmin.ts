import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(!!adminUser?.is_admin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  return { isAdmin, loading };
} 