// Dữ liệu cho một link mạng xã hội
export interface SocialLink {
  href: string;
  iconClass: string; // ví dụ: 'fab fa-facebook-f'
}

// Dữ liệu cho một link thông thường trong cột
export interface FooterLink {
  href: string;
  label: string;
}

// Dữ liệu cho một cột chứa các link
export interface FooterLinkColumn {
  type: 'links';
  title: string;
  links: FooterLink[];
}

// Dữ liệu cho cột thông tin liên hệ
export interface FooterContactColumn {
  type: 'contact';
  title: string;
  address: string;
  phone: string;
  email: string;
}

export interface User {
  name: string;
  avatarUrl: string; // URL đến ảnh đại diện
}

export interface UserAvatarProps {
  user: User;
  onLogout: () => void;
}
