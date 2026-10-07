# PreorderTicket

Phiếu đơn đặt trước từ app hoặc suất ăn tập thể theo lớp, có giờ nhận, quầy nhận, giờ dự kiến và bước xử lý.

- `code`, `source` (`app` | `class`), `buyer`, `items: [{qty, name}]`, `pickupAt`, `counter`, `eta` (vd `+30′ → 11:52`), `status`: `new` | `preparing` | `ready` | `done` | `cancelled`, `actions`.
- Nút hành động theo bước: Bắt đầu chuẩn bị → Báo sẵn sàng → Xác nhận đã giao.
- Thời gian cộng thêm (sinh viên): ≤30 đơn +20′, 30–50 +30′, ≥50 +35′.
