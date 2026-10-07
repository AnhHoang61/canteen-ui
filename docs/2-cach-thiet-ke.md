# 2. Cách thiết kế

## Quy trình

1. **Đặc tả → hệ thống.** Bắt đầu từ đặc tả "Phần mềm bán hàng tại quầy – POS" (mục 3.1–3.10), dựng design system trước: token màu/chữ/khoảng cách, rồi các component nghiệp vụ (giỏ hàng, thanh toán tiền mặt, QR, thẻ người mua, phiếu đặt trước, chốt ca…), rồi ghép thành màn hình mẫu.
2. **Đổi phong cách theo ảnh tham chiếu.** Chuyển sang phong cách phẳng, sáng kiểu ứng dụng cài đặt (nền xám nhạt, thẻ trắng, nút đen, icon xanh). Giao diện khóa ở theme sáng để bản thiết kế và bản dùng thử trông giống nhau.
3. **Bản dùng thử bấm được.** Ghép các màn thành prototype có dữ liệu mẫu và luồng thật: POS → Kiosk → Ví điện thoại.
4. **Đối chiếu danh sách tính năng** (file "NextGen - tính năng.xlsx"): thêm phần còn thiếu, bỏ phần thừa ở từng giao diện; dùng web điện thoại thay cho app native.
5. **Vòng góp ý trực tiếp trên giao diện.** Mỗi bình luận trên bản dùng thử được sửa ngay và phát hành phiên bản mới (xem nhật ký quyết định bên dưới).
6. **Chuẩn bị ghép app thật.** Tách mỗi giao diện thành thư mục riêng; kiosk bỏ nút mô phỏng và có cầu nối `window.CanteenKiosk` để phần cứng/backend điều khiển.

## Cấu trúc kỹ thuật

- **React 18 (UMD)**, viết bằng `React.createElement`, không cần build. Mở `index.html` là chạy.
- **Thư viện dùng chung** `components.js` (`window.CanteenPOS`) + `components.css`; khai báo kiểu trong `design-system/components/index.d.ts`.
- **Token** sinh từ `design-system/tokens.json` → `tokens.css` (biến CSS `--surface`, `--ink`, `--brand`, …).
- Mỗi giao diện chỉ thêm `app.js` (màn hình, luồng, dữ liệu mẫu) và `app.css` (bố cục riêng).
- Thư mục `demo/` có bản một-file của từng giao diện (mọi CSS/JS đã gộp), tiện gửi xem nhanh.

## Luồng chính

### POS thu ngân
Đăng nhập & mở ca (3 bước trên một màn: tài khoản → Canteen & quầy → ca + tiền đầu ca)
→ **Bán hàng**: lưới món có ảnh (3 món/hàng), giỏ hàng bên phải, thanh toán tiền mặt (tự tính tiền thừa) hoặc QR (chờ ngân hàng xác minh) → biên lai
→ **Đơn hàng**: bảng 4 cột *Cần thanh toán tiền mặt → Mới nhận → Đang chuẩn bị → Sẵn sàng giao*; đơn từ app, kiosk, suất tập thể; thời gian cộng thêm cho sinh viên
→ **Đơn hoàn thành**: danh sách đơn trong ca, tự mở đơn mới nhất; hoàn/hủy có lý do, vượt 50.000 ₫ phải gửi duyệt
→ **Nhập hàng**: cộng thêm tồn kho từng món, giá nhập, phiếu nhập theo nhà cung cấp; thêm món mới có tải ảnh; tạo mục (danh mục) mới
→ **Chốt ca**: số liệu ca, doanh thu theo phương thức/giờ, món bán chạy, đếm tiền theo mệnh giá, chênh lệch Khớp/Thừa/Thiếu, danh sách kiểm tra bàn giao, biên bản.
Mất mạng thì tự chuyển offline, có mạng lại thì tự đồng bộ.

### Kiosk tự phục vụ (tablet dọc)
Quét mặt (đường xanh chạy quanh khung theo chiều kim đồng hồ → tô xanh + dấu tích → xanh tỏa kín camera)
→ Xác nhận "Bạn có phải là…?" trong 30 giây (độ khớp < 90% thì nhập PIN)
→ Menu theo tài khoản: số dư tách thật/thưởng, hạn mức hôm nay, món bị phụ huynh chặn có ổ khóa, nhãn dị ứng "Có chứa:"
→ Thanh toán (trừ ví, thiếu thì gửi đơn sang quầy thu tiền mặt) → mã nhận món.
Đăng nhập thay thế: quét QR bằng Ví Canteen trên điện thoại, hoặc quẹt thẻ / QR học sinh.

