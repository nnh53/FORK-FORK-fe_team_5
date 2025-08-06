import ctaImage from "@/assets/cta.png";

export const siteConfig = {
  name: "F Cinema",
  description: "A Movie Theater App.",
  cta: "Get Started",
  // url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5173",
  keywords: ["AI Calendar", "Smart Scheduling", "Productivity", "Time Management"],
  links: {
    email: "support@calai.app",
    twitter: "https://twitter.com/calaiapp",
    discord: "https://discord.gg/calaiapp",
    github: "https://github.com/calaiapp",
    instagram: "https://instagram.com/calaiapp",
  },
  nav: {
    links: [
      { id: 1, name: "Home", href: "#home" },
      { id: 2, name: "Movies", href: "#movies" },
      { id: 3, name: "Trending", href: "#trending" },
      { id: 4, name: "Features", href: "#features" },
      { id: 5, name: "FAQ", href: "#faq" },
    ],
  },
  featureSection: {
    title: "Công Nghệ. Phong Cách. Trải nghiệm.",
    description: "Nâng cấp trải nghiệm và cảm xúc khi xem phim",
    items: [
      {
        id: 1,
        title: "Phòng Standard",
        content: "Trải nghiệm xem phim cơ bản với trang thiết bị tiêu chuẩn, mang đến những giây phút giải trí thoải mái và tiết kiệm.",
        image: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/16d07de8-3c27-48a4-b93b-fe1e220a7e6d-standard.webp",
      },
      {
        id: 2,
        title: "Phòng Vip",
        content: "Tận hưởng không gian sang trọng, ghế ngồi êm ái và dịch vụ đặc biệt, nâng tầm trải nghiệm xem phim của bạn.",
        image: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/7ab5398b-4a52-4392-bc79-3edaad74eec0-vip.webp",
      },
      {
        id: 3,
        title: "Phòng Premium",
        content: "Kết hợp giữa sự thoải mái và công nghệ hiện đại, với màn hình lớn, âm thanh sống động và ghế ngồi rộng rãi. ",
        image: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/d05097fb-bb37-4fe8-89ba-ee94eda41680-premium.webp",
      },
      {
        id: 4,
        title: "Phòng 4DMax",
        content:
          "Hòa mình vào thế giới điện ảnh với hiệu ứng chuyển động, ánh sáng và gió, mang đến trải nghiệm xem phim chân thực và sống động nhất.",
        image: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/81ecb4dc-fa3f-46b9-9687-6c908707a0d8-4dmax.webp",
      },
    ],
  },
  faqSection: {
    title: "Câu Hỏi Thường Gặp",
    faQitems: [
      {
        id: 1,
        question: "Sau khi đặt vé trực tuyến, tôi cần làm gì tiếp theo? Có cần in vé không?",
        answer:
          "Bạn không cần in vé giấy. Sau khi đặt vé thành công, bạn chỉ cần mở email xác nhận hoặc vào mục. Khi đến rạp, bạn chỉ cần đưa mã QR này cho nhân viên soát vé để quét trực tiếp trên màn hình điện thoại của bạn và vào phòng chiếu.",
      },
      {
        id: 2,
        question: "Làm thế nào để tôi có thể mua vé xem phim?",
        answer: "Bạn có thể mua vé một cách tiện lợi qua hai hình thức chính là Mua vé trực tuyến và Mua vé trực tiếp tại rạp.",
      },
      {
        id: 3,
        question: "Tôi có thể hủy vé, đổi suất chiếu hoặc yêu cầu hoàn tiền không?",
        answer: "Chúng tôi rất tiếc nhưng vé xem phim đã giao dịch thành công sẽ không được hoàn lại hoặc hủy.",
      },
      {
        id: 4,
        question: "Rạp có cho phép mang đồ ăn, thức uống từ bên ngoài vào không?",
        answer:
          "Để đảm bảo chất lượng dịch vụ, vệ sinh chung và trải nghiệm điện ảnh tốt nhất cho tất cả khách hàng, rạp phim chúng tôi xin phép không cho phép mang đồ ăn và thức uống được mua từ bên ngoài vào. Rạp có quầy F&B phục vụ đa dạng các loại bắp rang, nước ngọt và các món ăn nhẹ khác để bạn thưởng thức.",
      },
      {
        id: 5,
        question: "Quy định về độ tuổi khi xem các phim được phân loại (Rating) như thế nào?",
        answer:
          "Nhân viên của chúng tôi có thể yêu cầu xem giấy tờ tùy thân (CMND/CCCD, bằng lái xe) để xác thực độ tuổi đối với các phim có giới hạn.",
      },
      {
        id: 6,
        question: "Giá vé được tính như thế nào và có những chương trình khuyến mãi gì?",
        answer:
          "Giá vé có thể khác nhau tùy thuộc vào định dạng phim (2D, 3D), loại ghế (thường, VIP), thời điểm xem phim (ngày thường, cuối tuần, ngày lễ) và suất chiếu (trước 17:00, sau 17:00).",
      },
    ],
  },
  ctaSection: {
    id: "cta",
    title: "Đến Với Chúng Tôi",
    backgroundImage: ctaImage,
    button: {
      text: "Đặt phim ngay",
      href: "#movies",
    },
    subtext: "Hủy vé bất cứ lúc nào, không cần lo lắng",
  },
  chairSection: {
    title: "Hạng Ghế",
    description: "Khám phá các lựa chọn chỗ ngồi cao cấp của chúng tôi để có trải nghiệm xem phim tuyệt đỉnh",
    chairs: [
      {
        imageSrc: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/75c58430-e8fe-4366-8047-8e3f63ab4048-normal.webp",
        alt: "Ghế Thường",
        title: "Ghế Thường",
      },
      {
        imageSrc: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/b44d4ed9-dae5-4a0d-80ce-1c14e777b9d1-vip.webp",
        alt: "Ghế VIP",
        title: "Ghế VIP",
      },
      {
        imageSrc: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/691f23ca-42f4-4fa8-a785-7a1f7127f90b-premium.webp",
        alt: "Ghế Premium",
        title: "Ghế Premium",
      },
      {
        imageSrc: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/86a5d757-c920-48bd-957e-ebd016c36cfb-couple.webp",
        alt: "Ghế Đôi",
        title: "Ghế Đôi",
      },
    ],
  },
  errorPage: {
    code: "404",
    label: "Error",
    title: "Sorry, we couldn't find this page.",
    button: "Back to Home",
  },
  internalServerErrorPage: {
    code: "500",
    label: "Server Error",
    title: "Oops! Something went wrong on our end.",
    button: "Back to Home",
  },
  adminTeamSection: {
    title: "Đội Ngũ Phát Triển",
    description: "Các thành viên FCinema.",
    cards: [
      { id: 1, img: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/a3a4e359-2ba6-47fb-aef4-c5b141789868-cuong.webp" },
      { id: 2, img: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/714dbf1c-a580-4586-96c8-f22e894541d9-hoang.webp" },
      {
        id: 3,
        img: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/0fae00ec-2101-4b76-bbf7-d1c95e1631ea-66409e92-578e-4d81-a64f-385e0883ad31.webp",
      },
      { id: 4, img: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/bc051d33-b955-4e44-a19a-350b65c48d9b-tan.webp" },
      { id: 5, img: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/567afc59-c987-45ac-90fd-7911d5f4381f-bao.webp" },
    ],
  },
  termsOfService: {
    title: "Điều khoản dịch vụ",
    updatedDate: "18/06/2025",
    sections: [
      {
        id: 1,
        title: "Chấp nhận điều khoản",
        content:
          'Bằng cách tải xuống, cài đặt hoặc sử dụng ứng dụng di động của chúng tôi ("Ứng dụng"), bạn đồng ý bị ràng buộc bởi các Điều khoản dịch vụ này. Nếu bạn không đồng ý, vui lòng không sử dụng Ứng dụng.',
      },
      {
        id: 2,
        title: "Đặt vé và thanh toán",
        items: [
          "Tất cả các giao dịch mua vé là cuối cùng.",
          "Chính sách hoàn tiền hoặc hủy vé sẽ được áp dụng tùy theo quy định của từng rạp chiếu phim đối tác. Vui lòng kiểm tra các điều khoản cụ thể trước khi hoàn tất giao dịch.",
          "Giá vé được hiển thị bằng Việt Nam Đồng (VND) và đã bao gồm các loại thuế áp dụng.",
        ],
      },
      {
        id: 3,
        title: "Tài khoản người dùng",
        content:
          "Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. Bạn đồng ý chịu trách nhiệm cho tất cả các hoạt động xảy ra dưới tài khoản của mình.",
      },
      {
        id: 4,
        title: "Sở hữu trí tuệ",
        content:
          "Ứng dụng và tất cả nội dung của nó, bao gồm logo, đồ họa và văn bản, là tài sản của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ.",
      },
      {
        id: 5,
        title: "Chấm dứt",
        content: "Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của bạn vào Ứng dụng bất kỳ lúc nào nếu bạn vi phạm các điều khoản này.",
      },
      {
        id: 6,
        title: "Thay đổi điều khoản",
        content:
          "Chúng tôi có thể sửa đổi các điều khoản này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng các điều khoản mới trong Ứng dụng.",
      },
    ],
  },
  privacyPolicy: {
    title: "Chính sách quyền riêng tư",
    updatedDate: "18/06/2025",
    sections: [
      {
        id: 1,
        title: "Giới thiệu",
        content:
          "Chính sách quyền riêng tư này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng ứng dụng di động của chúng tôi. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn theo Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam về Bảo vệ dữ liệu cá nhân.",
      },
      {
        id: 2,
        title: "Thông tin chúng tôi thu thập",
        description: "Chúng tôi có thể thu thập các loại thông tin sau:",
        items: [
          "Thông tin cá nhân: Tên, địa chỉ email, số điện thoại khi bạn đăng ký tài khoản.",
          "Thông tin giao dịch: Chi tiết về các lượt đặt vé xem phim của bạn, bao gồm phim, rạp, và thời gian. Chúng tôi không lưu trữ chi tiết thẻ thanh toán của bạn.",
          "Thông tin sử dụng: Cách bạn tương tác với Ứng dụng, chẳng hạn như lịch sử tìm kiếm và các phim đã xem.",
        ],
      },
      {
        id: 3,
        title: "Cách chúng tôi sử dụng thông tin của bạn",
        description: "Chúng tôi sử dụng thông tin của bạn để:",
        items: [
          "Xử lý đặt vé và thanh toán của bạn.",
          "Gửi cho bạn xác nhận vé và thông báo.",
          "Cá nhân hóa trải nghiệm của bạn và đề xuất các bộ phim bạn có thể thích.",
          "Cải thiện dịch vụ và ứng dụng của chúng tôi.",
        ],
      },
      {
        id: 4,
        title: "Quyền của bạn",
        content:
          "Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của mình. Vui lòng liên hệ với chúng tôi để thực hiện các quyền này.",
      },
      {
        id: 5,
        title: "Liên hệ",
        content: "Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ với chúng tôi tại support@fcinema.vn",
      },
    ],
  },
  hero: {
    badge: "Web đặt phim",
    title: "Welcome to F Cinema",
    description: "Một project nhỏ đến từ nhóm 5 thành viên",
    cta: {
      primary: {
        text: "Try for Free",
        href: "/register",
      },
      secondary: {
        text: "Log in",
        href: "/login",
      },
    },
  },
};

export type SiteConfig = typeof siteConfig;
