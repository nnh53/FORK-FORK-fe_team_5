/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam (VNĐ).
 * @param amount Số tiền cần định dạng.
 * @param decimals Số chữ số thập phân (mặc định là 0).
 * @returns Chuỗi định dạng VNĐ (ví dụ: "100.000 VNĐ").
 */
export function formatVND(amount: number, decimals: number = 0): string {
  if (isNaN(amount)) return "0 VNĐ";

  // Làm tròn số đến số chữ số thập phân yêu cầu
  const rounded = Number(amount.toFixed(decimals));
  const isNegative = rounded < 0;
  const absolute = Math.abs(rounded);

  // Tách phần nguyên và phần thập phân
  const [integerPart, decimalPart] = absolute.toString().split(".");

  // Định dạng phần nguyên với dấu chấm phân cách hàng nghìn
  let formattedInteger = "";
  const integerStr = integerPart.toString();
  for (let i = integerStr.length - 1, count = 0; i >= 0; i--) {
    formattedInteger = integerStr[i] + formattedInteger;
    count++;
    if (count % 3 === 0 && i !== 0) {
      formattedInteger = "." + formattedInteger;
    }
  }

  // Định dạng phần thập phân (nếu có)
  let formattedDecimal = "";
  if (decimals > 0 && decimalPart) {
    formattedDecimal = "," + decimalPart.padEnd(decimals, "0").slice(0, decimals);
  } else if (decimals > 0) {
    formattedDecimal = "," + "0".repeat(decimals);
  }

  // Kết hợp các phần
  return `${isNegative ? "-" : ""}${formattedInteger}${formattedDecimal} VNĐ`;
}

/**
 * Phân tích chuỗi tiền tệ VNĐ thành số.
 * @param vndString Chuỗi VNĐ cần phân tích (ví dụ: "100.000 VNĐ" hoặc "1.000,50 VNĐ").
 * @returns Số đã phân tích, hoặc NaN nếu chuỗi không hợp lệ.
 */
export function parseVND(vndString: string): number {
  if (!vndString) return NaN;

  // Loại bỏ ký hiệu tiền tệ và khoảng trắng
  let cleaned = vndString.replace(/đ|VND/gi, "").trim();

  // Xác định dấu âm
  const isNegative = cleaned.startsWith("-");
  if (isNegative) {
    cleaned = cleaned.slice(1);
  }

  // Tách phần nguyên và phần thập phân
  const parts = cleaned.split(",");
  let integerPart = parts[0] || "";
  let decimalPart = parts[1] || "";

  // Làm sạch phần nguyên: loại bỏ dấu chấm và khoảng trắng
  integerPart = integerPart.replace(/[.\s]/g, "");

  // Làm sạch phần thập phân: loại bỏ ký tự không phải số
  decimalPart = decimalPart.replace(/\D/g, "");

  // Kết hợp thành chuỗi số
  let numberString = integerPart;
  if (decimalPart) {
    numberString += "." + decimalPart;
  }

  // Chuyển đổi thành số
  const result = parseFloat(numberString);
  return isNegative ? -result : result;
}
