# Money

Hiển thị số tiền VND với chữ số đều (`tabular-nums`), đậm ở cỡ `lg`/`xl`, dấu chấm nghìn và `₫`.

- `value` (số, đồng), `size` `md`/`lg`/`xl`, `tone` `brand`/`accent`/`danger`/`success`, `strike` cho giá gốc, `sign` thêm dấu + cho số dương.
- Số âm hiển thị dấu trừ thật (−). Dùng `CanteenPOS.formatVND(n)` khi cần chuỗi.
