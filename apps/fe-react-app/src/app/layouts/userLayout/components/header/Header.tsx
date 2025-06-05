import "./Header.scss";
import FCinema_Logo from "../../../assets/FCinema_Logo.png";

function Header() {
  return (
    <div className="bg-[url('./assets/bg-top.png')] bg-repeat-x">
      <div className="flex items-center justify-between px-4 py-4 text-white shadow-md">
        <div className="text-2xl font-bold text-red-500">
          <img className="w-22" src={FCinema_Logo} alt="FCinema" />
        </div>
        <div className="flex space-x-8 mt-8">
          <a className="navItem text-black uppercase hover:text-red-500 transition duration-300 cursor-pointer font-bold">
            Phim lẻ
          </a>
          <a className="navItem text-black uppercase hover:text-red-500 transition duration-300 cursor-pointer font-bold">
            Phim bộ
          </a>
          <a className="navItem text-black uppercase hover:text-red-500 transition duration-300 cursor-pointer font-bold">
            TV Show
          </a>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-amber-50 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-300 font-medium">
            Đăng ký
          </button>
          <button className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition duration-300 font-medium">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
