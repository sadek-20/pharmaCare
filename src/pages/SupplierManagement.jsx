"use client"

import { useState } from "react"
import { Plus, Search, Edit2, Trash2, Building2, Mail, DollarSign, CreditCard } from "../components/Icons"
import { usePharmacy } from "../context/PharmacyContext"

function SupplierManagement() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, paySupplier } = usePharmacy()

  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [paymentSupplier, setPaymentSupplier] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    balance: 0,
  })

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    setEditingSupplier(null)
    setFormData({ name: "", contact: "", email: "", balance: 0 })
    setShowModal(true)
  }

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier)
    setFormData(supplier)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      deleteSupplier(id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData)
    } else {
      addSupplier(formData)
    }
    setShowModal(false)
  }

  const handlePayment = (supplier) => {
    setPaymentSupplier(supplier)
    setPaymentAmount("")
    setShowPaymentModal(true)
  }

  const processPayment = (e) => {
    e.preventDefault()
    const amount = Number.parseFloat(paymentAmount)
    if (amount > 0 && amount <= paymentSupplier.balance) {
      paySupplier(paymentSupplier.id, amount)
      setShowPaymentModal(false)
      alert(`Payment of $${amount.toFixed(2)} processed successfully!`)
    } else {
      alert("Invalid payment amount!")
    }
  }

  const totalBalance = suppliers.reduce((sum, supplier) => sum + supplier.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Supplier Management</h2>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-gray-600 text-sm">Total Suppliers</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{suppliers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-red-500" />
            <div>
              <p className="text-gray-600 text-sm">Outstanding Balance</p>
              <p className="text-3xl font-bold text-red-600 mt-1">${totalBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-orange-500" />
            <div>
              <p className="text-gray-600 text-sm">Suppliers with Balance</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{suppliers.filter((s) => s.balance > 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers by name, contact, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{supplier.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{supplier.contact}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{supplier.email}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 mb-4">
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-red-600">${supplier.balance.toFixed(2)}</p>
            </div>

            <div className="flex gap-2">
              {supplier.balance > 0 && (
                <button
                  onClick={() => handlePayment(supplier)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-1"
                >
                  <DollarSign className="w-4 h-4" />
                  Pay
                </button>
              )}
              <button
                onClick={() => handleEdit(supplier)}
                className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium flex items-center justify-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(supplier.id)}
                className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outstanding Balance ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: Number.parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingSupplier ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Process Payment</h3>
                <p className="text-sm text-gray-600">{paymentSupplier.name}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <p className="text-3xl font-bold text-red-600">${paymentSupplier.balance.toFixed(2)}</p>
            </div>

            <form onSubmit={processPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  max={paymentSupplier.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount to pay"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum: ${paymentSupplier.balance.toFixed(2)}</p>
              </div>

              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setPaymentAmount((paymentSupplier.balance / 2).toFixed(2))}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentAmount(paymentSupplier.balance.toFixed(2))}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                >
                  Full Amount
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Process Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierManagement
