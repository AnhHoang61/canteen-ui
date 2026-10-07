# 3. Style guide

Nguồn chuẩn: `design-system/tokens.json` (máy đọc) và `design-system/BRAND-BOOK.md` (quy tắc đầy đủ). Trang này tóm tắt để tra nhanh.

## Phong cách

- Phẳng, sáng, kiểu màn cài đặt điện thoại: **nền xám nhạt, thẻ trắng bo 12px không viền không bóng**.
- Nhóm nội dung = nhãn section phía trên + một thẻ trắng; trong thẻ các dòng cách nhau bằng đường `line`.
- Dòng: tiêu đề đậm + giá trị xám + chevron; **icon nét 24px màu xanh `info`** đứng đầu dòng.
- Nút chính **đen đặc full-width**, chữ trắng, bo 10px, cao 56–64px; nút phụ trắng, icon xanh; nút mô phỏng viền đứt.
- Lựa chọn đang bật: nền `brand-soft` + viền 2px `brand`.
- Cảnh báo nhẹ dùng dòng chữ có icon (i) màu `accent-ink`, không dùng hộp màu to.
- Chỉ một theme sáng cho mọi bản dùng thử (tokens có sẵn giá trị tối nếu sau này cần).

## Màu

| Token | Mã | Dùng cho |
| --- | --- | --- |
| `surface` | `#f4f5f7` | Nền trang |
| `surface-raised` | `#ffffff` | Thẻ, panel, hộp thoại |
| `surface-sunken` | `#f4f5f7` | Giếng trong thẻ: ô nhập, phím số, stepper |
| `line` | `#eceef1` | Đường phân tách |
| `line-strong` | `#8e939b` | Viền control khi bắt buộc |
| `ink` | `#1d1f24` | Chữ chính |
| `ink-muted` | `#60656d` | Chữ phụ, meta (≥ 4.5:1) |
| `brand` | `#1d1f24` | Nút chính, tab đang chọn, viền lựa chọn |
| `on-brand` | `#ffffff` | Chữ trên nút chính |
| `brand-soft` | `#e9f1fd` | Nền lựa chọn đang bật, khối tiền thật |
| `accent` | `#f5a623` | Số lượng trên thẻ món, món bán chạy |
| `on-accent` | `#1d1f24` | Chữ trên accent |
| `accent-soft` | `#fdf3e1` | Khối tiền thưởng, tiền mặt cần thu |
| `accent-ink` | `#946200` | Chữ hổ phách |
| `success` | `#0f7a5c` | Thành công, khớp tiền |
| `success-soft` | `#e3f5ee` | Nền thành công |
| `warning` | `#9a4f00` | Chờ, sắp hết |
| `warning-soft` | `#fdeedb` | Nền cảnh báo |
| `danger` | `#c0281b` | Lỗi, hết hàng, thiếu tiền |
| `danger-soft` | `#fde8e6` | Nền lỗi |
| `info` | `#1a62c2` | Icon đầu dòng, liên kết, chữ "POS" |
| `info-soft` | `#e9f1fd` | Nền thông tin |
| `focus` | `#1a62c2` | Vòng focus 3px |
| `qr-ink` | `#111111` | Mã QR |
| `qr-ground` | `#ffffff` | Nền mã QR |

Quy tắc: màu chỉ mang nghĩa; trạng thái luôn có **chữ + icon** (success + check, warning + đồng hồ, danger + tam giác, bị chặn + ổ khóa). Ví luôn tách **tiền thật** (`brand-soft`) và **tiền thưởng** (`accent-ink` trên `accent-soft`).

## Chữ

Họ chữ: `Roboto, "Segoe UI", system-ui, -apple-system, sans-serif` (Roboto từ Google Fonts). Số tiền dùng `tabular-nums`.

