import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { PageLoader } from '../../components/Spinner';

// OAuth callback — receives token from server redirect, stores it, then navigates home
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // router.query is empty until isReady — wait for hydration to complete
    if (!router.isReady) return;
    const { token } = router.query;
    if (!token) return;
    localStorage.setItem('pt_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    router.replace('/');
  }, [router.isReady, router.query]);

  return <PageLoader />;
}
