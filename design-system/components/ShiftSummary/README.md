# ShiftSummary

Chốt ca: KPI, bảng tách ví / tiền mặt / QR, nhập tiền mặt thực tế và tính chênh lệch.

- `opening`, `orders`, `wallet`/`walletCount`, `cash`/`cashCount`, `qr`/`qrCount`, `qrPending`, `refunds`/`refundCount`, `cancelCount`, `cashRefund`, `counted`.
- Tiền mặt phải có = đầu ca + thu tiền mặt − hoàn tiền mặt. Chênh lệch: Khớp (`success`), Thừa (`warning`), Thiếu (`danger`).
- QR chưa xác minh hiện riêng, không cộng vào doanh thu.
