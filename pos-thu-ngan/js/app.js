(function () {
  var C = window.CanteenPOS, h = React.createElement, useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;
  var fmt = C.formatVND;

  /* ---------------- Dữ liệu mẫu ---------------- */
  var MENU = [
    { code: 'C01', name: 'Cơm gà xối mỡ', price: 35000, cat: 'com', stock: 24, cost: 21000 },
    { code: 'C02', name: 'Cơm rang dưa bò', price: 38000, cat: 'com', stock: 18, cost: 23000 },
    { code: 'C05', name: 'Cơm sườn nướng', price: 38000, cat: 'com', stock: 0, cost: 22000 },
    { code: 'B03', name: 'Bún bò Huế', price: 40000, cat: 'bun', promo: '−10%', promoPct: 10, stock: 15, cost: 26000 },
    { code: 'B04', name: 'Phở gà', price: 35000, cat: 'bun', stock: 20, cost: 21000 },
    { code: 'A07', name: 'Bánh mì trứng', price: 15000, cat: 'an', stock: 3, cost: 8000 },
    { code: 'A09', name: 'Khoai tây chiên', price: 20000, cat: 'an', group: 'Đồ chiên rán', stock: 30, cost: 10000 },
    { code: 'A10', name: 'Xôi xéo', price: 20000, cat: 'an', stock: 12, cost: 11000 },
    { code: 'N01', name: 'Trà đào', price: 15000, cat: 'nuoc', stock: 40, cost: 6000 },
    { code: 'N02', name: 'Coca-Cola lon', price: 12000, cat: 'nuoc', group: 'Nước ngọt có ga', stock: 48, cost: 7000 },
    { code: 'N05', name: 'Sữa tươi ít đường', price: 10000, cat: 'nuoc', stock: 36, cost: 6500 },
    { code: 'N06', name: 'Nước cam', price: 18000, cat: 'nuoc', stock: 14, cost: 9000 },
    { code: 'T01', name: 'Sữa chua', price: 8000, cat: 'trang', stock: 50, cost: 4500 },
    { code: 'T03', name: 'Hoa quả dầm', price: 20000, cat: 'trang', stock: 10, cost: 11000 }
  ];
  var SUPPLIERS = ['Bếp trung tâm', 'Đại lý nước giải khát Hải Hà', 'Lò bánh mì Thành Công', 'Sữa Mộc Châu — NPP Ba Đình', 'Khác'];
  var GROUPS = ['Không hạn chế', 'Đồ chiên rán', 'Nước ngọt có ga', 'Đồ ngọt nhiều đường'];
  var CATS = [{ id: 'all', label: 'Tất cả' }, { id: 'com', label: 'Cơm & món chính', prefix: 'C' }, { id: 'bun', label: 'Bún / Phở', prefix: 'B' }, { id: 'an', label: 'Ăn vặt', prefix: 'A' }, { id: 'nuoc', label: 'Đồ uống', prefix: 'N' }, { id: 'trang', label: 'Tráng miệng', prefix: 'T' }];
  function addCat(label) {
    var plain = label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'D').toUpperCase().replace(/[^A-Z]/g, '');
    var used = CATS.map(function (c) { return c.prefix; });
    var prefix = plain.split('').filter(function (ch) { return used.indexOf(ch) < 0; })[0] || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(function (ch) { return used.indexOf(ch) < 0; })[0];
    var c = { id: 'cat' + Date.now().toString(36), label: label, prefix: prefix };
    CATS.push(c); return c;
  }
  var BUYERS = {
    'HS-208317': { id: 'HS-208317', name: 'Trần Minh Khôi', role: 'student', klass: 'Lớp 8A3', real: 42000, bonus: 10000, limit: { used: 12000, max: 60000 }, blocked: ['Nước ngọt có ga', 'Đồ chiên rán'] },
    'GV-0451': { id: 'GV-0451', name: 'Phạm Thu Hà', role: 'teacher', real: 315000, bonus: 20000 },
    'SV-K20-118': { id: 'SV-K20-118', name: 'Lê Gia Bảo', role: 'university', klass: 'SV K20', real: 18000, bonus: 5000 }
  };
  var OFFLINE_WALLET_LIMIT = 30000;
  var SEED_ORDERS = [
    { id: 'DH-0401', time: '06:52', buyer: 'Khách lẻ', lines: [{ code: 'A07', name: 'Bánh mì trứng', price: 15000, qty: 2 }], total: 30000, pay: { cash: 30000 } },
    { id: 'DH-0402', time: '07:05', buyer: 'Phạm Thu Hà · GV-0451', buyerId: 'GV-0451', lines: [{ code: 'B04', name: 'Phở gà', price: 35000, qty: 1 }, { code: 'N01', name: 'Trà đào', price: 15000, qty: 1 }], total: 50000, pay: { bonus: 10000, real: 40000 } },
    { id: 'DH-0403', time: '07:18', buyer: 'Khách lẻ', lines: [{ code: 'C01', name: 'Cơm gà xối mỡ', price: 35000, qty: 1 }], total: 35000, pay: { qr: 35000 } },
    { id: 'DH-0404', time: '07:31', buyer: 'Trần Minh Khôi · HS-208317', buyerId: 'HS-208317', lines: [{ code: 'A10', name: 'Xôi xéo', price: 20000, qty: 1 }], total: 20000, pay: { real: 20000 } }
  ];
  var SEED_PRE = [
    { code: 'K-0151', source: 'kiosk', buyer: 'Lê Gia Bảo · SV K20 · ví thiếu', status: 'cash', pickupAt: '11:20', counter: '2', cashDue: 12000, cashNote: 'Ví thiếu — thu thêm tiền mặt', items: [{ qty: 1, name: 'Bún bò Huế' }, { qty: 1, name: 'Trà đào' }] },
    { code: 'APP-1190', source: 'app', buyer: 'Đặng Thu Trang · 11B3', status: 'cash', pickupAt: '11:35', counter: '2', cashDue: 53000, cashNote: 'Chọn trả tiền mặt khi nhận', items: [{ qty: 1, name: 'Cơm rang dưa bò' }, { qty: 1, name: 'Nước cam' }] },
    { code: 'APP-1191', source: 'app', buyer: 'Vũ Minh Anh · 9A2', status: 'new', pickupAt: '11:45', counter: '2', eta: '11:45', items: [{ qty: 1, name: 'Phở gà' }, { qty: 1, name: 'Trà đào' }] },
    { code: 'APP-1187', source: 'app', uni: true, buyer: 'Lê Gia Bảo · SV K20', status: 'new', pickupAt: '11:30', counter: '2', items: [{ qty: 1, name: 'Cơm sườn nướng' }, { qty: 1, name: 'Nước cam' }] },
    { code: 'LOP-10A2', source: 'class', buyer: 'Lớp 10A2 — GVCN Đỗ Thảo', status: 'preparing', pickupAt: '11:00', counter: '3', items: [{ qty: 38, name: 'Suất trưa tiêu chuẩn' }, { qty: 2, name: 'Suất chay' }] },
    { code: 'APP-1183', source: 'app', uni: true, buyer: 'Nguyễn Hải Yến · SV K19', status: 'preparing', pickupAt: '11:15', counter: '1', items: [{ qty: 2, name: 'Bún chả' }] },
    { code: 'APP-1176', source: 'app', buyer: 'Hoàng Đức · 12C1', status: 'ready', pickupAt: '10:50', counter: '2', items: [{ qty: 1, name: 'Cơm gà xối mỡ' }] }
  ];
  var BACKLOG = 37; // đơn đang chờ ở các quầy khác (mô phỏng tải)

  function now() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function addMin(hhmm, m) { var p = hhmm.split(':'), t = (+p[0]) * 60 + (+p[1]) + m; return ('0' + Math.floor(t / 60) % 24).slice(-2) + ':' + ('0' + t % 60).slice(-2); }
  function etaAdd(n) { return n <= 30 ? 20 : n < 50 ? 30 : 35; }
  function lineTotal(lines) { return lines.reduce(function (s, l) { return s + l.price * l.qty; }, 0); }
  function promoOf(lines) { return lines.reduce(function (s, l) { var m = MENU.filter(function (x) { return x.code === l.code; })[0]; return s + (m && m.promoPct ? Math.round(l.price * l.qty * m.promoPct / 100) : 0); }, 0); }
  function payLabel(p) {
    var parts = [];
    if (p.bonus) parts.push('thưởng ' + fmt(p.bonus)); if (p.real) parts.push('ví ' + fmt(p.real));
    if (p.cash) parts.push('tiền mặt ' + fmt(p.cash)); if (p.qr) parts.push('QR ' + fmt(p.qr)); if (p.qrPending) parts.push('QR chờ xác minh ' + fmt(p.qrPending));
    return parts.join(' · ');
  }

  /* ---------------- Toast ---------------- */
  function Toast(props) {
    if (!props.toast) return null;
    return h('div', { className: 'pt-toast', role: 'status' }, h(C.Icon, { name: props.toast.icon || 'check' }), props.toast.text);
  }

  /* ---------------- Đăng nhập & mở ca ---------------- */
  function Login(props) {
    var s1 = useState('NV0123'), s2 = useState('123456'), s3 = useState('Quầy 2 — Cơm & món chính'), s4 = useState('Ca sáng 06:30–10:30'), s5 = useState('1000000'), s6 = useState('Canteen A — Nhà ăn chính');
    var err = s2[0].length < 4 ? 'PIN tối thiểu 4 số' : null;
    function step(n, title, body) {
      return h('div', { className: 'pt-step' }, h('span', { className: 'pt-step-n' }, n), h('div', { className: 'cp-stack' }, h('div', { className: 'cp-h2' }, title), body));
    }
    function submit(e) {
      e.preventDefault(); if (err) return;
      props.onOpen({ staff: 'Nguyễn Thị Lan', staffId: s1[0], canteen: s6[0], counter: s3[0].split(' — ')[0].replace('Quầy ', ''), counterName: s3[0], shift: s4[0].replace('Ca ', '').replace(/^s/, 'S').replace(/^t/, 'T').replace(/^c/, 'C'), opening: Number(s5[0] || 0), openedAt: now() });
    }
    return h('div', { className: 'pt-login' },
      h('aside', { className: 'pt-login-side' },
        h('div', { className: 'pt-login-brand' }, 'Canteen ', h('span', null, 'POS')),
        h('div', null,
          h('div', { className: 'pt-clock cp-num' }, now()),
          h('div', { className: 'pt-login-date' }, new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })),
          h('div', { className: 'pt-login-dev' }, 'Thiết bị: POS-A-02 · Bản dùng thử, dữ liệu mẫu'),
          h('div', { className: 'pt-login-shifts', 'aria-label': 'Lịch ca hôm nay' }, [['Ca sáng', '06:30–10:30', 'NV Lan · Quầy 2'], ['Ca trưa', '10:30–14:00', 'NV Tùng · Quầy 2'], ['Ca chiều', '14:00–18:00', 'NV Mai · Quầy 1']].map(function (c) {
            return h('div', { key: c[0], className: s4[0].indexOf(c[0].toLowerCase().replace('ca ', '')) >= 0 ? 'is-now' : '' }, h('span', null, c[0] + ' · ' + c[1]), h('small', null, c[2]));
          })))),
      h('form', { className: 'pt-login-main', onSubmit: submit },
        h('div', { className: 'pt-login-form' },
          h('div', null, h('h1', { className: 'cp-h' }, 'Đăng nhập & mở ca'), h('p', { className: 'cp-muted', style: { margin: '4px 0 0' } }, 'Dùng tài khoản nhân viên được Canteen cấp.')),
          step(1, 'Tài khoản nhân viên', h('div', { className: 'pt-2col' },
            h(C.Field, { id: 'f-staff', label: 'Mã nhân viên', icon: 'user', value: s1[0], onChange: function (e) { s1[1](e.target.value); } }),
            h(C.Field, { id: 'f-pin', label: 'Mật khẩu / PIN', icon: 'lock', type: 'password', value: s2[0], error: err, onChange: function (e) { s2[1](e.target.value); } }))),
          step(2, 'Canteen & quầy bán', h('div', { className: 'pt-2col' },
            h(C.Field, { id: 'f-canteen', label: 'Canteen', as: 'select', value: s6[0], onChange: function (e) { s6[1](e.target.value); }, options: ['Canteen A — Nhà ăn chính', 'Canteen B — Khu ký túc'] }),
            h(C.Field, { id: 'f-counter', label: 'Quầy', as: 'select', value: s3[0], onChange: function (e) { s3[1](e.target.value); }, options: ['Quầy 2 — Cơm & món chính', 'Quầy 1 — Đồ uống', 'Quầy 3 — Suất tập thể'] }))),
          step(3, 'Mở ca', h('div', { className: 'cp-stack' },
            h('div', { className: 'pt-2col', style: { alignItems: 'start' } },
              h(C.Field, { id: 'f-shift', label: 'Ca làm việc', as: 'select', value: s4[0], onChange: function (e) { s4[1](e.target.value); }, options: ['Ca sáng 06:30–10:30', 'Ca trưa 10:30–14:00', 'Ca chiều 14:00–18:00'] }),
              h(C.Field, { id: 'f-open', label: 'Tiền mặt đầu ca', numeric: true, suffix: '₫', value: s5[0] ? Number(s5[0]).toLocaleString('vi-VN') : '', onChange: function (e) { s5[1](e.target.value.replace(/\D/g, '')); }, hint: 'Đếm két và nhập đúng số thực tế' })),
            h(C.InlineNote, { tone: 'info' }, 'Hệ thống ghi nhận ' + s1[0] + ' · ' + s3[0].split(' — ')[0] + ' · ' + now() + ' làm mốc mở ca.'))),
          h('div', { className: 'pt-login-cta' }, h(C.Button, { type: 'submit', size: 'lg', icon: 'check' }, 'Mở ca và bắt đầu bán')))));
  }

  /* ---------------- Màn bán hàng ---------------- */
  function Sell(props) {
    var app = props.app, cart = app.cart, buyer = app.buyer;
    var cat = useState('all'), q = useState('');
    var student = buyer && buyer.role === 'student';
    var items = MENU.filter(function (m) { return (cat[0] === 'all' || m.cat === cat[0]) && (!q[0] || (m.name + ' ' + m.code).toLowerCase().indexOf(q[0].toLowerCase()) >= 0); });
    var qty = {}; cart.forEach(function (l) { qty[l.code] = l.qty; });
    var sub = lineTotal(cart), promo = promoOf(cart), total = sub - promo;
    var cats = CATS.map(function (c) { return { id: c.id, label: c.label, count: c.id === 'all' ? MENU.length : MENU.filter(function (m) { return m.cat === c.id; }).length }; });
    var idState = useState('idle');

    function identify(id) {
      idState[1]('reading');
      setTimeout(function () { idState[1]('idle'); props.setBuyer(Object.assign({ method: id.indexOf('GV') === 0 ? 'qr' : id.indexOf('SV') === 0 ? 'bio' : 'card' }, BUYERS[id])); }, 600);
    }
    var buyerBlock;
    if (buyer === null) {
      buyerBlock = h('div', { className: 'cp-panel cp-stack' },
        h('div', { className: 'cp-row', style: { justifyContent: 'space-between' } }, h('span', { className: 'cp-h2' }, 'Định danh người mua'), h(C.Button, { variant: 'ghost', size: 'sm', onClick: function () { props.setBuyer('guest'); } }, 'Hủy')),
        h(C.IdentifyPanel, { state: idState[0], onGuest: function () { props.setBuyer('guest'); } }),
        h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng đầu đọc'),
          h('div', { className: 'cp-row' },
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'card', onClick: function () { identify('HS-208317'); } }, 'Thẻ HS Khôi'),
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'qr', onClick: function () { identify('GV-0451'); } }, 'QR GV Hà'),
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'face', onClick: function () { identify('SV-K20-118'); } }, 'Sinh trắc SV Bảo'))));
    } else if (buyer === 'guest') {
      buyerBlock = h(C.BuyerCard, { role: 'guest' });
    } else {
      var limLeft = buyer.limit ? buyer.limit.max - buyer.limit.used : Infinity;
      buyerBlock = h(C.BuyerCard, Object.assign({ compact: true }, buyer, { code: buyer.id }),
        h('div', { className: 'cp-row', style: { justifyContent: 'space-between' } },
          buyer.limit && total > limLeft ? h(C.InlineNote, { tone: 'danger' }, 'Đơn vượt hạn mức hôm nay') : h('span'),
          h(C.Button, { variant: 'ghost', size: 'sm', icon: 'x', onClick: function () { props.setBuyer('guest'); } }, 'Bỏ người mua')));
    }

    var canWallet = buyer && buyer !== 'guest' && cart.length;
    return h('div', { className: 'cp-pos pt-pos' },
      h('div', { className: 'cp-pos-main' },
        h('div', { className: 'cp-search' },
          h(C.Field, { id: 'f-search', icon: 'search', placeholder: 'Tìm món theo tên hoặc mã (VD: C01)', value: q[0], onChange: function (e) { q[1](e.target.value); } })),
        h(C.CategoryTabs, { items: cats, active: cat[0], onChange: cat[1] }),
        h('div', { className: 'cp-menu-grid pt-grid' }, items.map(function (m) {
          var left = m.stock != null ? m.stock - (qty[m.code] || 0) : null;
          var st = m.status === 'soldout' || left <= 0 ? 'soldout' : student && m.group && buyer.blocked.indexOf(m.group) >= 0 ? 'blocked' : left != null && left <= 5 ? 'low' : 'available';
          return h(C.MenuItemCard, { key: m.code, image: m.image || null, code: m.code, name: m.name, price: m.price, promo: m.promo, status: st, stockLeft: left, qty: qty[m.code] || 0, blockedReason: 'Chặn với HS', onAdd: function () { props.add(m); } });
        }), items.length ? null : h('div', { className: 'cp-muted' }, 'Không tìm thấy món phù hợp.'))),
      h('div', { className: 'cp-pos-side' },
        buyerBlock,
        h(C.OrderCart, {
          orderCode: app.offline ? 'OFF-' + String(app.offSeq).padStart(4, '0') : 'DH-' + String(app.seq).padStart(4, '0'),
          staff: app.shift.staff.split(' ').pop(), counter: app.shift.counter, createdAt: now() + ' · ' + new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          lines: cart, onQty: props.qty, discount: promo ? { label: 'KM bún bò −10%', amount: promo } : null,
          badge: app.offline ? h(C.StatusBadge, { tone: 'warning', icon: 'wifiOff' }, 'Offline') : cart.length ? h(C.Button, { variant: 'ghost', size: 'sm', onClick: props.clear }, 'Xóa đơn') : null
        },
          canWallet ? h(C.Button, { size: 'lg', block: true, icon: 'wallet', onClick: function () { props.pay('wallet'); } }, app.offline ? 'Trừ ví offline (≤ ' + fmt(OFFLINE_WALLET_LIMIT) + ')' : 'Thanh toán bằng ví') : null,
          h('div', { className: 'pt-2col' },
            h(C.Button, { variant: canWallet ? 'secondary' : 'primary', icon: 'cash', size: canWallet ? 'md' : 'lg', disabled: !cart.length, onClick: function () { props.pay('cash'); } }, 'Tiền mặt'),
            h(C.Button, { variant: 'secondary', icon: 'qr', size: canWallet ? 'md' : 'lg', disabled: !cart.length, onClick: function () { props.pay('qr'); } }, app.offline ? 'QR (chờ xác minh)' : 'QR')))));
  }

  /* ---------------- Hộp thoại thanh toán ---------------- */
  function PayDialog(props) {
    var app = props.app, mode = props.mode, total = props.total, buyer = app.buyer, orderCode = props.orderCode;
    var qrState = useState(app.offline ? 'offline' : 'pending'), issue = useState(null), elapsed = useState(0);
    var supp = useState('cash');
    useEffect(function () { if (mode !== 'qr' && !(mode === 'wallet')) return; var t = setInterval(function () { elapsed[1](function (x) { return x + 1; }); }, 1000); return function () { clearInterval(t); }; }, []);
    var mmss = '00:' + ('0' + (elapsed[0] % 60)).slice(-2);
    var title, body, foot = null;

    if (mode === 'cash') {
      title = 'Thanh toán tiền mặt' + (buyer && buyer !== 'guest' ? ' — ' + buyer.name : ' — khách lẻ');
      body = h(C.CashPayment, { layout: 'wide', total: total, shift: app.shift.shift, staff: 'NV ' + app.shift.staff.split(' ').pop(), onConfirm: function (given) { props.done({ cash: total }, 'Đã nhận ' + fmt(given) + ' · trả lại ' + fmt(given - total)); } });
    } else if (mode === 'qr') {
      title = 'Thanh toán QR ngân hàng';
      var st = qrState[0];
      body = h('div', { className: 'cp-stack', style: { gap: 20 } },
        h(C.QRPayment, { total: total, orderCode: orderCode, state: st, elapsed: st === 'pending' ? mmss : null, issue: issue[0] },
          st === 'success' ? h(C.Button, { size: 'lg', icon: 'check', onClick: function () { props.done({ qr: total }, 'QR đã kiểm chứng · ' + fmt(total)); } }, 'Hoàn tất đơn')
          : st === 'offline' ? h(C.Button, { size: 'lg', icon: 'clock', onClick: function () { props.done({ qrPending: total }, 'Đã lưu đơn — QR chờ xác minh khi có mạng', 'clock'); } }, 'Lưu đơn, chờ xác minh')
          : st === 'check' ? h('div', { className: 'cp-row' }, h(C.Button, { variant: 'secondary', icon: 'receipt', onClick: function () { props.flag(orderCode, total, issue[0]); } }, 'Chuyển tra soát & đóng'), h(C.Button, { variant: 'ghost', icon: 'undo', onClick: function () { qrState[1]('pending'); issue[1](null); elapsed[1](0); } }, 'Tạo lại QR'))
          : h(C.InlineNote, null, 'Khách quét xong vẫn phải chờ ngân hàng báo về — không có nút "đánh dấu đã trả".')),
        st === 'pending' ? h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng phản hồi từ ngân hàng'),
          h('div', { className: 'cp-row' },
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'check', onClick: function () { qrState[1]('success'); } }, 'Khớp số tiền & mã đơn'),
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'alert', onClick: function () { issue[1]('Nhận ' + fmt(total - 5000) + ' — lệch 5.000 ₫ so với đơn. Không xác nhận; chuyển tra soát.'); qrState[1]('check'); } }, 'Sai số tiền'),
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'alert', onClick: function () { issue[1]('Giao dịch trùng với mã đơn đã thanh toán trước đó. Không ghi nhận lần hai.'); qrState[1]('check'); } }, 'Giao dịch trùng'),
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'alert', onClick: function () { issue[1]('Có tiền về ' + fmt(total) + ' nhưng nội dung CK không chứa mã ' + orderCode + '.'); qrState[1]('check'); } }, 'Chưa khớp đơn'))) : null);
    } else {
      // ví
      var bonusUse = Math.min(buyer.bonus, total), realUse = Math.min(buyer.real, total - bonusUse), short = total - bonusUse - realUse;
      var limLeft = buyer.limit ? buyer.limit.max - buyer.limit.used : Infinity;
      var walletUse = bonusUse + realUse, overLimit = buyer.limit && walletUse > limLeft;
      if (overLimit) { var cap = limLeft; bonusUse = Math.min(buyer.bonus, cap); realUse = Math.min(buyer.real, cap - bonusUse); short = total - bonusUse - realUse; walletUse = bonusUse + realUse; }
      var offCap = app.offline && walletUse > OFFLINE_WALLET_LIMIT;
      if (offCap) { bonusUse = Math.min(buyer.bonus, OFFLINE_WALLET_LIMIT); realUse = Math.min(buyer.real, OFFLINE_WALLET_LIMIT - bonusUse); short = total - bonusUse - realUse; }
      var blockedHit = buyer.role === 'student' && app.cart.some(function (l) { var m = MENU.filter(function (x) { return x.code === l.code; })[0]; return m.group && buyer.blocked.indexOf(m.group) >= 0; });
      title = 'Thanh toán bằng ví';
      var row = function (label, v, tone, sub) { return h('div', { className: 'pt-split-row' }, h('span', null, label, sub ? h('small', null, sub) : null), h(C.Money, { value: v, tone: tone })); };
      body = h('div', { className: 'pt-wallet' },
        h(C.BuyerCard, Object.assign({}, buyer, { code: buyer.id })),
        h('div', { className: 'cp-stack' },
          h('div', { className: 'cp-due' }, h('span', { className: 'cp-h2' }, 'Phải thu'), h(C.Money, { value: total, size: 'lg' })),
          blockedHit ? h(C.StatusBadge, { tone: 'danger' }, 'Đơn có món bị chặn') : h(C.StatusBadge, { tone: overLimit ? 'warning' : 'success' }, overLimit ? 'Chạm hạn mức — chỉ trừ ví ' + fmt(limLeft) : 'Không có món bị chặn' + (buyer.limit ? ' · trong hạn mức' : '')),
          offCap ? h(C.InlineNote, null, 'Offline: ví chỉ trừ tối đa ' + fmt(OFFLINE_WALLET_LIMIT) + ' mỗi giao dịch') : null,
          h('div', null,
            row('Trừ tiền thưởng', -bonusUse, 'accent', 'Ưu tiên dùng trước theo chính sách Canteen'),
            row('Trừ tiền thật', -realUse, null, 'Còn lại ' + fmt(buyer.real - realUse))),
          short > 0 ? h('div', { className: 'cp-change is-short' }, h('label', null, h(C.Icon, { name: 'alert' }), 'Còn thiếu — thu bổ sung'), h(C.Money, { value: short, size: 'lg' })) : null,
          short > 0 ? h('div', { className: 'pt-2col' },
            h(C.Button, { variant: 'secondary', icon: 'cash', className: supp[0] === 'cash' ? 'pt-on' : '', onClick: function () { supp[1]('cash'); } }, 'Bổ sung tiền mặt'),
            h(C.Button, { variant: 'secondary', icon: 'qr', className: supp[0] === 'qr' ? 'pt-on' : '', onClick: function () { supp[1]('qr'); } }, app.offline ? 'Bổ sung QR (chờ XM)' : 'Bổ sung QR')) : null));
      var pay = { bonus: bonusUse, real: realUse };
      if (short > 0) { if (supp[0] === 'cash') pay.cash = short; else if (app.offline) pay.qrPending = short; else pay.qr = short; }
      foot = h('div', { className: 'pt-dialog-foot' },
        h('div', { className: 'cp-note' }, h(C.Icon, { name: 'receipt', size: 14 }), 'Biên lai tách: ' + payLabel(pay)),
        h(C.Button, { size: 'lg', icon: 'check', disabled: blockedHit, onClick: function () { props.done(pay, 'Đã trừ ví ' + fmt(bonusUse + realUse) + (short > 0 ? ' · thu thêm ' + fmt(short) : '')); } },
          short > 0 ? 'Trừ ví & thu ' + fmt(short) + (supp[0] === 'cash' ? ' tiền mặt' : ' qua QR') : 'Trừ ví ' + fmt(total)));
      if (short > 0 && supp[0] === 'qr' && !app.offline) {
        foot = h('div', { className: 'pt-dialog-foot' }, h(C.InlineNote, { tone: 'info' }, 'Phần thiếu sẽ thu qua QR: trừ ví trước, đơn hoàn tất khi QR được kiểm chứng.'),
          h(C.Button, { size: 'lg', icon: 'qr', onClick: function () { props.walletThenQr({ bonus: bonusUse, real: realUse }, short); } }, 'Trừ ví & tạo QR ' + fmt(short)));
      }
    }
    return h('div', { className: 'cp-scrim pt-scrim', onClick: function (e) { if (e.target === e.currentTarget) props.close(); } },
      h('div', { className: 'cp-dialog pt-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
        h('div', { className: 'cp-dialog-head' }, h('h2', { className: 'cp-h' }, title), h(C.Button, { variant: 'ghost', icon: 'x', 'aria-label': 'Đóng', onClick: props.close })),
        body, foot));
  }

  /* ---------------- Đơn hàng (đặt trước / kiosk / suất lớp) ---------------- */
  function Preorders(props) {
    var list = props.list, filter = useState('all');
    var waiting = BACKLOG + list.filter(function (t) { return t.status === 'new' || t.status === 'preparing'; }).length;
    var add = etaAdd(waiting);
    var shown = list.filter(function (t) { return filter[0] === 'all' || t.source === filter[0]; });
    function col(title, st, tone) {
      var l = shown.filter(function (t) { return t.status === st; });
      return h('div', { className: 'pt-col' },
        h('div', { className: 'cp-row', style: { justifyContent: 'space-between' } }, h('span', { className: 'cp-h2' }, title), h(C.StatusBadge, { tone: tone }, l.length + ' đơn')),
        h('div', { className: 'pt-col-list' }, l.length ? l.map(function (t) {
          return h(C.PreorderTicket, Object.assign({ key: t.code }, t, { eta: t.uni && st !== 'ready' ? '+' + add + '′ → ' + addMin(t.pickupAt, add) : t.eta, onNext: function () { props.next(t.code); } }));
        }) : h('div', { className: 'pt-empty' }, 'Không có đơn')));
    }
    function rule(range, v) { return h('div', { className: 'pt-rule' + (v === add ? ' is-on' : '') }, h('small', null, range), h('b', { className: 'cp-num' }, '+' + v + '′')); }
    return h('div', { className: 'pt-page' },
      h('div', { className: 'cp-panel pt-pre-head' },
        h('div', { style: { flex: 1, minWidth: 240 } },
          h('h1', { className: 'cp-h' }, 'Đơn hàng'),
          h('div', { className: 'cp-muted' }, 'Đang chờ toàn Canteen: ', h('strong', { className: 'cp-num', style: { color: 'var(--ink)' } }, waiting + ' đơn'), ' · cộng thêm cho sinh viên (cấp Đại học)')),
        h('div', { className: 'pt-rules' }, rule('≤ 30 đơn', 20), rule('30 – 50 đơn', 30), rule('≥ 50 đơn', 35)),
        h(C.CategoryTabs, { items: [{ id: 'all', label: 'Tất cả', count: list.length }, { id: 'app', label: 'Từ app', count: list.filter(function (t) { return t.source === 'app'; }).length }, { id: 'kiosk', label: 'Từ kiosk', count: list.filter(function (t) { return t.source === 'kiosk'; }).length }, { id: 'class', label: 'Suất tập thể', count: list.filter(function (t) { return t.source === 'class'; }).length }], active: filter[0], onChange: filter[1] })),
      h('div', { className: 'pt-board' }, col('Cần thanh toán tiền mặt', 'cash', 'accent'), col('Mới nhận', 'new', 'info'), col('Đang chuẩn bị', 'preparing', 'warning'), col('Sẵn sàng giao', 'ready', 'success')),
      h('div', { className: 'pt-demo', style: { alignSelf: 'start' } }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng'),
        h('div', { className: 'cp-row' },
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'plus', onClick: props.incoming }, 'Đơn mới từ app'),
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'cash', onClick: props.incomingCash }, 'Đơn kiosk thiếu tiền ví'),
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'users', onClick: props.incomingClass }, 'Suất tập thể lớp mới'))));
  }

  /* ---------------- Hoàn / hủy ---------------- */
  function Refund(props) {
    var orders = props.orders;
    var q = useState(''), sel = useState(null), picks = useState({}), reason = useState(''), method = useState('wallet'), note = useState('');
    var found = orders.filter(function (o) { return !q[0] || (o.id + ' ' + o.buyer).toLowerCase().indexOf(q[0].toLowerCase()) >= 0; });
    var o = orders.filter(function (x) { return x.id === sel[0]; })[0];
    var amount = o ? o.lines.reduce(function (s, l, i) { return s + (picks[0][i] ? l.price * l.qty : 0); }, 0) : 0;
    if (o && amount > o.total) amount = o.total;
    var hasWallet = o && (o.pay.bonus || o.pay.real);
    var needApprove = amount > 50000;
    var bonusPart = o && hasWallet ? Math.round(amount * (o.pay.bonus || 0) / o.total) : 0;
    // mở tab: tự mở đơn hoàn thành mới nhất
    useEffect(function () { if (!sel[0] && orders.length) pick(orders[orders.length - 1].id); }, []);
    function pick(id) { sel[1](id); var p = {}; var ord = orders.filter(function (x) { return x.id === id; })[0]; ord.lines.forEach(function (_, i) { p[i] = true; }); picks[1](p); method[1]((ord.pay.bonus || ord.pay.real) ? 'wallet' : ord.pay.cash ? 'cash' : 'bank'); reason[1](''); }
    function radio(id, label, sub, disabled) {
      return h('label', { className: 'pt-radio' + (method[0] === id ? ' is-on' : '') + (disabled ? ' is-off' : '') },
        h('input', { type: 'radio', name: 'rf-method', id: 'rf-' + id, checked: method[0] === id, disabled: disabled, onChange: function () { method[1](id); } }),
        h('span', null, h('strong', null, label), h('small', null, sub)));
    }
    return h('div', { className: 'pt-page pt-refund' },
      h('div', { className: 'cp-panel cp-stack' },
        h('h1', { className: 'cp-h' }, 'Đơn đã hoàn thành'),
        h('div', { className: 'cp-muted' }, orders.length + ' đơn trong ca · mới nhất ở trên · chọn đơn để xem chi tiết, hoàn hoặc hủy'),
        h(C.Field, { id: 'rf-q', icon: 'search', placeholder: 'Mã đơn hoặc tên người mua', value: q[0], onChange: function (e) { q[1](e.target.value); }, hint: 'Phạm vi quyền: ' + props.shift.canteen.split(' — ')[0] + ' · ca hiện tại · Quầy 1–3' }),
        h('div', { className: 'pt-order-list' }, found.length ? found.slice().reverse().map(function (x) {
          return h('button', { key: x.id, type: 'button', className: 'pt-order' + (x.id === sel[0] ? ' is-on' : ''), onClick: function () { pick(x.id); } },
            h('span', { className: 'pt-order-top' }, h('span', { className: 'cp-num', style: { fontWeight: 700 } }, x.id), x.refunded ? h(C.StatusBadge, { tone: 'neutral' }, 'Đã hoàn') : x.flag ? h(C.StatusBadge, { tone: 'danger' }, 'Tra soát') : x.pay.qrPending ? h(C.StatusBadge, { tone: 'warning' }, 'Chờ xác minh') : h(C.StatusBadge, { tone: 'success' }, 'Đã thanh toán')),
            h('span', { className: 'cp-muted' }, x.time + ' · ' + x.buyer),
            h('span', { className: 'pt-order-top' }, h('span', { className: 'cp-muted', style: { fontSize: 13 } }, payLabel(x.pay)), h(C.Money, { value: x.total })));
        }) : h('div', { className: 'pt-empty' }, 'Không có đơn trong phạm vi'))),
      o ? h('div', { className: 'cp-panel cp-stack' },
        h('div', { className: 'cp-row', style: { justifyContent: 'space-between' } }, h('span', { className: 'cp-h2' }, 'Đơn ' + o.id), h('span', { className: 'cp-muted' }, o.time + ' · NV ' + props.shift.staff.split(' ').pop() + ' · Quầy ' + props.shift.counter)),
        o.refunded ? h(C.InlineNote, { tone: 'info' }, 'Đơn đã được hoàn ' + fmt(o.refunded) + ' (' + o.refundReason + ').') : null,
        h('table', { className: 'cp-table' }, h('thead', null, h('tr', null, h('th', null, ''), h('th', null, 'Món'), h('th', { className: 'r' }, 'SL'), h('th', { className: 'r' }, 'Tiền'))),
          h('tbody', null, o.lines.map(function (l, i) {
            return h('tr', { key: i }, h('td', null, h('input', { type: 'checkbox', id: 'rf-l' + i, 'aria-label': l.name, disabled: !!o.refunded, checked: !!picks[0][i], onChange: function () { var p = Object.assign({}, picks[0]); p[i] = !p[i]; picks[1](p); } })), h('td', null, l.name), h('td', { className: 'r cp-num' }, l.qty), h('td', { className: 'r' }, h(C.Money, { value: l.price * l.qty })));
          }))),
        h('div', { className: 'cp-row', style: { justifyContent: 'space-between' } }, h('span', null, 'Tổng đơn · ' + payLabel(o.pay)), h(C.Money, { value: o.total })),
        h('div', { className: 'pt-label', style: { marginTop: 8 } }, 'Hoàn / hủy đơn — chọn món cần hoàn ở bảng trên'),
        h('div', { className: 'cp-due' }, h('span', null, 'Số tiền hoàn'), h(C.Money, { value: amount, size: 'lg' })),
        h(C.Field, { id: 'rf-reason', label: 'Lý do (bắt buộc)', as: 'select', value: reason[0], onChange: function (e) { reason[1](e.target.value); }, options: ['', 'Món lỗi / không đạt chất lượng', 'Nhập sai món', 'Khách đổi ý', 'Món hết sau khi tạo đơn', 'Khác'] }),
        h(C.Field, { id: 'rf-note', label: 'Ghi chú', as: 'textarea', rows: 2, placeholder: 'Mô tả ngắn…', value: note[0], onChange: function (e) { note[1](e.target.value); } }),
        h('div', { className: 'cp-stack', style: { gap: 8 } }, h('div', { className: 'pt-label' }, 'Hoàn về'),
          radio('wallet', 'Ví người mua', hasWallet ? 'Đúng tỷ lệ: thưởng ' + fmt(bonusPart) + ' · thật ' + fmt(amount - bonusPart) : 'Đơn không trả bằng ví', !hasWallet),
          radio('cash', 'Tiền mặt', 'Trừ vào tiền mặt của ca hiện tại', false),
          radio('bank', 'Chuyển khoản', 'Theo phương thức đã duyệt — kế toán xử lý', false)),
        h(C.InlineNote, { tone: needApprove ? 'warn' : 'info' }, needApprove ? 'Hoàn > 50.000 ₫ cần quản lý duyệt — sẽ gửi yêu cầu thay vì hoàn ngay.' : 'Người xử lý: ' + props.shift.staff + ' (' + props.shift.staffId + ').'),
        h('div', { className: 'cp-row', style: { justifyContent: 'flex-end' } },
          h(C.Button, { variant: 'danger', icon: 'undo', size: 'lg', disabled: !amount || !reason[0] || !!o.refunded, onClick: function () { props.refund(o.id, amount, reason[0], method[0], needApprove, bonusPart); } },
            needApprove ? 'Gửi yêu cầu duyệt ' + fmt(amount) : 'Thực hiện hoàn ' + fmt(amount)))) :
        h('div', { className: 'cp-panel pt-empty-panel' }, h(C.Icon, { name: 'receipt', size: 32 }), h('div', null, 'Chọn một đơn bên trái để hoàn hoặc hủy.')));
  }

  /* ---------------- Chốt ca ---------------- */
  var DENOMS = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000];
  function cx2() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function Close(props) {
    var orders = props.orders, sh = props.shift;
    var recv = useState('Phạm Văn Tùng — Ca trưa'), expl = useState(''), done = useState(false), denoms = useState({}), checkSt = useState({});
    var counted = [Object.keys(denoms[0]).some(function (k) { return denoms[0][k] > 0; }) ? DENOMS.reduce(function (t, d) { return t + d * (denoms[0][d] || 0); }, 0) : null];
    function setDen(d, n) { var x = Object.assign({}, denoms[0]); x[d] = Math.max(0, n); denoms[1](x); }
    var sum = function (k) { return orders.reduce(function (s, o) { return s + (o.pay[k] || 0); }, 0); };
    var cnt = function (f) { return orders.filter(f).length; };
    var refunds = orders.filter(function (o) { return o.refunded && !o.refundPending; });
    var cashRefund = refunds.filter(function (o) { return o.refundMethod === 'cash'; }).reduce(function (s, o) { return s + o.refunded; }, 0);
    var data = {
      opening: sh.opening, orders: orders.length,
      wallet: sum('bonus') + sum('real'), walletCount: cnt(function (o) { return o.pay.bonus || o.pay.real; }),
      cash: sum('cash'), cashCount: cnt(function (o) { return o.pay.cash; }),
      qr: orders.filter(function (o) { return !o.flag; }).reduce(function (s, o) { return s + (o.pay.qr || 0); }, 0), qrCount: cnt(function (o) { return o.pay.qr && !o.flag; }),
      qrPending: cnt(function (o) { return o.pay.qrPending || o.flag; }),
      refunds: refunds.reduce(function (s, o) { return s + o.refunded; }, 0), refundCount: refunds.length, cancelCount: props.cancels, cashRefund: cashRefund
    };
    var expected = data.opening + data.cash - cashRefund;
    var diff = counted[0] == null ? null : counted[0] - expected;
    if (done[0]) {
      return h('div', { className: 'pt-page pt-done' }, h('div', { className: 'cp-panel cp-stack', style: { maxWidth: 560, margin: '0 auto' } },
        h(C.StatusBadge, { tone: 'success' }, 'Đã chốt ca'),
        h('h1', { className: 'cp-h' }, 'Biên bản bàn giao ca ' + sh.shift.split(' ')[0].toLowerCase()),
        h('dl', { className: 'cp-kv' },
          h('dt', null, 'Nhân viên'), h('dd', null, sh.staff + ' · ' + sh.staffId),
          h('dt', null, 'Quầy'), h('dd', null, sh.counterName),
          h('dt', null, 'Thời gian'), h('dd', null, sh.openedAt + ' → ' + now()),
          h('dt', null, 'Số đơn'), h('dd', { className: 'cp-num' }, data.orders),
          h('dt', null, 'Doanh thu thuần'), h('dd', null, fmt(data.wallet + data.cash + data.qr - data.refunds)),
          h('dt', null, 'Nhập hàng trong ca'), h('dd', null, fmt(props.receipts.reduce(function (t, r) { return t + r.total; }, 0)) + ' · ' + props.receipts.length + ' phiếu'),
          h('dt', null, 'Đơn chuyển ca sau'), h('dd', { className: 'cp-num' }, props.pre.filter(function (t) { return t.status !== 'done'; }).length),
          h('dt', null, 'Tiền mặt phải có'), h('dd', null, fmt(expected)),
          h('dt', null, 'Tiền mặt thực tế'), h('dd', null, fmt(counted[0])),
          h('dt', null, 'Chênh lệch'), h('dd', null, diff === 0 ? 'Khớp' : (diff > 0 ? 'Thừa ' : 'Thiếu ') + fmt(Math.abs(diff))),
          h('dt', null, 'Người nhận ca'), h('dd', null, recv[0])),
        expl[0] ? h(C.InlineNote, { tone: 'info' }, 'Giải trình: ' + expl[0]) : null,
        h(C.Button, { size: 'lg', block: true, icon: 'user', onClick: props.restart }, 'Đăng xuất & mở ca mới')));
    }
    var needExpl = diff != null && diff !== 0 && !expl[0].trim();
    var net = data.wallet + data.cash + data.qr - data.refunds;
    // món bán chạy
    var agg = {}; orders.forEach(function (o) { o.lines.forEach(function (l) { if (!l.code) return; var a = agg[l.code] || (agg[l.code] = { name: l.name, qty: 0, rev: 0 }); a.qty += l.qty; a.rev += l.price * l.qty; }); });
    var top = Object.keys(agg).map(function (k) { return agg[k]; }).sort(function (a, b) { return b.qty - a.qty || b.rev - a.rev; }).slice(0, 8);
    var topMax = top.length ? top[0].qty : 1;
    // doanh thu theo giờ
    var hours = {}; orders.forEach(function (o) { var hh = Number(o.time.split(':')[0]); hours[hh] = (hours[hh] || 0) + o.total; });
    var hk = Object.keys(hours).map(Number).sort(function (a, b) { return a - b; });
    var hMax = Math.max.apply(null, hk.map(function (k) { return hours[k]; }).concat([1]));
    var peak = hk.reduce(function (p, k) { return p == null || hours[k] > hours[p] ? k : p; }, null);
    // tồn kho & đơn mở
    var low = MENU.filter(function (m) { return m.stock != null && m.stock <= 5; }).sort(function (a, b) { return a.stock - b.stock; });
    var rcTotal = props.receipts.reduce(function (t, r) { return t + r.total; }, 0);
    var open = props.pre.filter(function (t) { return t.status !== 'done'; });
    var openCash = open.filter(function (t) { return t.status === 'cash'; });
    var avg = data.orders ? Math.round((data.wallet + data.cash + data.qr) / data.orders) : 0;
    var mins = (function () { var a = sh.openedAt.split(':'), d = new Date(); return Math.max(0, d.getHours() * 60 + d.getMinutes() - (Number(a[0]) * 60 + Number(a[1]))); })();
    var checks = [['count', 'Đã đếm tiền mặt trong két', counted[0] != null], ['stock', 'Đã kiểm tồn kho các món sắp hết', checkSt[0].stock], ['orders', 'Đã bàn giao đơn chưa hoàn tất cho ca sau', checkSt[0].orders || !open.length], ['clean', 'Đã vệ sinh quầy & thiết bị', checkSt[0].clean]];
    var allChecked = checks.every(function (c) { return c[2]; });
    function kpi(label, val, sub) { return h('div', { className: 'cp-kpi' }, h('label', null, label), val, sub ? h('small', { className: 'pt-kpi-sub' }, sub) : null); }
    return h('div', { className: 'pt-page pt-close' },
      h('div', { className: 'pt-close-main' },
        h('div', { className: 'pt-close-head' },
          h('div', null, h('h1', { className: 'cp-h' }, 'Chốt ca ' + sh.shift.split(' ')[0].toLowerCase() + ' — Quầy ' + sh.counter),
            h('div', { className: 'cp-muted' }, sh.staff + ' · ' + sh.staffId + ' · ' + sh.canteen.split(' — ')[0])),
          h('div', { className: 'pt-close-meta' },
            h('span', null, h(C.Icon, { name: 'clock', size: 16 }), 'Mở ', h('b', null, sh.openedAt), ' · đã chạy ', h('b', null, Math.floor(mins / 60) + 'g ' + (mins % 60) + 'p')),
            h('span', null, h(C.Icon, { name: 'cash', size: 16 }), 'Đầu ca ', h('b', null, fmt(sh.opening))),
            h(C.Button, { variant: 'secondary', size: 'sm', icon: 'receipt', onClick: function () { window.print(); } }, 'In báo cáo ca'))),
        h('div', { className: 'cp-kpis pt-kpis6' },
          kpi('Doanh thu thuần', h(C.Money, { value: net }), 'đã trừ hoàn ' + fmt(data.refunds)),
          kpi('Số đơn', h('span', { className: 'cp-num' }, data.orders), 'TB ' + fmt(avg) + ' / đơn'),
          kpi('Hoàn / hủy', h('span', { className: 'cp-num' }, data.refundCount + ' / ' + data.cancelCount), data.refundCount ? fmt(data.refunds) : 'không có'),
          kpi('Tiền mặt phải có', h(C.Money, { value: expected }), 'đầu ca + thu − hoàn'),
          kpi('Nhập hàng trong ca', h(C.Money, { value: rcTotal }), props.receipts.length + ' phiếu nhập'),
          kpi('Đơn chưa hoàn tất', h('span', { className: 'cp-num' + (open.length ? ' pt-low' : '') }, open.length), openCash.length ? openCash.length + ' đơn chờ thu tiền mặt' : 'chuyển cho ca sau')),
        h('div', { className: 'pt-close-grid' },
          h('section', { className: 'cp-panel cp-stack' },
            h('div', { className: 'cp-h2' }, 'Doanh thu theo phương thức'),
            h('table', { className: 'cp-table' },
              h('thead', null, h('tr', null, h('th', null, 'Phương thức'), h('th', { className: 'r' }, 'Số GD'), h('th', { className: 'r' }, 'Số tiền'), h('th', { className: 'r' }, 'Tỷ trọng'))),
              h('tbody', null, [['Ví (thật + thưởng)', data.walletCount, data.wallet], ['Tiền mặt', data.cashCount, data.cash], ['QR (đã đối soát)', data.qrCount, data.qr]].map(function (r) {
                var pct = net > 0 ? Math.round(r[2] / (data.wallet + data.cash + data.qr || 1) * 100) : 0;
                return h('tr', { key: r[0] }, h('td', null, r[0]), h('td', { className: 'r cp-num' }, r[1]), h('td', { className: 'r' }, h(C.Money, { value: r[2] })), h('td', { className: 'r' }, h('span', { className: 'pt-pct' }, h('i', { style: { '--w': pct + '%' } }), h('b', { className: 'cp-num' }, pct + '%'))));
              }).concat([
                data.qrPending ? h('tr', { key: 'qp' }, h('td', null, 'QR chờ xác minh — chưa tính'), h('td', { className: 'r cp-num' }, data.qrPending), h('td', { className: 'r' }, h(C.StatusBadge, { tone: 'warning' }, 'Tra soát')), h('td')) : null,
                h('tr', { key: 'rf' }, h('td', null, 'Hoàn / hủy'), h('td', { className: 'r cp-num' }, data.refundCount), h('td', { className: 'r' }, h(C.Money, { value: -data.refunds, tone: 'danger' })), h('td')),
                h('tr', { key: 't', className: 'is-total' }, h('td', null, 'Tổng'), h('td'), h('td', { className: 'r' }, h(C.Money, { value: net })), h('td'))]))),
            (function () {
              var gross = data.wallet + data.cash + data.qr || 1;
              var seg = [['Ví', data.wallet, 'var(--info)'], ['Tiền mặt', data.cash, 'var(--accent)'], ['QR', data.qr, 'var(--success)']];
              return h('div', { className: 'pt-split' },
                h('div', { className: 'pt-label' }, 'Cơ cấu thanh toán'),
                h('div', { className: 'pt-split-bar', role: 'img', 'aria-label': seg.map(function (x) { return x[0] + ' ' + Math.round(x[1] / gross * 100) + '%'; }).join(', ') },
                  seg.map(function (x) { return x[1] ? h('i', { key: x[0], style: { flexGrow: x[1], background: x[2] } }) : null; })),
                h('div', { className: 'pt-split-legend' }, seg.map(function (x) { return h('span', { key: x[0] }, h('i', { style: { background: x[2] } }), x[0], h('b', { className: 'cp-num' }, Math.round(x[1] / gross * 100) + '%')); })));
            })()),
          h('section', { className: 'cp-panel cp-stack pt-hours-panel' },
            h('div', { className: 'cp-row', style: { justifyContent: 'space-between' } }, h('span', { className: 'cp-h2' }, 'Doanh thu theo giờ'), peak != null ? h('span', { className: 'cp-muted' }, 'Cao điểm ' + peak + ':00–' + (peak + 1) + ':00') : null),
            h('div', { className: 'pt-hours', role: 'img', 'aria-label': 'Biểu đồ doanh thu theo giờ, 0h đến 23h' }, Array.apply(null, Array(24)).map(function (_, k) {
              var v = hours[k] || 0;
              return h('div', { key: k, className: 'pt-hour' + (k === peak ? ' is-peak' : '') + (v ? '' : ' is-zero'), title: k + ':00–' + (k + 1) + ':00 · ' + fmt(v) },
                h('small', { className: 'cp-num' }, v ? Math.round(v / 1000) + 'k' : ''),
                h('i', { style: { height: v ? Math.max(8, v / hMax * 100) + '%' : '2px' } }),
                h('span', null, k % 3 === 0 ? k + 'h' : ''));
            })),
            hk.length ? null : h('div', { className: 'cp-muted' }, 'Chưa có đơn trong ca')),
          h('section', { className: 'cp-panel cp-stack' },
            h('div', { className: 'cp-h2' }, 'Món bán chạy trong ca'),
            top.length ? h('ol', { className: 'pt-top' }, top.map(function (t, i) {
              return h('li', { key: t.name }, h('span', { className: 'pt-top-rank' }, i + 1), h('span', { className: 'pt-top-name' }, h('b', null, t.name), h('span', { className: 'pt-top-bar' }, h('i', { style: { width: (t.qty / topMax * 100) + '%' } }))), h('span', { className: 'r' }, h('b', { className: 'cp-num' }, t.qty + ' phần'), h('small', { className: 'cp-muted' }, fmt(t.rev))));
            })) : h('div', { className: 'pt-empty' }, 'Chưa bán món nào'),
            h('div', { className: 'pt-top-foot' },
              h('span', null, 'Tổng đã bán', h('b', { className: 'cp-num' }, Object.keys(agg).reduce(function (t, k) { return t + agg[k].qty; }, 0) + ' phần')),
              h('span', null, 'Số loại món', h('b', { className: 'cp-num' }, Object.keys(agg).length)),
              h('span', null, 'Món hết hàng', h('b', { className: 'cp-num' }, MENU.filter(function (m) { return m.stock === 0; }).length))))),
        h('section', { className: 'cp-panel cp-stack' },
          h('div', { className: 'cp-row', style: { justifyContent: 'space-between', flexWrap: 'wrap' } },
            h('span', { className: 'cp-h2' }, 'Đếm tiền mặt trong két'),
            h('span', { className: 'cp-muted' }, 'Bấm +/− hoặc nhập số tờ theo mệnh giá')),
          h('div', { className: 'pt-denoms' }, DENOMS.map(function (d) {
            var n = denoms[0][d] || 0;
            return h('div', { key: d, className: 'pt-denom' + (n ? ' is-on' : '') },
              h('b', null, d >= 1000 ? (d / 1000) + 'k' : d),
              h('span', { className: 'pt-qty' },
                h('button', { type: 'button', 'aria-label': 'Bớt tờ ' + fmt(d), disabled: !n, onClick: function () { setDen(d, n - 1); } }, h(C.Icon, { name: 'minus', size: 14 })),
                h('input', { inputMode: 'numeric', 'aria-label': 'Số tờ ' + fmt(d), value: n || '', placeholder: '0', onChange: function (e) { setDen(d, Number(e.target.value.replace(/\D/g, '')) || 0); } }),
                h('button', { type: 'button', 'aria-label': 'Thêm tờ ' + fmt(d), onClick: function () { setDen(d, n + 1); } }, h(C.Icon, { name: 'plus', size: 14 }))),
              h('small', { className: 'cp-muted cp-num' }, n ? fmt(n * d) : '—'));
          })),
          h('div', { className: 'pt-count-foot' },
            h('div', { className: 'pt-count-row' }, h('span', null, 'Tiền mặt phải có'), h(C.Money, { value: expected })),
            h('div', { className: 'pt-count-row' }, h('span', null, 'Tiền đếm được'), counted[0] == null ? h('span', { className: 'cp-muted' }, 'Chưa đếm') : h(C.Money, { value: counted[0] })),
            h('div', { className: cx2('cp-variance', counted[0] == null || diff === 0 ? 'is-ok' : diff > 0 ? 'is-over' : 'is-short') },
              h('span', { style: { font: '600 15px/22px var(--font-sans)', display: 'flex', gap: 8, alignItems: 'center' } }, h(C.Icon, { name: counted[0] == null || diff === 0 ? 'check' : 'alert' }), counted[0] == null ? 'Chưa đếm tiền' : diff === 0 ? 'Khớp' : diff > 0 ? 'Thừa' : 'Thiếu'),
              counted[0] != null ? h(C.Money, { value: diff, size: 'lg', sign: true }) : null)))),
      h('aside', { className: 'cp-panel cp-stack pt-close-side' },
        h('div', { className: 'cp-h2' }, 'Bàn giao ca'),
        h(C.Field, { id: 'cl-recv', label: 'Người nhận ca', as: 'select', value: recv[0], onChange: function (e) { recv[1](e.target.value); }, options: ['Phạm Văn Tùng — Ca trưa', 'Quản lý Canteen'] }),
        h('div', { className: 'cp-stack', style: { gap: 6 } }, h('div', { className: 'pt-label' }, 'Kiểm tra trước khi chốt'),
          checks.map(function (c) {
            var auto = c[0] === 'count' || (c[0] === 'orders' && !open.length);
            return h('label', { key: c[0], className: 'pt-check' + (c[2] ? ' is-on' : '') },
              h('input', { type: 'checkbox', checked: c[2], disabled: auto, onChange: function () { var n = Object.assign({}, checkSt[0]); n[c[0]] = !n[c[0]]; checkSt[1](n); } }),
              h('span', null, c[1], auto && c[0] === 'count' ? h('small', null, counted[0] == null ? 'Tự đánh dấu khi đếm xong' : 'Đã đếm ' + fmt(counted[0])) : null));
          })),
h('section', { className: 'cp-stack pt-side-stock' },
            h('div', { className: 'cp-row', style: { justifyContent: 'space-between' } }, h('span', { className: 'pt-label' }, 'Tồn kho cần chú ý'), h(C.Button, { variant: 'ghost', size: 'sm', icon: 'store', onClick: props.goStock }, 'Nhập hàng')),
            low.length ? h('ul', { className: 'pt-lowlist' }, low.slice(0, 8).map(function (m) {
              return h('li', { key: m.code }, h('span', null, h('small', { className: 'cp-muted' }, m.code + ' '), m.name), h(C.StatusBadge, { tone: m.stock === 0 ? 'danger' : 'warning', icon: m.stock === 0 ? 'ban' : 'clock' }, m.stock === 0 ? 'Hết hàng' : 'Còn ' + m.stock));
            })) : h('div', { className: 'pt-empty' }, 'Không có món sắp hết')),
        h(C.Field, { id: 'cl-expl', label: 'Giải trình chênh lệch', as: 'textarea', rows: 3, value: expl[0], placeholder: diff ? 'Bắt buộc khi có chênh lệch' : 'Không bắt buộc khi khớp', error: needExpl ? 'Cần giải trình vì tiền đếm lệch ' + fmt(Math.abs(diff)) : null, onChange: function (e) { expl[1](e.target.value); } }),
        data.qrPending ? h(C.InlineNote, null, data.qrPending + ' giao dịch QR chờ xác minh/tra soát không tính vào doanh thu ca.') : null,
        props.offlinePending ? h(C.InlineNote, { tone: 'danger' }, 'Còn ' + props.offlinePending + ' giao dịch offline chưa đồng bộ — chờ có mạng trước khi chốt.') : null,
        h(C.Button, { size: 'lg', block: true, icon: 'check', disabled: counted[0] == null || needExpl || props.offlinePending > 0 || !allChecked, onClick: function () { done[1](true); } }, 'Chốt ca & bàn giao'),
        !allChecked ? h('div', { className: 'cp-note' }, h(C.Icon, { name: 'info', size: 14 }), 'Hoàn tất các mục kiểm tra để chốt ca.') : null));
  }


  /* ---------------- Biên lai sau thanh toán (2.3.4, tính năng 27) ---------------- */
  function Receipt(props) {
    var r = props.r, sh = props.shift;
    var row = function (a, b, cls) { return h('div', { className: 'cp-sum-row' + (cls ? ' ' + cls : '') }, h('span', null, a), b); };
    var paidOther = (r.pay.cash || 0) + (r.pay.qr || 0) + (r.pay.qrPending || 0);
    return h('div', { className: 'cp-scrim pt-scrim', onClick: function (e) { if (e.target === e.currentTarget) props.close(); } },
      h('div', { className: 'cp-dialog pt-receipt', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Biên lai ' + r.id },
        h('div', { className: 'pt-bill' },
          h('div', { className: 'pt-bill-head' }, h('b', null, sh.canteen), h('span', null, 'Quầy ' + sh.counter + ' · ' + sh.staff + ' · ' + r.time + ' ' + new Date().toLocaleDateString('vi-VN')), h('span', null, 'Đơn ' + r.id + (r.offline ? ' · lưu offline' : ''))),
          h('div', { className: 'pt-bill-sec' }, r.lines.map(function (l, i) { return row(l.qty + ' × ' + l.name, h(C.Money, { value: l.price * l.qty })); })),
          h('div', { className: 'pt-bill-sec' },
            row('Giá gốc', h(C.Money, { value: r.orig })),
            r.disc ? row('Khuyến mại / giảm giá', h(C.Money, { value: -r.disc }), 'is-discount') : null,
            r.pay.bonus ? row('Trừ tiền thưởng (ví)', h(C.Money, { value: -r.pay.bonus, tone: 'accent' })) : null,
            r.pay.real ? row('Trừ tiền thật (ví)', h(C.Money, { value: -r.pay.real })) : null,
            r.pay.cash ? row('Tiền mặt', h(C.Money, { value: r.pay.cash })) : null,
            r.pay.qr ? row(r.flag ? 'QR — đang tra soát' : 'QR ngân hàng', h(C.Money, { value: r.pay.qr })) : null,
            r.pay.qrPending ? row('QR — chờ xác minh', h(C.Money, { value: r.pay.qrPending })) : null,
            row('Thực thu', h(C.Money, { value: r.total - (r.pay.bonus || 0), size: 'lg' }), 'is-total')),
          r.balBefore != null ? h('div', { className: 'pt-bill-sec' },
            row('Người mua', h('b', null, r.buyer)),
            row('Số dư ví trước', h(C.Money, { value: r.balBefore })),
            row('Số dư ví sau', h(C.Money, { value: r.balAfter }))) : h('div', { className: 'pt-bill-sec' }, row('Người mua', h('b', null, 'Khách lẻ'))),
          h('div', { className: 'pt-bill-foot' }, 'Cảm ơn quý khách · Tra cứu và khiếu nại trên Ví Canteen')),
        h('div', { className: 'pt-dialog-foot' },
          h(C.Button, { variant: 'secondary', icon: 'receipt', onClick: function () { props.say('Đã gửi lệnh in biên lai ' + r.id, 'receipt'); } }, 'In biên lai'),
          h(C.Button, { size: 'lg', icon: 'check', onClick: props.close }, 'Xong · đơn mới'))));
  }

  /* ---------------- Nhập hàng ---------------- */
  function readImage(file, cb) { if (!file) return; var r = new FileReader(); r.onload = function () { cb(r.result); }; r.readAsDataURL(file); }
  function Thumb(props) {
    var ref = useRef();
    return h('span', { className: 'pt-thumb' + (props.src ? '' : ' is-empty') },
      props.src ? h('img', { src: props.src, alt: '' }) : h(C.Icon, { name: 'image', size: props.big ? 32 : 20, stroke: 1.6 }),
      props.onPick ? h('button', { type: 'button', className: 'pt-thumb-btn', 'aria-label': props.label || 'Tải ảnh món', onClick: function () { ref.current.click(); } }, h(C.Icon, { name: props.src ? 'edit' : 'plus', size: 14 })) : null,
      props.onPick ? h('input', { ref: ref, type: 'file', accept: 'image/*', hidden: true, onChange: function (e) { readImage(e.target.files[0], props.onPick); e.target.value = ''; } }) : null);
  }
  function NewItemDialog(props) {
    var img = useState(null), name = useState(''), cat = useState(props.cat && props.cat !== 'all' ? props.cat : 'com'), price = useState(''), cost = useState(''), qty = useState(''), group = useState(GROUPS[0]);
    var prefix = CATS.filter(function (c) { return c.id === cat[0]; })[0].prefix;
    var n = MENU.filter(function (m) { return m.code[0] === prefix; }).map(function (m) { return Number(m.code.slice(1)); });
    var code = prefix + String((n.length ? Math.max.apply(null, n) : 0) + 1).padStart(2, '0');
    var dup = name[0].trim() && MENU.some(function (m) { return m.name.toLowerCase() === name[0].trim().toLowerCase(); });
    var ok = name[0].trim() && Number(price[0]) > 0 && !dup;
    var drop = useState(false);
    function num(st) { return function (e) { st[1](e.target.value.replace(/\D/g, '')); }; }
    return h('div', { className: 'cp-scrim pt-scrim', onClick: function (e) { if (e.target === e.currentTarget) props.close(); } },
      h('div', { className: 'cp-dialog pt-newitem', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Thêm món mới' },
        h('div', { className: 'cp-dialog-head' }, h('h2', { className: 'cp-h' }, 'Thêm món mới'), h(C.Button, { variant: 'ghost', icon: 'x', 'aria-label': 'Đóng', onClick: props.close })),
        h('div', { className: 'pt-newitem-grid' },
          h('label', { className: 'pt-drop' + (drop[0] ? ' is-over' : '') + (img[0] ? ' has-img' : ''),
              onDragOver: function (e) { e.preventDefault(); drop[1](true); }, onDragLeave: function () { drop[1](false); },
              onDrop: function (e) { e.preventDefault(); drop[1](false); readImage(e.dataTransfer.files[0], img[1]); } },
            img[0] ? h('img', { src: img[0], alt: 'Ảnh món mới' }) : h('span', { className: 'pt-drop-empty' }, h(C.Icon, { name: 'image', size: 36, stroke: 1.5 }), h('b', null, 'Tải ảnh món lên'), h('small', null, 'Bấm để chọn hoặc kéo thả ảnh · JPG, PNG')),
            h('input', { type: 'file', accept: 'image/*', hidden: true, onChange: function (e) { readImage(e.target.files[0], img[1]); } }),
            img[0] ? h('span', { className: 'pt-drop-change' }, h(C.Icon, { name: 'edit', size: 14 }), 'Đổi ảnh') : null),
          h('div', { className: 'cp-stack' },
            h(C.Field, { id: 'ni-name', label: 'Tên món', placeholder: 'VD: Mì xào bò', value: name[0], onChange: function (e) { name[1](e.target.value); }, error: dup ? 'Món này đã có trong danh sách — nhập thêm hàng ở bảng bên ngoài.' : null }),
            h('div', { className: 'pt-2col' },
              h(C.Field, { id: 'ni-cat', label: 'Nhóm món', as: 'select', value: CATS.filter(function (c) { return c.id === cat[0]; })[0].label, onChange: function (e) { cat[1](CATS.filter(function (c) { return c.label === e.target.value; })[0].id); }, options: CATS.slice(1).map(function (c) { return c.label; }) }),
              h(C.Field, { id: 'ni-code', label: 'Mã món (tự sinh)', value: code, onChange: function () {} })),
            h('div', { className: 'pt-2col' },
              h(C.Field, { id: 'ni-price', label: 'Giá bán', numeric: true, suffix: '₫', placeholder: '0', value: price[0] ? Number(price[0]).toLocaleString('vi-VN') : '', onChange: num(price) }),
              h(C.Field, { id: 'ni-cost', label: 'Giá nhập / phần', numeric: true, suffix: '₫', placeholder: '0', value: cost[0] ? Number(cost[0]).toLocaleString('vi-VN') : '', onChange: num(cost) })),
            h('div', { className: 'pt-2col' },
              h(C.Field, { id: 'ni-qty', label: 'Số lượng nhập lần đầu', numeric: true, placeholder: '0', value: qty[0], onChange: num(qty) }),
              h(C.Field, { id: 'ni-group', label: 'Nhóm hạn chế (phụ huynh chặn được)', as: 'select', value: group[0], onChange: function (e) { group[1](e.target.value); }, options: GROUPS })),
            Number(price[0]) > 0 && Number(cost[0]) > 0 ? h(C.InlineNote, { tone: Number(cost[0]) >= Number(price[0]) ? 'danger' : 'info' }, Number(cost[0]) >= Number(price[0]) ? 'Giá nhập đang cao hơn hoặc bằng giá bán.' : 'Lãi gộp mỗi phần ' + fmt(Number(price[0]) - Number(cost[0])) + ' (' + Math.round((1 - Number(cost[0]) / Number(price[0])) * 100) + '%).') : null)),
        h('div', { className: 'pt-dialog-foot' },
          h('span', { className: 'cp-muted' }, Number(qty[0]) > 0 && Number(cost[0]) > 0 ? 'Thêm vào phiếu nhập: ' + qty[0] + ' × ' + fmt(Number(cost[0])) + ' = ' + fmt(Number(qty[0]) * Number(cost[0])) : 'Món mới sẽ hiện ngay ở màn Bán hàng.'),
          h(C.Button, { size: 'lg', icon: 'check', disabled: !ok, onClick: function () {
            props.save({ code: code, name: name[0].trim(), price: Number(price[0]), cat: cat[0], cost: Number(cost[0]) || 0, stock: 0, image: img[0] || undefined, group: group[0] === GROUPS[0] ? undefined : group[0], isNew: true }, Number(qty[0]) || 0);
          } }, 'Lưu món mới'))));
  }
  function Receive(props) {
    var q = useState(''), cat = useState('all'), newCat = useState(null), lines = useState({}), supplier = useState(SUPPLIERS[0]), note = useState(''), dlg = useState(false), tick = useState(0);
    var items = MENU.filter(function (m) { return (cat[0] === 'all' || m.cat === cat[0]) && (!q[0] || (m.name + ' ' + m.code).toLowerCase().indexOf(q[0].toLowerCase()) >= 0); });
    var cats = CATS.map(function (c) { return { id: c.id, label: c.label, count: c.id === 'all' ? MENU.length : MENU.filter(function (m) { return m.cat === c.id; }).length }; });
    function line(code) { var m = MENU.filter(function (x) { return x.code === code; })[0]; return lines[0][code] || { qty: 0, cost: m.cost || 0 }; }
    function set(code, patch) { var n = Object.assign({}, lines[0]); n[code] = Object.assign({}, line(code), patch); lines[1](n); }
    var picked = MENU.filter(function (m) { return line(m.code).qty > 0; });
    var total = picked.reduce(function (s, m) { var l = line(m.code); return s + l.qty * l.cost; }, 0);
    var units = picked.reduce(function (s, m) { return s + line(m.code).qty; }, 0);
    function save() {
      var rows = picked.map(function (m) { var l = line(m.code); return { code: m.code, name: m.name, qty: l.qty, cost: l.cost, before: m.stock || 0 }; });
      rows.forEach(function (r) { var m = MENU.filter(function (x) { return x.code === r.code; })[0]; m.stock = (m.stock || 0) + r.qty; m.cost = r.cost; delete m.status; });
      props.saveReceipt({ supplier: supplier[0], note: note[0], rows: rows, total: total });
      lines[1]({}); note[1]('');
    }
    function money(v) { return v ? Number(v).toLocaleString('vi-VN') : ''; }
    return h('div', { className: 'pt-page pt-receive' },
      h('div', { className: 'cp-panel cp-stack pt-receive-list' },
        h('div', { className: 'cp-row', style: { justifyContent: 'space-between', flexWrap: 'wrap' } },
          h('div', null, h('h1', { className: 'cp-h' }, 'Nhập hàng'), h('div', { className: 'cp-muted' }, 'Nhập số lượng cộng thêm và giá nhập cho từng món · bấm vào ảnh để tải ảnh món')),
          h(C.Button, { icon: 'plus', onClick: function () { dlg[1](true); } }, 'Thêm món mới')),
        h(C.Field, { id: 'rc-q', icon: 'search', placeholder: 'Tìm món theo tên hoặc mã', value: q[0], onChange: function (e) { q[1](e.target.value); } }),
        h('div', { className: 'pt-cat-row' },
          h(C.CategoryTabs, { items: cats, active: cat[0], onChange: cat[1] }),
          newCat[0] === null ? h('button', { type: 'button', className: 'pt-cat-add', onClick: function () { newCat[1](''); } }, h(C.Icon, { name: 'plus', size: 16 }), 'Thêm mục')
            : h('form', { className: 'pt-cat-form', onSubmit: function (e) {
                e.preventDefault(); var v = newCat[0].trim(); if (!v) return;
                if (CATS.some(function (c) { return c.label.toLowerCase() === v.toLowerCase(); })) return props.say('Mục “' + v + '” đã có', 'alert');
                var c = addCat(v); newCat[1](null); cat[1](c.id); props.say('Đã tạo mục “' + v + '” · mã món bắt đầu bằng ' + c.prefix, 'plus');
              } },
              h('input', { autoFocus: true, 'aria-label': 'Tên mục mới', placeholder: 'Tên mục mới, VD: Món chay', value: newCat[0], maxLength: 32, onChange: function (e) { newCat[1](e.target.value); }, onKeyDown: function (e) { if (e.key === 'Escape') newCat[1](null); } }),
              h(C.Button, { size: 'sm', type: 'submit', disabled: !newCat[0].trim() }, 'Tạo'),
              h(C.Button, { size: 'sm', variant: 'ghost', icon: 'x', 'aria-label': 'Hủy', onClick: function () { newCat[1](null); } }))),
        h('div', { className: 'pt-rc-table', role: 'table', 'aria-label': 'Danh sách món để nhập hàng' },
          h('div', { className: 'pt-rc-row is-head', role: 'row' }, h('span', null, 'Món'), h('span', { className: 'r' }, 'Tồn kho'), h('span', { className: 'r' }, 'Nhập thêm'), h('span', { className: 'r' }, 'Giá nhập / phần'), h('span', { className: 'r' }, 'Thành tiền')),
          items.map(function (m) {
            var l = line(m.code), stock = m.stock || 0;
            return h('div', { key: m.code, role: 'row', className: 'pt-rc-row' + (l.qty > 0 ? ' is-on' : '') },
              h('span', { className: 'pt-rc-item' },
                h(Thumb, { src: m.image, label: 'Tải ảnh cho ' + m.name, onPick: function (src) { m.image = src; tick[1](tick[0] + 1); props.say('Đã cập nhật ảnh ' + m.name, 'check'); } }),
                h('span', { className: 'pt-rc-name' }, h('small', null, m.code + (m.isNew ? ' · món mới' : '')), h('b', null, m.name), h('small', null, 'Giá bán ' + fmt(m.price)))),
              h('span', { className: 'r' },
                h('span', { className: 'pt-stock' }, h('b', { className: 'cp-num' + (stock === 0 ? ' pt-out' : stock <= 5 ? ' pt-low' : '') }, stock), l.qty > 0 ? h('span', { className: 'pt-after cp-num', 'aria-label': 'sau nhập ' + (stock + l.qty) }, '→ ' + (stock + l.qty)) : null),
                h('small', { className: 'cp-muted' }, stock === 0 ? 'Hết hàng' : stock <= 5 ? 'Sắp hết' : 'phần')),
              h('span', { className: 'r' }, h('span', { className: 'pt-qty' },
                h('button', { type: 'button', 'aria-label': 'Bớt', disabled: !l.qty, onClick: function () { set(m.code, { qty: Math.max(0, l.qty - 1) }); } }, h(C.Icon, { name: 'minus', size: 16 })),
                h('input', { inputMode: 'numeric', 'aria-label': 'Số lượng nhập ' + m.name, value: l.qty || '', placeholder: '0', onChange: function (e) { set(m.code, { qty: Number(e.target.value.replace(/\D/g, '')) || 0 }); } }),
                h('button', { type: 'button', 'aria-label': 'Thêm', onClick: function () { set(m.code, { qty: l.qty + 1 }); } }, h(C.Icon, { name: 'plus', size: 16 })))),
              h('span', { className: 'r' }, h('span', { className: 'pt-cost' }, h('input', { inputMode: 'numeric', 'aria-label': 'Giá nhập ' + m.name, value: money(l.cost), placeholder: '0', onChange: function (e) { set(m.code, { cost: Number(e.target.value.replace(/\D/g, '')) || 0 }); } }), h('span', null, '₫'))),
              h('span', { className: 'r' }, l.qty > 0 ? h(C.Money, { value: l.qty * l.cost }) : h('span', { className: 'cp-muted' }, '—')));
          }),
          items.length ? null : h('div', { className: 'pt-empty' }, 'Không có món phù hợp — bấm “Thêm món mới”.'))),
      h('div', { className: 'pt-receive-side' },
        h('div', { className: 'cp-panel cp-stack' },
          h('div', { className: 'cp-row', style: { justifyContent: 'space-between' } }, h('span', { className: 'cp-h2' }, 'Phiếu nhập ', h('span', { className: 'cp-num' }, 'PN-' + String(props.seq).padStart(4, '0'))), h('span', { className: 'cp-muted' }, now() + ' · NV ' + props.shift.staff.split(' ').pop())),
          h(C.Field, { id: 'rc-sup', label: 'Nhà cung cấp', as: 'select', value: supplier[0], onChange: function (e) { supplier[1](e.target.value); }, options: SUPPLIERS }),
          picked.length ? h('ul', { className: 'pt-rc-sum' }, picked.map(function (m) { var l = line(m.code); return h('li', { key: m.code }, h('span', null, h('b', null, l.qty + '×'), ' ', m.name), h(C.Money, { value: l.qty * l.cost })); }))
            : h('div', { className: 'pt-empty' }, 'Chưa có món nào. Nhập số lượng ở bảng bên trái.'),
          picked.some(function (m) { return !line(m.code).cost; }) ? h(C.InlineNote, { tone: 'warn' }, 'Có món chưa nhập giá nhập.') : null,
          h('div', { className: 'cp-due' }, h('span', null, 'Tổng tiền'), h(C.Money, { value: total, size: 'lg' })),
          h(C.Field, { id: 'rc-note', label: 'Ghi chú', as: 'textarea', rows: 2, placeholder: 'Số hóa đơn, hạn dùng…', value: note[0], onChange: function (e) { note[1](e.target.value); } }),
          h(C.Button, { size: 'lg', block: true, icon: 'check', disabled: !picked.length, onClick: save }, picked.length ? 'Lưu phiếu nhập · ' + fmt(total) : 'Lưu phiếu nhập')),
        h('div', { className: 'cp-panel cp-stack' },
          h('span', { className: 'cp-h2' }, 'Phiếu nhập trong ca'),
          props.receipts.length ? props.receipts.slice().reverse().map(function (r) {
            return h('div', { key: r.id, className: 'pt-rc-hist' },
              h('div', { className: 'cp-row', style: { justifyContent: 'space-between' } }, h('b', { className: 'cp-num' }, r.id), h(C.Money, { value: r.total })),
              h('small', { className: 'cp-muted' }, r.time + ' · ' + r.supplier + ' · ' + r.rows.length + ' món, ' + r.rows.reduce(function (s, x) { return s + x.qty; }, 0) + ' phần'));
          }) : h('div', { className: 'cp-muted' }, 'Chưa có phiếu nhập nào trong ca.'))),
      dlg[0] ? h(NewItemDialog, { cat: cat[0], close: function () { dlg[1](false); }, save: function (item, qty) {
        MENU.push(item); dlg[1](false);
        if (qty > 0) { var n = Object.assign({}, lines[0]); n[item.code] = { qty: qty, cost: item.cost }; lines[1](n); }
        q[1]('');
        props.say('Đã thêm món mới ' + item.code + ' · ' + item.name + (qty > 0 ? ' — đã đưa vào phiếu nhập' : ''), 'plus');
      } }) : null);
  }

  /* ---------------- App ---------------- */
  function App() {
    var S = useState(null), shift = S[0];
    var cart = useState([]), buyer = useState('guest'), view = useState('sell'), dialog = useState(null);
    var orders = useState(SEED_ORDERS), seq = useState(412), offSeq = useState(1), offline = useState(false), queue = useState([]), syncing = useState(null);
    var receipts = useState([]), rcSeq = useState(1), menuVer = useState(0);
    var receipt = useState(null), pre = useState(SEED_PRE), preSeq = useState(1192), toast = useState(null), cancels = useState(0), pendingWallet = useState(null);
    var toastT = useRef();
    function say(text, icon) { toast[1]({ text: text, icon: icon }); clearTimeout(toastT.current); toastT.current = setTimeout(function () { toast[1](null); }, 3200); }

    var netRef = useRef(function () {});
    useEffect(function () {
      function up() { netRef.current(true); } function down() { netRef.current(false); }
      window.addEventListener('online', up); window.addEventListener('offline', down);
      return function () { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
    }, []);
    if (!shift) return h(React.Fragment, null, h(Login, { onOpen: function (s) { S[1](s); say('Đã mở ca · tiền đầu ca ' + fmt(s.opening)); } }), h(Toast, { toast: toast[0] }));

    var app = { shift: shift, cart: cart[0], buyer: buyer[0], offline: offline[0], seq: seq[0], offSeq: offSeq[0] };
    var sub = lineTotal(cart[0]), total = sub - promoOf(cart[0]);
    var orderCode = offline[0] ? 'OFF-' + String(offSeq[0]).padStart(4, '0') : 'DH-' + String(seq[0]).padStart(4, '0');

    function add(m) { var c = cart[0].slice(), i = c.findIndex(function (l) { return l.code === m.code; }); if (m.stock != null && (i >= 0 ? c[i].qty : 0) >= m.stock) return say('Hết tồn kho ' + m.name + ' — vào Nhập hàng để cộng thêm', 'alert'); if (i >= 0) c[i] = Object.assign({}, c[i], { qty: c[i].qty + 1 }); else c.push({ code: m.code, name: m.name, price: m.price, qty: 1 }); cart[1](c); }
    function setQty(i, d) { cart[1](cart[0].map(function (l, j) { return j === i ? Object.assign({}, l, { qty: l.qty + d }) : l; }).filter(function (l) { return l.qty > 0; })); }
    function setBuyer(b) {
      if (b && b !== 'guest' && b.role === 'student') {
        var removed = cart[0].filter(function (l) { var m = MENU.filter(function (x) { return x.code === l.code; })[0]; return m.group && b.blocked.indexOf(m.group) >= 0; });
        if (removed.length) { cart[1](cart[0].filter(function (l) { return removed.indexOf(l) < 0; })); say('Đã bỏ món bị chặn với học sinh: ' + removed.map(function (l) { return l.name; }).join(', '), 'lock'); }
      }
      buyer[1](b);
    }
    function finish(pay, msg, icon, extra) {
      var b = buyer[0], isAcc = b && b !== 'guest';
      var balBefore = isAcc ? BUYERS[b.id].real + BUYERS[b.id].bonus : null;
      var o = Object.assign({ id: orderCode, time: now(), buyer: isAcc ? b.name + ' · ' + b.id : 'Khách lẻ', buyerId: isAcc ? b.id : null, lines: cart[0], orig: sub, disc: sub - total, total: total, pay: pay, offline: offline[0] }, extra || {});
      orders[1](orders[0].concat([o]));
      cart[0].forEach(function (l) { var m = MENU.filter(function (x) { return x.code === l.code; })[0]; if (m && m.stock != null) m.stock = Math.max(0, m.stock - l.qty); });
      if (isAcc && (pay.bonus || pay.real)) {
        var nb = Object.assign({}, BUYERS[b.id]); nb.bonus -= pay.bonus || 0; nb.real -= pay.real || 0;
        if (nb.limit) nb.limit = { used: nb.limit.used + (pay.bonus || 0) + (pay.real || 0), max: nb.limit.max };
        BUYERS[b.id] = nb;
      }
      if (offline[0]) { queue[1](queue[0].concat([o.id])); offSeq[1](offSeq[0] + 1); } else seq[1](seq[0] + 1);
      cart[1]([]); buyer[1]('guest'); dialog[1](null); pendingWallet[1](null);
      say(o.id + ' — ' + msg, icon);
      receipt[1](Object.assign({ balBefore: balBefore, balAfter: isAcc ? BUYERS[b.id].real + BUYERS[b.id].bonus : null, msg: msg }, o));
    }
    function flag(code, amt, why) {
      finish(Object.assign({}, pendingWallet[0] ? pendingWallet[0].pay : {}, { qr: amt }), 'đã chuyển tra soát, chưa tính doanh thu', 'alert', { flag: why || 'Cần kiểm tra' });
    }
    // theo dõi mạng thật của thiết bị: mất mạng → offline, có mạng lại → đồng bộ
    netRef.current = function (on) { if (on === offline[0]) toggleNet(); };
    function toggleNet() {
      if (!offline[0]) { offline[1](true); say('Mất mạng — đã chuyển sang chế độ offline', 'wifiOff'); return; }
      offline[1](false);
      var n = queue[0].length; if (!n) { say('Đã có mạng', 'wifi'); return; }
      syncing[1]({ done: 0, total: n });
      var k = 0, t = setInterval(function () {
        k++; syncing[1]({ done: k, total: n });
        if (k >= n) {
          clearInterval(t);
          orders[1](function (list) { return list.map(function (o) { return o.offline && o.pay.qrPending ? Object.assign({}, o, { flag: 'QR offline chưa tìm thấy giao dịch khớp — cần tra soát' }) : o; }); });
          setTimeout(function () { syncing[1](null); queue[1]([]); say('Đã đồng bộ ' + n + ' giao dịch offline', 'sync'); }, 900);
        }
      }, 500);
    }
    function nextPre(code) {
      var order = ['cash', 'new', 'preparing', 'ready', 'done'];
      pre[1](pre[0].map(function (t) { return t.code === code ? Object.assign({}, t, { status: order[order.indexOf(t.status) + 1] }, t.status === 'cash' ? { cashDue: 0, buyer: t.buyer.replace(' · ví thiếu', '') + ' · đã thu tiền mặt' } : {}) : t; }).filter(function (t) { return t.status !== 'done'; }));
      var t = pre[0].filter(function (x) { return x.code === code; })[0];
      if (t.status === 'cash') {
        orders[1](orders[0].concat([{ id: code, time: now(), buyer: t.buyer.split(' · ').slice(0, 2).join(' · '), lines: [{ code: '', name: 'Thu tiền mặt đơn ' + code, price: t.cashDue, qty: 1 }], total: t.cashDue, pay: { cash: t.cashDue } }]));
        return say(code + ' — đã thu ' + fmt(t.cashDue) + ' tiền mặt, chuyển sang Mới nhận', 'cash');
      }
      say(code + ' — ' + (t.status === 'new' ? 'bắt đầu chuẩn bị' : t.status === 'preparing' ? 'đã báo sẵn sàng' : 'đã giao cho người nhận'));
    }
    function incoming() {
      var code = 'APP-' + preSeq[0], uni = preSeq[0] % 2 === 0;
      pre[1](pre[0].concat([{ code: code, source: 'app', uni: uni, buyer: uni ? 'Đỗ Quang Huy · SV K21' : 'Bùi Ngọc Trâm · 7A4', status: 'new', pickupAt: addMin(now(), 15), counter: shift.counter, eta: uni ? null : addMin(now(), 15), items: [{ qty: 1, name: 'Bún bò Huế' }, { qty: 1, name: 'Sữa tươi ít đường' }] }]));
      preSeq[1](preSeq[0] + 1); say('Đơn hàng mới ' + code, 'clock');
    }
    function incomingCash() {
      var code = 'K-0' + (160 + preSeq[0] % 40);
      pre[1](pre[0].concat([{ code: code, source: 'kiosk', buyer: 'Trần Minh Khôi · HS 8A3 · ví thiếu', status: 'cash', pickupAt: addMin(now(), 10), counter: shift.counter, cashDue: 8000, cashNote: 'Ví thiếu — thu thêm tiền mặt', items: [{ qty: 1, name: 'Cơm gà xối mỡ' }, { qty: 1, name: 'Sữa chua' }] }]));
      preSeq[1](preSeq[0] + 1); say('Đơn ' + code + ' cần thu tiền mặt', 'cash');
    }
    function incomingClass() {
      var code = 'LOP-' + ['6A1', '9B2', '11C3'][preSeq[0] % 3];
      pre[1](pre[0].concat([{ code: code + '-' + preSeq[0], source: 'class', buyer: 'Lớp ' + code.slice(4) + ' — GVCN', status: 'new', pickupAt: addMin(now(), 30), counter: '3', items: [{ qty: 32, name: 'Suất trưa tiêu chuẩn' }] }]));
      preSeq[1](preSeq[0] + 1); say('Suất tập thể mới cho lớp ' + code.slice(4), 'users');
    }
    function refund(id, amt, reason, method, pending, bonusPart) {
      orders[1](orders[0].map(function (o) { return o.id === id ? Object.assign({}, o, { refunded: amt, refundReason: reason, refundMethod: method, refundPending: pending }) : o; }));
      if (!pending && method === 'wallet') { var o = orders[0].filter(function (x) { return x.id === id; })[0]; if (o.buyerId && BUYERS[o.buyerId]) { var b = Object.assign({}, BUYERS[o.buyerId]); b.bonus += bonusPart; b.real += amt - bonusPart; BUYERS[o.buyerId] = b; } }
      say(pending ? 'Đã gửi yêu cầu hoàn ' + fmt(amt) + ' cho quản lý duyệt' : 'Đã hoàn ' + fmt(amt) + ' về ' + (method === 'wallet' ? 'ví' : method === 'cash' ? 'tiền mặt' : 'chuyển khoản') + ' · ' + id, 'undo');
    }

    var tabs = [['sell', 'Bán hàng', 'cash'], ['pre', 'Đơn hàng', 'bag'], ['refund', 'Đơn hoàn thành', 'doc'], ['stock', 'Nhập hàng', 'store'], ['close', 'Chốt ca', 'receipt']];
    var preCount = pre[0].filter(function (t) { return t.status === 'new' || t.status === 'cash'; }).length;
    var main;
    if (view[0] === 'sell') main = h(Sell, { app: app, add: add, qty: setQty, clear: function () { cart[1]([]); cancels[1](cancels[0] + 1); say('Đã hủy đơn đang tạo', 'x'); }, setBuyer: setBuyer, pay: function (m) { dialog[1](m); } });
    else if (view[0] === 'pre') main = h(Preorders, { list: pre[0], next: nextPre, incoming: incoming, incomingCash: incomingCash, incomingClass: incomingClass });
    else if (view[0] === 'stock') main = h(Receive, { shift: shift, say: say, seq: rcSeq[0], receipts: receipts[0], saveReceipt: function (r) {
      var id = 'PN-' + String(rcSeq[0]).padStart(4, '0');
      receipts[1](receipts[0].concat([Object.assign({ id: id, time: now(), staff: shift.staff }, r)])); rcSeq[1](rcSeq[0] + 1); menuVer[1](menuVer[0] + 1);
      say('Đã lưu ' + id + ' · cộng ' + r.rows.reduce(function (s, x) { return s + x.qty; }, 0) + ' phần vào tồn kho · ' + fmt(r.total), 'check');
    } });
    else if (view[0] === 'refund') main = h(Refund, { orders: orders[0], shift: shift, refund: refund });
    else main = h(Close, { receipts: receipts[0], pre: pre[0], goStock: function () { view[1]('stock'); }, goOrders: function () { view[1]('pre'); }, orders: orders[0], shift: shift, cancels: cancels[0], offlinePending: queue[0].length, restart: function () { S[1](null); view[1]('sell'); orders[1](SEED_ORDERS); cart[1]([]); queue[1]([]); offline[1](false); } });

    return h('div', { className: 'cp-app pt-app' },
      h(C.TopBar, {
        canteen: shift.canteen, counter: shift.counter, shift: shift.shift, staff: shift.staff, online: !offline[0], pending: queue[0].length,
        right: h('div', { className: 'pt-nav', role: 'tablist' }, tabs.map(function (t) {
          return h('button', { key: t[0], type: 'button', role: 'tab', 'aria-selected': String(view[0] === t[0]), className: 'pt-nav-btn', onClick: function () { view[1](t[0]); } }, h(C.Icon, { name: t[2], size: 18 }), t[1], t[0] === 'pre' && preCount ? h('span', { className: 'pt-count' }, preCount) : null);
        }))
      }),
      syncing[0] ? h(C.OfflineBanner, { syncing: true, done: syncing[0].done, pending: syncing[0].total }) : offline[0] ? h(C.OfflineBanner, { pending: queue[0].length, walletLimit: OFFLINE_WALLET_LIMIT, qrPending: orders[0].filter(function (o) { return o.offline && o.pay.qrPending; }).length }) : null,
      h('div', { className: 'pt-main' }, main),
      dialog[0] ? h(PayDialog, {
        key: dialog[0], app: app, mode: dialog[0], total: pendingWallet[0] ? pendingWallet[0].short : total, orderCode: orderCode, close: function () { dialog[1](null); pendingWallet[1](null); },
        done: function (pay, msg, icon) { if (pendingWallet[0]) pay = Object.assign({}, pendingWallet[0].pay, pay); finish(pay, msg, icon); },
        flag: flag,
        walletThenQr: function (walletPay, short) { pendingWallet[1]({ pay: walletPay, short: short }); dialog[1]('qr'); }
      }) : null,
      receipt[0] ? h(Receipt, { r: receipt[0], shift: shift, say: say, close: function () { receipt[1](null); } }) : null,
      h(Toast, { toast: toast[0] }));
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
