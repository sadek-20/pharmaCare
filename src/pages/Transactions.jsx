"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Package,
} from "../components/Icons"
import { usePharmacy } from "../context/PharmacyContext"

function Transactions() {
  const { transactions } = usePharmacy()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.customer && transaction.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.supplier && transaction.supplier.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = filterType === "all" || transaction.type === filterType

    return matchesSearch && matchesFilter
  })

  const totalSales = transactions.filter((t) => t.type === "sale").reduce((sum, t) => sum + t.amount, 0)
  const totalPurchases = transactions.filter((t) => t.type === "purchase").reduce((sum, t) => sum + t.amount, 0)
  const totalPayments = transactions.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.amount, 0)

  const getTransactionIcon = (type) => {
    switch (type) {
      case "sale":
        return <ShoppingCart className="w-5 h-5 text-green-600" />
      case "purchase":
        return <Package className="w-5 h-5 text-blue-600" />
      case "payment":
        return <CreditCard className="w-5 h-5 text-purple-600" />
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case "sale":
        return "bg-green-50 text-green-700 border-green-200"
      case "purchase":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "payment":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Transactions</h2>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Sales</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">${totalSales.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Purchases</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">${totalPurchases.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Payments</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">${totalPayments.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="sale">Sales</option>
              <option value="purchase">Purchases</option>
              <option value="payment">Payments</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Party</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getTransactionColor(transaction.type)}`}
                        >
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-800">{transaction.description}</td>
                    <td className="px-6 py-4 text-gray-600">{transaction.customer || transaction.supplier || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div>
                        <div className="font-medium">{new Date(transaction.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{new Date(transaction.date).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{transaction.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          transaction.type === "sale"
                            ? "text-green-600"
                            : transaction.type === "purchase"
                              ? "text-blue-600"
                              : "text-purple-600"
                        }`}
                      >
                        {transaction.type === "sale" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Transactions
