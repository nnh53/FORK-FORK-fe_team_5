import React, { useState } from "react";

const paymentMethods = [
  { id: "momo", name: "Momo", logo: "https://developers.momo.vn/images/logo.png" },
  { id: "vnpay", name: "VNPAY", logo: "https://vnpay.vn/s1/statics.vnpay.vn/logo-vnpay-qr-1.png" },
  { id: "card", name: "Thẻ quốc tế", logo: "https://cdn-icons-png.flaticon.com/512/349/349221.png" },
];

const PaymentMethodSelector: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>("momo");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold border-l-4 border-red-600 pl-3">PHƯƠNG THỨC THANH TOÁN</h3>
      <div className="flex flex-wrap gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                        ${selectedMethod === method.id ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <img src={method.logo} alt={method.name} className="h-8 object-contain" />
            <span className="font-semibold text-sm">{method.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
