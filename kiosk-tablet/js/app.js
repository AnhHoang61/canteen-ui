(function () {
  var C = window.CanteenPOS, h = React.createElement, useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;
  var fmt = C.formatVND;

  /* ---------------- Dữ liệu mẫu ---------------- */
  var MENU = [
    { code: 'C01', name: 'Cơm gà xối mỡ', desc: 'Cơm, gà chiên giòn, dưa chua', price: 35000, cat: 'com', al: 'gluten' },
    { code: 'C02', name: 'Cơm rang dưa bò', desc: 'Cơm rang, bò xào dưa cải', price: 38000, cat: 'com', al: 'đậu nành' },
    { code: 'C05', name: 'Cơm sườn nướng', desc: 'Sườn nướng mật ong, trứng ốp', price: 38000, cat: 'com', soldout: true, al: 'trứng, đậu nành' },
    { code: 'B03', name: 'Bún bò Huế', desc: 'Bắp bò, chả cua, rau sống', price: 40000, cat: 'bun', promoPct: 10, al: 'hải sản, gluten' },
    { code: 'B04', name: 'Phở gà', desc: 'Gà ta xé, hành lá', price: 35000, cat: 'bun', al: '' },
    { code: 'A07', name: 'Bánh mì trứng', desc: 'Trứng ốp, pate, dưa leo', price: 15000, cat: 'an', stock: 3, al: 'trứng, gluten' },
    { code: 'A09', name: 'Khoai tây chiên', desc: 'Phần vừa, tương cà', price: 20000, cat: 'an', group: 'Đồ chiên rán', al: '' },
    { code: 'A10', name: 'Xôi xéo', desc: 'Đậu xanh, hành phi', price: 20000, cat: 'an', al: 'đậu xanh' },
    { code: 'N01', name: 'Trà đào', desc: 'Ít đường', price: 15000, cat: 'nuoc', al: '' },
    { code: 'N02', name: 'Coca-Cola lon', desc: '330ml', price: 12000, cat: 'nuoc', group: 'Nước ngọt có ga', al: '' },
    { code: 'N05', name: 'Sữa tươi ít đường', desc: 'Hộp 180ml', price: 10000, cat: 'nuoc', al: 'sữa' },
    { code: 'N06', name: 'Nước cam', desc: 'Cam vắt tươi', price: 18000, cat: 'nuoc', al: '' },
    { code: 'T01', name: 'Sữa chua', desc: 'Hũ 100g', price: 8000, cat: 'trang', al: 'sữa' },
    { code: 'T03', name: 'Hoa quả dầm', desc: 'Hoa quả theo mùa, sữa chua', price: 20000, cat: 'trang', al: 'sữa' }
  ];
  var CATS = [{ id: 'all', label: 'Tất cả' }, { id: 'com', label: 'Cơm' }, { id: 'bun', label: 'Bún / Phở' }, { id: 'an', label: 'Ăn vặt' }, { id: 'nuoc', label: 'Đồ uống' }, { id: 'trang', label: 'Tráng miệng' }];
  var PEOPLE = {
    khoi: { id: 'HS-208317', name: 'Trần Minh Khôi', role: 'student', roleLabel: 'Học sinh', klass: 'Lớp 8A3', real: 42000, bonus: 10000, limit: { used: 12000, max: 60000 }, blocked: ['Nước ngọt có ga', 'Đồ chiên rán'], score: 97, pin: '2468' },
    ha: { id: 'GV-0451', name: 'Phạm Thu Hà', role: 'teacher', roleLabel: 'Giáo viên', klass: 'Tổ Ngữ văn', real: 315000, bonus: 20000, score: 96, pin: '1357' },
    bao: { id: 'SV-K20-118', name: 'Lê Gia Bảo', role: 'university', roleLabel: 'Sinh viên', klass: 'K20 · CNTT', real: 18000, bonus: 5000, score: 84, pin: '1111', uni: true }
  };
  var CONFIDENT = 90; var CONFIRM_SECONDS = 30;        // ≥ 90%: chỉ cần xác nhận; thấp hơn: nhập PIN
  var IDLE_SECONDS = 60;     // tự đăng xuất khi không thao tác
  var KIOSK = { name: 'Kiosk K1', canteen: 'Canteen A — Nhà ăn chính', counter: '2' };
  var QUEUE = 34;            // đơn đang chờ ở Canteen (mô phỏng tải)

  /* ---------------- Cầu nối với app thật ----------------
     Phần cứng / backend gọi vào:
       CanteenKiosk.face({ status: 'scanning' | 'found' | 'fail' | 'multi' | 'idle', person })
       CanteenKiosk.card(person, 'card' | 'qr')            // đầu đọc thẻ / QR học sinh
       CanteenKiosk.phone({ status: 'scanned' | 'approved' | 'rejected', person })
       CanteenKiosk.camera(stream)                          // MediaStream hiển thị trong khung camera
       CanteenKiosk.config({ kiosk, menu, queue, verifyPin, pay }) // verifyPin(person, pin) → Promise<boolean>; pay(order) → Promise<{bonus, real, pickup}>
     Kiosk phát ra (CanteenKiosk.on(tên, fn)):
       'retry' · 'loginCode' (mã QR đăng nhập) · 'confirmed' (person, method) · 'cancel' · 'paid' (đơn) · 'logout'
     person = { id, name, roleLabel, klass, real, bonus, limit?: { used, max }, blocked?: [nhóm món], score?, uni? }
     Thêm ?demo vào URL để hiện các nút mô phỏng khi chạy thử. */
  var DEMO = /[?&#]demo\b/.test(location.search + location.hash);
  var listeners = {}, lastFace = null, stream = null;
  function on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); return function () { listeners[evt] = (listeners[evt] || []).filter(function (f) { return f !== fn; }); }; }
  function emit(evt, data) { if (evt === 'face') lastFace = data; (listeners[evt] || []).slice().forEach(function (f) { try { f(data); } catch (e) { console.error(e); } }); }
  function useBridge(evt, fn) { var r = useRef(fn); r.current = fn; useEffect(function () { return on(evt, function (d) { r.current(d); }); }, []); }
  var cfg = { verifyPin: function (p, pin) { return Promise.resolve(!!p.pin && pin === p.pin); }, pay: null };
  window.CanteenKiosk = {
    face: function (r) { emit('face', r || {}); },
    card: function (person, method) { emit('card', { person: person, method: method || 'card' }); },
    phone: function (r) { emit('phone', r || {}); },
    camera: function (s) { stream = s; emit('camera', s); },
    config: function (o) { o = o || {}; if (o.kiosk) Object.assign(KIOSK, o.kiosk); if (o.menu) { MENU.length = 0; o.menu.forEach(function (m) { MENU.push(m); }); } if (o.queue != null) QUEUE = o.queue; if (o.verifyPin) cfg.verifyPin = o.verifyPin; if (o.pay) cfg.pay = o.pay; emit('config', o); },
    on: on
  };

  function etaAdd(n) { return n <= 30 ? 20 : n < 50 ? 30 : 35; }
  function now() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function addMin(m) { var d = new Date(Date.now() + m * 60000); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function initials(n) { var p = n.split(' '); return (p[p.length - 2][0] + p[p.length - 1][0]).toUpperCase(); }
  function itemOf(code) { return MENU.filter(function (m) { return m.code === code; })[0]; }
  function priceOf(m) { return m.promoPct ? Math.round(m.price * (100 - m.promoPct) / 100) : m.price; }

  /* ---------------- Khung camera mô phỏng ---------------- */
  function Viewfinder(props) {
    var st = props.state; // idle | scanning | found | fail | multi
    return h('div', { className: 'kx-cam is-' + st, role: 'img', 'aria-label': 'Khung camera nhận diện khuôn mặt' },
      h('div', { className: 'kx-cam-grid' }),
      h(CamVideo),
      st === 'found' ? h('div', { className: 'kx-cam-flood', 'aria-hidden': 'true' }) : null,
      h('svg', { className: 'kx-oval', viewBox: '0 0 240 300', 'aria-hidden': 'true' },
        h('ellipse', { cx: 120, cy: 150, rx: 104, ry: 134, className: 'kx-oval-ring' }),
        st === 'scanning' || st === 'found' ? h('path', { className: 'kx-trace', pathLength: 1, d: 'M120 16 A104 134 0 0 1 120 284 A104 134 0 0 1 120 16' }) : null,
        st === 'found' ? h('ellipse', { cx: 120, cy: 150, rx: 104, ry: 134, className: 'kx-oval-fill' }) : null,
        st === 'found' ? h('path', { className: 'kx-check', pathLength: 1, d: 'M82 152 L108 178 L160 120' }) : null,
        st === 'multi' ? h('ellipse', { cx: 210, cy: 120, rx: 40, ry: 52, className: 'kx-oval-ring kx-second' }) : null),
      ['tl', 'tr', 'bl', 'br'].map(function (c) { return h('i', { key: c, className: 'kx-corner kx-' + c }); }),
      h('div', { className: 'kx-cam-tag' }, h('span', { className: 'kx-rec' }), st === 'scanning' ? 'Đang nhận diện…' : st === 'found' ? 'Đã tìm thấy' : st === 'fail' ? 'Không khớp' : st === 'multi' ? '2 khuôn mặt' : 'Camera sẵn sàng'),
      null);
  }

  function CamVideo() {
    var ref = useRef(), has = useState(!!stream);
    function attach(s) { has[1](!!s); if (ref.current) { ref.current.srcObject = s || null; if (s) ref.current.play().catch(function () {}); } }
    useEffect(function () { attach(stream); }, []);
    useBridge('camera', attach);
    return h('video', { ref: ref, className: 'kx-video' + (has[0] ? ' is-on' : ''), autoPlay: true, muted: true, playsInline: true, 'aria-hidden': 'true' });
  }

  /* ---------------- 1. Nhận diện ---------------- */
  function Scan(props) {
    var st = useState('idle'), who = useState(null), t = useRef(), since = useRef(0);
    useEffect(function () { return function () { clearTimeout(t.current); }; }, []);
    // nhận kết quả từ bộ nhận diện; giữ đủ 1,4s cho đường quét chạy hết vòng trước khi tô xanh
    function face(r) {
      clearTimeout(t.current);
      var s = r.status || 'idle';
      if (s === 'scanning') { since.current = Date.now(); st[1]('scanning'); who[1](null); return; }
      var wait = st[0] === 'scanning' ? Math.max(0, 1400 - (Date.now() - since.current)) : 0;
      t.current = setTimeout(function () {
        if (s === 'found' && r.person) { st[1]('found'); who[1](r.person); t.current = setTimeout(function () { props.onFound(r.person, 'face'); }, 1400); }
        else { st[1](s === 'found' ? 'fail' : s); who[1](null); }
      }, wait);
    }
    useBridge('face', face);
    function simulate(key) {
      face({ status: 'scanning' });
      setTimeout(function () { face(key === 'fail' || key === 'multi' ? { status: key } : { status: 'found', person: PEOPLE[key] }); }, 1400);
    }
    var msg = {
      idle: ['Nhìn thẳng vào camera', 'Đứng cách màn hình khoảng 50 cm, bỏ khẩu trang và kính râm.'],
      scanning: ['Giữ yên trong giây lát', 'Đang so khớp với khuôn mặt đã đăng ký.'],
      found: ['Đã nhận diện', 'Đang mở tài khoản…'],
      fail: ['Chưa nhận ra bạn', 'Thử lại, hoặc đăng nhập bằng điện thoại / thẻ.'],
      multi: ['Có nhiều người trong khung hình', 'Chỉ một người đứng trước camera rồi thử lại.']
    }[st[0]];
    return h('div', { className: 'kx-scan' },
      h('div', { className: 'kx-scan-cam' }, h(Viewfinder, { state: st[0], person: who[0] })),
      h('div', { className: 'kx-scan-side' },
        h('div', { className: 'kx-brand' }, 'Canteen ', h('b', null, 'POS'), h('span', null, KIOSK.name + ' · Quầy nhận ' + KIOSK.counter)),
        h('div', { className: 'kx-scan-copy' },
          h('div', { className: 'kx-step-tag' }, 'Bước 1/3 · Nhận diện'),
          h('h1', { className: 'kx-h1' }, msg[0]),
          h('p', { className: 'kx-lead' }, msg[1]),
          st[0] === 'fail' || st[0] === 'multi' ? h('div', { className: 'kx-actions' },
            h(C.Button, { size: 'lg', icon: 'face', onClick: function () { st[1]('idle'); emit('retry'); } }, 'Thử lại'),
            h(C.Button, { size: 'lg', variant: 'secondary', icon: 'qr', onClick: props.onPhone }, 'Đăng nhập bằng điện thoại'),
            h(C.Button, { size: 'lg', variant: 'secondary', icon: 'card', onClick: props.onAlt }, 'Quẹt thẻ')) :
            st[0] === 'idle' ? h('div', { className: 'kx-actions kx-actions-split', style: { width: '100%', maxWidth: 560 } },
              h(C.Button, { size: 'lg', variant: 'secondary', icon: 'qr', onClick: props.onPhone }, 'Đăng nhập bằng điện thoại'),
              h(C.Button, { size: 'lg', variant: 'secondary', icon: 'card', onClick: props.onAlt }, 'Quẹt thẻ / QR học sinh')) : null),
        h('div', { className: 'kx-privacy' }, h(C.Icon, { name: 'lock', size: 16 }), 'Ảnh camera chỉ dùng để so khớp tại chỗ, không lưu lại.'),
        DEMO ? h('div', { className: 'pt-demo' },
          h('div', { className: 'pt-demo-label' }, 'Mô phỏng người đứng trước camera'),
          h('div', { className: 'cp-row' },
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { simulate('khoi'); } }, 'HS Khôi · 97%'),
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { simulate('ha'); } }, 'GV Hà · 96%'),
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { simulate('bao'); } }, 'SV Bảo · 84%'),
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { simulate('fail'); } }, 'Người lạ'),
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { simulate('multi'); } }, '2 người'))) : null));
  }

  /* ---------------- 1b. Thẻ / QR thay thế ---------------- */
  function Alt(props) {
    return h('div', { className: 'kx-center' }, h('div', { className: 'kx-card kx-narrow' },
      h(C.NavBar, { title: 'Quẹt thẻ hoặc quét QR', onBack: props.onBack }),
      h('div', { className: 'kx-alt-ill' }, h(C.Icon, { name: 'card', size: 56, stroke: 1.4 }), h(C.Icon, { name: 'qr', size: 56, stroke: 1.4 })),
      h('p', { className: 'kx-lead', style: { textAlign: 'center' } }, 'Đặt thẻ học sinh lên đầu đọc bên phải màn hình, hoặc đưa mã QR trong ứng dụng vào camera.'),
      DEMO ? h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng đầu đọc'),
        h('div', { className: 'cp-row' },
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'card', onClick: function () { props.onFound(PEOPLE.khoi, 'card'); } }, 'Thẻ HS Khôi'),
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'qr', onClick: function () { props.onFound(PEOPLE.bao, 'qr'); } }, 'QR SV Bảo'))) : null));
  }


  /* ---------------- 1c. Đăng nhập bằng điện thoại: kiosk hiện QR, người dùng quét bằng Ví Canteen ---------------- */
  function PhoneLogin(props) {
    var code = useState(Math.random().toString(36).slice(2, 8).toUpperCase()), left = useState(60), st = useState('wait'), who = useState(null);
    useEffect(function () {
      if (st[0] !== 'wait') return;
      var t = setInterval(function () { left[1](function (s) { if (s <= 1) { code[1](Math.random().toString(36).slice(2, 8).toUpperCase()); return 60; } return s - 1; }); }, 1000);
      return function () { clearInterval(t); };
    }, [st[0]]);
    function scanned(p) { who[1](p); st[1]('scanned'); }
    function approve(p) { p = p || who[0]; who[1](p); st[1]('ok'); setTimeout(function () { props.onLogin(p); }, 900); }
    function rejected() { st[1]('wait'); who[1](null); props.say('Đăng nhập bị từ chối trên điện thoại', 'x'); }
    useEffect(function () { emit('loginCode', 'KIOSKLOGIN|K1|' + code[0]); }, [code[0]]);
    useBridge('phone', function (r) { if (r.status === 'scanned' && r.person) scanned(r.person); else if (r.status === 'approved') approve(r.person); else if (r.status === 'rejected') rejected(); });
    var n = 29, seed = 0, s = 'KIOSKLOGIN|K1|' + code[0];
    for (var i = 0; i < s.length; i++) seed = (seed * 31 + s.charCodeAt(i)) >>> 0;
    function rnd() { seed ^= seed << 13; seed >>>= 0; seed ^= seed >> 17; seed ^= seed << 5; seed >>>= 0; return seed / 4294967296; }
    var cells = [];
    function finder(x, y) { for (var a = 0; a < 7; a++) for (var b = 0; b < 7; b++) { if (a === 0 || a === 6 || b === 0 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4)) cells.push([x + a, y + b]); } }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { var inF = (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8); if (!inF && rnd() > 0.52) cells.push([x, y]); }
    return h('div', { className: 'kx-center' }, h('div', { className: 'kx-card kx-narrow kx-phone' },
      h(C.NavBar, { title: 'Đăng nhập bằng điện thoại', onBack: props.onBack }),
      h('div', { className: 'kx-step-tag', style: { textAlign: 'center' } }, 'Bước 1/3 · Nhận diện'),
      h('div', { className: 'kx-pqr' + (st[0] !== 'wait' ? ' is-dim' : '') },
        h('svg', { viewBox: '0 0 ' + n + ' ' + n, role: 'img', 'aria-label': 'Mã QR đăng nhập kiosk', shapeRendering: 'crispEdges' }, cells.map(function (c, i) { return h('rect', { key: i, x: c[0], y: c[1], width: 1, height: 1 }); })),
        st[0] !== 'wait' ? h('div', { className: 'kx-pqr-over' }, h('span', { className: 'kx-avatar' }, who[0].name.split(' ').slice(-2).map(function (w) { return w[0]; }).join('').toUpperCase()),
          h('b', null, who[0].name), h('span', null, st[0] === 'ok' ? 'Đã xác nhận — đang mở menu…' : 'Đang chờ xác nhận trên điện thoại…')) : null),
      st[0] === 'wait' ? h('div', { className: 'mb-ttl kx-ttl' }, h('div', { className: 'mb-ttl-bar' }, h('i', { style: { width: (left[0] / 60 * 100) + '%' } })),
        h('span', null, h(C.Icon, { name: 'sync', size: 16 }), 'Mã đổi sau ', h('b', { className: 'cp-num' }, left[0] + 's'))) : null,
      h('ol', { className: 'kx-psteps' },
        h('li', null, 'Mở ', h('b', null, 'Ví Canteen'), ' trên điện thoại và đăng nhập.'),
        h('li', null, 'Chọn ', h('b', null, '“Đăng nhập kiosk bằng điện thoại”'), ' rồi quét mã này.'),
        h('li', null, 'Bấm ', h('b', null, 'Xác nhận'), ' trên điện thoại — không cần nhận diện khuôn mặt hay PIN.')),
      DEMO ? h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng điện thoại'),
        st[0] === 'wait' ? h('div', { className: 'cp-row' },
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'qr', onClick: function () { scanned(PEOPLE.khoi); } }, 'HS Khôi quét mã'),
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'qr', onClick: function () { scanned(PEOPLE.ha); } }, 'GV Hà quét mã'))
          : st[0] === 'scanned' ? h('div', { className: 'cp-row' },
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'check', onClick: function () { approve(); } }, 'Điện thoại bấm Xác nhận'),
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'x', onClick: rejected }, 'Điện thoại bấm Từ chối')) : null) : null));
  }

  /* ---------------- 2. Xác nhận danh tính ---------------- */
  function Confirm(props) {
    var p = props.person, needPin = props.method === 'face' && p.score < CONFIDENT;
    var pin = useState(''), err = useState(null), tries = useState(0), left = useState(CONFIRM_SECONDS);
    useEffect(function () {
      if (left[0] <= 0) { props.onTimeout(); return; }
      var t = setTimeout(function () { left[1](left[0] - 1); }, 1000);
      return function () { clearTimeout(t); };
    }, [left[0]]);
    function key(k) {
      err[1](null);
      if (k === 'del') return pin[1](pin[0].slice(0, -1));
      var v = (pin[0] + k).slice(0, 4); pin[1](v);
      if (v.length === 4) {
        cfg.verifyPin(p, v).then(function (ok) {
        if (ok) setTimeout(function () { props.onOk(); }, 150);
        else { var n = tries[0] + 1; tries[1](n); setTimeout(function () { pin[1](''); err[1](n >= 3 ? 'Sai 3 lần — vui lòng quẹt thẻ hoặc gặp thu ngân.' : 'Mã PIN chưa đúng, còn ' + (3 - n) + ' lần thử.'); }, 200); }
        });
      }
    }
    return h('div', { className: 'kx-center' }, h('div', { className: 'kx-card kx-confirm' },
      h('div', { className: 'kx-step-tag' }, 'Bước 2/3 · Xác nhận'),
      h('div', { className: 'kx-who' },
        h('div', { className: 'kx-avatar' }, initials(p.name)),
        h('div', null,
          h('div', { className: 'kx-q' }, 'Bạn có phải là'),
          h('div', { className: 'kx-name' }, p.name + '?'),
          h('div', { className: 'kx-sub' }, [p.roleLabel, p.klass, p.id].join(' · ')))),
      h('div', { className: 'kx-count' + (left[0] <= 10 ? ' is-low' : ''), role: 'timer', 'aria-live': left[0] <= 10 ? 'polite' : 'off' },
        h('div', { className: 'kx-count-bar' }, h('i', { style: { width: (Math.max(left[0] - 1, 0) / CONFIRM_SECONDS * 100) + '%' } })),
        h('div', { className: 'kx-count-text' },
          h('span', null, needPin ? 'Nhập PIN trong ' : 'Xác nhận trong '), h('strong', { className: 'cp-num' }, left[0] + ' giây'),
          h('span', null, ' · hết giờ sẽ tự hủy và mời người tiếp theo'))),
      props.method === 'face' ? h('div', { className: 'kx-score' + (needPin ? ' is-low' : '') },
        h(C.Icon, { name: needPin ? 'alert' : 'check', size: 18 }),
        h('span', null, 'Độ khớp ', h('strong', { className: 'cp-num' }, p.score + '%'), needPin ? ' · dưới ngưỡng ' + CONFIDENT + '%, cần nhập PIN' : ' · đạt ngưỡng tin cậy')) :
        h(C.StatusBadge, { tone: 'success', icon: props.method === 'qr' ? 'qr' : 'card' }, props.method === 'qr' ? 'Đã đọc mã QR' : 'Đã đọc thẻ'),
      needPin ? h('div', { className: 'kx-pin' },
        h('div', { className: 'kx-pin-label' }, 'Nhập mã PIN 4 số của bạn', h('small', null, ' (thử: ' + p.pin + ')')),
        h('div', { className: 'kx-pin-dots', 'aria-label': pin[0].length + ' trên 4 số' }, [0, 1, 2, 3].map(function (i) { return h('i', { key: i, className: i < pin[0].length ? 'on' : '' }); })),
        err[0] ? h(C.InlineNote, { tone: 'danger' }, err[0]) : null,
        h('div', { className: 'kx-pad' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(function (k, i) {
          return k === '' ? h('span', { key: i }) : h('button', { key: i, type: 'button', disabled: tries[0] >= 3, onClick: function () { key(k); }, 'aria-label': k === 'del' ? 'Xóa' : k }, k === 'del' ? '⌫' : k);
        }))) : null,
      h('div', { className: 'kx-actions kx-actions-split' },
        h(C.Button, { size: 'lg', variant: 'secondary', icon: 'x', onClick: props.onNo }, 'Không phải tôi'),
        needPin ? null : h(C.Button, { size: 'lg', icon: 'check', onClick: props.onOk }, 'Đúng, là tôi'))));
  }

  /* ---------------- 3. Menu với tài khoản ---------------- */
  function Menu(props) {
    var p = props.person, cart = props.cart;
    var cat = useState('all'), sheet = useState(false);
    var qty = {}; cart.forEach(function (l) { qty[l.code] = l.qty; });
    var total = cart.reduce(function (s, l) { return s + priceOf(itemOf(l.code)) * l.qty; }, 0);
    var limLeft = p.limit ? p.limit.max - p.limit.used : null;
    var spend = p.real + p.bonus, canSpend = limLeft == null ? spend : Math.min(spend, limLeft);
    var left = canSpend - total;
    var items = MENU.filter(function (m) { return cat[0] === 'all' || m.cat === cat[0]; });
    var count = cart.reduce(function (s, l) { return s + l.qty; }, 0);

    function card(m) {
      var blocked = p.blocked && m.group && p.blocked.indexOf(m.group) >= 0;
      var stockLeft = m.stock != null ? m.stock - (qty[m.code] || 0) : null;
      var out = m.soldout || stockLeft === 0, price = priceOf(m);
      var tooMuch = !blocked && !out && left >= 0 && price > left;
      var dis = blocked || out;
      return h('button', { key: m.code, type: 'button', className: 'kx-item' + (qty[m.code] ? ' is-on' : '') + (dis ? ' is-off' : '') + (blocked ? ' is-blocked' : ''), disabled: dis, onClick: function () { props.add(m.code); } },
        h('span', { className: 'kx-item-ph kx-ph-' + m.cat }, h('span', null, m.code)),
        h('span', { className: 'kx-item-body' },
          h('span', { className: 'kx-item-name' }, m.name),
          h('span', { className: 'kx-item-desc' }, m.desc), h('span', { className: 'kx-item-al' + (m.al ? ' has' : '') }, m.al ? 'Có chứa: ' + m.al : 'Không chứa chất gây dị ứng phổ biến'),
          h('span', { className: 'kx-item-foot' },
            h('span', null, m.promoPct ? h(C.Money, { value: m.price, strike: true }) : null, ' ', h(C.Money, { value: price })),
            blocked ? h(C.StatusBadge, { tone: 'danger', icon: 'lock' }, 'Không dành cho HS') :
              out ? h(C.StatusBadge, { tone: 'neutral', icon: 'ban' }, 'Hết món') :
                tooMuch ? h(C.StatusBadge, { tone: 'warning', icon: 'wallet' }, 'Vượt số dư') :
                  stockLeft != null ? h('span', { className: 'cp-muted', style: { fontSize: 13 } }, 'Còn ' + stockLeft) :
                    m.promoPct ? h(C.StatusBadge, { tone: 'accent', icon: 'tag' }, '−' + m.promoPct + '%') : h('span', { className: 'kx-add' }, h(C.Icon, { name: 'plus', size: 20 })))),
        qty[m.code] ? h('span', { className: 'cp-item-qty' }, qty[m.code]) : null);
    }

    var cartPanel = h('aside', { className: 'kx-cart' + (sheet[0] ? ' is-open' : '') },
      h('div', { className: 'kx-cart-head' }, h('span', { className: 'cp-h2' }, 'Món đã chọn'), h('span', { className: 'cp-muted' }, count + ' món'),
        h('button', { type: 'button', className: 'kx-sheet-close', 'aria-label': 'Đóng', onClick: function () { sheet[1](false); } }, h(C.Icon, { name: 'x' }))),
      cart.length ? h('div', { className: 'kx-cart-lines' }, cart.map(function (l, i) {
        var m = itemOf(l.code);
        return h('div', { className: 'kx-line', key: l.code },
          h('div', { style: { minWidth: 0 } }, h('div', { className: 'cp-line-name' }, m.name), h('div', { className: 'cp-line-unit' }, fmt(priceOf(m)))),
          h('span', { className: 'cp-stepper' },
            h('button', { type: 'button', 'aria-label': 'Giảm', onClick: function () { props.qty(i, -1); } }, h(C.Icon, { name: l.qty <= 1 ? 'x' : 'minus', size: 18 })),
            h('output', null, l.qty),
            h('button', { type: 'button', 'aria-label': 'Tăng', onClick: function () { props.add(l.code); } }, h(C.Icon, { name: 'plus', size: 18 }))));
      })) : h('div', { className: 'kx-cart-empty' }, h(C.Icon, { name: 'tag', size: 28 }), 'Chạm vào món để thêm'),
      h('div', { className: 'kx-cart-sum' },
        h('div', { className: 'cp-sum-row is-total' }, h('span', null, 'Tổng'), h(C.Money, { value: total, size: 'lg' })),
        h('div', { className: 'cp-sum-row' }, h('span', { className: 'cp-muted' }, 'Còn được dùng sau đơn'), h(C.Money, { value: Math.max(0, left), tone: left < 0 ? 'danger' : null })),
        left < 0 ? h(C.InlineNote, { tone: 'danger' }, 'Vượt ' + fmt(-left) + (limLeft != null && limLeft < spend ? ' so với hạn mức hôm nay' : ' so với số dư ví') + '. Bớt món, hoặc thanh toán phần thiếu tại quầy thu ngân.') : null,
        h(C.Button, { size: 'lg', block: true, icon: 'wallet', disabled: !cart.length, onClick: props.checkout }, left < 0 ? 'Tiếp tục — trả phần thiếu tại quầy' : 'Thanh toán bằng ví')));

    return h('div', { className: 'kx-menu' },
      h('header', { className: 'kx-top' },
        h('div', { className: 'kx-top-who' }, h('span', { className: 'kx-avatar sm' }, initials(p.name)),
          h('span', null, h('b', null, 'Chào ' + p.name.split(' ').pop()), h('small', null, [p.roleLabel, p.klass].join(' · ')))),
        h('div', { className: 'kx-wallet' },
          h('div', { className: 'kx-w' }, h('small', null, 'Tiền thật'), h(C.Money, { value: p.real })),
          h('div', { className: 'kx-w is-bonus' }, h('small', null, 'Tiền thưởng'), h(C.Money, { value: p.bonus, tone: 'accent' })),
          limLeft != null ? h('div', { className: 'kx-w is-limit' }, h('small', null, 'Hạn mức còn'), h(C.Money, { value: limLeft })) : null),
        h('div', { className: 'kx-top-right' },
          h('span', { className: 'kx-idle' + (props.idle <= 15 ? ' is-warn' : ''), title: 'Tự đăng xuất khi không thao tác' }, h(C.Icon, { name: 'clock', size: 16 }), props.idle + 's'),
          h(C.Button, { variant: 'secondary', icon: 'x', onClick: props.logout }, 'Thoát'))),
      p.blocked ? h('div', { className: 'kx-rule' }, h(C.Icon, { name: 'lock', size: 16 }), 'Theo cài đặt của phụ huynh/nhà trường, ' + p.blocked.join(' và ').toLowerCase() + ' không bán cho tài khoản này.') : null,
      h('div', { className: 'kx-body' },
        h('div', { className: 'kx-main' },
          h('div', { className: 'kx-step-tag' }, 'Bước 3/3 · Chọn món'),
          h(C.CategoryTabs, { items: CATS.map(function (c) { return { id: c.id, label: c.label }; }), active: cat[0], onChange: cat[1] }),
          h('div', { className: 'kx-grid' }, items.map(card))),
        cartPanel),
      h('button', { type: 'button', className: 'kx-fab', disabled: !cart.length, onClick: function () { sheet[1](true); } },
        h('span', { className: 'kx-fab-l' }, h('span', { className: 'kx-fab-n' }, count), h('span', null, count ? 'Xem đơn & thanh toán' : 'Chưa chọn món')),
        h('b', { className: 'cp-num' }, fmt(total))),
      sheet[0] ? h('div', { className: 'kx-scrim', onClick: function () { sheet[1](false); } }) : null);
  }

  /* ---------------- 4. Thanh toán ---------------- */
  function Pay(props) {
    var p = props.person, cart = props.cart, mode = useState('now');
    var total = cart.reduce(function (s, l) { return s + priceOf(itemOf(l.code)) * l.qty; }, 0);
    var limLeft = p.limit ? p.limit.max - p.limit.used : Infinity;
    var cap = Math.min(total, limLeft);
    var bonus = Math.min(p.bonus, cap), real = Math.min(p.real, cap - bonus), short = total - bonus - real;
    var add = p.uni ? etaAdd(QUEUE) : 10;
    var pickup = mode[0] === 'now' ? addMin(add) : '11:30';
    return h('div', { className: 'kx-center' }, h('div', { className: 'kx-card kx-pay' },
      h(C.NavBar, { title: 'Xác nhận thanh toán', onBack: props.onBack }),
      h('div', { className: 'kx-pay-grid' },
        h('div', { className: 'cp-stack' },
          h(C.SectionLabel, null, 'Đơn của ' + p.name),
          h('div', { className: 'cp-card' }, cart.map(function (l) {
            var m = itemOf(l.code);
            return h(C.ListRow, { key: l.code, title: l.qty + ' × ' + m.name, value: fmt(priceOf(m)) + ' / phần', trailing: h(C.Money, { value: priceOf(m) * l.qty }) });
          })),
          h(C.SectionLabel, null, 'Nhận món'),
          h('div', { className: 'kx-seg' },
            h('button', { type: 'button', 'aria-pressed': String(mode[0] === 'now'), onClick: function () { mode[1]('now'); } }, h('b', null, 'Lấy ngay'), h('small', null, 'Quầy ' + KIOSK.counter + ' · khoảng ' + pickup)),
            h('button', { type: 'button', 'aria-pressed': String(mode[0] === 'later'), onClick: function () { mode[1]('later'); } }, h('b', null, 'Giờ nghỉ trưa'), h('small', null, 'Quầy ' + KIOSK.counter + ' · 11:30'))),
          p.uni && mode[0] === 'now' ? h(C.InlineNote, { tone: 'info' }, 'Canteen đang có ' + QUEUE + ' đơn chờ → sinh viên cộng thêm ' + add + ' phút.') : null),
        h('div', { className: 'cp-stack' },
          h(C.SectionLabel, null, 'Trừ ví'),
          h('div', { className: 'cp-card is-padded cp-stack', style: { gap: 10 } },
            h('div', { className: 'cp-sum-row' }, h('span', null, 'Tổng đơn'), h(C.Money, { value: total })),
            h('div', { className: 'cp-sum-row is-discount' }, h('span', null, 'Tiền thưởng (dùng trước)'), h(C.Money, { value: -bonus })),
            h('div', { className: 'cp-sum-row' }, h('span', null, 'Tiền thật'), h(C.Money, { value: -real })),
            short > 0 ? h('div', { className: 'cp-change is-short' }, h('label', null, h(C.Icon, { name: 'alert' }), 'Trả tại quầy thu ngân'), h(C.Money, { value: short, size: 'lg' })) : null,
            h('div', { className: 'cp-sum-row is-total' }, h('span', null, 'Số dư sau đơn'), h(C.Money, { value: p.real + p.bonus - bonus - real }))),
          short > 0 ? h(C.InlineNote, null, 'Đơn sẽ chờ ở quầy thu ngân cho tới khi bạn trả ' + fmt(short) + ' bằng tiền mặt hoặc QR.') : null,
          h(C.Button, { size: 'lg', block: true, icon: 'check', onClick: function () { var o = { bonus: bonus, real: real, short: short, pickup: pickup, total: total }; if (!cfg.pay) return props.onPaid(o); cfg.pay(Object.assign({ person: p, cart: props.cart }, o)).then(function (res) { props.onPaid(Object.assign(o, res || {})); }, function () { props.say && props.say('Chưa trừ được ví — thử lại hoặc gặp thu ngân', 'alert'); }); } }, short > 0 ? 'Trừ ví ' + fmt(bonus + real) + ' & gửi đơn' : 'Trừ ví ' + fmt(total))))));
  }

  /* ---------------- 5. Hoàn tất ---------------- */
  function Done(props) {
    var r = props.result, p = props.person, sec = useState(12);
    useEffect(function () { var t = setInterval(function () { sec[1](function (s) { if (s <= 1) { clearInterval(t); props.onExit(); return 0; } return s - 1; }); }, 1000); return function () { clearInterval(t); }; }, []);
    return h('div', { className: 'kx-center' }, h('div', { className: 'kx-card kx-done' },
      h('div', { className: 'kx-done-icon' + (r.short ? ' is-warn' : '') }, h(C.Icon, { name: r.short ? 'clock' : 'check', size: 40, stroke: 2.4 })),
      h('div', { className: 'kx-q' }, r.short ? 'Đơn đã gửi — còn ' + fmt(r.short) + ' trả tại quầy' : 'Đặt món thành công'),
      h('div', { className: 'kx-ticket cp-num' }, r.code),
      h('p', { className: 'kx-lead' }, 'Đọc mã này ở ', h('b', null, 'Quầy ' + KIOSK.counter), ', khoảng ', h('b', null, r.pickup), '. Màn hình quầy sẽ báo khi món sẵn sàng.'),
      h('div', { className: 'cp-card is-padded kx-done-sum' },
        h('div', { className: 'cp-sum-row' }, h('span', null, 'Đã trừ tiền thưởng'), h(C.Money, { value: r.bonus, tone: 'accent' })),
        h('div', { className: 'cp-sum-row' }, h('span', null, 'Đã trừ tiền thật'), h(C.Money, { value: r.real })),
        h('div', { className: 'cp-sum-row is-total' }, h('span', null, 'Số dư còn lại'), h(C.Money, { value: p.real + p.bonus }))),
      h(C.Button, { size: 'lg', block: true, onClick: props.onExit }, 'Xong · đăng xuất (' + sec[0] + 's)')));
  }

  /* ---------------- App ---------------- */
  function App() {
    var step = useState('scan'), person = useState(null), method = useState('face'), cart = useState([]), result = useState(null), idle = useState(IDLE_SECONDS), seq = useState(153), toast = useState(null);
    var tt = useRef();
    function say(t, i) { toast[1]({ text: t, icon: i }); clearTimeout(tt.current); tt.current = setTimeout(function () { toast[1](null); }, 3000); }
    function reset(msg, evt) { if (step[0] !== 'scan') emit(evt || 'logout', person[0]); step[1]('scan'); person[1](null); cart[1]([]); result[1](null); idle[1](IDLE_SECONDS); if (msg) say(msg, 'user'); }

    // tự đăng xuất khi không thao tác ở menu / thanh toán
    useEffect(function () {
      if (step[0] !== 'menu' && step[0] !== 'pay' && step[0] !== 'confirm') return;
      var t = setInterval(function () { idle[1](function (s) { if (s <= 1) { clearInterval(t); reset('Đã tự đăng xuất do không thao tác'); return IDLE_SECONDS; } return s - 1; }); }, 1000);
      function poke() { idle[1](IDLE_SECONDS); }
      window.addEventListener('pointerdown', poke); window.addEventListener('keydown', poke);
      return function () { clearInterval(t); window.removeEventListener('pointerdown', poke); window.removeEventListener('keydown', poke); };
    }, [step[0]]);

    function found(p, m) { person[1](Object.assign({}, p)); method[1](m || 'face'); step[1]('confirm'); idle[1](IDLE_SECONDS); }
    // đầu đọc thẻ / QR đọc được ở màn nhận diện hoặc màn thẻ
    useBridge('card', function (r) { if ((step[0] === 'scan' || step[0] === 'alt') && r.person) found(r.person, r.method); });
    function add(code) { var c = cart[0].slice(), i = c.findIndex(function (l) { return l.code === code; }); var m = itemOf(code); if (m.stock != null && i >= 0 && c[i].qty >= m.stock) return; if (i >= 0) c[i] = { code: code, qty: c[i].qty + 1 }; else c.push({ code: code, qty: 1 }); cart[1](c); }
    function qty(i, d) { cart[1](cart[0].map(function (l, j) { return j === i ? { code: l.code, qty: l.qty + d } : l; }).filter(function (l) { return l.qty > 0; })); }
    function paid(r) {
      var p = Object.assign({}, person[0]); p.bonus -= r.bonus; p.real -= r.real; if (p.limit) p.limit = { used: p.limit.used + r.bonus + r.real, max: p.limit.max };
      var key = Object.keys(PEOPLE).filter(function (k) { return PEOPLE[k].id === p.id; })[0]; if (key) PEOPLE[key] = Object.assign({}, PEOPLE[key], { real: p.real, bonus: p.bonus, limit: p.limit });
      emit('paid', Object.assign({ person: p, cart: cart[0] }, r));
      person[1](p); result[1](Object.assign({ code: 'K-' + String(seq[0]).padStart(4, '0') }, r)); seq[1](seq[0] + 1); cart[1]([]); step[1]('done');
    }

    var screen;
    if (step[0] === 'scan') screen = h(Scan, { onFound: found, onAlt: function () { step[1]('alt'); }, onPhone: function () { step[1]('phone'); } });
    else if (step[0] === 'phone') screen = h(PhoneLogin, { say: say, onBack: function () { step[1]('scan'); }, onLogin: function (p) { emit('confirmed', { person: p, method: 'phone' }); person[1](Object.assign({}, p)); method[1]('phone'); step[1]('menu'); idle[1](IDLE_SECONDS); say('Đã đăng nhập qua điện thoại · ' + p.name, 'check'); } });
    else if (step[0] === 'alt') screen = h(Alt, { onBack: function () { step[1]('scan'); }, onFound: found });
    else if (step[0] === 'confirm') screen = h(Confirm, { person: person[0], method: method[0], onOk: function () { emit('confirmed', { person: person[0], method: method[0] }); step[1]('menu'); say('Đã đăng nhập tài khoản ' + person[0].name, 'check'); }, onNo: function () { reset('Đã hủy — mời người tiếp theo', 'cancel'); }, onTimeout: function () { reset('Hết 30 giây chưa xác nhận — đã hủy', 'cancel'); } });
    else if (step[0] === 'menu') screen = h(Menu, { person: person[0], cart: cart[0], add: add, qty: qty, idle: idle[0], logout: function () { reset('Đã đăng xuất'); }, checkout: function () { step[1]('pay'); } });
    else if (step[0] === 'pay') screen = h(Pay, { person: person[0], cart: cart[0], onBack: function () { step[1]('menu'); }, onPaid: paid });
    else screen = h(Done, { person: person[0], result: result[0], onExit: function () { reset(); } });

    return h('div', { className: 'kx-app' }, screen,
      toast[0] ? h('div', { className: 'pt-toast', role: 'status' }, h(C.Icon, { name: toast[0].icon || 'check' }), toast[0].text) : null);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
