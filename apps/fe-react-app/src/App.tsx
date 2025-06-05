// src/App.tsx
import React from 'react';
import MemberManagementPage from './feature/member/pages/MemberManagementPage'; // Kiểm tra lại đường dẫn
import './App.css'; // Hoặc file CSS global của bạn
// Đảm bảo `src/index.css` (chứa Tailwind directives) được import ở `src/main.tsx`

function App() {
  // Bạn có thể đã có router hoặc các layout khác ở đây
  // Để DaisyUI hoạt động, bạn cần set theme. Có thể set trong tailwind.config.js hoặc thẻ html.
  // Ví dụ: đặt theme cho toàn bộ app
  return (
    <div data-theme="">
      {' '}
      {/* Chọn một theme của DaisyUI, ví dụ "cupcake" */}
      <MemberManagementPage />
    </div>
  );
}

export default App;
