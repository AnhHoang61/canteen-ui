Hệ thống giao diện cho **phần mềm bán hàng tại quầy (POS) của Canteen trường học** — dùng bởi nhân viên bán hàng và thu ngân, phục vụ cả học sinh/giáo viên/sinh viên có tài khoản ví và khách lẻ. Thiết kế cho màn hình cảm ứng 1280×800 trở lên, thao tác nhanh trong giờ cao điểm, đọc được dưới ánh sáng nhà ăn.

## Nguyên tắc

1. **Tiền phải đúng trước, đẹp sau.** Mọi số tiền dùng `Money` (chữ số đều độ rộng, dấu chấm phân cách nghìn, hậu tố `₫`). Không làm tròn, không viết tắt trừ nút gợi ý mệnh giá ("100k").
2. **Không bao giờ xác nhận thanh toán khi chưa kiểm chứng.** QR chỉ chuyển sang *Thành công* khi có kết quả ngân hàng khớp số tiền và mã đơn. Khách quét QR ≠ đã trả tiền.
3. **Trạng thái luôn có chữ + icon**, không chỉ màu: `success` + check, `warning` + đồng hồ, `danger` + tam giác cảnh báo, món bị chặn + ổ khóa.
4. **Một chạm cho việc thường làm.** Vùng chạm tối thiểu `tap-min` (48px); hành động chính `tap-lg` (64px). Không đặt hành động phá hủy (Hủy/Hoàn) cạnh nút Thanh toán chính.
5. **Ghi vết mọi thao tác.** Đơn luôn hiển thị nhân viên, quầy, thời gian tạo (`caption`); hoàn/hủy luôn có lý do và người xử lý.

## Giọng văn & nội dung

- Tiếng Việt, câu ngắn, động từ đứng đầu nút: "Mở ca và bắt đầu bán", "Xác nhận đã nhận tiền", "Chốt ca & bàn giao". Không dùng "OK", "Submit".
- Gọi người mua theo vai trò hệ thống: **Học sinh**, **Giáo viên**, **Sinh viên**, **Khách lẻ**. Mã định danh viết hoa có gạch: `HS-208317`, `GV-0451`, đơn `DH-0412`, đơn app `APP-1187`, suất lớp `LOP-10A2`, đơn offline `OFF-0007`.
- Ví luôn tách hai dòng: **Tiền thật** (nền `brand-soft`) và **Tiền thưởng** (`accent-ink` trên `accent-soft`). Không gộp thành "số dư".
- Thông báo lỗi nói điều đã xảy ra + bước tiếp theo: "Nhận 45.000 ₫ — lệch 5.000 ₫ so với đơn. Không xác nhận; chuyển tra soát."
- Không emoji. Thời gian 24h `10:42 · 05/10`; phút cộng thêm viết `+30′`.

## Phong cách

Giao diện phẳng kiểu ứng dụng cài đặt di động: **nền xám nhạt, thẻ trắng bo 12px không viền không bóng, nhãn section đặt trên thẻ, dòng có tiêu đề đậm + giá trị xám + chevron, icon nét màu xanh, nút chính đen đặc full-width**.

- Nhóm nội dung = `SectionLabel` (chữ `label`, màu `ink`) + một thẻ `.cp-card` trắng. Trong thẻ, các `ListRow` cách nhau bằng đường `line`.
- Ô nhập là thẻ trắng không viền, giá trị in đậm (`body-strong`); placeholder `ink-muted`. Khi ô nằm trong panel/hộp thoại trắng, nền ô tự đổi sang `surface-sunken`.
- Cảnh báo nhẹ dùng `InlineNote` (icon (i) + chữ `accent-ink`) ngay dưới giá trị, không dùng hộp màu.
- Hành động chính: `Button` `primary` (đen `brand`, chữ `on-brand`, bo `radius-md`, cao `tap-lg`), đặt ở đáy màn hình trong `.cp-bottom-bar` khi là form. Nút phụ trắng, icon xanh.

