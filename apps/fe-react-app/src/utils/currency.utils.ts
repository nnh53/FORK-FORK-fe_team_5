/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam (VNĐ).
 * @param amount Số tiền cần định dạng.
 * @param decimals Số chữ số thập phân (mặc định là 0).
 * @param currency Ký hiệu tiền tệ (mặc định là "VNĐ").
 * @returns Chuỗi định dạng tiền tệ (ví dụ: "1.000.000 VNĐ").
 * @example
 * formatVND(1000000); // "1.000.000 VNĐ"
 * formatVND(1000000.567, 2); // "1.000.000,57 VNĐ"
 * formatVND(-123456, 0, "đ"); // "-123.456 đ"
 */
export function formatVND(amount: number, decimals: number = 0, currency: string = "VNĐ"): string {
  if (isNaN(amount)) return `0 ${currency}`;

  // Làm tròn số đến số chữ số thập phân yêu cầu
  const rounded = Number(amount.toFixed(decimals));
  const isNegative = rounded < 0;
  const absolute = Math.abs(rounded);

  // Định dạng phần nguyên với dấu chấm phân cách hàng nghìn
  const formattedInteger = absolute.toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  // Định dạng phần thập phân (nếu có)
  let formattedDecimal = "";
  if (decimals > 0) {
    const decimalPart = absolute.toString().split(".")[1] || "";
    formattedDecimal = "," + (decimalPart.padEnd(decimals, "0").slice(0, decimals) || "0".repeat(decimals));
  }

  // Kết hợp các phần
  return `${isNegative ? "-" : ""}${formattedInteger}${formattedDecimal} ${currency}`;
}

/**
 * Phân tích chuỗi tiền tệ VNĐ thành số nguyên.
 * @param vndString Chuỗi tiền tệ cần phân tích (ví dụ: "1.000.000 VNĐ", "1,000,000", "1.000,50 đ").
 * @returns Phần nguyên của số đã phân tích, hoặc NaN nếu chuỗi không hợp lệ.
 * @example
 * parseVND("1.000.000 VNĐ"); // 1000000
 * parseVND("1,000,000"); // 1000000
 * parseVND("1.000,50 đ"); // 1000
 * parseVND("-123.456,789 VNĐ"); // -123456
 */
export function parseVND(vndString: string): number {
  if (!vndString || typeof vndString !== "string") return NaN;

  // Chuẩn hóa chuỗi: loại bỏ khoảng trắng, chuyển về chữ thường
  let cleaned = vndString.trim().toLowerCase();

  // Regex để kiểm tra định dạng tiền tệ VNĐ hợp lệ
  // Using simpler regex with no single-character classes
  const basicFormat = /^(-)?\\s*\d[\d.,\\s]*(vnd|đ)?$/i;
  if (!basicFormat.test(cleaned)) return NaN;

  // Loại bỏ ký hiệu tiền tệ và khoảng trắng
  cleaned = cleaned.replace(/vnd|đ/gi, "").trim();

  // Xác định dấu âm
  const isNegative = cleaned.startsWith("-");
  if (isNegative) cleaned = cleaned.slice(1);

  // Tách phần nguyên (bỏ qua phần thập phân)
  const integerPart = cleaned.split(/[.,]/)[0];

  // Làm sạch phần nguyên: loại bỏ dấu chấm, dấu phẩy và khoảng trắng
  const cleanInteger = integerPart.replace(/[.,\\s]/g, "");

  // Chuyển đổi thành số nguyên
  const result = parseInt(cleanInteger, 10);
  return isNegative ? -result : result;
}
