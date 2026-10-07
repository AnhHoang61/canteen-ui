# Field

Ô nhập có nhãn, gợi ý và lỗi — dùng cho đăng nhập, tiền đầu ca, lý do hoàn/hủy.

- `label`, `hint`, `error`, `icon`, `suffix` (vd `₫`), `numeric` (căn phải, chữ số đều). Ô là thẻ trắng không viền, giá trị in đậm; trong panel trắng nền ô chuyển `surface-sunken`.
- `as`: `input` | `select` (truyền `options`) | `textarea`.
- Lỗi thay gợi ý và đổi viền sang `danger`.
