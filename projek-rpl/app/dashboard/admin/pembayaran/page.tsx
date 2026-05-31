"use client";

import { useEffect, useState } from "react";
import { getAllChildren, approveChildPayment, rejectChildPayment, updateChildPaymentDetails } from "@/lib/services/admin";

export default function AdminPaymentPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentForms, setPaymentForms] = useState<Record<string, any>>({});

  async function loadPayments() {
    try {
      setLoading(true);
      const data = await getAllChildren();
      setChildren(data || []);
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      setLoading(false);
    }
  }
async function handleSavePaymentDetails(childId: string) {
  const child = children.find((item) => item.id === childId);
  const form = paymentForms[childId];

  if (!child) return;

  if (!form?.start_date || !form?.end_date) {
    alert("Start date and end date must be filled.");
    return;
  }

  const start = new Date(form.start_date);
  const end = new Date(form.end_date);

  const days =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (days <= 0) {
    alert("End date must be after start date.");
    return;
  }

  let total = 0;

  if (child.program === "Harian") {
    total = days * 200000;
  }

  if (child.program === "Mingguan") {
    total = Math.ceil(days / 7) * 1000000;
  }

  if (child.program === "Bulanan") {
    total = Math.ceil(days / 30) * 5000000;
  }

  await updateChildPaymentDetails(childId, {
    start_date: form.start_date,
    end_date: form.end_date,
    total_amount: total,
  });

  await loadPayments();
  alert("Payment details saved!");
}

    async function handleApprove(childId: string) {
    try {
      await approveChildPayment(childId);
      await loadPayments();
      alert("Payment approved!");
    } catch (error) {
      console.error("Failed to approve payment:", error);
      alert("Failed to approve payment.");
    }
  }
      async function handleReject(childId: string) {
    try {
    await rejectChildPayment(childId);
    await loadPayments();
    alert("Payment rejected!");
  } catch (error) {
    console.error("Failed to reject payment:", error);
    alert("Failed to reject payment.");
  }
}
  

  useEffect(() => {
    loadPayments();
  }, []);

  const pendingPayments = children.filter(
    (child) => child.payment_status === "pending"
  );

  const approvedPayments = children.filter(
    (child) => child.payment_status === "approved"
  );

  const rejectedPayments = children.filter(
    (child) => child.payment_status === "rejected"
  );

  if (loading) {
    return <p>Loading payment data...</p>;
  }

return (
  <div className="p-8">
    <h1 className="text-3xl font-black">Payment Approval</h1>
    <p className="mt-1 text-gray-500">
      Approve daycare registration payments from parents.
    </p>

    <div className="mt-8 rounded-[2rem] border border-warm-beige/40 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Pending Payments</h2>

      {pendingPayments.length === 0 ? (
        <p className="mt-6 text-gray-500">No pending payments.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {pendingPayments.map((child) => (
            <div key={child.id} className="rounded-2xl border border-warm-beige/40 p-5">
              <div className="grid grid-cols-[220px_1fr] items-center gap-8">
                <div>
                  <h3 className="text-xl font-black">{child.full_name}</h3>

                  <p className="mt-4 text-xs uppercase tracking-wide text-gray-400">
                    Program
                  </p>
                  <p className="text-lg">{child.program || "-"}</p>

                  <p className="mt-3 text-xs uppercase tracking-wide text-gray-400">
                    Status
                  </p>
                  <p className="text-lg text-yellow-600">Pending</p>
                </div>

                <div className="grid grid-cols-[260px_1fr] gap-x-8 gap-y-4">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Start Date
                    </p>
                    <input
                      type="date"
                      value={paymentForms[child.id]?.start_date || child.start_date || ""}
                      onChange={(e) =>
                        setPaymentForms((prev) => ({
                          ...prev,
                          [child.id]: { ...prev[child.id], start_date: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-warm-beige/40 px-3 py-2"
                    />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Total Amount
                    </p>

                    <button
                      onClick={() => handleSavePaymentDetails(child.id)}
                      className="whitespace-nowrap rounded-2xl bg-foreground px-5 py-3 font-bold text-warm-beige"
                    >
                      Save Payment Details
                    </button>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                      End Date
                    </p>
                    <input
                      type="date"
                      value={paymentForms[child.id]?.end_date || child.end_date || ""}
                      onChange={(e) =>
                        setPaymentForms((prev) => ({
                          ...prev,
                          [child.id]: { ...prev[child.id], end_date: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-warm-beige/40 px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-wrap items-end gap-3">
                    {child.payment_proof_url ? (
                      <a
                        href={child.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl bg-green-500 px-5 py-3 font-bold text-white"
                      >
                        View Proof
                      </a>
                    ) : (
                      <span className="rounded-2xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-500">
                        No Proof Yet
                      </span>
                    )}

                    <button
                      onClick={() => handleApprove(child.id)}
                      className="rounded-2xl bg-blue-500 px-6 py-3 font-bold text-white"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(child.id)}
                      className="rounded-2xl bg-red-500 px-6 py-3 font-bold text-white"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}