# Canteen POS — Vibe Tech Smart Canteen (NextGen)

Toàn bộ giao diện, ý tưởng thiết kế, cách thiết kế và style của hệ thống canteen trường học, gộp trong một thư mục.

## Mở nhanh

| Mở file | Để xem |
| --- | --- |
| `demo/pos-thu-ngan.html` | POS thu ngân (bản một file, cần mạng để tải React/font) |
| `demo/kiosk-tablet.html` | Kiosk tự phục vụ, tablet dọc |
| `demo/vi-canteen.html` | Ví Canteen trên điện thoại |
| `pos-thu-ngan/index.html`, `kiosk-tablet/index.html`, `vi-dien-thoai/index.html` | Bản chia file để ghép vào app (React đã kèm, chạy không cần mạng) |

Kiosk không có nút mô phỏng; thêm `?demo` vào đường dẫn để hiện lại khi chạy thử.
Ví dùng thử: mật khẩu `123456` — `HS-208317` (học sinh), `0912345678` (phụ huynh), `GV-0451` (giáo viên kiêm phụ huynh), `SV-K20-118` (sinh viên).

## Cấu trúc

```
canteen-ui/
├── README.md                 ← trang này
├── docs/
│   ├── 1-y-tuong-thiet-ke.md ← bài toán, người dùng, nguyên tắc, quy tắc nghiệp vụ
│   ├── 2-cach-thiet-ke.md    ← quy trình, cấu trúc kỹ thuật, luồng, nhật ký quyết định, ghép app thật
│   ├── 3-style-guide.md      ← màu, chữ, khoảng cách, bố cục, component, giọng văn, hiệu ứng
│   └── screens/              ← 18 ảnh màn hình chính
├── design-system/
│   ├── BRAND-BOOK.md         ← quy tắc thiết kế đầy đủ
│   ├── tokens.json / tokens.css
│   └── components/           ← bundle.js, bundle.css, index.d.ts, README + preview từng component, màn hình mẫu
├── pos-thu-ngan/             ← Bán hàng · Đơn hàng · Đơn hoàn thành · Nhập hàng · Chốt ca
├── kiosk-tablet/             ← Quét mặt · Xác nhận · Chọn món · Thanh toán (README có API ghép app)
├── vi-dien-thoai/            ← Ví: nạp tiền, đặt trước, hạn mức & chặn món, khuôn mặt…
└── demo/                     ← bản một file của 3 giao diện
```

Mỗi thư mục giao diện có `index.html`, `css/` (tokens, components, app) và `js/` (vendor React, components, app).

## Đọc theo thứ tự

1. [Ý tưởng thiết kế](docs/1-y-tuong-thiet-ke.md)
2. [Cách thiết kế](docs/2-cach-thiet-ke.md)
3. [Style guide](docs/3-style-guide.md) → chi tiết trong [BRAND-BOOK](design-system/BRAND-BOOK.md)
