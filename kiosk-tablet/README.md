# Canteen Kiosk tự phục vụ

Kiosk tablet dọc 834×1194: nhận diện khuôn mặt / QR điện thoại / thẻ, chọn món bằng tài khoản.

Mở `index.html` bằng trình duyệt là chạy được (React đã kèm trong `js/vendor/`, font Roboto tải từ Google Fonts, không có mạng sẽ dùng font hệ thống).

```
kiosk-tablet/
├── index.html
├── css/
│   ├── tokens.css        # màu, khoảng cách, bo góc, font — sinh từ design-system/tokens.json
│   ├── components.css    # style component dùng chung
│   └── app.css           # bố cục riêng của giao diện này
└── js/
    ├── vendor/           # React 18 + ReactDOM 18
    ├── components.js     # thư viện component window.CanteenPOS
    └── app.js            # màn hình, luồng và dữ liệu mẫu của giao diện này
```

Giao diện không còn nút mô phỏng: camera, đầu đọc thẻ và điện thoại được app thật điều khiển qua `window.CanteenKiosk`. Muốn chạy thử bằng nút mô phỏng thì mở `index.html?demo`.

## Ghép vào app thật

```js
// cấu hình (tùy chọn)
CanteenKiosk.config({
  kiosk: { name: 'Kiosk K1', counter: '2' },
  menu: [...],                                  // { code, name, desc, price, cat, soldout?, stock?, promoPct?, group?, al? }
  queue: 34,                                    // số đơn đang chờ → thời gian cộng thêm cho sinh viên
  verifyPin: (person, pin) => api.verifyPin(person.id, pin),   // Promise<boolean>
  pay: order => api.pay(order)                  // Promise<{ bonus, real, pickup? }>
});

// camera hiển thị trong khung
navigator.mediaDevices.getUserMedia({ video: true }).then(CanteenKiosk.camera);

// bộ nhận diện khuôn mặt
CanteenKiosk.face({ status: 'scanning' });
CanteenKiosk.face({ status: 'found', person });   // hoặc 'fail' | 'multi' | 'idle'

// đầu đọc thẻ / QR học sinh
CanteenKiosk.card(person, 'card');                // hoặc 'qr'

// đăng nhập bằng điện thoại (Ví Canteen quét mã QR trên kiosk)
CanteenKiosk.on('loginCode', code => api.registerKioskCode(code));
CanteenKiosk.phone({ status: 'scanned', person }); // rồi 'approved' hoặc 'rejected'

// sự kiện kiosk phát ra
CanteenKiosk.on('confirmed', ({ person, method }) => {});
CanteenKiosk.on('paid', order => {});
CanteenKiosk.on('cancel', person => {});  CanteenKiosk.on('logout', person => {});
CanteenKiosk.on('retry', () => {});
```

`person = { id, name, roleLabel, klass, real, bonus, limit?: { used, max }, blocked?: [nhóm món], score?, uni? }`. `score` dưới 90 bắt nhập PIN; hết 30 giây chưa xác nhận thì kiosk tự hủy.
