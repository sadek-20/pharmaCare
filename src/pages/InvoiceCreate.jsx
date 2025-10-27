"use client";

import { useState } from "react";
import {
  Users,
  Truck,
  Plus,
  Search,
  Trash2,
  Save,
  RefreshCw,
  Printer,
  Download,
} from "../components/Icons";

const CreateInvoice = ({ setActiveTab, invoices, setInvoices }) => {
  const [invoiceType, setInvoiceType] = useState("sale");
  const [invoice, setInvoice] = useState({
    type: "sale",
    customer: "",
    supplier: "",
    items: [],
    amountPaid: 0,
    notes: "",
    paymentMethod: "cash",
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState("");

  // Demo data
  const [customers] = useState([
    {
      _id: "1",
      name: "Ahmed Mohamed",
      phone: "+252611234567",
      type: "regular",
    },
    { _id: "2", name: "Aisha Hassan", phone: "+252612345678", type: "regular" },
    { _id: "3", name: "Omar Ali", phone: "+252613456789", type: "vip" },
  ]);

  const [suppliers] = useState([
    {
      _id: "1",
      name: "MediPlus Distributors",
      phone: "+252615678901",
      category: "General Medicine",
    },
    {
      _id: "2",
      name: "PharmaSource Ltd",
      phone: "+252616789012",
      category: "Branded Drugs",
    },
  ]);

  const [products] = useState([
    {
      _id: "1",
      name: "Paracetamol 500mg",
      price: 5.0,
      cost: 3.5,
      stock: 100,
      category: "Pain Relief",
    },
    {
      _id: "2",
      name: "Amoxicillin 250mg",
      price: 15.5,
      cost: 11.0,
      stock: 50,
      category: "Antibiotic",
    },
    {
      _id: "3",
      name: "Vitamin C 1000mg",
      price: 8.75,
      cost: 6.25,
      stock: 200,
      category: "Supplement",
    },
  ]);

  // Calculate totals
  const totalAmount = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const amountDue = totalAmount - invoice.amountPaid;

  const getPaymentStatus = () => {
    if (invoice.amountPaid >= totalAmount) return "paid";
    if (invoice.amountPaid > 0) return "partial";
    return "unpaid";
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = () => {
    if (!selectedProduct || quantity < 1) return;

    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    if (invoiceType === "sale" && product.stock < quantity) {
      alert(`Insufficient stock! Only ${product.stock} items available.`);
      return;
    }

    const price = customPrice
      ? parseFloat(customPrice)
      : invoiceType === "sale"
      ? product.price
      : product.cost;

    const existingItem = invoice.items.find(
      (item) => item.product === product._id
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (invoiceType === "sale" && product.stock < newQuantity) {
        alert(`Insufficient stock! Only ${product.stock} items available.`);
        return;
      }

      setInvoice((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product === product._id
            ? {
                ...item,
                quantity: newQuantity,
                price: price,
                total: price * newQuantity,
              }
            : item
        ),
      }));
    } else {
      setInvoice((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            product: product._id,
            name: product.name,
            price: price,
            quantity: quantity,
            total: price * quantity,
          },
        ],
      }));
    }

    setSelectedProduct("");
    setQuantity(1);
    setCustomPrice("");
    setSearchTerm("");
  };

  const removeItem = (productId) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.product !== productId),
    }));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const item = invoice.items.find((item) => item.product === productId);
    const product = products.find((p) => p._id === productId);

    if (invoiceType === "sale" && product && product.stock < newQuantity) {
      alert(`Insufficient stock! Only ${product.stock} items available.`);
      return;
    }

    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.product === productId
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      ),
    }));
  };

  const updatePrice = (productId, newPrice) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.product === productId
          ? { ...item, price: newPrice, total: newPrice * item.quantity }
          : item
      ),
    }));
  };

  const handleInvoiceTypeChange = (type) => {
    setInvoiceType(type);
    setInvoice({
      type: type,
      customer: "",
      supplier: "",
      items: [],
      amountPaid: 0,
      notes: "",
      paymentMethod: "cash",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (invoice.items.length === 0) {
      alert("Please add at least one item to the invoice");
      return;
    }

    if (invoiceType === "sale" && !invoice.customer) {
      alert("Please select a customer for sale invoice");
      return;
    }

    if (invoiceType === "purchase" && !invoice.supplier) {
      alert("Please select a supplier for purchase invoice");
      return;
    }

    setLoading(true);

    try {
      const invoiceData = {
        _id: Date.now().toString(),
        invoiceNumber: `INV${Date.now()}`,
        type: invoiceType,
        customer:
          invoiceType === "sale"
            ? customers.find((c) => c._id === invoice.customer)
            : undefined,
        supplier:
          invoiceType === "purchase"
            ? suppliers.find((s) => s._id === invoice.supplier)
            : undefined,
        items: invoice.items,
        totalAmount: totalAmount,
        amountPaid: parseFloat(invoice.amountPaid) || 0,
        paymentStatus: getPaymentStatus(),
        notes: invoice.notes,
        createdAt: new Date().toISOString(),
      };

      console.log("Submitting invoice:", invoiceData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add to invoices list
      setInvoices((prev) => [invoiceData, ...prev]);

      alert("Invoice created successfully!");

      // Reset form
      setInvoice({
        type: invoiceType,
        customer: "",
        supplier: "",
        items: [],
        amountPaid: 0,
        notes: "",
        paymentMethod: "cash",
      });

      // Switch to list view
      setActiveTab("list");
    } catch (error) {
      alert("Error creating invoice: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const shareOnWhatsApp = () => {
    if (invoice.items.length === 0) {
      alert("Please add items to the invoice first");
      return;
    }

    const customer = customers.find((c) => c._id === invoice.customer);
    if (!customer) {
      alert("Please select a customer first");
      return;
    }

    const itemsText = invoice.items
      .map(
        (item) =>
          `${item.name} - ${item.quantity} x $${item.price} = $${item.total}`
      )
      .join("%0A");

    const message =
      `*Invoice Summary*%0A%0A` +
      `Customer: ${customer.name}%0A` +
      `Phone: ${customer.phone}%0A%0A` +
      `*Items:*%0A${itemsText}%0A%0A` +
      `*Total Amount:* $${totalAmount.toFixed(2)}%0A` +
      `*Amount Paid:* $${invoice.amountPaid}%0A` +
      `*Amount Due:* $${amountDue.toFixed(2)}%0A%0A` +
      `Thank you for your business!`;

    const whatsappUrl = `https://wa.me/${customer.phone.replace(
      "+",
      ""
    )}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Invoice Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Invoice Type Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex gap-2">
            <button
              onClick={() => handleInvoiceTypeChange("sale")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                invoiceType === "sale"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 border border-gray-200"
              }`}
            >
              <Users className="w-5 h-5" />
              Sale Invoice
            </button>
            <button
              onClick={() => handleInvoiceTypeChange("purchase")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                invoiceType === "purchase"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 border border-gray-200"
              }`}
            >
              <Truck className="w-5 h-5" />
              Purchase Invoice
            </button>
          </div>
        </div>

        {/* Customer/Supplier Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                invoiceType === "sale" ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              {invoiceType === "sale" ? (
                <Users className="w-5 h-5 text-blue-600" />
              ) : (
                <Truck className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {invoiceType === "sale"
                  ? "Customer Information"
                  : "Supplier Information"}
              </h3>
              <p className="text-sm text-gray-600">
                Select {invoiceType === "sale" ? "customer" : "supplier"} for
                this invoice
              </p>
            </div>
          </div>

          <select
            value={invoiceType === "sale" ? invoice.customer : invoice.supplier}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                [invoiceType === "sale" ? "customer" : "supplier"]:
                  e.target.value,
              }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">
              Select {invoiceType === "sale" ? "customer" : "supplier"}
            </option>
            {(invoiceType === "sale" ? customers : suppliers).map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} - {item.phone}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add Product
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Product
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or category..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a product</option>
                {filteredProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - $
                    {invoiceType === "sale" ? product.price : product.cost}
                    {invoiceType === "sale" && ` (${product.stock} in stock)`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Price (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="Leave empty for default"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={addItem}
              disabled={!selectedProduct}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Invoice Items ({invoice.items.length})
          </h3>

          {invoice.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No items added to the invoice yet.</p>
              <p className="text-sm mt-1">Search and add products above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Qty
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr
                      key={item.product}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) =>
                            updatePrice(
                              item.product,
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 text-right border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => removeItem(item.product)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Summary and Actions */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Invoice Summary
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold">${totalAmount.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Paid
              </label>
              <input
                type="number"
                min="0"
                max={totalAmount}
                step="0.01"
                value={invoice.amountPaid}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    amountPaid: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">
                Amount Due:
              </span>
              <span
                className={`text-xl font-bold ${
                  amountDue === 0 ? "text-green-600" : "text-orange-600"
                }`}
              >
                ${amountDue.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-600">Payment Status:</span>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  getPaymentStatus() === "paid"
                    ? "bg-green-100 text-green-800"
                    : getPaymentStatus() === "partial"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {getPaymentStatus().charAt(0).toUpperCase() +
                  getPaymentStatus().slice(1)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={invoice.notes}
              onChange={(e) =>
                setInvoice((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows="3"
              placeholder="Additional notes..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={
                invoice.items.length === 0 ||
                loading ||
                (invoiceType === "sale" && !invoice.customer) ||
                (invoiceType === "purchase" && !invoice.supplier)
              }
              className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? "Creating..." : "Create Invoice"}
            </button>

            {invoiceType === "sale" && invoice.customer && (
              <button
                onClick={shareOnWhatsApp}
                disabled={invoice.items.length === 0}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors flex items-center justify-center gap-2"
              >
                📱 Share on WhatsApp
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.print()}
                disabled={invoice.items.length === 0}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => window.print()}
                disabled={invoice.items.length === 0}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Invoice Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Items in invoice:</span>
              <span className="font-semibold text-blue-900">
                {invoice.items.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Total quantity:</span>
              <span className="font-semibold text-blue-900">
                {invoice.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Type:</span>
              <span className="font-semibold text-blue-900">
                {invoiceType === "sale" ? "Sale" : "Purchase"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
