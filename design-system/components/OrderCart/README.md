# OrderCart

Giỏ hàng / đơn đang tạo: mã đơn, NV, quầy, thời gian, dòng món với stepper, tạm tính, giảm giá và số phải thu.

- `orderCode`, `staff`, `counter`, `createdAt`, `lines: [{name, price, qty, note}]`, `discount: {label, amount}`, `badge` (vd trạng thái chờ thanh toán).
- `children` là vùng nút thanh toán ở đáy (nút `primary` trên cùng).
- Bấm − ở số lượng 1 sẽ xóa dòng (icon đổi thành ×).
