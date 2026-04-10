import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// OAuth callback — receives token from server redirect, stores it, then navigates home
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;
    if (!token) return;
    localStorage.setItem('pt_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    router.replace('/');
  }, [router.query]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Signing you in…</p>
    </div>
  );
}
