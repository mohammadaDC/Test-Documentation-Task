import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { PageLoader } from '../components/Spinner';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login?redirect=/profile');
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/api/orders/my`)
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (loading || !user) return <PageLoader />;

  return (
    <Layout title="My Profile – PageTurner Books">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">My Account</h1>

        {/* Profile card */}
        <div className="card p-6 mb-8">
          <h2 className="font-serif font-bold text-lg mb-4">Profile Details</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium ml-1">{user.name}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium ml-1">{user.email}</span></div>
            <div><span className="text-gray-500">Role:</span> <span className="font-medium ml-1 capitalize">{user.role.toLowerCase()}</span></div>
          </div>
        </div>

        {/* Orders */}
        <div className="card p-6">
          <h2 className="font-serif font-bold text-lg mb-4">Order History</h2>
          {ordersLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No orders yet.</p>
              <Link href="/books" className="text-brand-600 hover:text-brand-700 text-sm font-medium mt-2 inline-block">Browse Books</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b">
                  <tr>
                    <th className="pb-2 font-semibold text-gray-600">Order ID</th>
                    <th className="pb-2 font-semibold text-gray-600">Date</th>
                    <th className="pb-2 font-semibold text-gray-600">Status</th>
                    <th className="pb-2 font-semibold text-gray-600 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}…</td>
                      <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          order.status === 'PAID'      ? 'bg-green-100 text-green-700' :
                          order.status === 'SHIPPED'   ? 'bg-blue-100 text-blue-700' :
                          order.status === 'DELIVERED' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-brand-600">${parseFloat(order.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
