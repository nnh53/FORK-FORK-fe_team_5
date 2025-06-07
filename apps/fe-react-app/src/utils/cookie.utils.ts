// import type { Role } from "../interfaces/roles.interface";

// //tao mot ngay het han trong tuong lai
// export function setCookie(name: string, value: string, days: number) {
//   const expires = new Date();
//   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
//   document.cookie = name + '=' + value + '; expires=' + expires.toUTCString() + '; path=/';
// }

// export function getCookie(name: string): string | null {
//   const nameEQ = name + '=';
//   const ca = document.cookie.split(';');
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i].trim();
//     if (c.indexOf(nameEQ) === 0) {
//       const rawValue = c.substring(nameEQ.length);

//       // Xử lý đặc biệt cho access_token
//       if (name === 'access_token') {
//         const cleanedToken = rawValue.split('localhost')[0];
//         return decodeURIComponent(cleanedToken);
//       }
//       return decodeURIComponent(rawValue);
//     }
//   }
//   return null;
// }

// //xóa cookie bằng cách cài đặt về quá khứ
// export function eraseCookie(name: string) {
//     document.cookie = name + "=; path=/; Exprires =Fri, 02 Jan 1970 00:00:01 GMT; SameSite=Strict";
// }

// export function parsedRoles(rolesString: string | null): Role[] {
//     //Không có roles, trả về mảng rỗng
//     if(!rolesString) return [];
//         try {
//             //Chuyển đổi chuỗi JSON thành mảng
//             const parsedRoles = JSON.parse(rolesString);
//             if(Array.isArray(parsedRoles)) {
//                 return parsedRoles.filter((role): role is Role => ["ROLE_ADMIN","ROLE_STAFF","ROLE_MEMBER"].includes(role,),);
//             }
//         } catch (error) {
//             // Xử lý lỗi khi parsed
//           console.error("Error parsing roles:",error);
//           return [];
//         }
// }