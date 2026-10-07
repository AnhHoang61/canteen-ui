# QRPayment

Thanh toán QR ngân hàng gắn số tiền + mã đơn, với trạng thái chỉ dựa trên kết quả đã kiểm chứng.

- `total`, `orderCode`, `memo`, `account`, `elapsed`, `issue` (mô tả lệch), `children` (nút thao tác).
- `state`: `pending` (chờ ngân hàng) | `success` (đã khớp) | `check` (sai số tiền, trùng, chưa khớp đơn → tra soát) | `offline` (chờ xác minh).
- Không có nút "Đánh dấu đã thanh toán". Mã QR trong preview là hình minh họa; thay bằng chuỗi VietQR thật từ cổng thanh toán.
