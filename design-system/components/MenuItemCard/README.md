# MenuItemCard

Thẻ món trong lưới bán hàng: mã, tên, giá, trạng thái còn bán, số lượng đã chọn.

- `code`, `name`, `price`, `qty`, `onAdd`.
- `status`: `available` | `low` (kèm `stockLeft`) | `soldout` (xám, không chạm) | `blocked` (viền `danger` + ổ khóa, `blockedReason` — món thuộc nhóm bị chặn với học sinh đang được định danh).
- `promo`: nhãn khuyến mại (`accent`).
- Đặt trong `.cp-menu-grid` (tự chia cột ≥168px).