| Style | Cỡ / dòng | Đậm | Dùng cho |
| --- | --- | --- | --- |
| `title-lg` | 20px / 28px | 500 | Tiêu đề màn hình căn giữa trên thanh điều hướng, tiêu đề hộp thoại. |
| `title` | 18px / 24px | 700 | Tiêu đề dòng đậm trong thẻ, tên người mua, tên panel. |
| `body` | 16px / 22px | 400 | Giá trị dòng, tên món, mô tả quyền. |
| `body-strong` | 16px / 22px | 700 | Giá trị đã nhập (email), nhãn nút chính, dòng tổng. |
| `label` | 15px / 20px | 400 | Nhãn section đặt trên thẻ trắng, nhãn field. |
| `caption` | 13px / 18px | 400 | Meta đơn, ghi chú cảnh báo nhỏ có icon. |
| `numeral-xl` | 40px / 44px | 700 | Số tiền phải thu trên màn thanh toán, QR. |
| `numeral-lg` | 26px / 32px | 700 | Tổng giỏ hàng, tiền thừa. |
| `numeral` | 15px / 22px | 500 | Giá món, số dư, dòng bảng chốt ca. |

## Khoảng cách, kích thước, bo góc

| Token | Giá trị |
| --- | --- |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 24px |
| `space-6` | 32px |
| `space-7` | 48px |
| `tap-min` | 48px |
| `tap-lg` | 56px |
| `cart-width` | 400px |
| `radius-sm` | 6px |
| `radius-md` | 10px |
| `radius-lg` | 12px |
| `radius-pill` | 999px |

- Lề trong thẻ `space-5` (24px) ngang; dòng cao tối thiểu 72px ở form; nhãn section cách thẻ `space-3`.
- Bóng: `shadow-1` = không bóng; `shadow-2` chỉ cho hộp thoại và nút nổi ở đáy.
- Focus: viền liền 3px `focus`, cách 2px.

## Bố cục theo thiết bị

| Giao diện | Khung | Bố cục |
| --- | --- | --- |
| POS | Ngang 1280×800 → 1920×1080 | Thanh trên 60px (Canteen · Quầy · Ca · tab · trạng thái mạng · nhân viên) → nội dung 2 cột: lưới món + giỏ hàng 400px; các màn quản lý vừa một màn hình, không cuộn |
| Kiosk | Tablet dọc 834×1194 | Thương hiệu trên → camera lớn tự vừa màn → hướng dẫn + nút thay thế dưới; menu 2 cột + giỏ dạng tấm trượt |
| Ví | Điện thoại 360–430px | Thanh tiêu đề giữa + thẻ trắng + nút đen ở đáy; thanh tab dưới cùng (Trang chủ · Đặt món · Con · Nạp tiền · Lịch sử) |

## Component dùng chung (`window.CanteenPOS`)

`Button`, `StatusBadge`, `Money`, `Field`, `TopBar`, `OfflineBanner`, `CategoryTabs`, `MenuItemCard` (có ô ảnh), `OrderCart`, `BuyerCard`, `IdentifyPanel`, `CashPayment`, `QRPayment`, `PreorderTicket` (có trạng thái chờ thu tiền mặt), `ShiftSummary`, `NavBar`, `SectionLabel`, `ListRow`, `InlineNote`, `Icon`, `formatVND`. Mỗi component có README và preview trong `design-system/components/<Tên>/`.

## Giọng văn

- Tiếng Việt, câu ngắn, **động từ đứng đầu nút**: "Mở ca và bắt đầu bán", "Đã thu 12.000 ₫", "Chốt ca & bàn giao". Không "OK", "Submit".
- Mã viết hoa có gạch: `HS-208317`, `GV-0451`, `DH-0412`, `APP-1187`, `K-0151`, `PN-0001`, `LOP-10A2`.
- Lỗi nói điều đã xảy ra + bước tiếp theo. Không emoji. Giờ 24h `10:42`; phút cộng thêm `+30′`; tiền `35.000 ₫`.

## Hiệu ứng

- Quét mặt: vòng oval nét đứt; đường xanh `#22c55e` nét liền chạy từ đỉnh theo chiều kim đồng hồ 1,4 giây → oval tô xanh + dấu tích trắng → xanh tỏa kín khung camera 0,55 giây.
- Thanh đếm ngược rút dần mỗi giây; ≤ 10 giây chuyển đỏ.
- Mọi chuyển động tắt khi người dùng bật "giảm chuyển động" (`prefers-reduced-motion`).