### Ví Canteen (web điện thoại)
Đăng nhập / tạo tài khoản (phụ huynh, giáo viên, sinh viên, học sinh) → Trang chủ theo vai trò → Đặt món trước, Con (hạn mức, khung giờ, chặn nhóm món, đồng ý suất tập thể và khuôn mặt), Nạp tiền VietQR, Lịch sử, Thông báo, Hồ sơ, Đăng ký khuôn mặt (hướng dẫn quay mặt theo yêu cầu), Đăng nhập kiosk bằng điện thoại, Hỗ trợ, Sao kê.

## Nhật ký quyết định từ góp ý

| Góp ý | Quyết định |
| --- | --- |
| Bản thiết kế nền trắng nhưng bản dùng thử nền đen | Khóa theme sáng cho mọi bản dùng thử |
| Viền chọn món ở kiosk bị ảnh che | Vẽ viền bằng lớp phủ `::after` nằm trên ảnh |
| Bỏ QR thanh toán trong ví | Ví chỉ còn nạp tiền, đặt trước, QR đăng nhập kiosk |
| Giáo viên có thể là phụ huynh | Một tài khoản hai vai trò; chỉ bố mẹ đặt hạn mức/chặn món |
| Hiệu ứng quét mặt | Khung nét đứt; chỉ đường xanh là nét liền, chạy từ đỉnh theo chiều kim đồng hồ; xong thì tô xanh, dấu tích trắng, xanh tỏa kín camera |
| Khung camera | Giữ kích thước cố định giữa các trạng thái, tự vừa màn hình |
| Bước xác nhận | Thanh đếm ngược 30 giây, hết giờ tự hủy |
| Bỏ phần mô phỏng ở kiosk để ghép app thật | Thêm cầu nối `window.CanteenKiosk`; nút mô phỏng chỉ hiện khi mở với `?demo` |
| Ảnh sản phẩm ở POS | Ô ảnh trên thẻ món, 3 món/hàng, ảnh 160px |
| "Đặt trước" → "Đơn hàng", thêm cột tiền mặt | Cột "Cần thanh toán tiền mặt" cho đơn kiosk thiếu ví và đơn app trả khi nhận |
| Tab "Hoàn / hủy" | Đổi thành "Đơn hoàn thành", tự mở đơn mới nhất |
| Bỏ "Định danh HS / GV / SV" và nút "Ngắt mạng" ở POS | Quầy chỉ bán khách lẻ; mạng được theo dõi tự động |
| Thêm tab Nhập hàng | Tồn kho, giá nhập, phiếu nhập, thêm món có ảnh, tạo mục mới; tồn mới hiện "24 → 26" bên phải số cũ |
| Màn đăng nhập POS trống | Cột đen rộng hơn (đồng hồ lớn, lịch ca), form lớn ở giữa |
| Màn chốt ca trống / phải cuộn | Bố cục vừa một màn ở 1280×800 → 1920×1080: 6 ô số liệu 2 hàng, 3 khung phân tích, đếm tiền theo mệnh giá, cột bàn giao có tồn kho |

## Ghép vào app thật

- **Kiosk**: xem `kiosk-tablet/README.md` — `CanteenKiosk.face()`, `.card()`, `.phone()`, `.camera(stream)`, `.config({ menu, verifyPin, pay })`, sự kiện `confirmed`, `paid`, `cancel`, `logout`, `retry`, `loginCode`.
- **POS & Ví**: dữ liệu mẫu nằm ở đầu `js/app.js` (`MENU`, `BUYERS`, `SEED_ORDERS`, `DB`…); thay bằng API thật. Ảnh món và tồn kho trong bản dùng thử chỉ lưu tạm trên trình duyệt — cần backend lưu lại.
- Chưa làm: Web quản lý Đối tác và Web quản trị Vibe Tech (mục 1–2 trong danh sách tính năng).

## Ảnh màn hình

Xem thư mục [`screens/`](screens/):

| POS thu ngân | Kiosk | Ví Canteen |
| --- | --- | --- |
| `pos-01-dang-nhap` | `kiosk-01-quet-mat` | `vi-01-dang-nhap` |
| `pos-02-ban-hang` | `kiosk-02-dang-quet` | `vi-02-trang-chu-phu-huynh` |
| `pos-03-don-hang` | `kiosk-03-nhan-dien-xong` | `vi-03-dat-mon` |
| `pos-04-don-hoan-thanh` | `kiosk-04-xac-nhan` | `vi-04-con` |
| `pos-05-nhap-hang` | `kiosk-05-chon-mon` | `vi-05-nap-tien` |
| `pos-06-them-mon-moi` | | `vi-06-lich-su` |
| `pos-07-chot-ca` | | |
