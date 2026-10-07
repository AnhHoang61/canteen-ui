# IdentifyPanel

Chọn cách định danh người mua — thẻ, QR, hoặc thiết bị sinh trắc — và hiện trạng thái đọc.

- `active`: `card` | `qr` | `bio`; `state`: `idle` | `reading` | `found` | `error`; `message` ghi đè chữ trạng thái.
- `onGuest` cho nút "Bán cho khách lẻ"; `onGuest={false}` để ẩn.
