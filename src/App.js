import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    payAmount: 0,  // Payment Amount the user enters
  });

  const invoiceRef = useRef(); // Reference for the invoice

  const handleInputChange = (index, field, value) => {
    const items = [...formData.items];
    items[index][field] = value;
    setFormData({ ...formData, items });
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addNewItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, price: 0 }],
    });
  };

  const calculateTotal = () =>
    formData.items.reduce((total, item) => total + item.quantity * item.price, 0);

  const calculatePendingAmount = () => calculateTotal() - formData.payAmount;

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save(`${formData.customerName}_Invoice.pdf`);
  };

  const shareInvoice = async () => {
    if (navigator.share) {
      const totalAmount = calculateTotal().toFixed(2);
      const pendingAmount = calculatePendingAmount().toFixed(2);

      try {
        await navigator.share({
          title: `Invoice for ${formData.customerName}`,
          text: `Invoice Details:\n- Customer: ${formData.customerName}\n- Address: ${formData.customerAddress}\n- Total Amount: ₹${totalAmount}\n- Pay Amount: ₹${formData.payAmount.toFixed(2)}\n- Pending Amount: ₹${pendingAmount}`,
        });
        alert("Invoice shared successfully!");
      } catch (error) {
        console.error("Sharing failed", error);
      }
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">Invoice Generator</h1>
        </header>

        {/* Form Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Customer Name</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={(e) => handleFieldChange("customerName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Customer Address</label>
              <textarea
                className="w-full border rounded-md p-2"
                rows={2}
                placeholder="Enter customer address"
                value={formData.customerAddress}
                onChange={(e) => handleFieldChange("customerAddress", e.target.value)}
              ></textarea>
            </div>
          </div>
          
        </div>

        {/* Items Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Items</h2>
          {formData.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              
              <input
                type="text"
                placeholder="Item Name"
                className="border rounded-md p-2 flex-1"
                value={item.name}
                onChange={(e) => handleInputChange(index, "name", e.target.value)}
              />Quantity
              <input
                type="number"
                placeholder="Quantity"
                className="border rounded-md p-2 w-24"
                value={item.quantity}
                onChange={(e) => handleInputChange(index, "quantity", Number(e.target.value))}
              />Price
              <input
                type="number"
                placeholder="Price"
                className="border rounded-md p-2 w-28"
                value={item.price}
                onChange={(e) => handleInputChange(index, "price", Number(e.target.value))}
              />
            </div>
          ))}
          <button
            onClick={addNewItem}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Add Item
          </button>
        </div>

        {/* Invoice Section */}
        <div ref={invoiceRef} className="p-6 bg-gray-50 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Invoice</h2>
          <p className="mb-1"><strong>Customer Name:</strong> {formData.customerName}</p>
          <p className="mb-4"><strong>Address:</strong> {formData.customerAddress}</p>

          <table className="w-full border-collapse border border-gray-200 text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Item</th>
                <th className="border border-gray-300 p-2">Quantity</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">{item.quantity}</td>
                  <td className="border border-gray-300 p-2">₹{item.price.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <p className="text-gray-700"><strong>Total Amount:</strong> ₹{calculateTotal().toFixed(2)}</p>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Pay Amount</label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={formData.payAmount}
                onChange={(e) => handleFieldChange("payAmount", Number(e.target.value))}
                placeholder="Enter paid amount"
              />
            </div>
            <p className="text-gray-700"><strong>Pending Amount:</strong> ₹{calculatePendingAmount().toFixed(2)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={downloadPDF}
            className="bg-green-500 text-white py-2 px-4 rounded-md"
          >
            Download as PDF
          </button>
          <button
            onClick={shareInvoice}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Share Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
