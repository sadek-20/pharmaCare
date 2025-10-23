"use client"

import { useState } from "react"
import { ShoppingCart, User, DollarSign, Trash2, Plus } from "../components/Icons"
import { usePharmacy } from "../context/PharmacyContext"

function InvoiceCreate() {
  const { medicines, customers, createSale } = usePharmacy()

  const [items, setItems] = useState([])
  const [currentItem, setCurrentItem] = useState({
    medicineId: "",
    medicineName: "",
    batch: "",
    quantity: "",
    unitPrice: "",
  })
  const [paymentType, setPaymentType] = useState("cash")
  const [amountPaid, setAmountPaid] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleMedicineSelect = (medicineId) => {
    const medicine = medicines.find((m) => m.id === Number.parseInt(medicineId))
    if (medicine) {
      setCurrentItem({
        medicineId: medicine.id,
        medicineName: medicine.name,
        batch: medicine.batch,
        quantity: "",
        unitPrice: medicine.sellingPrice,
      })
    }
  }

  const addItem = () => {
    if (currentItem.medicineName && currentItem.quantity && currentItem.unitPrice) {
      const quantity = Number.parseInt(currentItem.quantity)
      const medicine = medicines.find((m) => m.id === currentItem.medicineId)

      if (medicine && quantity > medicine.stock) {
        alert(`Not enough stock! Available: ${medicine.stock}`)
        return
      }

      setItems([...items, { ...currentItem, id: Date.now() }])
      setCurrentItem({ medicineId: "", medicineName: "", batch: "", quantity: "", unitPrice: "" })
    }
  }

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice), 0)
  }

  const calculateBalance = () => {
    const total = calculateTotal()
    return paymentType === "cash" ? total - (Number.parseFloat(amountPaid) || 0) : total
  }

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer")
      return
    }

    if (items.length === 0) {
      alert("Please add at least one item")
      return
    }

    const invoiceData = {
      customer: selectedCustomer,
      items,
      total: calculateTotal(),
      paymentType,
      amountPaid: paymentType === "cash" ? Number.parseFloat(amountPaid) || 0 : 0,
      balance: calculateBalance(),
      date: new Date().toISOString(),
    }

    createSale(invoiceData)
    setShowPreview(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-800">Create Invoice</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Add Items Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-800">Customer Information</h3>
            </div>
            <select
              value={selectedCustomer?.id || ""}
              onChange={(e) => {
                const customer = customers.find((c) => c.id === Number.parseInt(e.target.value))
                setSelectedCustomer(customer)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                  {customer.creditBalance > 0 && ` (Credit: $${customer.creditBalance.toFixed(2)})`}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-800">Add Items</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                value={currentItem.medicineId}
                onChange={(e) => handleMedicineSelect(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Medicine</option>
                {medicines.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name} - Stock: {medicine.stock} - ${medicine.sellingPrice}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Batch Number"
                value={currentItem.batch}
                readOnly
                className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Unit Price ($)"
                value={currentItem.unitPrice}
                onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={addItem}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Medicine</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Batch</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{item.medicineName}</td>
                      <td className="px-4 py-3 text-gray-600">{item.batch}</td>
                      <td className="px-4 py-3 text-gray-800">{item.quantity}</td>
                      <td className="px-4 py-3 text-gray-800">${item.unitPrice}</td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Payment & Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-800">Payment Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentType("cash")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
                      paymentType === "cash"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentType("credit")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
                      paymentType === "credit"
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    Credit
                  </button>
                </div>
              </div>

              {paymentType === "cash" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                </div>
                {paymentType === "cash" && (
                  <>
                    <div className="flex justify-between text-gray-700">
                      <span>Paid:</span>
                      <span className="font-semibold">${(Number.parseFloat(amountPaid) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Change:</span>
                      <span className="text-green-600">${Math.max(0, -calculateBalance()).toFixed(2)}</span>
                    </div>
                  </>
                )}
                {paymentType === "credit" && (
                  <div className="flex justify-between text-lg font-bold text-red-600">
                    <span>Credit Balance:</span>
                    <span>${calculateBalance().toFixed(2)}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={items.length === 0 || !selectedCustomer}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">PharmaCare</h2>
              <p className="text-gray-600">Invoice Receipt</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                <strong>Customer:</strong> {selectedCustomer?.name}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {selectedCustomer?.phone}
              </p>
              <p className="text-gray-700">
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <strong>Payment:</strong> {paymentType.toUpperCase()}
              </p>
            </div>

            <table className="w-full mb-6">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2">{item.medicineName}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">${item.unitPrice}</td>
                    <td className="text-right py-2">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right mb-6 space-y-1">
              <p className="text-xl font-bold">Total: ${calculateTotal().toFixed(2)}</p>
              {paymentType === "cash" && (
                <>
                  <p>Paid: ${(Number.parseFloat(amountPaid) || 0).toFixed(2)}</p>
                  <p className="text-green-600 font-semibold">Change: ${Math.max(0, -calculateBalance()).toFixed(2)}</p>
                </>
              )}
              {paymentType === "credit" && (
                <p className="text-red-600 font-semibold">Credit Balance: ${calculateBalance().toFixed(2)}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Print
              </button>
              <button
                onClick={() => {
                  setShowPreview(false)
                  setItems([])
                  setSelectedCustomer(null)
                  setAmountPaid("")
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                New Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceCreate
