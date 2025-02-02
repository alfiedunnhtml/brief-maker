'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/main-layout';

export default function SignIn() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    setRedirectUrl(`${window.location.origin}/auth/callback`);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/');
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!mounted) {
    return (
      <MainLayout>
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome to Brief Maker</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['github', 'google']}
            redirectTo={redirectUrl}
            theme="dark"
          />
        </div>
      </div>
    </MainLayout>
  );
} 