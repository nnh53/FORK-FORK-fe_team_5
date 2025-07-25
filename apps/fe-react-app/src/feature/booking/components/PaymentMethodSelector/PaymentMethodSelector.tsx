import React from "react";

const paymentMethods = [
  {
    id: "ONLINE",
    name: "QR thanh toán",
    logo: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/31bba905-7384-4c3e-bb90-f9099d22e1dd-qr-code_12380127.webp",
  },
];

interface PaymentMethodSelectorProps {
  selectedMethod?: string;
  onMethodChange?: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selectedMethod = "ONLINE", onMethodChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="border-l-4 border-red-600 pl-3 text-lg font-bold">PHƯƠNG THỨC THANH TOÁN</h3>
      <div className="flex flex-wrap gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onMethodChange?.(method.id)}
            className={`flex items-center gap-3 rounded-lg border-2 p-3 transition-all ${selectedMethod === method.id ? "border-red-500 bg-red-50" : "border-gray-200"}`}
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
