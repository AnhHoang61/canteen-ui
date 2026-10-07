# Canteen POS — Design system

Nguồn gốc chung của cả 3 giao diện.

- `BRAND-BOOK.md` — nguyên tắc, màu, chữ, bố cục, quy tắc nghiệp vụ hiển thị.
- `tokens.json` / `tokens.css` — design token.
- `components/bundle.js`, `bundle.css`, `index.d.ts` — thư viện component `window.CanteenPOS` (React 18).
- `components/<Tên>/README.md` + `preview.html` — hướng dẫn và bản xem trước từng component, kể cả các màn hình mẫu `Screen*`.

Khi sửa token hoặc component ở đây, chép `tokens.css`, `components/bundle.css` → `css/components.css` và `components/bundle.js` → `js/components.js` sang từng thư mục giao diện.
