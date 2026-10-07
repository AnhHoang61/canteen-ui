# Ví Canteen

Web điện thoại cho học sinh, giáo viên, phụ huynh: đăng nhập, tạo tài khoản, nạp tiền VietQR, đặt món trước, hạn mức & chặn món, đăng ký khuôn mặt.

Mở `index.html` bằng trình duyệt là chạy được (React đã kèm trong `js/vendor/`, font Roboto tải từ Google Fonts, không có mạng sẽ dùng font hệ thống).

```
vi-dien-thoai/
├── index.html
├── css/
│   ├── tokens.css        # màu, khoảng cách, bo góc, font — sinh từ design-system/tokens.json
│   ├── components.css    # style component dùng chung
│   └── app.css           # bố cục riêng của giao diện này
└── js/
    ├── vendor/           # React 18 + ReactDOM 18
    ├── components.js     # thư viện component window.CanteenPOS
    └── app.js            # màn hình, luồng và dữ liệu mẫu của giao diện này
```

Dữ liệu là dữ liệu mẫu trong `js/app.js`; các nút viền đứt là nút mô phỏng (đầu đọc, ngân hàng, camera…). Tải lại trang thì dữ liệu về ban đầu.
