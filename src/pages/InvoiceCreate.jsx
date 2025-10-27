"use client";

import { useState, useEffect } from "react";
import {
  Printer,
  Download,
  Plus,
  Trash2,
  Search,
  Calendar,
  Users,
  Truck,
  Save,
  Eye,
  Edit,
  RefreshCw,
} from "../components/Icons";

const InvoiceCreate = () => {
  const [activeTab, setActiveTab] = useState("create"); // "create" or "list"
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

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Demo data matching your backend structure
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
    {
      _id: "3",
      name: "Global Healthcare",
      phone: "+252617890123",
      category: "Medical Supplies",
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
    {
      _id: "4",
      name: "Ibuprofen 400mg",
      price: 7.25,
      cost: 5.0,
      stock: 75,
      category: "Pain Relief",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Load demo invoices
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    // Demo invoices matching your backend structure
    const demoInvoices = [
      {
        _id: "1",
        invoiceNumber: "INV00001",
        type: "sale",
        customer: { _id: "1", name: "Ahmed Mohamed", phone: "+252611234567" },
        totalAmount: 45.5,
        amountPaid: 45.5,
        paymentStatus: "paid",
        createdAt: new Date().toISOString(),
        items: [
          {
            product: "1",
            name: "Paracetamol 500mg",
            price: 5.0,
            quantity: 2,
            total: 10.0,
          },
          {
            product: "2",
            name: "Amoxicillin 250mg",
            price: 15.5,
            quantity: 1,
            total: 15.5,
          },
          {
            product: "3",
            name: "Vitamin C 1000mg",
            price: 8.75,
            quantity: 2,
            total: 17.5,
          },
        ],
      },
      {
        _id: "2",
        invoiceNumber: "INV00002",
        type: "purchase",
        supplier: {
          _id: "1",
          name: "MediPlus Distributors",
          phone: "+252615678901",
        },
        totalAmount: 125.75,
        amountPaid: 0,
        paymentStatus: "unpaid",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        items: [
          {
            product: "1",
            name: "Paracetamol 500mg",
            price: 3.5,
            quantity: 25,
            total: 87.5,
          },
          {
            product: "4",
            name: "Ibuprofen 400mg",
            price: 5.0,
            quantity: 7,
            total: 35.0,
          },
        ],
      },
      {
        _id: "3",
        invoiceNumber: "INV00003",
        type: "sale",
        customer: { _id: "2", name: "Aisha Hassan", phone: "+252612345678" },
        totalAmount: 23.25,
        amountPaid: 15.0,
        paymentStatus: "partial",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        items: [
          {
            product: "4",
            name: "Ibuprofen 400mg",
            price: 7.25,
            quantity: 2,
            total: 14.5,
          },
          {
            product: "3",
            name: "Vitamin C 1000mg",
            price: 8.75,
            quantity: 1,
            total: 8.75,
          },
        ],
      },
    ];
    setInvoices(demoInvoices);
  };

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
                total: product.price * newQuantity,
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
            price: invoiceType === "sale" ? product.price : product.cost,
            quantity: quantity,
            total:
              (invoiceType === "sale" ? product.price : product.cost) *
              quantity,
          },
        ],
      }));
    }

    setSelectedProduct("");
    setQuantity(1);
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
        type: invoiceType,
        customer: invoiceType === "sale" ? invoice.customer : undefined,
        supplier: invoiceType === "purchase" ? invoice.supplier : undefined,
        items: invoice.items.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        amountPaid: parseFloat(invoice.amountPaid) || 0,
        notes: invoice.notes,
      };

      console.log("Submitting invoice:", invoiceData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      loadInvoices();
    } catch (error) {
      alert("Error creating invoice: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const printInvoice = (invoice) => {
    console.log("Printing invoice:", invoice);
    window.print();
  };

  const viewInvoice = (invoice) => {
    console.log("Viewing invoice:", invoice);
    // Here you would typically open a modal or navigate to detail page
    alert(`Viewing invoice ${invoice.invoiceNumber}`);
  };

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
                      Select {invoiceType === "sale" ? "customer" : "supplier"}{" "}
                      for this invoice
                    </p>
                  </div>
                </div>

                <select
                  value={
                    invoiceType === "sale" ? invoice.customer : invoice.supplier
                  }
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
                  {(invoiceType === "sale" ? customers : suppliers).map(
                    (item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} - {item.phone}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Add Product Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Add Product
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                          {invoiceType === "sale"
                            ? product.price
                            : product.cost}
                          {invoiceType === "sale" &&
                            ` (${product.stock} in stock)`}
                        </option>
                      ))}
                    </select>
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
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
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
                    <p className="text-sm mt-1">
                      Search and add products above.
                    </p>
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
                                <p className="text-sm text-gray-500">
                                  ${item.price.toFixed(2)} each
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-gray-900">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product,
                                      item.quantity - 1
                                    )
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
                                    updateQuantity(
                                      item.product,
                                      item.quantity + 1
                                    )
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
                    <span className="font-semibold">
                      ${totalAmount.toFixed(2)}
                    </span>
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
                    <span className="text-sm text-gray-600">
                      Payment Status:
                    </span>
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

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => printInvoice(invoice)}
                      disabled={invoice.items.length === 0}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <button
                      onClick={() => printInvoice(invoice)}
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
                <h4 className="font-semibold text-blue-900 mb-3">
                  Invoice Stats
                </h4>
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
                      {invoice.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
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
        ) : (
          /* Invoice List Tab */
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
                    onClick={loadInvoices}
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
                      {invoiceType === "sale" ? "Customer" : "Supplier"}
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
        )}
      </div>
    </div>
  );
};

export default InvoiceCreate;
