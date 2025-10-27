"use client";

import { Printer, Download, ArrowLeft } from "../components/Icons";

const ViewInvoice = ({ invoice, onBack, onPrint }) => {
  const shareOnWhatsApp = () => {
    const customer = invoice.customer;
    if (!customer) {
      alert("No customer information available");
      return;
    }

    const itemsText = invoice.items
      .map(
        (item) =>
          `${item.name} - ${item.quantity} x $${item.price} = $${item.total}`
      )
      .join("%0A");

    const message =
      `*Invoice ${invoice.invoiceNumber}*%0A%0A` +
      `Customer: ${customer.name}%0A` +
      `Phone: ${customer.phone}%0A` +
      `Date: ${new Date(invoice.createdAt).toLocaleDateString()}%0A%0A` +
      `*Items:*%0A${itemsText}%0A%0A` +
      `*Total Amount:* $${invoice.totalAmount.toFixed(2)}%0A` +
      `*Amount Paid:* $${invoice.amountPaid.toFixed(2)}%0A` +
      `*Amount Due:* $${(invoice.totalAmount - invoice.amountPaid).toFixed(
        2
      )}%0A` +
      `*Status:* ${invoice.paymentStatus}%0A%0A` +
      `Thank you for your business!`;

    const whatsappUrl = `https://wa.me/${customer.phone.replace(
      "+",
      ""
    )}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Invoice {invoice.invoiceNumber}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {invoice.type === "sale" && invoice.customer && (
              <button
                onClick={shareOnWhatsApp}
                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center gap-2"
              >
                📱 Share on WhatsApp
              </button>
            )}
            <button
              onClick={onPrint}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onPrint}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-6">
        {/* Invoice Header */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {invoice.type === "sale" ? "Customer" : "Supplier"} Details
            </h4>
            <div className="text-gray-600">
              <p className="font-medium">
                {invoice.type === "sale"
                  ? invoice.customer?.name
                  : invoice.supplier?.name}
              </p>
              <p>
                {invoice.type === "sale"
                  ? invoice.customer?.phone
                  : invoice.supplier?.phone}
              </p>
              {invoice.type === "purchase" && (
                <p>{invoice.supplier?.category}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Invoice Details
            </h4>
            <div className="text-gray-600">
              <p>Invoice #: {invoice.invoiceNumber}</p>
              <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p>Type: {invoice.type === "sale" ? "Sale" : "Purchase"}</p>
              <p
                className={`font-semibold ${
                  invoice.paymentStatus === "paid"
                    ? "text-green-600"
                    : invoice.paymentStatus === "partial"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Status: {invoice.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 border border-gray-200 font-semibold">
                  Product
                </th>
                <th className="text-right py-3 px-4 border border-gray-200 font-semibold">
                  Price
                </th>
                <th className="text-right py-3 px-4 border border-gray-200 font-semibold">
                  Quantity
                </th>
                <th className="text-right py-3 px-4 border border-gray-200 font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 border border-gray-200">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-right">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-right font-semibold">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            {invoice.notes && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-600">{invoice.notes}</p>
              </div>
            )}
          </div>
          <div className="text-right space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">
                ${invoice.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold">
                ${invoice.amountPaid.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-lg font-semibold text-gray-900">
                Amount Due:
              </span>
              <span
                className={`text-lg font-bold ${
                  invoice.totalAmount - invoice.amountPaid === 0
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                ${(invoice.totalAmount - invoice.amountPaid).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
