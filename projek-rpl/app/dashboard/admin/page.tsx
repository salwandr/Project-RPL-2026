"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAllChildren,
  getAllProfiles,
  approveChildPayment,
} from "@/lib/services/admin";

export default function AdminDashboardPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function loadData() {
    try {
      setLoading(true);

      const childrenData = await getAllChildren();
      const profilesData = await getAllProfiles();

      setChildren(childrenData || []);
      setProfiles(profilesData || []);
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(childId: string) {
    try {
      await approveChildPayment(childId);
      await loadData();
      alert("Payment approved!");
    } catch (error) {
      console.error("Failed to approve payment:", error);
      alert("Failed to approve payment.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const pendingPayments = children.filter(
    (child) => child.payment_status === "pending"
  );

  const paidChildren = children.filter(
    (child) => child.payment_status === "paid"
  );

  const parents = profiles.filter((profile) => profile.role === "parent");
  const teachers = profiles.filter((profile) => profile.role === "teacher");

  if (loading) {
    return <p className="p-6">Loading admin dashboard...</p>;
  }

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">
          Owner panel for managing daycare registrations.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Total Children</p>
          <h2 className="text-3xl font-bold">{children.length}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Parents</p>
          <h2 className="text-3xl font-bold">{parents.length}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Teachers</p>
          <h2 className="text-3xl font-bold">{teachers.length}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Pending Payments</p>
          <h2 className="text-3xl font-bold">{pendingPayments.length}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Paid Children</p>
          <h2 className="text-3xl font-bold">{paidChildren.length}</h2>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow">
        <h2 className="text-xl font-semibold mb-4">
          Pending Payment Approval
        </h2>

        {pendingPayments.length === 0 ? (
          <p className="text-gray-500">No pending payments.</p>
        ) : (
          <div className="space-y-3">
            {pendingPayments.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h3 className="font-semibold">{child.full_name}</h3>

                  <p className="text-sm text-gray-500">
                    Program: {child.program || "-"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Status: {child.payment_status}
                  </p>
                </div>

                <button
                 onClick={() => router.push(`/dashboard/admin/pembayaran`)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Ke Pembayaran
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}