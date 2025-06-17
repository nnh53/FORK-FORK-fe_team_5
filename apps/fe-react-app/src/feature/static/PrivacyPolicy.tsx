import BlurText from "../../../Reactbits/BlurText/BlurText";
import NavigateButton from "../../components/shared/NavigateButton";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

const PrivacyPolicy = () => {
  return (
    <section className="flex h-full items-center p-8 md:p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-3xl text-center md:text-left">
          <div className="mb-6 text-center">
            <BlurText
              text="Chính sách quyền riêng tư"
              onAnimationComplete={handleAnimationComplete}
              direction="bottom"
              delay={200}
              animateBy="words"
              className="text-3xl font-bold md:text-4xl"
            />
            <BlurText text="Cập nhật lần cuối: 18/06/2025" direction="bottom" delay={1500} animateBy="words" className="text-sm text-gray-500 mt-2" />
          </div>

          <div className="mb-6">
            <BlurText text="1. Giới thiệu" direction="bottom" delay={300} animateBy="words" className="text-xl font-semibold mb-2" />
            <BlurText
              text="Chính sách quyền riêng tư này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng ứng dụng di động của chúng tôi. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn theo Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam về Bảo vệ dữ liệu cá nhân."
              direction="bottom"
              delay={100}
              animateBy="words"
              className="mb-4"
            />
          </div>

          <div className="mb-6">
            <BlurText
              text="2. Thông tin chúng tôi thu thập"
              direction="bottom"
              delay={300}
              animateBy="words"
              className="text-xl font-semibold mb-2"
            />
            <BlurText text="Chúng tôi có thể thu thập các loại thông tin sau:" direction="bottom" delay={300} animateBy="words" className="mb-2" />
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <BlurText
                  text="Thông tin cá nhân: Tên, địa chỉ email, số điện thoại khi bạn đăng ký tài khoản."
                  direction="bottom"
                  delay={300}
                  animateBy="words"
                />
              </li>
              <li>
                <BlurText
                  text="Thông tin giao dịch: Chi tiết về các lượt đặt vé xem phim của bạn, bao gồm phim, rạp, và thời gian. Chúng tôi không lưu trữ chi tiết thẻ thanh toán của bạn."
                  direction="bottom"
                  delay={200}
                  animateBy="words"
                />
              </li>
              <li>
                <BlurText
                  text="Thông tin sử dụng: Cách bạn tương tác với Ứng dụng, chẳng hạn như lịch sử tìm kiếm và các phim đã xem."
                  direction="bottom"
                  delay={200}
                  animateBy="words"
                />
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <BlurText
              text="3. Cách chúng tôi sử dụng thông tin của bạn"
              direction="bottom"
              delay={300}
              animateBy="words"
              className="text-xl font-semibold mb-2"
            />
            <BlurText text="Chúng tôi sử dụng thông tin của bạn để:" direction="bottom" delay={200} animateBy="words" className="mb-2" />
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <BlurText text="Xử lý đặt vé và thanh toán của bạn." direction="bottom" delay={200} animateBy="words" />
              </li>
              <li>
                <BlurText text="Gửi cho bạn xác nhận vé và thông báo." direction="bottom" delay={200} animateBy="words" />
              </li>
              <li>
                <BlurText
                  text="Cá nhân hóa trải nghiệm của bạn và đề xuất các bộ phim bạn có thể thích."
                  direction="bottom"
                  delay={200}
                  animateBy="words"
                />
              </li>
              <li>
                <BlurText text="Cải thiện dịch vụ và ứng dụng của chúng tôi." direction="bottom" delay={200} animateBy="words" />
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <BlurText text="4. Quyền của bạn" direction="bottom" delay={300} animateBy="words" className="text-xl font-semibold mb-2" />
            <BlurText
              text="Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của mình. Vui lòng liên hệ với chúng tôi để thực hiện các quyền này."
              direction="bottom"
              delay={100}
              animateBy="words"
              className="mb-4"
            />
          </div>

          <div className="mb-8">
            <BlurText text="5. Liên hệ" direction="bottom" delay={300} animateBy="words" className="text-xl font-semibold mb-2" />
            <BlurText
              text="Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ với chúng tôi tại support@fcinema.vn"
              direction="bottom"
              delay={200}
              animateBy="words"
              className="mb-4"
            />
          </div>

          <div className="text-center mt-8">
            <NavigateButton to="/" text="Trở về Trang chủ" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
