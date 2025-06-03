import React from "react";
import FCinema_Logo from "../../../assets/FCinema_Logo.png";
import bgTop from "../../../assets/bg-top.png";

function Footer() {
  return (
    <footer
      className="w-full bg-repeat-x flex-col"
      style={{
        backgroundImage: `url(${bgTop})`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%", // Hoặc "100% 100%" nếu bạn muốn căng hình nền
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <div className="mb-6 md:mb-0">
            <img className="w-32" src={FCinema_Logo} alt="FCinema" />
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-amber-50 hover:text-red-500 transition duration-300"
            >
              <i className="fab fa-facebook-f text-2xl"></i>
            </a>
            <a
              href="#"
              className="text-amber-50 hover:text-red-500 transition duration-300"
            >
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a
              href="#"
              className="text-amber-50 hover:text-red-500 transition duration-300"
            >
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a
              href="#"
              className="text-amber-50 hover:text-red-500 transition duration-300"
            >
              <i className="fab fa-youtube text-2xl"></i>
            </a>
          </div>

          {/* Middle section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 mt-4">
            <div>
              <h3 className="text-red-500 font-bold text-lg mb-2">
                VỀ CHÚNG TÔI
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition duration-300"
                  >
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition duration-300"
                  >
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition duration-300"
                  >
                    Tuyển dụng
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-red-500 font-bold text-lg mb-2">
                ĐIỀU KHOẢN
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition duration-300"
                  >
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition duration-300"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition duration-300"
                  >
                    Khiếu nại
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-red-500 font-bold text-lg mb-2">HỖ TRỢ</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition duration-300"
                  >
                    Góp ý
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition duration-300"
                  >
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition duration-300"
                  >
                    Hướng dẫn sử dụng
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-red-500 font-bold text-lg mb-2">KẾT NỐI</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <i className="fas fa-map-marker-alt"></i>
                  Hà Nội, Việt Nam
                </p>
                <p className="flex items-center">
                  <i className="fas fa-phone-alt"></i>
                  1900 1234
                </p>
                <p className="flex items-center">
                  <i className="fas fa-envelope"></i>
                  support@fcinema.vn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="text-center text-gray-400 pb-4">
          <p>© {new Date().getFullYear()} FCinema. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
