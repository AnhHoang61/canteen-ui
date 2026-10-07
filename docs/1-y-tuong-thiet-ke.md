# 1. Ý tưởng thiết kế

## Bài toán

Canteen trường học (Vibe Tech Smart Canteen / NextGen) phục vụ nhiều nhóm người trong cùng một khung giờ ngắn: học sinh, giáo viên, sinh viên, phụ huynh và khách lẻ. Giờ ra chơi và giờ trưa là cao điểm — hàng dài, nhân viên ít, tiền lẻ, và phụ huynh muốn biết con ăn gì, tiêu bao nhiêu.

Bộ giao diện này giải ba việc:

1. **Bán nhanh tại quầy** — thu ngân thao tác một chạm, nhận đủ phương thức (ví, tiền mặt, QR), không sai tiền, vẫn bán được khi mất mạng.
2. **Giảm hàng chờ** — học sinh, giáo viên tự gọi món tại kiosk bằng khuôn mặt, hoặc đặt trước trên điện thoại rồi chỉ việc đến lấy.
3. **Minh bạch cho phụ huynh** — nạp tiền, đặt hạn mức, chặn món, xem lịch sử ăn uống của con từ điện thoại.

## Ba giao diện, một hệ thống

| Giao diện | Ai dùng | Thiết bị | Vai trò trong luồng |
| --- | --- | --- | --- |
| **POS thu ngân** (`pos-thu-ngan/`) | Nhân viên bán hàng, thu ngân | Máy POS / màn ngang ≥ 1280px | Bán cho khách lẻ, nhận đơn kiosk/app, thu tiền mặt còn thiếu, nhập hàng, chốt ca |
| **Kiosk tự phục vụ** (`kiosk-tablet/`) | Học sinh, giáo viên, sinh viên | Tablet dọc 834×1194 | Nhận diện khuôn mặt → xác nhận → chọn món → trừ ví → lấy mã nhận món |
| **Ví Canteen** (`vi-dien-thoai/`) | Học sinh, giáo viên, sinh viên, phụ huynh | Web điện thoại (thay app native) | Nạp tiền, đặt món trước, hạn mức & chặn món, đăng ký khuôn mặt, lịch sử |

Cả ba dùng chung một thư viện component và một bộ token (`design-system/`), nên một con số, một trạng thái, một nút bấm trông giống nhau ở mọi nơi.

## Nguyên tắc cốt lõi

1. **Tiền phải đúng trước, đẹp sau.** Số tiền luôn đủ chữ số, chữ số đều độ rộng, hậu tố `₫`. Không gộp ví thành một "số dư": luôn tách **tiền thật** và **tiền thưởng**; trừ tiền thưởng trước.
2. **Không xác nhận khi chưa kiểm chứng.** QR chỉ "Thành công" khi ngân hàng trả kết quả khớp số tiền và mã đơn. Khách quét QR ≠ đã trả tiền.
3. **Một chạm cho việc thường làm.** Vùng chạm ≥ 48px, nút chính 56–64px. Hành động phá hủy (hoàn, hủy) không đặt cạnh nút thanh toán.
4. **Trạng thái luôn có chữ + icon**, không chỉ dựa vào màu.
5. **Ghi vết mọi thao tác**: nhân viên, quầy, giờ; hoàn/hủy luôn có lý do và người xử lý.
6. **Quyền theo đúng vai trò**: chỉ bố mẹ đặt hạn mức và chặn món cho con. Giáo viên có thể là phụ huynh (một tài khoản, hai vai trò) nhưng không có quyền đặt hạn mức cho học sinh khác. Sinh viên tự quản lý ví.
7. **Riêng tư khuôn mặt**: ảnh camera chỉ so khớp tại chỗ, không lưu; đăng ký khuôn mặt cho học sinh cần phụ huynh đồng ý.

## Quy tắc nghiệp vụ đưa vào giao diện

- **Ví**: trừ tiền thưởng trước, tiền thật sau; thiếu thì thu thêm tiền mặt hoặc QR. Khuyến mãi nạp 500.000 ₫ tặng 50.000 ₫, tiền thưởng hết hạn sau 30 ngày.
- **Offline**: vẫn bán tiền mặt; ví offline tối đa 30.000 ₫/giao dịch; QR luôn "Chờ xác minh" và đồng bộ khi có mạng.
- **Đặt trước cho sinh viên (cấp Đại học)**: cộng thêm thời gian theo số đơn đang chờ toàn Canteen — ≤ 30 đơn **+20′**, 30–50 đơn **+30′**, ≥ 50 đơn **+35′**. Hạn chót đặt trước 30 phút.
- **Suất tập thể theo lớp**: 30.000 ₫/suất trừ ví từng học sinh khi phụ huynh đồng ý; vắng mặt thì hoàn.
- **Kiosk**: độ khớp khuôn mặt ≥ 90% chỉ cần bấm xác nhận; thấp hơn phải nhập PIN; 30 giây không xác nhận thì tự hủy; 60 giây không thao tác thì tự đăng xuất.
- **Tồn kho**: bán xong trừ tồn; hết tồn thì món chuyển "Hết món"; còn ≤ 5 phần hiện "Còn N".

## Hướng thẩm mỹ

Phẳng, sáng, giống màn cài đặt của điện thoại: nền xám rất nhạt, thẻ trắng bo 12px không viền không bóng, chữ đen đậm, icon nét màu xanh, nút chính đen đặc. Màu chỉ dùng để mang nghĩa (trạng thái, tiền thưởng, lựa chọn đang bật) — không dùng để trang trí. Lý do: nhà ăn sáng, màn hình bị chói; người dùng là học sinh và nhân viên cần đọc nhanh, không cần học.

Chi tiết style xem [3-style-guide.md](3-style-guide.md); quy trình và các quyết định thiết kế xem [2-cach-thiet-ke.md](2-cach-thiet-ke.md).
