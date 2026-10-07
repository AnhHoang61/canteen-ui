# Button

Nút hành động của POS, cao tối thiểu `tap-min` (48px).

- `variant`: `primary` (đen đặc, một nút chính mỗi vùng — Thanh toán, Mở ca), `secondary` (phương thức thay thế: Tiền mặt, QR), `accent` (áp khuyến mại), `ghost` (đóng, hủy bỏ), `danger` (Hoàn/Hủy đơn — nền `danger-soft`, chữ đỏ).
- `size`: `sm` (36px, trong ticket), `md`, `lg` (`tap-lg` 56px, hành động chốt — thường full-width ở đáy).
- `icon`, `iconRight`: tên icon trong `CanteenPOS.Icon`. `block` kéo rộng 100%.
- Không để nút `danger` cạnh nút `primary` thanh toán. Nút bị khóa khi không đủ quyền: `disabled` kèm lý do ở chỗ khác.
