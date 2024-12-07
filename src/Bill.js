import React, { useState } from "react";

function Bill() {
  const [formData, setFormData] = useState({
    companyName: "Your Company Name",
    logo: "/path-to-logo.png", // Placeholder for the logo image
    addressLine1: "Address Line 1",
    addressLine2: "Address Line 2",
    phone: "123-456-7890",
    billNo: "001",
    date: new Date().toLocaleDateString(),
    customerName: "Customer Name",
    vehicleNo: "AB1234",
    items: [
      { particulars: "Item 1", rate: 500, quantity: 2 },
      { particulars: "Item 2", rate: 300, quantity: 3 },
    ],
    terms: "Terms and conditions apply.",
  });

  const handleInputChange = (index, field, value) => {
    const items = [...formData.items];
    items[index][field] = value;
    setFormData({ ...formData, items });
  };

  const calculateTotal = () =>
    formData.items.reduce((total, item) => total + item.quantity * item.rate, 0);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-200 p-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        {/* Logo & Company Info */}
        <div className="flex flex-col">
          <img src={formData.logo} alt="Logo" className="h-16 w-auto mb-4" />
          <p className="text-xl font-bold">{formData.companyName}</p>
          <p>{formData.addressLine1}</p>
          <p>{formData.addressLine2}</p>
          <p>Phone: {formData.phone}</p>
        </div>

        {/* Bill Info */}
        <div className="text-right">
          <p className="text-lg font-bold">Bill No: {formData.billNo}</p>
          <p>Date: {formData.date}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">To:</h3>
        <p>{formData.customerName}</p>
        <p>Vehicle No: {formData.vehicleNo}</p>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border border-gray-200 mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">SL.No</th>
            <th className="border p-2">Particulars</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">
                <input
                  type="text"
                  className="w-full p-1"
                  value={item.particulars}
                  onChange={(e) => handleInputChange(index, "particulars", e.target.value)}
                  placeholder="Particulars"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  className="w-full p-1"
                  value={item.rate}
                  onChange={(e) => handleInputChange(index, "rate", parseFloat(e.target.value))}
                  placeholder="Rate"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  className="w-full p-1"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", parseInt(e.target.value))}
                  placeholder="Quantity"
                />
              </td>
              <td className="border p-2">₹{(item.rate * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Amount */}
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <h3 className="text-xl font-semibold">Total Amount:</h3>
        <p className="text-xl font-bold">₹{calculateTotal().toFixed(2)}</p>
      </div>

      {/* Terms and Conditions */}
      <div className="mt-6 text-sm">
        <p>{formData.terms}</p>
      </div>

      {/* Footer: Authorized Signatory */}
      <div className="mt-12 text-right text-sm">
        <p>For {formData.companyName}</p>
        <p className="mt-16">Authorized Signatory</p>
      </div>
    </div>
  );
}

export default Bill;
