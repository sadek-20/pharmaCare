"use client";

import { useState } from "react";
import {
  Plus,
  RefreshCw,
  Eye,
  Printer,
  Edit,
  Users,
} from "../components/Icons";
import ViewInvoice from "./ViewInvoice";

const ListInvoices = ({ invoices, setActiveTab }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const getStatusBadge = (status) => {
    const statusStyles = {
      paid: "bg-green-100 text-green-800",
      unpaid: "bg-red-100 text-red-800",
      partial: "bg-yellow-100 text-yellow-800",
      refunded: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || statusStyles.unpaid
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          type === "sale"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {type === "sale" ? "Sale" : "Purchase"}
      </span>
    );
  };

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewMode(true);
  };

  const printInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  if (viewMode && selectedInvoice) {
    return (
      <ViewInvoice
        invoice={selectedInvoice}
        onBack={() => setViewMode(false)}
        onPrint={() => printInvoice(selectedInvoice)}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* List Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              All Invoices
            </h3>
            <p className="text-sm text-gray-600">
              Manage your sale and purchase invoices
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Invoice #
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Customer/Supplier
              </th>
              <th className="text-right py-3 px-6 text-sm font-semibold text-gray-700">
                Total Amount
              </th>
              <th className="text-right py-3 px-6 text-sm font-semibold text-gray-700">
                Paid
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="text-right py-3 px-6 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((inv) => (
              <tr key={inv._id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <span className="font-mono font-semibold text-gray-900">
                    {inv.invoiceNumber}
                  </span>
                </td>
                <td className="py-4 px-6">{getTypeBadge(inv.type)}</td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900">
                      {inv.type === "sale"
                        ? inv.customer?.name
                        : inv.supplier?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {inv.type === "sale"
                        ? inv.customer?.phone
                        : inv.supplier?.phone}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6 text-right font-semibold text-gray-900">
                  ${inv.totalAmount.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-right text-gray-700">
                  ${inv.amountPaid.toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(inv.paymentStatus)}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => viewInvoice(inv)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => printInvoice(inv)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        /* Edit functionality */
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Invoice"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {invoices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No invoices found
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first invoice.
          </p>
          <button
            onClick={() => setActiveTab("create")}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default ListInvoices;
