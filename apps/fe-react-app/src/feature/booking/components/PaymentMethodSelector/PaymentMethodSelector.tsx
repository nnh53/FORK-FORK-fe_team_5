import React from "react";

const paymentMethods = [
  { id: "card", name: "QR thanh toán", logo: "https://cdn-icons-png.flaticon.com/512/349/349221.png" },
  { id: "cash", name: "Tiền mặt", logo: "https://cdn-icons-png.flaticon.com/512/1611/1611179.png" },
];

interface PaymentMethodSelectorProps {
  selectedMethod?: string;
  onMethodChange?: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selectedMethod = "momo", onMethodChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="border-l-4 border-red-600 pl-3 text-lg font-bold">PHƯƠNG THỨC THANH TOÁN</h3>
      <div className="flex flex-wrap gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onMethodChange?.(method.id)}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all ${selectedMethod === method.id ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <img src={method.logo} alt={method.name} className="h-8 object-contain" />
            <span className="text-sm font-semibold">{method.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
