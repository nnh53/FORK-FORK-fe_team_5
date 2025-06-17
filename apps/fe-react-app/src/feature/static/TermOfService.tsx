import BlurText from "../../../Reactbits/BlurText/BlurText";
import NavigateButton from "../../components/shared/NavigateButton";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

const TermOfService = () => {
  return (
    <section className="flex h-full items-center p-8 md:p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-3xl text-center md:text-left">
          <div className="mb-6 text-center">
            <BlurText
              text="Điều khoản dịch vụ"
              onAnimationComplete={handleAnimationComplete}
              direction="bottom"
              delay={200}
              animateBy="words"
              className="text-3xl font-bold md:text-4xl"
            />
            <BlurText text="Cập nhật lần cuối: 18/06/2025" direction="bottom" delay={1500} animateBy="words" className="text-sm text-gray-500 mt-2" />
          </div>

          <div className="mb-6">
            <BlurText text="1. Chấp nhận điều khoản" direction="bottom" delay={200} animateBy="words" className="text-xl font-semibold mb-2" />
            <BlurText
              text={
                'Bằng cách tải xuống, cài đặt hoặc sử dụng ứng dụng di động của chúng tôi ("Ứng dụng"), bạn đồng ý bị ràng buộc bởi các Điều khoản dịch vụ này. Nếu bạn không đồng ý, vui lòng không sử dụng Ứng dụng.'
              }
              direction="bottom"
              delay={100}
              animateBy="words"
              className="mb-4"
            />
          </div>

          <div className="mb-6">
            <BlurText text="2. Đặt vé và thanh toán" direction="bottom" delay={200} animateBy="words" className="text-xl font-semibold mb-2" />
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <BlurText text="Tất cả các giao dịch mua vé là cuối cùng." direction="bottom" delay={200} animateBy="words" />
              </li>
              <li>
                <BlurText
                  text="Chính sách hoàn tiền hoặc hủy vé sẽ được áp dụng tùy theo quy định của từng rạp chiếu phim đối tác. Vui lòng kiểm tra các điều khoản cụ thể trước khi hoàn tất giao dịch."
                  direction="bottom"
                  delay={100}
                  animateBy="words"
                />
              </li>
              <li>
                <BlurText
                  text="Giá vé được hiển thị bằng Việt Nam Đồng (VND) và đã bao gồm các loại thuế áp dụng."
                  direction="bottom"
                  delay={100}
                  animateBy="words"
                />
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <BlurText text="3. Tài khoản người dùng" direction="bottom" delay={200} animateBy="words" className="text-xl font-semibold mb-2" />
            <BlurText
              text="Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. Bạn đồng ý chịu trách nhiệm cho tất cả các hoạt động xảy ra dưới tài khoản của mình."
              direction="bottom"
              delay={100}
              animateBy="words"
              className="mb-4"
            />
          </div>

          <div className="mb-6">
            <BlurText text="4. Sở hữu trí tuệ" direction="bottom" delay={200} animateBy="words" className="text-xl font-semibold mb-2" />
            <BlurText
              text="Ứng dụng và tất cả nội dung của nó, bao gồm logo, đồ họa và văn bản, là tài sản của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ."
              direction="bottom"
              delay={100}
              animateBy="words"
              className="mb-4"
            />
          </div>

          <div className="mb-6">
            <BlurText text="5. Chấm dứt" direction="bottom" delay={200} animateBy="words" className="text-xl font-semibold mb-2" />
            <BlurText
              text="Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của bạn vào Ứng dụng bất kỳ lúc nào nếu bạn vi phạm các điều khoản này."
              direction="bottom"
              delay={100}
              animateBy="words"
              className="mb-4"
            />
          </div>

          <div className="mb-8">
            <BlurText text="6. Thay đổi điều khoản" direction="bottom" delay={200} animateBy="words" className="text-xl font-semibold mb-2" />
            <BlurText
              text="Chúng tôi có thể sửa đổi các điều khoản này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng các điều khoản mới trong Ứng dụng."
              direction="bottom"
              delay={100}
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

export default TermOfService;