## Màu

- Nền `surface`; thẻ `surface-raised`; giếng trong thẻ (ô tổng tiền, phím số, stepper) `surface-sunken`. Đường phân tách `line`; viền control chỉ khi bắt buộc `line-strong`.
- Chữ `ink`; giá trị phụ, meta, mô tả `ink-muted` (≥4.5:1 trên mọi surface, `brand-soft`, `accent-soft`).
- `brand` là đen (theme tối: trắng ngà) — chỉ cho nút chính, tab đang chọn, viền 2px của lựa chọn đang bật. Lựa chọn đang bật có nền `brand-soft` (xanh rất nhạt).
- `info` (xanh) là màu icon đầu dòng, nút sửa, liên kết và chữ "POS" trên thanh trên.
- `accent` (hổ phách) cho số lượng trên thẻ món và khối tiền thưởng; chữ hổ phách luôn là `accent-ink`.
- Trạng thái: `success`, `warning`, `danger`, `info` + `*-soft`; luôn kèm chữ và icon.
- Mã QR luôn `qr-ink` trên `qr-ground` ở mọi theme.
- Lưu ý khả năng truy cập: thẻ trắng trên nền xám có tương phản ranh giới thấp (theo đúng phong cách gốc); vì vậy vùng bấm luôn có nhãn rõ, chevron hoặc icon, và focus là vòng `focus` 3px.

## Chữ

- Một họ chữ `sans` = Roboto (dự phòng Segoe UI / system-ui), tải từ Google Fonts. Số tiền dùng cùng họ chữ với chữ số đều (`tabular-nums`).
- `title-lg` tiêu đề màn hình căn giữa trên `NavBar` · `title` tiêu đề dòng đậm, tên người mua · `body` giá trị, tên món · `body-strong` giá trị đã nhập, nút · `label` nhãn section · `caption` meta, ghi chú.
- `numeral-xl` số phải thu · `numeral-lg` tổng giỏ, tiền thừa · `numeral` giá, số dư, bảng.

## Khoảng cách, bo góc, đổ bóng

- Thang `space-1`…`space-7` (4 → 48px). Lề trong thẻ `space-5` ngang; dòng cao tối thiểu 72px; nhãn section cách thẻ `space-3`, cách nhóm trước `space-5`.
- `radius-lg` (12px) thẻ, panel, ô nhập, hộp thoại · `radius-md` (10px) nút, phím số · `radius-sm` badge · `radius-pill` tab, số lượng, avatar.
- `shadow-1` = không có bóng. `shadow-2` chỉ cho hộp thoại và nút chính nổi ở đáy.
- Focus: viền liền 3px `focus`, offset 2px.

## Bố cục màn hình

- **Form / màn con**: `NavBar` (quay lại + tiêu đề giữa) → các cặp `SectionLabel` + thẻ → nút chính đen ở đáy (xem preview của `ListRow`).
- **Khung POS**: `TopBar` 60px trên nền xám (Canteen · Quầy · Ca · trạng thái mạng · nhân viên) → nội dung 2 cột: trái là tìm kiếm + `CategoryTabs` + lưới `MenuItemCard`; phải rộng `cart-width` (400px) gồm `BuyerCard` và `OrderCart`.
- **Thanh toán**: giữ giỏ hàng bên trái làm bằng chứng, phương thức thanh toán chiếm bên phải (`CashPayment layout="wide"`, `QRPayment`). Thanh toán ví mở hộp thoại trên màn bán hàng.
- **Offline**: `TopBar online={false}` + `OfflineBanner` ngay dưới, cố định cho tới khi đồng bộ xong.

## Quy tắc nghiệp vụ hiển thị

