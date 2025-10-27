"use client";

import { useState } from "react";
import CreateInvoice from "./InvoiceCreate";
import ListInvoices from "./ListInvoices";

const InvoiceManagement = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [invoices, setInvoices] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Invoice Management
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage sale/purchase invoices
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white rounded-xl p-1 border border-gray-200 mt-6 w-fit">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "create"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Create Invoice
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "list"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Invoice List
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <CreateInvoice
            setActiveTab={setActiveTab}
            invoices={invoices}
            setInvoices={setInvoices}
          />
        ) : (
          <ListInvoices invoices={invoices} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;
