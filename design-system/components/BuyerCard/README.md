# BuyerCard

Thông tin người mua sau định danh: vai trò, lớp/mã, ví tách tiền thật – tiền thưởng, hạn mức ngày, nhóm món bị chặn.

- `role`: `student` | `teacher` | `university` | `guest`. `guest` chỉ hiện "Khách lẻ" — không thẻ, hồ sơ, ví.
- `name`, `klass`, `code`, `method` (`card`/`qr`/`bio`), `real`, `bonus`, `limit: {used, max}`, `blocked: string[]`.
- `compact` gộp hạn mức thành ô thứ ba (dùng trong cột giỏ hàng).
- "Được dùng thêm" = min(tổng ví, hạn mức còn lại).