| Mục | Quy tắc giao diện |
| --- | --- |
| 3.1 Mở ca | Ba bước trên một màn: tài khoản → Canteen & quầy → ca + tiền mặt đầu ca. Ghi mốc NV · quầy · giờ. |
| 3.2 Tạo đơn | Món hết: `status="soldout"`, không chạm được. Sắp hết: "Còn N". KM theo quyền: badge `accent` trên thẻ + dòng giảm trong giỏ. |
| 3.3 Học sinh/GV | Định danh qua `IdentifyPanel` (thẻ/QR/sinh trắc). Món thuộc nhóm bị chặn hiển thị viền `danger` + ổ khóa với học sinh. Hạn mức: thanh đo chuyển `warning` ≥80%, `danger` khi vượt. Trừ ví tách tiền thưởng/tiền thật; thiếu thì thu bổ sung tiền mặt/QR. |
| 3.4 Khách lẻ | `BuyerCard role="guest"` — không hỏi thẻ, hồ sơ, ví; chỉ tiền mặt hoặc QR. |
| 3.5 Tiền mặt | Nhập tiền khách đưa → tự tính tiền thừa (`success-soft`) hoặc còn thiếu (`danger-soft`); nút xác nhận khóa khi thiếu. |
| 3.6 QR | Chờ (`warning`) → Thành công (`success`, chỉ sau kiểm chứng) hoặc Cần kiểm tra (`danger`: sai số tiền, trùng, chưa khớp đơn → tra soát). |
| 3.7 Đặt trước | Bảng Mới / Đang chuẩn bị / Sẵn sàng giao. Thời gian cộng thêm cho sinh viên (cấp Đại học) theo số đơn đang chờ: ≤30 đơn **+20′**, 30–50 đơn **+30′**, ≥50 đơn **+35′** — mức đang áp dụng tô đen `brand`. Suất tập thể theo lớp có badge `Suất tập thể`. |
| 3.8 Hoàn/hủy | Tra cứu trong phạm vi quyền (hiện rõ phạm vi dưới ô tìm). Bắt buộc lý do; ghi người xử lý; chọn hoàn về ví / tiền mặt / chuyển khoản. Vượt quyền → "Gửi yêu cầu duyệt". |
| 3.9 Offline | Cho phép tiền mặt; ví offline trong giới hạn; QR luôn "Chờ xác minh". Hàng đợi đồng bộ hiển thị từng giao dịch; khi có mạng chuyển banner `info` và báo xung đột. |
| 3.10 Chốt ca | KPI (số đơn, doanh thu thuần, hoàn/hủy, tiền mặt phải có) → bảng tách ví / tiền mặt / QR → nhập tiền đếm → chênh lệch Khớp / Thừa / Thiếu → bàn giao. QR chưa xác minh không tính vào doanh thu ca. |

## Biểu tượng

- Bộ icon nét 24px, stroke 2 (1.6 cho icon đầu dòng 28px), đầu tròn, màu `info` khi đứng đầu dòng, vẽ riêng cho hệ thống và có sẵn qua `CanteenPOS.Icon` (`check`, `alert`, `clock`, `card`, `qr`, `face`, `wifi`, `wifiOff`, `cash`, `wallet`, `sync`, `ban`, `lock`, `store`, `receipt`, `undo`, `search`, `tag`, `users`, `user`, `plus`, `minus`, `x`, `chevron`, `back`, `edit`, `info`, `home`, `bag`). Icon kế thừa màu chữ (`currentColor`).
- Hệ thống chưa có logo: tên **Canteen POS** đặt bằng `sans` đậm, chữ "POS" màu `info`. Thay bằng logo của trường/Canteen khi có.

## Màn hình mẫu

Nhóm **Màn hình** trong Components là các màn hoàn chỉnh dựng từ chính các component: Đăng nhập & mở ca, Bán hàng, Thanh toán ví học sinh, Tiền mặt, QR, Đơn đặt trước, Hoàn/hủy, Offline, Chốt ca.
