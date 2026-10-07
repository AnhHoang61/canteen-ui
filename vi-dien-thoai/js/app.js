(function () {
  var C = window.CanteenPOS, h = React.createElement, useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;
  var fmt = C.formatVND;

  /* ---------------- Dữ liệu mẫu (dùng chung cho mọi tài khoản trong bản dùng thử) ---------------- */
  var SCHOOL = 'THCS & THPT Giảng Võ';
  var BANK = { name: 'VietinBank', account: '1140 2026 8888', holder: 'CANTEEN TRUONG GIANG VO' };
  var PRESETS = [50000, 100000, 200000, 300000, 500000, 1000000];
  var MIN = 10000, MAX = 5000000;
  var PROMO = { from: 500000, gift: 50000, days: 30, until: '31/10' }; // nạp 500k tặng 50k tiền thưởng, hạn dùng 30 ngày
  var QR_TTL = 30;
  var LIMIT_PRESETS = [20000, 30000, 50000, 60000, 80000, 100000];
  var FOOD_GROUPS = [
    { id: 'Nước ngọt có ga', ex: 'Coca-Cola, Pepsi, 7Up' },
    { id: 'Đồ chiên rán', ex: 'Khoai tây chiên, gà rán' },
    { id: 'Đồ ăn vặt đóng gói', ex: 'Snack, bim bim, xúc xích' },
    { id: 'Kẹo & bánh ngọt', ex: 'Kẹo, bánh kem, bánh quy' },
    { id: 'Trà sữa & cà phê', ex: 'Trà sữa, cà phê, nước tăng lực' },
    { id: 'Đồ ăn cay', ex: 'Mì cay, tokbokki' }
  ];
  // Khung giờ bán của Canteen A — phụ huynh chọn khung con được mua (4.4.3)
  var WINDOWS = [{ id: 'w1', label: 'Trước giờ học', t: '06:30–07:15', from: '06:30', to: '07:15' }, { id: 'w2', label: 'Ra chơi', t: '09:15–09:45', from: '09:15', to: '09:45' }, { id: 'w3', label: 'Nghỉ trưa', t: '11:15–12:30', from: '11:15', to: '12:30' }, { id: 'w4', label: 'Tan học', t: '16:30–17:30', from: '16:30', to: '17:30' }];
  var ALL_W = ['w1', 'w2', 'w3', 'w4'];
  var COUNTERS = [{ id: '1', name: 'Quầy 1', desc: 'Đồ uống, tráng miệng' }, { id: '2', name: 'Quầy 2', desc: 'Cơm, bún, mì' }, { id: '3', name: 'Quầy 3', desc: 'Ăn sáng, ăn vặt' }];

  var DB = {
    accounts: {
      khoi: { key: 'khoi', login: 'HS-208317', role: 'student', name: 'Trần Minh Khôi', id: 'HS-208317', klass: 'Lớp 8A3', wallet: { real: 42000, bonus: 10000 }, limit: { used: 12000, max: 60000 }, blocked: ['Nước ngọt có ga', 'Đồ chiên rán'], blockedItems: [], edited: 'Phụ huynh Trần Văn Nam · 02/10', faceConsent: true, face: { at: '01/10/2026' }, windows: ['w2', 'w3', 'w4'], classMeal: true, bonusExp: '31/10/2026' },
      linh: { key: 'linh', login: 'HS-260114', role: 'student', name: 'Trần Bảo Linh', id: 'HS-260114', klass: 'Lớp 6A1', wallet: { real: 65000, bonus: 0 }, limit: { used: 0, max: 40000 }, blocked: ['Nước ngọt có ga', 'Kẹo & bánh ngọt', 'Trà sữa & cà phê'], blockedItems: [], edited: 'Phụ huynh Trần Văn Nam · 28/09', faceConsent: false, face: null, windows: ['w3'], classMeal: true },
      an: { key: 'an', login: 'HS-208302', role: 'student', name: 'Nguyễn Hoàng An', id: 'HS-208302', klass: 'Lớp 8A3', wallet: { real: 15000, bonus: 5000 }, limit: { used: 30000, max: 50000 }, blocked: [], blockedItems: [], edited: 'Chưa thay đổi', windows: ALL_W, classMeal: true, bonusExp: '15/10/2026' },
      binh: { key: 'binh', login: 'HS-208305', role: 'student', name: 'Lê Thanh Bình', id: 'HS-208305', klass: 'Lớp 8A3', wallet: { real: 120000, bonus: 0 }, limit: { used: 0, max: 80000 }, blocked: ['Trà sữa & cà phê'], blockedItems: [], edited: 'Phụ huynh · 15/09', windows: ALL_W, classMeal: true },
      mai: { key: 'mai', login: 'HS-208319', role: 'student', name: 'Đỗ Ngọc Mai', id: 'HS-208319', klass: 'Lớp 8A3', wallet: { real: 3000, bonus: 0 }, limit: { used: 0, max: 50000 }, blocked: [], blockedItems: [], edited: 'Phụ huynh · 20/09', windows: ALL_W, classMeal: false },
      nam: { key: 'nam', login: '0912345678', role: 'parent', name: 'Trần Văn Nam', id: '0912 345 678', children: ['khoi', 'linh'] },
      ha: { key: 'ha', login: 'GV-0451', role: 'teacher', name: 'Phạm Thu Hà', id: 'GV-0451', klass: 'Tổ Ngữ văn · GVCN 8A3', homeroom: '8A3', students: ['khoi', 'an', 'binh', 'mai'], children: ['minh'], wallet: { real: 315000, bonus: 20000 }, limit: null, face: { at: '28/09/2026' }, bonusExp: '20/10/2026' },
      minh: { key: 'minh', login: 'HS-270233', role: 'student', name: 'Lê Đức Minh', id: 'HS-270233', klass: 'Lớp 7B2', wallet: { real: 48000, bonus: 0 }, limit: { used: 15000, max: 50000 }, blocked: ['Đồ ăn cay'], blockedItems: [], edited: 'Phụ huynh Phạm Thu Hà · 01/10', faceConsent: true, face: null, windows: ALL_W, classMeal: true },
      bao: { key: 'bao', login: 'SV-K20-118', role: 'university', name: 'Lê Gia Bảo', id: 'SV-K20-118', klass: 'Đại học · K20 CNTT', wallet: { real: 18000, bonus: 5000 }, limit: null, bonusExp: '12/10/2026' },
      tuan: { key: 'tuan', login: 'GV-0388', role: 'teacher', name: 'Vũ Anh Tuấn', id: 'GV-0388', klass: 'Tổ Toán', wallet: { real: 120000, bonus: 0 }, limit: null }
    },
    tx: {
      khoi: [
        { id: 'DH-0404', t: 'Hôm nay · 07:31', kind: 'buy', title: 'Xôi xéo', place: 'Canteen A · Quầy 2', real: -20000, items: [{ name: 'Xôi xéo', qty: 1, price: 20000 }], staff: 'NV Lan' },
        { id: 'NAP-2291', t: 'Hôm qua · 19:05', kind: 'topup', title: 'Nạp tiền qua VietQR', place: 'Phụ huynh Trần Văn Nam', real: 100000 },
        { id: 'DH-0377', t: 'Hôm qua · 11:42', kind: 'buy', title: 'Bún bò Huế, Trà đào', place: 'Canteen A · Kiosk K1', real: -40000, bonus: -10000, items: [{ name: 'Bún bò Huế', qty: 1, price: 40000 }, { name: 'Trà đào', qty: 1, price: 15000 }], disc: 5000, discLabel: 'KM bún bò −10%' },
        { id: 'HT-0012', t: '03/10 · 12:10', kind: 'refund', title: 'Hoàn món lỗi — Bún bò Huế', place: 'Canteen A · Quầy 2', real: 36000 },
        { id: 'TH-0905', t: '01/10 · 08:00', kind: 'bonus', title: 'Tiền thưởng tháng 10', place: 'Nhà trường', bonus: 20000 }
      ],
      linh: [{ id: 'NAP-2277', t: '04/10 · 20:12', kind: 'topup', title: 'Nạp tiền qua VietQR', place: 'Phụ huynh Trần Văn Nam', real: 100000 }, { id: 'DH-0350', t: '04/10 · 10:05', kind: 'buy', title: 'Bánh mì trứng, Sữa chua', place: 'Canteen A · Quầy 1', real: -23000 }],
      minh: [{ id: 'DH-0391', t: 'Hôm nay · 07:12', kind: 'buy', title: 'Bánh mì trứng', place: 'Canteen A · Kiosk K1', real: -15000 }],
      bao: [{ id: 'DH-0388', t: 'Hôm qua · 11:50', kind: 'buy', title: 'Cơm rang dưa bò', place: 'Canteen A · Quầy 2', real: -38000 }],
      tuan: [{ id: 'DH-0399', t: 'Hôm nay · 06:58', kind: 'buy', title: 'Phở gà', place: 'Canteen A · Quầy 2', real: -35000 }],
      ha: [{ id: 'DH-0402', t: 'Hôm nay · 07:05', kind: 'buy', title: 'Phở gà, Trà đào', place: 'Canteen A · Quầy 2', real: -40000, bonus: -10000 }],
      an: [], binh: [], mai: []
    }
  };
  var DEMO = [
    { key: 'khoi', label: 'Học sinh', who: 'Trần Minh Khôi', login: 'HS-208317' },
    { key: 'nam', label: 'Phụ huynh', who: 'Trần Văn Nam', login: '0912345678' },
    { key: 'ha', label: 'GV có con', who: 'Phạm Thu Hà', login: 'GV-0451' },
    { key: 'tuan', label: 'Giáo viên', who: 'Vũ Anh Tuấn', login: 'GV-0388' },
    { key: 'bao', label: 'Sinh viên', who: 'Lê Gia Bảo', login: 'SV-K20-118' }
  ];
  var PASSWORD = '123456';
  DB.pass = { khoi: PASSWORD, nam: PASSWORD, ha: PASSWORD, tuan: PASSWORD, bao: PASSWORD };
  // Ngày sinh dùng để xác minh khi phụ huynh liên kết con
  var DOB = { khoi: '12/03/2012', linh: '05/09/2014', an: '21/07/2012', binh: '02/02/2012', mai: '30/10/2012', minh: '20/11/2013' };
  // Danh sách nhà trường đã cấp mã nhưng chưa kích hoạt
  var ROSTER = {
    'GV-0412': { role: 'teacher', name: 'Nguyễn Thị Hồng', klass: 'Tổ Tiếng Anh' },
    'HS-208302': { role: 'student', key: 'an' },
    'SV-K21-045': { role: 'university', name: 'Phạm Minh Châu', klass: 'Đại học · K21 Kinh tế' }
  };
  var OTP = '246810';
  var ROLE = { student: 'Học sinh', parent: 'Phụ huynh', teacher: 'Giáo viên', university: 'Sinh viên' };

  function now() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function initials(n) { var p = n.split(' '); return (p[p.length - 2][0] + p[p.length - 1][0]).toUpperCase(); }
  function rndCode() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
  function bonusFor(a) { return Math.floor(a / PROMO.from) * PROMO.gift; }
  function expIn(days) { var d = new Date(Date.now() + days * 864e5); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }
  function acc(k) { return DB.accounts[k]; }
  function limLeftOf(a) { return a.limit && a.limit.max != null ? Math.max(0, a.limit.max - a.limit.used) : Infinity; }
  function managedOf(me) { return me.children || []; }
  function isParent(me) { return me.role === 'parent' || !!(me.children && me.children.length); }
  function shortMoney(v) { return v >= 1000000 ? v / 1000000 + ' triệu' : v / 1000 + 'k'; }

  /* Mã QR minh họa */
  function QR(props) {
    var n = 29, seed = 0, s = props.value || 'x';
    for (var i = 0; i < s.length; i++) seed = (seed * 31 + s.charCodeAt(i)) >>> 0;
    function rnd() { seed ^= seed << 13; seed >>>= 0; seed ^= seed >> 17; seed ^= seed << 5; seed >>>= 0; return seed / 4294967296; }
    var cells = [];
    function finder(x, y) { for (var a = 0; a < 7; a++) for (var b = 0; b < 7; b++) { if (a === 0 || a === 6 || b === 0 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4)) cells.push([x + a, y + b]); } }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var inF = (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
      var mid = props.logo && x >= 11 && x <= 17 && y >= 11 && y <= 17;
      if (!inF && !mid && rnd() > 0.52) cells.push([x, y]);
    }
    return h('div', { className: 'mb-qr' + (props.dim ? ' is-dim' : '') },
      h('svg', { viewBox: '0 0 ' + n + ' ' + n, role: 'img', 'aria-label': props.label, shapeRendering: 'crispEdges' },
        cells.map(function (c, i) { return h('rect', { key: i, x: c[0], y: c[1], width: 1, height: 1 }); })),
      props.logo ? h('span', { className: 'mb-qr-logo' }, props.logo) : null,
      props.overlay || null);
  }

  function Header(props) {
    return h('header', { className: 'mb-head' },
      props.onBack ? h('button', { type: 'button', className: 'mb-icon-btn', 'aria-label': 'Quay lại', onClick: props.onBack }, h(C.Icon, { name: 'back', size: 24 })) : h('span', { className: 'mb-icon-sp' }),
      h('h1', null, props.title),
      props.right || h('span', { className: 'mb-icon-sp' }));
  }

  /* ---------------- Đăng nhập ---------------- */
  function Login(props) {
    var u = useState(''), p = useState(''), show = useState(false), err = useState(null), busy = useState(false);
    function submit(e) {
      e.preventDefault();
      var norm = function (x) { return String(x).toLowerCase().replace(/\s/g, ''); };
      var key = Object.keys(DB.pass).filter(function (k) { return norm(DB.accounts[k].login) === norm(u[0]); })[0];
      if (!u[0].trim() || !p[0]) return err[1]('Nhập tài khoản và mật khẩu.');
      if (!key || p[0] !== DB.pass[key]) return err[1]('Tài khoản hoặc mật khẩu chưa đúng.');
      busy[1](true); setTimeout(function () { props.onLogin(key); }, 400);
    }
    function fill(d) { u[1](d.login); p[1](PASSWORD); err[1](null); }
    return h('form', { className: 'mb-login', onSubmit: submit },
      h('div', { className: 'mb-login-top' },
        h('div', { className: 'mb-logo' }, h(C.Icon, { name: 'wallet', size: 30 })),
        h('h1', null, 'Ví Canteen'),
        h('p', null, SCHOOL)),
      h('div', { className: 'mb-login-form' },
        h(C.Field, { id: 'lg-user', label: 'Mã học sinh / giáo viên hoặc số điện thoại', icon: 'user', placeholder: 'VD: HS-208317 hoặc 0912…', value: u[0], onChange: function (e) { u[1](e.target.value); err[1](null); } }),
        h('div', { className: 'mb-pass' },
          h(C.Field, { id: 'lg-pass', label: 'Mật khẩu', icon: 'lock', type: show[0] ? 'text' : 'password', placeholder: '••••••', value: p[0], error: err[0], onChange: function (e) { p[1](e.target.value); err[1](null); } }),
          h('button', { type: 'button', className: 'mb-pass-eye', onClick: function () { show[1](!show[0]); } }, show[0] ? 'Ẩn' : 'Hiện')),
        h('button', { type: 'button', className: 'mb-link mb-forgot', onClick: function () { props.say('Liên hệ văn phòng nhà trường để cấp lại mật khẩu', 'info'); } }, 'Quên mật khẩu?'),
        h(C.Button, { type: 'submit', size: 'lg', block: true, disabled: busy[0] }, busy[0] ? 'Đang đăng nhập…' : 'Đăng nhập'),
        h('p', { className: 'mb-login-note' }, 'Học sinh, giáo viên dùng mã do nhà trường cấp. Phụ huynh dùng số điện thoại đã đăng ký. Giáo viên có con học tại trường dùng một tài khoản cho cả hai.'),
        h('div', { className: 'mb-signup-cta' }, h('span', null, 'Chưa có tài khoản?'), h(C.Button, { variant: 'secondary', block: true, icon: 'user', onClick: props.onRegister }, 'Tạo tài khoản'))),
      h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Tài khoản dùng thử · mật khẩu 123456'),
        h('div', { className: 'mb-demo-accs' }, DEMO.map(function (d) {
          return h('button', { key: d.key, type: 'button', onClick: function () { fill(d); } }, h('b', null, d.label), h('small', null, d.who));
        }))));
  }


  /* ---------------- Tạo tài khoản ---------------- */
  var REG_ROLES = [
    { id: 'parent', icon: 'users', title: 'Phụ huynh', desc: 'Đăng ký bằng số điện thoại, liên kết với tài khoản của con để nạp tiền, đặt hạn mức và chặn món.' },
    { id: 'teacher', icon: 'user', title: 'Giáo viên, nhân viên', desc: 'Kích hoạt bằng mã giáo viên nhà trường cấp. Có ví riêng để mua ở căng tin; có con học tại trường thì liên kết thêm.' },
    { id: 'university', icon: 'user', title: 'Sinh viên', desc: 'Kích hoạt bằng mã sinh viên. Tự nạp tiền, tự quản lý ví và đặt món — không cần tài khoản phụ huynh.' },
    { id: 'student', icon: 'card', title: 'Học sinh', desc: 'Kích hoạt tài khoản nhà trường đã tạo sẵn bằng mã học sinh. Học sinh không tự đặt hạn mức.' }
  ];
  function Register(props) {
    var step = useState('role'), role = useState(null);
    var name = useState(''), phone = useState(''), code = useState(''), pw = useState(''), pw2 = useState(''), agree = useState(false), tried = useState(false);
    var otp = useState(''), otpErr = useState(null), resend = useState(60);
    var kids = useState([]), kc = useState(''), kd = useState(''), kErr = useState(null), wantKids = useState(false);
    var r = role[0];
    useEffect(function () {
      if (step[0] !== 'otp') return;
      var t = setInterval(function () { resend[1](function (x) { return x > 0 ? x - 1 : 0; }); }, 1000);
      return function () { clearInterval(t); };
    }, [step[0]]);
    var norm = function (x) { return String(x).toUpperCase().replace(/\s/g, ''); };
    var roster = ROSTER[norm(code[0])];
    var errs = {};
    if (r === 'parent') {
      if (name[0].trim().split(/\s+/).length < 2) errs.name = 'Nhập đầy đủ họ và tên.';
    } else if (r) {
      if (!roster || roster.role !== r) errs.code = r === 'teacher' ? 'Không tìm thấy mã giáo viên chưa kích hoạt. Thử GV-0412.' : r === 'university' ? 'Không tìm thấy mã sinh viên chưa kích hoạt. Thử SV-K21-045.' : 'Không tìm thấy mã học sinh chưa kích hoạt. Thử HS-208302.';
    }
    var ph = phone[0].replace(/\D/g, '');
    if (!/^0\d{9}$/.test(ph)) errs.phone = 'Số điện thoại gồm 10 số, bắt đầu bằng 0.';
    else if (Object.keys(DB.accounts).some(function (k) { return DB.accounts[k].login.replace(/\D/g, '') === ph && DB.pass[k]; })) errs.phone = 'Số này đã có tài khoản — hãy đăng nhập.';
    if (pw[0].length < 6) errs.pw = 'Mật khẩu tối thiểu 6 ký tự.';
    else if (pw2[0] !== pw[0]) errs.pw2 = 'Mật khẩu nhập lại chưa khớp.';
    if (!agree[0]) errs.agree = 'Cần đồng ý điều khoản để tiếp tục.';
    var ok = !Object.keys(errs).length;
    var e = function (k) { return tried[0] ? errs[k] : null; };
    var displayName = r === 'parent' ? name[0].trim() : roster ? (roster.key ? DB.accounts[roster.key].name : roster.name) : '';

    function header(title, back, n) {
      return h(React.Fragment, null, h(Header, { title: title, onBack: back }),
        n ? h('div', { className: 'mb-progress', 'aria-label': 'Bước ' + n + ' trên ' + (needKids() ? 4 : 3) }, [1, 2, 3, 4].slice(0, needKids() ? 4 : 3).map(function (i) { return h('i', { key: i, className: i <= n ? 'on' : '' }); })) : null);
    }
    function needKids() { return r === 'parent' || (r === 'teacher' && wantKids[0]); }
    function link() {
      var c = norm(kc[0]), key = Object.keys(DB.accounts).filter(function (k) { return DB.accounts[k].role === 'student' && norm(DB.accounts[k].id) === c; })[0];
      if (!key) return kErr[1]('Không tìm thấy mã học sinh này.');
      if (kids[0].indexOf(key) >= 0) return kErr[1]('Đã liên kết học sinh này.');
      if (DOB[key] !== kd[0].trim()) return kErr[1]('Ngày sinh không khớp với hồ sơ nhà trường.');
      kids[1](kids[0].concat([key])); kc[1](''); kd[1](''); kErr[1](null);
    }
    function finish() {
      var key;
      if (r === 'student') { key = roster.key; DB.accounts[key].phone = ph; }
      else {
        key = 'u' + Date.now().toString(36);
        DB.accounts[key] = r === 'parent'
          ? { key: key, login: ph, role: 'parent', name: displayName, id: ph.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3'), children: kids[0].slice() }
          : { key: key, login: norm(code[0]), role: r, name: roster.name, id: norm(code[0]), klass: roster.klass, phone: ph, wallet: { real: 0, bonus: 0 }, limit: null, children: kids[0].slice() };
        DB.tx[key] = [];
        delete ROSTER[norm(code[0])];
      }
      if (r === 'student') delete ROSTER[norm(code[0])];
      DB.pass[key] = pw[0];
      props.onDone(key);
    }

    if (step[0] === 'role') {
      return h('div', { className: 'mb-screen' },
        header('Tạo tài khoản', props.onBack),
        h('p', { className: 'mb-lead' }, 'Bạn là ai? Mỗi người chỉ cần một tài khoản — giáo viên có con học tại trường không cần tạo thêm tài khoản phụ huynh.'),
        h('div', { className: 'mb-roles' }, REG_ROLES.map(function (x) {
          return h('button', { key: x.id, type: 'button', className: 'mb-role', onClick: function () { role[1](x.id); tried[1](false); step[1]('info'); } },
            h('span', { className: 'mb-kiosk-ico' }, h(C.Icon, { name: x.icon, size: 24 })),
            h('span', null, h('b', null, x.title), h('small', null, x.desc)),
            h(C.Icon, { name: 'chevron', size: 20 }));
        })),
        h('button', { type: 'button', className: 'mb-link', onClick: props.onBack }, 'Đã có tài khoản? Đăng nhập'));
    }

    if (step[0] === 'info') {
      var R = REG_ROLES.filter(function (x) { return x.id === r; })[0];
      return h('form', { className: 'mb-screen', onSubmit: function (ev) { ev.preventDefault(); tried[1](true); if (ok) { otp[1](''); otpErr[1](null); resend[1](60); step[1]('otp'); } } },
        header(R.title, function () { step[1]('role'); }, 1),
        r === 'parent' ? h(C.Field, { id: 'rg-name', label: 'Họ và tên', icon: 'user', placeholder: 'VD: Nguyễn Văn An', value: name[0], error: e('name'), onChange: function (ev) { name[1](ev.target.value); } })
          : h(React.Fragment, null,
            h(C.Field, { id: 'rg-code', label: r === 'teacher' ? 'Mã giáo viên' : r === 'university' ? 'Mã sinh viên' : 'Mã học sinh', icon: 'card', placeholder: r === 'teacher' ? 'VD: GV-0412' : r === 'university' ? 'VD: SV-K21-045' : 'VD: HS-208302', value: code[0], error: e('code'), hint: roster ? 'Tìm thấy: ' + displayName : 'In trên thẻ hoặc giấy báo nhà trường gửi.', onChange: function (ev) { code[1](ev.target.value); } })),
        h('div', { style: { height: 12 } }),
        h(C.Field, { id: 'rg-phone', label: 'Số điện thoại', icon: 'info', placeholder: '09xx xxx xxx', value: phone[0], error: e('phone'), hint: 'Dùng để nhận mã xác minh và đăng nhập' + (r === 'parent' ? '.' : ' khi quên mật khẩu.'), onChange: function (ev) { phone[1](ev.target.value.replace(/[^\d ]/g, '').slice(0, 13)); } }),
        h('div', { style: { height: 12 } }),
        h(C.Field, { id: 'rg-pw', label: 'Mật khẩu', icon: 'lock', type: 'password', placeholder: 'Tối thiểu 6 ký tự', value: pw[0], error: e('pw'), onChange: function (ev) { pw[1](ev.target.value); } }),
        h('div', { style: { height: 12 } }),
        h(C.Field, { id: 'rg-pw2', label: 'Nhập lại mật khẩu', icon: 'lock', type: 'password', value: pw2[0], error: e('pw2'), onChange: function (ev) { pw2[1](ev.target.value); } }),
        r === 'teacher' ? h('label', { className: 'mb-toggle-row mb-card-row' },
          h('span', null, h('b', null, 'Tôi có con đang học tại trường'), h('small', null, 'Liên kết để nạp tiền, đặt hạn mức và chặn món cho con')),
          h('input', { type: 'checkbox', role: 'switch', className: 'mb-switch is-ok', checked: wantKids[0], onChange: function () { wantKids[1](!wantKids[0]); } })) : null,
        h('label', { className: 'mb-agree' + (e('agree') ? ' is-err' : '') },
          h('input', { type: 'checkbox', checked: agree[0], onChange: function () { agree[1](!agree[0]); } }),
          h('span', null, 'Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo vệ dữ liệu cá nhân của Canteen.')),
        e('agree') ? h(C.InlineNote, { tone: 'danger' }, errs.agree) : null,
        h('div', { className: 'mb-bottom' }, h(C.Button, { type: 'submit', size: 'lg', block: true }, 'Gửi mã xác minh')));
    }

    if (step[0] === 'otp') {
      return h('div', { className: 'mb-screen' },
        header('Xác minh số điện thoại', function () { step[1]('info'); }, 2),
        h('p', { className: 'mb-lead' }, 'Nhập mã 6 số đã gửi tới ', h('b', null, ph.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')), '.'),
        h('input', { className: 'mb-otp', id: 'rg-otp', autoFocus: true, inputMode: 'numeric', autoComplete: 'one-time-code', maxLength: 6, value: otp[0], 'aria-label': 'Mã xác minh 6 số', onChange: function (ev) { otp[1](ev.target.value.replace(/\D/g, '').slice(0, 6)); otpErr[1](null); } }),
        h('div', { className: 'mb-otp-boxes', 'aria-hidden': 'true', onClick: function () { var el = document.querySelector('.mb-otp'); if (el) el.focus(); } }, [0, 1, 2, 3, 4, 5].map(function (i) { return h('span', { key: i, className: i < otp[0].length ? 'on' : i === otp[0].length ? 'cur' : '' }, otp[0][i] || ''); })),
        otpErr[0] ? h(C.InlineNote, { tone: 'danger' }, otpErr[0]) : null,
        h('div', { className: 'mb-resend' }, resend[0] ? 'Gửi lại mã sau ' + resend[0] + 's' : h('button', { type: 'button', className: 'mb-link', onClick: function () { resend[1](60); props.say('Đã gửi lại mã xác minh', 'sync'); } }, 'Gửi lại mã')),
        h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng tin nhắn SMS'), h('div', null, 'Ma xac minh Vi Canteen cua ban la ', h('b', null, OTP), '. Khong chia se ma nay voi bat ky ai.'),
          h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { otp[1](OTP); } }, 'Điền mã')),
        h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, disabled: otp[0].length < 6, onClick: function () {
          if (otp[0] !== OTP) return otpErr[1]('Mã chưa đúng. Kiểm tra lại tin nhắn.');
          step[1](needKids() ? 'kids' : 'done');
        } }, 'Xác minh')));
    }

    if (step[0] === 'kids') {
      return h('div', { className: 'mb-screen' },
        header('Liên kết con', function () { step[1]('otp'); }, 3),
        h('p', { className: 'mb-lead' }, 'Nhập mã học sinh và ngày sinh của con để xác minh với hồ sơ nhà trường. Chỉ bố mẹ đã liên kết mới đặt được hạn mức và chặn món.'),
        kids[0].length ? h('div', { className: 'cp-card' }, kids[0].map(function (k) {
          var c = DB.accounts[k];
          return h(C.ListRow, { key: k, icon: 'user', title: c.name, value: c.klass + ' · ' + c.id, trailing: h(C.StatusBadge, { tone: 'success' }, 'Đã liên kết') });
        })) : null,
        h(C.SectionLabel, null, kids[0].length ? 'Thêm con khác' : 'Thông tin của con'),
        h('div', { className: 'cp-card is-padded mb-items' },
          h(C.Field, { id: 'rg-kc', label: 'Mã học sinh', icon: 'card', placeholder: 'VD: HS-208317', value: kc[0], onChange: function (ev) { kc[1](ev.target.value); kErr[1](null); } }),
          h(C.Field, { id: 'rg-kd', label: 'Ngày sinh (dd/mm/yyyy)', icon: 'clock', placeholder: '12/03/2012', value: kd[0], error: kErr[0], onChange: function (ev) { kd[1](ev.target.value.replace(/[^\d/]/g, '').slice(0, 10)); kErr[1](null); } }),
          h(C.Button, { variant: 'secondary', icon: 'plus', disabled: !kc[0] || kd[0].length < 10, onClick: link }, 'Liên kết')),
        h(C.InlineNote, { tone: 'info' }, 'Nếu con đã có bố hoặc mẹ khác liên kết, người đó sẽ nhận thông báo. Cả hai đều chỉnh được hạn mức.'),
        h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Dữ liệu dùng thử'),
          h('div', { className: 'cp-row' },
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { kc[1]('HS-208317'); kd[1]('12/03/2012'); } }, 'Khôi · 12/03/2012'),
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { kc[1]('HS-260114'); kd[1]('05/09/2014'); } }, 'Linh · 05/09/2014'))),
        h('div', { className: 'mb-bottom mb-2btn' },
          h(C.Button, { size: 'lg', variant: 'secondary', onClick: function () { step[1]('done'); } }, 'Để sau'),
          h(C.Button, { size: 'lg', disabled: !kids[0].length, onClick: function () { step[1]('done'); } }, 'Tiếp tục')));
    }

    return h('div', { className: 'mb-screen' },
      header('Hoàn tất', null, needKids() ? 4 : 3),
      h('div', { className: 'mb-result' },
        h('div', { className: 'mb-result-ico' }, h(C.Icon, { name: 'check', size: 40, stroke: 2.4 })),
        h('div', { className: 'mb-result-title' }, r === 'student' ? 'Đã kích hoạt tài khoản' : 'Đã tạo tài khoản'),
        h('div', { className: 'mb-confirm-name' }, displayName),
        h('div', { className: 'cp-card is-padded mb-result-sum' },
          h('div', { className: 'cp-sum-row' }, h('span', null, 'Vai trò'), h('b', null, REG_ROLES.filter(function (x) { return x.id === r; })[0].title + (r === 'teacher' && kids[0].length ? ' · Phụ huynh' : ''))),
          h('div', { className: 'cp-sum-row' }, h('span', null, 'Đăng nhập bằng'), h('b', null, r === 'parent' ? ph : norm(code[0]))),
          needKids() ? h('div', { className: 'cp-sum-row' }, h('span', null, 'Con đã liên kết'), h('b', null, kids[0].length ? kids[0].map(function (k) { return DB.accounts[k].name.split(' ').pop(); }).join(', ') : 'Chưa có')) : null),
        needKids() && !kids[0].length ? h(C.InlineNote, null, 'Bạn có thể liên kết con sau trong mục Con.') : null),
      h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, onClick: finish }, 'Vào Ví Canteen')));
  }


  function UpcomingOrder(props) {
    var me = props.me, owners = ownersOf(me);
    var act = (DB.orders || []).filter(function (o) { return owners.indexOf(o.for) >= 0 && ['placed', 'preparing', 'ready'].indexOf(o.status) >= 0; });
    return h(React.Fragment, null,
      h('button', { type: 'button', className: 'mb-kiosk-row mb-order-row', onClick: function () { props.go('order'); } },
        h('span', { className: 'mb-kiosk-ico is-accent' }, h(C.Icon, { name: 'bag', size: 24 })),
        h('span', null, h('b', null, 'Đặt món trước'), h('small', null, 'Chọn món, hẹn giờ nhận — không phải xếp hàng')),
        h(C.Icon, { name: 'chevron', size: 20 })),
      act.slice(0, 2).map(function (o) {
        var S = O_STATUS[o.status];
        return h('button', { key: o.id, type: 'button', className: 'mb-up', onClick: function () { props.go('orders'); } },
          h('span', null, h('b', null, o.id + ' · ' + o.day + ' ' + o.slot + (o.for !== me.key ? ' · ' + acc(o.for).name.split(' ').pop() : '')), h('small', null, o.items.map(function (l) { return l.qty + '× ' + l.name; }).join(', '))),
          h(C.StatusBadge, { tone: S[1] }, S[0].split(' — ')[0]));
      }));
  }

  /* ---------------- Trang chủ học sinh / giáo viên ---------------- */
  function Hello(props) {
    var me = props.me;
    return h('div', { className: 'mb-hello' },
      h('span', { className: 'mb-avatar' }, initials(me.name)),
      h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { className: 'mb-hello-name' }, 'Chào ' + me.name.split(' ').pop()), h('div', { className: 'mb-hello-sub' }, [ROLE[me.role] + (me.role === 'teacher' && isParent(me) ? ' · Phụ huynh' : ''), me.klass, me.id].filter(Boolean).join(' · '))),
      props.onHide ? h('button', { type: 'button', className: 'mb-icon-btn', 'aria-label': props.hide ? 'Hiện số dư' : 'Ẩn số dư', onClick: props.onHide }, h(C.Icon, { name: props.hide ? 'lock' : 'info', size: 22 })) : null,
      h('button', { type: 'button', className: 'mb-icon-btn mb-bell', 'aria-label': 'Thông báo', onClick: function () { props.go('notif'); } }, h(C.Icon, { name: 'bell', size: 22 }), unread(me.key) ? h('span', { className: 'mb-dot' }, unread(me.key)) : null),
      h('button', { type: 'button', className: 'mb-icon-btn', 'aria-label': 'Tài khoản', onClick: function () { props.go('profile'); } }, h(C.Icon, { name: 'user', size: 22 })));
  }

  function WalletCard(props) {
    var w = props.a.wallet, hide = props.hide;
    var money = function (v) { return hide ? h('span', { className: 'cp-money' }, '••••••') : h(C.Money, { value: v }); };
    return h('section', { className: 'mb-wallet' },
      h('div', { className: 'mb-wallet-label' }, 'Tổng số dư có thể dùng'),
      h('div', { className: 'mb-wallet-total' }, hide ? '••••••' : fmt(w.real + w.bonus)),
      h('div', { className: 'mb-wallet-split' },
        h('div', null, h('small', null, 'Tiền thật'), money(w.real)),
        h('div', null, h('small', null, 'Tiền thưởng' + (w.bonus && props.a.bonusExp ? ' · hạn ' + props.a.bonusExp.slice(0, 5) : '')), money(w.bonus))),
      h('div', { className: 'mb-wallet-actions' },
        h('button', { type: 'button', className: 'mb-big is-light', onClick: function () { props.go('topup'); } }, h(C.Icon, { name: 'plus', size: 28 }), 'Nạp tiền'),
        h('button', { type: 'button', className: 'mb-big', onClick: function () { props.go('history'); } }, h(C.Icon, { name: 'receipt', size: 28 }), 'Lịch sử')));
  }

  function LimitCard(props) {
    var a = props.a, w = a.wallet;
    if (!a.limit) return null;
    var pct = Math.min(100, Math.round(a.limit.used / a.limit.max * 100));
    var blockedAll = a.blocked;
    return h('div', { className: 'cp-card is-padded mb-limit' },
      h('div', { className: 'cp-limit-row' }, h('span', null, 'Đã dùng ' + fmt(a.limit.used)), h('span', null, a.limit.max == null ? 'Không giới hạn' : 'Tối đa ' + fmt(a.limit.max))),
      a.limit.max == null ? null : h('div', { className: 'cp-meter' + (pct >= 80 ? ' is-high' : '') }, h('i', { style: { width: pct + '%' } })),
      h('div', { className: 'cp-sum-row', style: { marginTop: 10 } }, h('span', { className: 'cp-muted' }, 'Còn được dùng hôm nay'), h('b', { className: 'cp-num' }, fmt(Math.min(limLeftOf(a), w.real + w.bonus)))),
      blockedAll.length ? h(C.InlineNote, { tone: 'info' }, 'Không bán cho tài khoản này: ' + blockedAll.join(', ').toLowerCase() + '.') : h(C.InlineNote, { tone: 'info' }, 'Không có món nào bị chặn.'),
      h('div', { className: 'mb-audit' }, 'Do bố mẹ cài đặt · sửa lần cuối: ' + a.edited));
  }

  function HomeSelf(props) {
    var me = props.me;
    return h('div', { className: 'mb-screen' },
      h(Hello, { me: me, hide: props.hide, onHide: props.toggleHide, go: props.go }),
      h(WalletCard, { a: me, hide: props.hide, go: props.go }),
      h(UpcomingOrder, { me: me, go: props.go }),
      h('button', { type: 'button', className: 'mb-kiosk-row', onClick: function () { props.go('kiosk'); } },
        h('span', { className: 'mb-kiosk-ico' }, h(C.Icon, { name: 'face', size: 24 })),
        h('span', null, h('b', null, 'Đăng nhập kiosk bằng điện thoại'), h('small', null, 'Quét mã QR hiện trên màn hình kiosk')),
        h(C.Icon, { name: 'chevron', size: 20 })),
      h('button', { type: 'button', className: 'mb-kiosk-row', onClick: function () { props.go('face'); } },
        h('span', { className: 'mb-kiosk-ico' + (me.face ? ' is-ok' : '') }, h(C.Icon, { name: 'face', size: 24 })),
        h('span', null, h('b', null, 'Nhận diện khuôn mặt'), h('small', null, me.face ? 'Đã đăng ký ' + me.face.at + ' · dùng để đăng nhập kiosk' : 'Chưa đăng ký · quét mặt để đăng nhập kiosk không cần thẻ')),
        me.face ? h(C.StatusBadge, { tone: 'success' }, 'Đã bật') : h(C.StatusBadge, { tone: 'warning', icon: 'info' }, 'Chưa có')),
      PROMO ? h('div', { className: 'mb-promo' }, h(C.Icon, { name: 'tag', size: 20 }), h('span', null, 'Nạp từ ', h('b', null, fmt(PROMO.from)), ' tặng ', h('b', null, fmt(PROMO.gift) + ' tiền thưởng'), ' (dùng trong ' + PROMO.days + ' ngày) — đến ' + PROMO.until + '.')) : null,
      me.homeroom ? h('button', { type: 'button', className: 'mb-kiosk-row', onClick: function () { props.go('classmeal'); } },
        h('span', { className: 'mb-kiosk-ico is-accent' }, h(C.Icon, { name: 'users', size: 24 })),
        h('span', null, h('b', null, 'Suất ăn lớp ' + me.homeroom), h('small', null, 'Đặt suất cho lớp chủ nhiệm, điểm danh học sinh vắng')),
        h(C.Icon, { name: 'chevron', size: 20 })) : null,
      isParent(me) ? h(React.Fragment, null, h(C.SectionLabel, null, 'Con của bạn'), h(Kids, { me: me, goTopup: props.goTopup, goControls: props.goControls })) : null,
      me.limit ? h(React.Fragment, null, h(C.SectionLabel, null, 'Hạn mức hôm nay'), h(LimitCard, { a: me })) : null,
      h(C.SectionLabel, null, 'Giao dịch gần đây'),
      h('div', { className: 'cp-card' }, (DB.tx[me.key] || []).slice(0, 3).map(function (t) { return h(TxRow, { key: t.id, t: t, hide: props.hide, onOpen: props.openTx }); })),
      h('button', { type: 'button', className: 'mb-link', onClick: function () { props.go('history'); } }, 'Xem tất cả giao dịch', h(C.Icon, { name: 'chevron', size: 18 })));
  }

  /* ---------------- Thẻ của từng con (chỉ bố mẹ thấy) ---------------- */
  function Kids(props) {
    var me = props.me;
    if (!(me.children || []).length) return h('div', { className: 'cp-card is-padded' }, h(C.InlineNote, { tone: 'info' }, 'Chưa liên kết con nào. Mở tab “Con” ở thanh dưới để liên kết bằng mã học sinh và ngày sinh.'));
    return h('div', { className: 'mb-kids' }, me.children.map(function (k) {
        var c = acc(k), pct = c.limit.max == null ? 0 : Math.min(100, Math.round(c.limit.used / c.limit.max * 100));
        return h('section', { key: k, className: 'mb-kid' },
          h('div', { className: 'mb-kid-head' }, h('span', { className: 'mb-avatar sm' }, initials(c.name)),
            h('div', null, h('b', null, c.name), h('small', null, c.klass + ' · ' + c.id))),
          h('div', { className: 'mb-kid-bal' },
            h('div', null, h('small', null, 'Số dư'), h(C.Money, { value: c.wallet.real + c.wallet.bonus, tone: c.wallet.real + c.wallet.bonus < 20000 ? 'danger' : null })),
            h('div', null, h('small', null, 'Hôm nay'), h('span', { className: 'cp-num' }, fmt(c.limit.used) + (c.limit.max == null ? '' : ' / ' + shortMoney(c.limit.max))))),
          c.limit.max == null ? null : h('div', { className: 'cp-meter' + (pct >= 80 ? ' is-high' : '') }, h('i', { style: { width: pct + '%' } })),
          h('div', { className: 'mb-kid-tags' }, c.blocked.length ? c.blocked.map(function (b) { return h(C.StatusBadge, { key: b, tone: 'danger', icon: 'lock' }, b); }) : h('span', { className: 'cp-muted' }, 'Không chặn món nào')),
          h('div', { className: 'mb-2btn' },
            h(C.Button, { variant: 'secondary', icon: 'plus', onClick: function () { props.goTopup(k); } }, 'Nạp tiền'),
            h(C.Button, { icon: 'lock', onClick: function () { props.goControls(k); } }, 'Hạn mức & món')));
      }));
  }

  /* ---------------- Trang chủ phụ huynh ---------------- */
  function HomeParent(props) {
    var me = props.me;
    return h('div', { className: 'mb-screen' },
      h(Hello, { me: me, go: props.go }),
      h(UpcomingOrder, { me: me, go: props.go }),
      h(C.SectionLabel, null, 'Con của bạn'),
      h(Kids, { me: me, goTopup: props.goTopup, goControls: props.goControls }),
      h(C.SectionLabel, null, 'Giao dịch gần đây của con'),
      h('div', { className: 'cp-card' }, me.children.reduce(function (all, k) { return all.concat((DB.tx[k] || []).slice(0, 2).map(function (t) { return Object.assign({ who: acc(k).name.split(' ').pop() }, t); })); }, []).map(function (t) { return h(TxRow, { key: t.id, t: t, onOpen: props.openTx }); })),
      h('button', { type: 'button', className: 'mb-link', onClick: function () { props.go('history'); } }, 'Xem tất cả giao dịch', h(C.Icon, { name: 'chevron', size: 18 })));
  }

  var TX_ICON = { buy: 'receipt', topup: 'plus', refund: 'undo', bonus: 'tag', pending: 'clock' };
  function TxRow(props) {
    var t = props.t, amt = (t.real || 0) + (t.bonus || 0);
    return h(props.onOpen ? 'button' : 'div', { type: props.onOpen ? 'button' : undefined, className: 'mb-tx' + (props.onOpen ? ' is-btn' : ''), onClick: props.onOpen ? function () { props.onOpen(t); } : undefined },
      h('span', { className: 'mb-tx-ico is-' + t.kind }, h(C.Icon, { name: TX_ICON[t.kind], size: 20 })),
      h('span', { className: 'mb-tx-body' }, h('b', null, (t.who ? t.who + ' · ' : '') + t.title), h('small', null, t.t + ' · ' + t.place)),
      h('span', { className: 'mb-tx-amt' },
        t.kind === 'pending' ? h(C.StatusBadge, { tone: 'warning' }, 'Chờ xác nhận') : null,
        props.hide ? '••••' : h(C.Money, { value: amt, sign: true, tone: amt > 0 ? 'success' : null }),
        t.bonus && t.kind !== 'bonus' && !props.hide ? h('small', null, 'gồm thưởng ' + fmt(Math.abs(t.bonus))) : null));
  }

  /* ---------------- Danh sách học sinh được quản lý ---------------- */
  function Manage(props) {
    var me = props.me, q = useState('');
    var list = managedOf(me).map(acc).filter(function (c) { return !q[0] || (c.name + ' ' + c.id).toLowerCase().indexOf(q[0].toLowerCase()) >= 0; });
    return h('div', { className: 'mb-screen' },
      h(Header, { title: 'Hạn mức & món ăn' }),
      h(C.SectionLabel, null, 'Chọn con để cài đặt'),
      h('div', { className: 'cp-card' }, list.map(function (c) {
        var n = c.blocked.length;
        return h(C.ListRow, { key: c.key, icon: 'user', chevron: true, onClick: function () { props.goControls(c.key); },
          title: c.name, value: c.klass + ' · ' + (c.limit.max == null ? 'Không giới hạn' : 'Hạn mức ' + fmt(c.limit.max) + '/ngày') + ' · ' + (n ? n + ' mục bị chặn' : 'không chặn món'),
          note: c.wallet.real + c.wallet.bonus < 20000 ? 'Số dư thấp: ' + fmt(c.wallet.real + c.wallet.bonus) : null });
      })),
      list.length ? null : h('div', { className: 'pt-empty' }, 'Chưa liên kết con nào.'),
      h(LinkKid, { me: me, say: props.say, onLinked: props.bump }),
      h(C.InlineNote, { tone: 'info' }, 'Chỉ bố mẹ đã liên kết với tài khoản của con mới đặt được hạn mức và món bị chặn. Giáo viên và nhà trường chỉ xem.'));
  }


  function LinkKid(props) {
    var me = props.me, open = useState(!(me.children || []).length), kc = useState(''), kd = useState(''), err = useState(null);
    var norm = function (x) { return String(x).toUpperCase().replace(/\s/g, ''); };
    function link() {
      var key = Object.keys(DB.accounts).filter(function (k) { return DB.accounts[k].role === 'student' && norm(DB.accounts[k].id) === norm(kc[0]); })[0];
      if (!key) return err[1]('Không tìm thấy mã học sinh này.');
      if ((me.children || []).indexOf(key) >= 0) return err[1]('Đã liên kết học sinh này.');
      if (DOB[key] !== kd[0].trim()) return err[1]('Ngày sinh không khớp với hồ sơ nhà trường.');
      me.children = (me.children || []).concat([key]); kc[1](''); kd[1](''); err[1](null); open[1](false);
      props.say('Đã liên kết ' + DB.accounts[key].name); props.onLinked();
    }
    if (!open[0]) return h('button', { type: 'button', className: 'mb-link', onClick: function () { open[1](true); } }, h(C.Icon, { name: 'plus', size: 18 }), 'Liên kết thêm con');
    return h(React.Fragment, null, h(C.SectionLabel, null, 'Liên kết con'),
      h('div', { className: 'cp-card is-padded mb-items' },
        h(C.Field, { id: 'lk-c', label: 'Mã học sinh', icon: 'card', placeholder: 'VD: HS-208317', value: kc[0], onChange: function (e) { kc[1](e.target.value); err[1](null); } }),
        h(C.Field, { id: 'lk-d', label: 'Ngày sinh (dd/mm/yyyy)', icon: 'clock', placeholder: '12/03/2012', value: kd[0], error: err[0], onChange: function (e) { kd[1](e.target.value.replace(/[^\d/]/g, '').slice(0, 10)); err[1](null); } }),
        h(C.Button, { variant: 'secondary', icon: 'plus', disabled: !kc[0] || kd[0].length < 10, onClick: link }, 'Liên kết')));
  }

  /* ---------------- Cài đặt hạn mức & món bị chặn ---------------- */
  function Controls(props) {
    var me = props.me, c = acc(props.target), nm = c.name.split(' ').pop();
    var lim = useState(c.limit.max), raw = useState(''), groups = useState(c.blocked.slice()), wins = useState((c.windows || ALL_W).slice());
    var value = raw[0] ? Number(raw[0]) : lim[0];
    var err = value != null && value < 10000 ? 'Tối thiểu 10.000 ₫' : value != null && value > 500000 ? 'Tối đa 500.000 ₫' : null;
    var winErr = !wins[0].length ? 'Chọn ít nhất một khung giờ.' : null;
    var same = function (x, y) { return x.slice().sort().join() === y.slice().sort().join(); };
    var changed = value !== c.limit.max || !same(groups[0], c.blocked) || !same(wins[0], c.windows || ALL_W);
    function toggle(list, g) { list[1](list[0].indexOf(g) >= 0 ? list[0].filter(function (x) { return x !== g; }) : list[0].concat([g])); }
    function save() {
      c.limit = { used: c.limit.used, max: value }; c.blocked = groups[0].slice(); c.windows = wins[0].slice();
      c.edited = 'Phụ huynh ' + me.name + ' · hôm nay ' + now();
      props.say('Đã lưu cho ' + nm + ' — áp dụng ngay tại quầy và kiosk'); props.back();
    }
    function sw(label, sub, on, onChange, ok) {
      return h('label', { className: 'mb-toggle-row' }, h('span', null, h('b', null, label), h('small', null, sub)),
        h('input', { type: 'checkbox', role: 'switch', className: 'mb-switch' + (ok ? ' is-ok' : ''), checked: on, onChange: onChange, 'aria-label': label }));
    }
    return h('div', { className: 'mb-screen' },
      h(Header, { title: 'Cài đặt cho ' + nm, onBack: props.back }),
      h('div', { className: 'cp-card' }, h(C.ListRow, { icon: 'user', title: c.name, value: c.klass + ' · ' + c.id + ' · số dư ' + fmt(c.wallet.real + c.wallet.bonus) })),

      h(C.SectionLabel, null, 'Hạn mức chi tiêu mỗi ngày'),
      h('div', { className: 'mb-presets' }, LIMIT_PRESETS.map(function (p) {
        return h('button', { key: p, type: 'button', 'aria-pressed': String(!raw[0] && lim[0] === p), onClick: function () { lim[1](p); raw[1](''); } }, h('b', null, shortMoney(p)), h('small', null, '/ngày'));
      }).concat([h('button', { key: 'none', type: 'button', 'aria-pressed': String(!raw[0] && lim[0] == null), onClick: function () { lim[1](null); raw[1](''); } }, h('b', null, 'Không'), h('small', null, 'giới hạn'))])),
      h(C.Field, { id: 'ct-lim', label: 'Hoặc nhập số khác', numeric: true, suffix: '₫/ngày', placeholder: '0', value: raw[0] ? Number(raw[0]).toLocaleString('vi-VN') : '', error: err, hint: 'Hôm nay đã dùng ' + fmt(c.limit.used) + '. Hạn mức mới áp dụng ngay.', onChange: function (e) { raw[1](e.target.value.replace(/\D/g, '').slice(0, 7)); } }),

      h(C.SectionLabel, null, 'Lịch áp dụng — khung giờ ' + nm + ' được mua'),
      h('div', { className: 'cp-card' }, WINDOWS.map(function (w) {
        return h(React.Fragment, { key: w.id }, sw(w.label, w.t + ' · Canteen A, thứ Hai – thứ Bảy', wins[0].indexOf(w.id) >= 0, function () { toggle(wins, w.id); }, true));
      })),
      winErr ? h(C.InlineNote, { tone: 'danger' }, winErr) : h(C.InlineNote, { tone: 'info' }, 'Ngoài các khung này, quầy, kiosk và đặt trước đều từ chối giao dịch của ' + nm + '. Khung giờ lấy theo lịch của Canteen tại trường con học.'),

      h(C.SectionLabel, { help: true }, 'Nhóm món không bán cho ' + nm),
      h('div', { className: 'cp-card' }, FOOD_GROUPS.map(function (g) {
        return h(React.Fragment, { key: g.id }, sw(g.id, g.ex, groups[0].indexOf(g.id) >= 0, function () { toggle(groups, g.id); }));
      })),

      h(C.SectionLabel, null, 'Sự đồng ý của phụ huynh'),
      h('div', { className: 'cp-card' },
        sw('Cho phép GVCN đặt suất ăn lớp', c.classMeal ? 'Tiền suất trừ từ ví của ' + nm + '; ngày vắng được hoàn về ví' : 'Tắt · ' + nm + ' không có trong đơn suất ăn lớp', !!c.classMeal, function () { c.classMeal = !c.classMeal; props.say(c.classMeal ? 'Đã đồng ý cho GVCN đặt suất ăn lớp' : 'Đã tắt suất ăn lớp cho ' + nm); props.bump(); }, true),
        sw('Cho phép dùng khuôn mặt', c.face ? 'Đã đăng ký ngày ' + c.face.at + ' · đăng nhập kiosk bằng khuôn mặt' : c.faceConsent ? 'Đã cho phép · con chưa quét mặt trên Ví Canteen' : 'Tắt · con đăng nhập kiosk bằng thẻ hoặc điện thoại', !!c.faceConsent, function () {
          c.faceConsent = !c.faceConsent;
          if (!c.faceConsent && c.face) { c.face = null; props.say('Đã tắt và xóa dữ liệu khuôn mặt của ' + nm); }
          else props.say(c.faceConsent ? 'Đã cho phép — ' + nm + ' có thể quét mặt trên Ví Canteen' : 'Đã tắt nhận diện khuôn mặt');
          props.bump();
        }, true)),
      h(C.InlineNote, { tone: 'info' }, 'Hai mục đồng ý lưu ngay khi bật/tắt và được ghi nhật ký. Tắt khuôn mặt sẽ xóa ngay dữ liệu đã lưu.'),
      h('div', { className: 'mb-audit' }, 'Sửa lần cuối: ' + c.edited + ' · Thay đổi áp dụng ngay tại quầy và kiosk.'),
      h('div', { className: 'mb-bottom' },
        h(C.Button, { size: 'lg', block: true, icon: 'check', disabled: !changed || !!err || !!winErr, onClick: save }, changed ? 'Lưu hạn mức & lịch' : 'Chưa có thay đổi')));
  }

  /* ---------------- Đăng ký nhận diện khuôn mặt ---------------- */
  var FACE_STEPS = [
    { id: 'front', text: 'Nhìn thẳng vào camera', arrow: null },
    { id: 'left', text: 'Từ từ quay mặt sang trái', arrow: 'left' },
    { id: 'right', text: 'Từ từ quay mặt sang phải', arrow: 'right' },
    { id: 'up', text: 'Ngẩng đầu lên một chút', arrow: 'up' },
    { id: 'blink', text: 'Chớp mắt hai lần', arrow: null }
  ];
  function FaceEnroll(props) {
    var me = props.me, isKid = me.role === 'student';
    var st = useState(me.face ? 'manage' : 'intro'), agree = useState(false), idx = useState(0), warn = useState(null), confirmDel = useState(false);
    var t = useRef();
    useEffect(function () { return function () { clearTimeout(t.current); }; }, []);
    useEffect(function () {
      if (st[0] !== 'scan' || warn[0]) return;
      t.current = setTimeout(function () {
        if (idx[0] < FACE_STEPS.length - 1) idx[1](idx[0] + 1);
        else st[1]('process');
      }, 1700);
      return function () { clearTimeout(t.current); };
    }, [st[0], idx[0], warn[0]]);
    useEffect(function () {
      if (st[0] !== 'process') return;
      var tp = setTimeout(function () { var d = new Date(); me.face = { at: ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() }; props.bump(); st[1]('done'); }, 1600);
      return function () { clearTimeout(tp); };
    }, [st[0]]);
    function start() { idx[1](0); warn[1](null); st[1]('scan'); }

    if (isKid && !me.faceConsent) {
      return h('div', { className: 'mb-screen' }, h(Header, { title: 'Nhận diện khuôn mặt', onBack: function () { props.go('home'); } }),
        h('div', { className: 'mb-result' }, h('div', { className: 'mb-result-ico is-warn' }, h(C.Icon, { name: 'lock', size: 36 })),
          h('div', { className: 'mb-confirm-name', style: { fontSize: 22 } }, 'Cần bố mẹ cho phép'),
          h('p', { className: 'mb-lead', style: { textAlign: 'center' } }, 'Khuôn mặt là dữ liệu cá nhân nhạy cảm. Bố hoặc mẹ cần bật “Cho phép nhận diện khuôn mặt” trong mục Con của tài khoản phụ huynh trước khi em đăng ký.')),
        h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, variant: 'secondary', onClick: function () { props.say('Đã gửi yêu cầu tới bố mẹ', 'check'); props.go('home'); } }, 'Gửi yêu cầu cho bố mẹ')));
    }

    if (st[0] === 'manage') {
      return h('div', { className: 'mb-screen' }, h(Header, { title: 'Nhận diện khuôn mặt', onBack: function () { props.go('home'); } }),
        h('div', { className: 'mb-face-status' }, h('div', { className: 'mb-face-ok' }, h(C.Icon, { name: 'face', size: 40, stroke: 1.6 })),
          h('div', null, h('b', null, 'Đã đăng ký khuôn mặt'), h('small', null, 'Ngày ' + me.face.at + ' · 5 góc mặt'))),
        h(C.SectionLabel, null, 'Dùng để'),
        h('div', { className: 'cp-card' },
          h(C.ListRow, { icon: 'store', title: 'Đăng nhập kiosk tự phục vụ', value: 'Đứng trước kiosk, nhìn vào camera — không cần thẻ hay điện thoại' }),
          h(C.ListRow, { icon: 'lock', title: 'Độ khớp dưới 90% phải nhập PIN', value: 'Kiosk hỏi PIN khi ánh sáng kém hoặc bạn thay đổi ngoại hình' })),
        h(C.SectionLabel, null, 'Quản lý'),
        h('div', { className: 'cp-card' },
          h(C.ListRow, { icon: 'sync', title: 'Đăng ký lại', value: 'Khi đổi kiểu tóc, đeo kính mới hoặc kiosk hay hỏi PIN', chevron: true, onClick: function () { agree[1](true); start(); } }),
          h(C.ListRow, { icon: 'x', title: 'Xóa dữ liệu khuôn mặt', value: 'Tắt đăng nhập bằng khuôn mặt trên mọi kiosk', chevron: true, onClick: function () { confirmDel[1](true); } })),
        confirmDel[0] ? h('div', { className: 'cp-card is-padded mb-confirm-box' },
          h('b', null, 'Xóa dữ liệu khuôn mặt?'), h('p', null, 'Bạn sẽ đăng nhập kiosk bằng thẻ hoặc điện thoại. Có thể đăng ký lại bất cứ lúc nào.'),
          h('div', { className: 'mb-2btn', style: { display: 'grid', gap: 8 } },
            h(C.Button, { variant: 'secondary', onClick: function () { confirmDel[1](false); } }, 'Giữ lại'),
            h(C.Button, { variant: 'danger', icon: 'x', onClick: function () { me.face = null; props.bump(); props.say('Đã xóa dữ liệu khuôn mặt'); props.go('home'); } }, 'Xóa'))) : null,
        h(C.InlineNote, { tone: 'info' }, 'Hệ thống chỉ lưu đặc trưng khuôn mặt đã mã hóa, không lưu ảnh chụp.'));
    }

    if (st[0] === 'intro') {
      return h('div', { className: 'mb-screen' }, h(Header, { title: 'Đăng ký khuôn mặt', onBack: function () { props.go('home'); } }),
        h('div', { className: 'mb-face-hero' }, h(C.Icon, { name: 'face', size: 56, stroke: 1.4 })),
        h('p', { className: 'mb-lead', style: { textAlign: 'center' } }, 'Quét khuôn mặt một lần để đăng nhập kiosk ở căng tin chỉ bằng cách nhìn vào camera. Mất khoảng 15 giây.'),
        h(C.SectionLabel, null, 'Chuẩn bị'),
        h('div', { className: 'cp-card' },
          h(C.ListRow, { icon: 'info', title: 'Đứng nơi đủ sáng', value: 'Ánh sáng chiếu vào mặt, không ngược sáng' }),
          h(C.ListRow, { icon: 'user', title: 'Bỏ khẩu trang, kính râm, mũ', value: 'Kính cận thông thường vẫn được' }),
          h(C.ListRow, { icon: 'face', title: 'Làm theo hướng dẫn trên màn hình', value: 'Nhìn thẳng, quay trái, quay phải, ngẩng lên, chớp mắt' })),
        h('label', { className: 'mb-agree' },
          h('input', { type: 'checkbox', checked: agree[0], onChange: function () { agree[1](!agree[0]); } }),
          h('span', null, 'Tôi đồng ý cho Canteen lưu đặc trưng khuôn mặt đã mã hóa để đăng nhập kiosk. Không lưu ảnh; tôi có thể xóa bất cứ lúc nào.' + (isKid ? ' Bố mẹ đã cho phép.' : ''))),
        h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, icon: 'face', disabled: !agree[0], onClick: start }, 'Bắt đầu quét')));
    }

    if (st[0] === 'scan' || st[0] === 'process') {
      var step = FACE_STEPS[idx[0]], proc = st[0] === 'process';
      var segs = FACE_STEPS.map(function (f, i) {
        var a0 = -90 + i * 72 + 4, a1 = a0 + 64, r = 128, cx = 140, cy = 150;
        var p0 = [cx + r * Math.cos(a0 * Math.PI / 180), cy + r * 1.18 * Math.sin(a0 * Math.PI / 180)], p1 = [cx + r * Math.cos(a1 * Math.PI / 180), cy + r * 1.18 * Math.sin(a1 * Math.PI / 180)];
        return h('path', { key: i, className: 'mb-seg-arc' + (proc || i < idx[0] ? ' done' : i === idx[0] && !warn[0] ? ' cur' : ''), d: 'M' + p0[0] + ' ' + p0[1] + ' A ' + r + ' ' + (r * 1.18) + ' 0 0 1 ' + p1[0] + ' ' + p1[1] });
      });
      return h('div', { className: 'mb-screen mb-face-scan' }, h(Header, { title: 'Quét khuôn mặt', onBack: function () { clearTimeout(t.current); st[1](me.face ? 'manage' : 'intro'); } }),
        h('div', { className: 'mb-face-cam' + (warn[0] ? ' is-warn' : '') },
          h('svg', { viewBox: '0 0 280 300', className: 'mb-face-svg', 'aria-hidden': 'true' },
            h('ellipse', { cx: 140, cy: 150, rx: 112, ry: 134, className: 'mb-face-hole' }), segs,
            step.arrow && !proc && !warn[0] ? h('g', { className: 'mb-face-arrow is-' + step.arrow }, h('path', { d: step.arrow === 'left' ? 'M70 150 l22 -16 v32 z' : step.arrow === 'right' ? 'M210 150 l-22 -16 v32 z' : 'M140 40 l-16 22 h32 z' })) : null),
          h('div', { className: 'mb-face-silhouette is-' + (proc ? 'front' : step.id) }),
          h('span', { className: 'mb-face-count' }, proc ? 'Đang kiểm tra chất lượng…' : 'Bước ' + (idx[0] + 1) + '/' + FACE_STEPS.length)),
        h('div', { className: 'mb-face-instr', role: 'status', 'aria-live': 'polite' },
          warn[0] ? h(React.Fragment, null, h('b', { className: 'is-warn' }, warn[0]), h(C.Button, { size: 'sm', icon: 'sync', onClick: function () { warn[1](null); } }, 'Thử lại bước này'))
            : h('b', null, proc ? 'Giữ yên, sắp xong…' : step.text)),
        h('ol', { className: 'mb-face-steps' }, FACE_STEPS.map(function (f, i) { return h('li', { key: f.id, className: proc || i < idx[0] ? 'done' : i === idx[0] ? 'cur' : '' }, h(C.Icon, { name: proc || i < idx[0] ? 'check' : 'face', size: 14 }), (function (x) { return x.charAt(0).toUpperCase() + x.slice(1); })(f.text.replace('Từ từ ', '').replace(' vào camera', ''))); })),
        proc ? null : h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng sự cố'),
          h('div', { className: 'cp-row' },
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { warn[1]('Quá tối — di chuyển tới nơi sáng hơn'); } }, 'Quá tối'),
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { warn[1]('Có nhiều người trong khung hình'); } }, '2 người'),
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { warn[1]('Đang đeo khẩu trang — vui lòng bỏ ra'); } }, 'Khẩu trang'))));
    }

    return h('div', { className: 'mb-screen' }, h(Header, { title: 'Đăng ký thành công', onBack: function () { props.go('home'); } }),
      h('div', { className: 'mb-result' },
        h('div', { className: 'mb-result-ico' }, h(C.Icon, { name: 'check', size: 40, stroke: 2.4 })),
        h('div', { className: 'mb-result-title' }, 'Đã đăng ký khuôn mặt cho'),
        h('div', { className: 'mb-confirm-name' }, me.name),
        h('div', { className: 'cp-card is-padded mb-result-sum' },
          h('div', { className: 'cp-sum-row' }, h('span', null, 'Số góc mặt'), h('b', null, '5/5')),
          h('div', { className: 'cp-sum-row' }, h('span', null, 'Chất lượng'), h('b', null, 'Tốt')),
          h('div', { className: 'cp-sum-row' }, h('span', null, 'Áp dụng'), h('b', null, 'Mọi kiosk ở Canteen A, B'))),
        h(C.InlineNote, { tone: 'info' }, 'Lần tới ở kiosk, chỉ cần nhìn vào camera. Nếu kiosk hỏi “Bạn có phải là…?”, bấm “Đúng, là tôi”.')),
      h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, onClick: function () { props.go('home'); } }, 'Xong')));
  }


  /* ---------------- Đặt món trước ---------------- */
  var ORDER_MENU = [
    { code: 'C01', al: ['gluten'], name: 'Cơm gà xối mỡ', price: 35000, cat: 'com', group: 'Đồ chiên rán' },
    { code: 'C02', al: ['đậu nành'], name: 'Cơm rang dưa bò', price: 38000, cat: 'com' },
    { code: 'C05', al: ['trứng', 'đậu nành'], name: 'Cơm sườn nướng', price: 38000, cat: 'com', soldout: true },
    { code: 'B03', al: ['hải sản (chả cua)', 'gluten'], name: 'Bún bò Huế', price: 36000, was: 40000, cat: 'bun', group: 'Đồ ăn cay' },
    { code: 'B04', al: [], name: 'Phở gà', price: 35000, cat: 'bun' },
    { code: 'M01', al: ['hải sản', 'gluten', 'trứng'], name: 'Mì xào hải sản', price: 40000, cat: 'bun' },
    { code: 'A07', al: ['trứng', 'gluten'], name: 'Bánh mì trứng', price: 15000, cat: 'an' },
    { code: 'A08', al: ['lạc', 'gluten'], name: 'Bánh mì pate (có lạc)', price: 18000, cat: 'an' },
    { code: 'A09', al: [], name: 'Khoai tây chiên', price: 20000, cat: 'an', group: 'Đồ chiên rán' },
    { code: 'A10', al: ['đậu xanh'], name: 'Xôi xéo', price: 20000, cat: 'an' },
    { code: 'N01', al: [], name: 'Trà đào', price: 15000, cat: 'nuoc' },
    { code: 'N02', al: [], name: 'Coca-Cola lon', price: 12000, cat: 'nuoc', group: 'Nước ngọt có ga' },
    { code: 'N06', al: [], name: 'Nước cam', price: 18000, cat: 'nuoc' },
    { code: 'N07', al: ['sữa'], name: 'Trà sữa trân châu', price: 25000, cat: 'nuoc', group: 'Trà sữa & cà phê' },
    { code: 'T01', al: ['sữa'], name: 'Sữa chua', price: 8000, cat: 'trang' },
    { code: 'T02', al: ['trứng', 'sữa'], name: 'Bánh flan', price: 10000, cat: 'trang', group: 'Kẹo & bánh ngọt' }
  ];
  var ORDER_CATS = [{ id: 'all', label: 'Tất cả' }, { id: 'com', label: 'Cơm' }, { id: 'bun', label: 'Bún / Mì' }, { id: 'an', label: 'Ăn sáng / vặt' }, { id: 'nuoc', label: 'Đồ uống' }, { id: 'trang', label: 'Tráng miệng' }];
  var SLOTS = [{ t: '06:45', label: 'Trước giờ học' }, { t: '09:30', label: 'Ra chơi' }, { t: '11:30', label: 'Nghỉ trưa' }, { t: '11:45', label: 'Nghỉ trưa' }, { t: '16:45', label: 'Tan học' }];
  var SLOT_WIN = { '06:45': 'w1', '09:30': 'w2', '11:30': 'w3', '11:45': 'w3', '16:45': 'w4' };
  var QUEUE_NOW = 42; // đơn đang chờ toàn Canteen — áp dụng cộng giờ cho sinh viên (3.7.2)
  function etaAdd(n) { return n <= 30 ? 20 : n < 50 ? 30 : 35; }
  var CUTOFF = 30; // phút trước giờ nhận thì khóa đặt / hủy
  var O_STATUS = { placed: ['Đã đặt', 'info', 1], preparing: ['Đang chuẩn bị', 'warning', 2], ready: ['Sẵn sàng — đến lấy', 'success', 3], done: ['Đã nhận', 'neutral', 4], cancelled: ['Đã hủy · đã hoàn ví', 'danger', 0] };
  DB.orders = [{ id: 'APP-1176', for: 'khoi', by: 'khoi', items: [{ name: 'Phở gà', price: 35000, qty: 1 }], total: 35000, pay: { bonus: 0, real: 35000 }, day: 'Hôm nay', slot: '11:30', counter: '2', status: 'preparing' }];
  var orderSeq = 1192;
  function minsOf(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function nowMins() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  function blockedFor(c, m) { if (!c || c.role !== 'student') return null; if (m.group && c.blocked.indexOf(m.group) >= 0) return m.group; return null; }
  function ownersOf(me) { return (me.wallet ? [me.key] : []).concat(me.children || []); }

  function Order(props) {
    var me = props.me, owners = ownersOf(me);
    if (!owners.length) return h('div', { className: 'mb-screen' }, h(Header, { title: 'Đặt món trước' }), h('div', { className: 'cp-card is-padded' }, h(C.InlineNote, { tone: 'info' }, 'Liên kết con trong tab “Con” để đặt món cho con.')));
    var who = useState(owners[0]), step = useState('menu'), cat = useState('all'), cart = useState([]), day = useState(null), slot = useState(null), done = useState(null), note = useState(''), counter = useState(null);
    var c = acc(who[0]);
    var todayOpen = SLOTS.filter(function (x) { return minsOf(x.t) - CUTOFF > nowMins(); });
    var d = day[0] || (todayOpen.length ? 'Hôm nay' : 'Ngày mai');
    var slotList = SLOTS.map(function (x) { var late = d === 'Hôm nay' && minsOf(x.t) - CUTOFF <= nowMins(); var outWin = c.role === 'student' && (c.windows || ALL_W).indexOf(SLOT_WIN[x.t]) < 0; return Object.assign({ off: late || outWin, why: late ? 'Hết giờ đặt' : outWin ? 'Bố mẹ không cho' : null }, x); });
    var sl = slot[0] && !slotList.filter(function (x) { return x.t === slot[0] && !x.off; }).length ? null : slot[0];
    var total = cart[0].reduce(function (s, l) { return s + l.price * l.qty; }, 0), count = cart[0].reduce(function (s, l) { return s + l.qty; }, 0);
    var used = c.limit ? (d === 'Hôm nay' ? c.limit.used : 0) : 0;
    var limLeft = c.limit && c.limit.max != null ? c.limit.max - used : Infinity;
    var bal = c.wallet.real + c.wallet.bonus;
    function add(m) { var l = cart[0].slice(), i = l.findIndex(function (x) { return x.code === m.code; }); if (i >= 0) l[i] = Object.assign({}, l[i], { qty: l[i].qty + 1 }); else l.push({ code: m.code, name: m.name, price: m.price, qty: 1 }); cart[1](l); }
    function qty(i, dlt) { cart[1](cart[0].map(function (l, j) { return j === i ? Object.assign({}, l, { qty: l.qty + dlt }) : l; }).filter(function (l) { return l.qty > 0; })); }
    function switchWho(k) {
      var t = acc(k), removed = cart[0].filter(function (l) { return blockedFor(t, ORDER_MENU.filter(function (m) { return m.code === l.code; })[0]); });
      if (removed.length) { cart[1](cart[0].filter(function (l) { return removed.indexOf(l) < 0; })); props.say('Đã bỏ món bị chặn với ' + t.name.split(' ').pop() + ': ' + removed.map(function (l) { return l.name; }).join(', '), 'lock'); }
      who[1](k);
    }
    var qtyOf = {}; cart[0].forEach(function (l) { qtyOf[l.code] = l.qty; });
    var firstCat = cart[0].length ? (ORDER_MENU.filter(function (m) { return m.code === cart[0][0].code; })[0] || {}).cat : 'com';
    var cnt = counter[0] || (firstCat === 'nuoc' || firstCat === 'trang' ? '1' : firstCat === 'an' ? '3' : '2');

    if (step[0] === 'done') {
      var o = done[0];
      return h('div', { className: 'mb-screen' }, h(Header, { title: 'Đặt món thành công', onBack: function () { props.go('orders'); } }),
        h('div', { className: 'mb-result' },
          h('div', { className: 'mb-result-ico' }, h(C.Icon, { name: 'check', size: 40, stroke: 2.4 })),
          h('div', { className: 'mb-result-title' }, 'Mã nhận món' + (o.for !== me.key ? ' cho ' + acc(o.for).name : '')),
          h('div', { className: 'mb-pick-code' }, o.id),
          h('div', { className: 'mb-pick-when' }, h(C.Icon, { name: 'clock', size: 20 }), h('span', null, o.day + ' · ', h('b', null, o.slot), ' · Quầy ' + o.counter)),
          h('div', { className: 'cp-card is-padded mb-result-sum' },
            o.items.map(function (l) { return h('div', { key: l.name, className: 'cp-sum-row' }, h('span', null, l.qty + ' × ' + l.name), h(C.Money, { value: l.price * l.qty })); }),
            h('div', { className: 'cp-sum-row is-discount' }, h('span', null, 'Trừ tiền thưởng'), h(C.Money, { value: -o.pay.bonus })),
            h('div', { className: 'cp-sum-row' }, h('span', null, 'Trừ tiền thật'), h(C.Money, { value: -o.pay.real })),
            h('div', { className: 'cp-sum-row is-total' }, h('span', null, 'Số dư còn lại'), h(C.Money, { value: acc(o.for).wallet.real + acc(o.for).wallet.bonus }))),
          h(C.InlineNote, { tone: 'info' }, 'Đọc mã ' + o.id + ' ở Quầy ' + o.counter + ' để nhận món. Hủy được tới ' + (function () { var m = minsOf(o.slot) - CUTOFF; return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + m % 60).slice(-2); })() + ', tiền hoàn về ví.')),
        h('div', { className: 'mb-bottom mb-2btn' },
          h(C.Button, { size: 'lg', variant: 'secondary', onClick: function () { cart[1]([]); done[1](null); step[1]('menu'); } }, 'Đặt thêm'),
          h(C.Button, { size: 'lg', icon: 'bag', onClick: function () { props.go('orders'); } }, 'Đơn của tôi')));
    }

    if (step[0] === 'checkout') {
      var bonus = Math.min(c.wallet.bonus, total), real = total - bonus;
      var problem = total > bal ? 'Số dư ví của ' + (c.key === me.key ? 'bạn' : c.name.split(' ').pop()) + ' không đủ — còn thiếu ' + fmt(total - bal) + '.'
        : total > limLeft ? 'Vượt hạn mức ' + (d === 'Hôm nay' ? 'hôm nay' : 'ngày mai') + ' (' + fmt(c.limit.max) + ') — bớt món hoặc nhờ bố mẹ tăng hạn mức.'
        : !sl ? 'Chọn giờ nhận món.' : null;
      return h('div', { className: 'mb-screen' }, h(Header, { title: 'Xác nhận đặt món', onBack: function () { step[1]('menu'); } }),
        h(C.SectionLabel, null, 'Đặt cho'),
        h('div', { className: 'cp-card' }, h(C.ListRow, { icon: 'user', title: c.key === me.key ? 'Tôi · ' + c.name : c.name, value: [c.klass, c.id].join(' · ') })),
        h(C.SectionLabel, null, 'Ngày nhận'),
        h('div', { className: 'mb-seg' }, ['Hôm nay', 'Ngày mai'].map(function (x) {
          var off = x === 'Hôm nay' && !todayOpen.length;
          return h('button', { key: x, type: 'button', disabled: off, 'aria-pressed': String(d === x), onClick: function () { day[1](x); } }, h('b', null, x), h('small', null, off ? 'Đã hết giờ đặt' : x === 'Hôm nay' ? 'Còn ' + todayOpen.length + ' khung giờ' : 'Mở đặt cả ngày'));
        })),
        h(C.SectionLabel, null, 'Giờ nhận'),
        h('div', { className: 'mb-slots' }, slotList.map(function (x) {
          return h('button', { key: x.t, type: 'button', disabled: x.off, 'aria-pressed': String(sl === x.t), onClick: function () { slot[1](x.t); } }, h('b', null, x.t), h('small', null, x.why || x.label));
        })),
        h(C.InlineNote, { tone: 'info' }, 'Đặt và hủy được tới ' + CUTOFF + ' phút trước giờ nhận.'),
        c.role === 'university' && sl ? h(C.InlineNote, null, 'Canteen đang có ' + QUEUE_NOW + ' đơn chờ → sinh viên cộng thêm ' + etaAdd(QUEUE_NOW) + ' phút: dự kiến nhận ' + (function () { var m = minsOf(sl) + etaAdd(QUEUE_NOW); return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + m % 60).slice(-2); })() + '.') : null,
        h(C.SectionLabel, null, 'Quầy nhận'),
        h('div', { className: 'mb-seg mb-counters' }, COUNTERS.map(function (q) {
          return h('button', { key: q.id, type: 'button', 'aria-pressed': String(cnt === q.id), onClick: function () { counter[1](q.id); } }, h('b', null, q.name), h('small', null, q.desc));
        })),
        h(C.SectionLabel, null, 'Món đã chọn'),
        h('div', { className: 'cp-card is-padded mb-items' },
          cart[0].map(function (l, i) {
            return h('div', { key: l.code, className: 'mb-oline' }, h('span', null, h('b', null, l.name), h('small', null, fmt(l.price))),
              h('span', { className: 'cp-stepper' },
                h('button', { type: 'button', 'aria-label': 'Giảm', onClick: function () { qty(i, -1); } }, h(C.Icon, { name: l.qty <= 1 ? 'x' : 'minus', size: 18 })),
                h('output', null, l.qty),
                h('button', { type: 'button', 'aria-label': 'Tăng', onClick: function () { qty(i, 1); } }, h(C.Icon, { name: 'plus', size: 18 }))));
          }),
          h(C.Field, { id: 'od-note', label: 'Ghi chú cho bếp', placeholder: 'VD: ít cay, không hành', value: note[0], onChange: function (e) { note[1](e.target.value.slice(0, 80)); } })),
        h(C.SectionLabel, null, 'Thanh toán bằng ví' + (c.key === me.key ? '' : ' của ' + c.name.split(' ').pop())),
        h('div', { className: 'cp-card is-padded', style: { display: 'grid', gap: 8 } },
          h('div', { className: 'cp-sum-row' }, h('span', null, 'Tổng ' + count + ' món'), h(C.Money, { value: total })),
          h('div', { className: 'cp-sum-row is-discount' }, h('span', null, 'Tiền thưởng (dùng trước)'), h(C.Money, { value: -Math.min(bonus, bal) })),
          h('div', { className: 'cp-sum-row' }, h('span', null, 'Tiền thật'), h(C.Money, { value: -Math.max(0, Math.min(real, c.wallet.real)) })),
          h('div', { className: 'cp-sum-row is-total' }, h('span', null, 'Số dư sau khi đặt'), h(C.Money, { value: Math.max(0, bal - total), tone: total > bal ? 'danger' : null })),
          c.limit && c.limit.max != null ? h('div', { className: 'cp-sum-row' }, h('span', { className: 'cp-muted' }, 'Hạn mức ' + d.toLowerCase() + ' còn'), h('span', { className: 'cp-num' }, fmt(Math.max(0, limLeft)))) : null),
        problem && sl ? h(C.InlineNote, { tone: 'danger' }, problem) : null,
        h('div', { className: 'mb-bottom' },
          total > bal ? h(C.Button, { size: 'lg', block: true, icon: 'plus', variant: 'accent', onClick: function () { props.goTopup(c.key); } }, 'Nạp tiền vào ví' + (c.key === me.key ? '' : ' của ' + c.name.split(' ').pop()))
            : h(C.Button, { size: 'lg', block: true, icon: 'check', disabled: !!problem || !cart[0].length, onClick: function () {
              c.wallet = { real: c.wallet.real - real, bonus: c.wallet.bonus - bonus };
              if (d === 'Hôm nay' && c.limit) c.limit.used += total;
              var o = { id: 'APP-' + (orderSeq++), for: c.key, by: me.key, items: cart[0].map(function (l) { return { name: l.name, price: l.price, qty: l.qty }; }), total: total, pay: { bonus: bonus, real: real }, day: d, slot: sl, counter: cnt, status: 'placed', note: note[0] };
              DB.orders.unshift(o);
              DB.tx[c.key] = [{ id: o.id, t: 'Hôm nay · ' + now(), kind: 'buy', title: 'Đặt trước: ' + o.items.map(function (l) { return l.name; }).join(', '), place: 'Nhận ' + d.toLowerCase() + ' ' + sl + ' · Quầy ' + cnt, real: -real, bonus: -bonus || undefined, items: o.items }].concat(DB.tx[c.key] || []);
              notify(c.key, 'bag', 'Đã đặt ' + o.id, o.items.map(function (l) { return l.qty + '× ' + l.name; }).join(', ') + ' · nhận ' + d.toLowerCase() + ' ' + sl + ' tại Quầy ' + cnt + '.');
              props.bump(); done[1](o); step[1]('done');
            } }, sl ? 'Đặt món · trừ ví ' + fmt(total) : 'Chọn giờ nhận món')));
    }

    var items = ORDER_MENU.filter(function (m) { return cat[0] === 'all' || m.cat === cat[0]; });
    return h('div', { className: 'mb-screen mb-order' },
      h(Header, { title: 'Đặt món trước', right: h('button', { type: 'button', className: 'mb-icon-btn', 'aria-label': 'Đơn của tôi', onClick: function () { props.go('orders'); } }, h(C.Icon, { name: 'receipt', size: 22 })) }),
      owners.length > 1 ? h('div', { className: 'mb-seg mb-who' }, owners.map(function (k) {
        var a = acc(k);
        return h('button', { key: k, type: 'button', 'aria-pressed': String(who[0] === k), onClick: function () { switchWho(k); } }, h('b', null, k === me.key ? 'Tôi' : a.name.split(' ').pop()), h('small', null, 'Số dư ' + fmt(a.wallet.real + a.wallet.bonus)));
      })) : null,
      h('div', { className: 'mb-order-info' }, h(C.Icon, { name: 'wallet', size: 18 }),
        h('span', null, (c.key === me.key ? 'Ví của bạn: ' : 'Ví của ' + c.name.split(' ').pop() + ': '), h('b', null, fmt(bal)), c.limit && c.limit.max != null ? ' · hạn mức ' + fmt(c.limit.max) + '/ngày' : '')),
      c.role === 'student' && c.blocked.length ? h(C.InlineNote, { tone: 'danger' }, 'Bố mẹ đã chặn: ' + c.blocked.join(', ').toLowerCase() + '.') : null,
      h('div', { style: { height: 10 } }),
      h(C.CategoryTabs, { items: ORDER_CATS, active: cat[0], onChange: cat[1] }),
      h('div', { className: 'mb-menu' }, items.map(function (m) {
        var b = blockedFor(c, m), off = m.soldout || b;
        return h('button', { key: m.code, type: 'button', className: 'mb-mi' + (qtyOf[m.code] ? ' is-on' : '') + (off ? ' is-off' : ''), disabled: !!off, onClick: function () { add(m); } },
          h('span', { className: 'mb-mi-ph is-' + m.cat }, m.code),
          h('span', { className: 'mb-mi-body' }, h('b', null, m.name),
            h('span', { className: 'mb-mi-price' }, m.was ? h(C.Money, { value: m.was, strike: true }) : null, ' ', h(C.Money, { value: m.price })),
            h('small', { className: 'mb-mi-al' + (m.al && m.al.length ? ' has' : '') }, m.al && m.al.length ? 'Có chứa: ' + m.al.join(', ') : 'Không chứa chất gây dị ứng phổ biến'),
            m.soldout ? h(C.StatusBadge, { tone: 'neutral', icon: 'ban' }, 'Hết món') : b ? h(C.StatusBadge, { tone: 'danger', icon: 'lock' }, b) : null),
          qtyOf[m.code] ? h('span', { className: 'mb-mi-qty' }, qtyOf[m.code]) : off ? null : h('span', { className: 'mb-mi-add' }, h(C.Icon, { name: 'plus', size: 18 })));
      })),
      h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, icon: 'bag', disabled: !count, onClick: function () { step[1]('checkout'); } }, count ? 'Tiếp tục · ' + count + ' món · ' + fmt(total) : 'Chọn món để đặt')));
  }

  function MyOrders(props) {
    var me = props.me, owners = ownersOf(me);
    var list = DB.orders.filter(function (o) { return owners.indexOf(o.for) >= 0; });
    function set(o, st) { o.status = st; props.bump(); }
    return h('div', { className: 'mb-screen' }, h(Header, { title: 'Đơn đặt trước', onBack: function () { props.go('order'); } }),
      list.length ? list.map(function (o) {
        var S = O_STATUS[o.status], cut = minsOf(o.slot) - CUTOFF, canCancel = o.status === 'placed' && (o.day === 'Ngày mai' || nowMins() < cut);
        return h('section', { key: o.id, className: 'mb-order-card' + (o.status === 'ready' ? ' is-ready' : '') },
          h('div', { className: 'mb-oc-head' }, h('span', { className: 'mb-oc-code' }, o.id), h(C.StatusBadge, { tone: S[1] }, S[0])),
          h('div', { className: 'mb-oc-when' }, h(C.Icon, { name: 'clock', size: 16 }), o.day + ' · ' + o.slot + ' · Quầy ' + o.counter + (o.for !== me.key ? ' · cho ' + acc(o.for).name.split(' ').pop() : '')),
          h('div', { className: 'mb-oc-items' }, o.items.map(function (l) { return l.qty + '× ' + l.name; }).join(', ') + (o.note ? ' · “' + o.note + '”' : '')),
          o.status !== 'cancelled' ? h('div', { className: 'cp-steps' }, [1, 2, 3, 4].map(function (k) { return h('i', { key: k, className: k <= S[2] ? 'on' : '' }); })) : null,
          h('div', { className: 'mb-oc-foot' }, h(C.Money, { value: o.total }),
            canCancel ? h(C.Button, { size: 'sm', variant: 'danger', icon: 'x', onClick: function () {
              var c = acc(o.for); c.wallet = { real: c.wallet.real + o.pay.real, bonus: c.wallet.bonus + o.pay.bonus }; if (o.day === 'Hôm nay' && c.limit) c.limit.used -= o.total;
              DB.tx[o.for] = [{ id: 'HT-' + o.id.slice(4), t: 'Hôm nay · ' + now(), kind: 'refund', title: 'Hủy đặt trước ' + o.id, place: 'Hoàn về ví', real: o.pay.real, bonus: o.pay.bonus || undefined }].concat(DB.tx[o.for] || []);
              set(o, 'cancelled'); props.say('Đã hủy ' + o.id + ' · hoàn ' + fmt(o.total) + ' về ví', 'undo');
            } }, 'Hủy đơn') : o.status === 'placed' ? h('small', { className: 'cp-muted' }, 'Đã quá giờ hủy') : null),
          o.status === 'ready' ? h(C.InlineNote, { tone: 'info' }, 'Món đã sẵn sàng ở Quầy ' + o.counter + '. Đọc mã ' + o.id + ' cho nhân viên để nhận.') : null,
          ['placed', 'preparing', 'ready'].indexOf(o.status) >= 0 ? h('div', { className: 'pt-demo', style: { marginTop: 4 } }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng phía căng tin'),
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { var n = { placed: 'preparing', preparing: 'ready', ready: 'done' }[o.status]; if (n === 'ready') notify(o.for, 'bag', 'Món của ' + o.id + ' đã sẵn sàng', 'Đến Quầy ' + o.counter + ' và đọc mã ' + o.id + '.'); set(o, n); if (n === 'ready') props.say('Món của ' + o.id + ' đã sẵn sàng', 'check'); } },
              { placed: 'Bếp bắt đầu làm', preparing: 'Báo sẵn sàng', ready: 'Đã giao món' }[o.status])) : null);
      }) : h('div', { className: 'pt-empty' }, 'Chưa có đơn đặt trước.'),
      h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, icon: 'plus', onClick: function () { props.go('order'); } }, 'Đặt món mới')));
  }


  /* ================= Thông báo, hồ sơ, hỗ trợ, hoàn trả, sao kê, suất ăn lớp ================= */
  DB.notif = {
    nam: [
      { id: 1, at: 'Hôm nay 07:31', icon: 'receipt', title: 'Khôi vừa mua hàng', body: 'Xôi xéo · 20.000 ₫ · Canteen A, Quầy 2. Số dư còn 52.000 ₫.', read: false },
      { id: 2, at: 'Hôm qua 19:05', icon: 'plus', title: 'Nạp tiền thành công', body: 'Đã cộng 100.000 ₫ vào ví của Khôi.', read: true },
      { id: 3, at: '04/10 10:05', icon: 'alert', title: 'Số dư của Linh sắp hết?', body: 'Không — số dư 65.000 ₫. Bạn sẽ nhận cảnh báo khi dưới 20.000 ₫.', read: true }
    ],
    khoi: [
      { id: 1, at: 'Hôm nay 10:40', icon: 'bag', title: 'Đơn APP-1176 đang chuẩn bị', body: 'Nhận lúc 11:30 tại Quầy 2.', read: false },
      { id: 2, at: 'Hôm nay 06:00', icon: 'tag', title: 'Tiền thưởng sắp hết hạn', body: '10.000 ₫ tiền thưởng hết hạn ngày 31/10/2026.', read: true }
    ],
    ha: [{ id: 1, at: 'Hôm nay 07:05', icon: 'receipt', title: 'Thanh toán thành công', body: 'Phở gà, Trà đào · 50.000 ₫ (gồm 10.000 ₫ tiền thưởng).', read: false }]
  };
  DB.tickets = [{ id: 'HT-2031', key: 'nam', about: 'DH-0377', title: 'Kiosk trừ tiền 2 lần?', status: 'done', at: '02/10', reply: 'Đã kiểm tra: chỉ trừ 1 lần, giao dịch thứ hai bị hủy tự động. Cảm ơn anh.' }];
  DB.refunds = [];
  DB.channels = {};
  var NOTI_CH = [{ id: 'web', label: 'Trong Ví Canteen', desc: 'Luôn bật' }, { id: 'zalo', label: 'Zalo OA “Canteen Giảng Võ”', desc: 'Mua hàng, số dư thấp, đơn sẵn sàng' }, { id: 'sms', label: 'Tin nhắn SMS', desc: 'Chỉ nạp tiền và hoàn tiền' }];
  function notify(key, icon, title, body) {
    var push = function (k) { (DB.notif[k] = DB.notif[k] || []).unshift({ id: Date.now() + Math.random(), at: 'Vừa xong', icon: icon, title: title, body: body, read: false }); };
    push(key);
    Object.keys(DB.accounts).forEach(function (k) { var a = DB.accounts[k]; if (k !== key && (a.children || []).indexOf(key) >= 0) push(k); });
  }
  function unread(key) { return (DB.notif[key] || []).filter(function (n) { return !n.read; }).length; }

  function Notifications(props) {
    var me = props.me, list = DB.notif[me.key] || [];
    useEffect(function () { return function () { list.forEach(function (n) { n.read = true; }); props.bump(); }; }, []);
    return h('div', { className: 'mb-screen' }, h(Header, { title: 'Thông báo', onBack: function () { props.go('home'); } }),
      list.length ? h('div', { className: 'cp-card' }, list.map(function (n) {
        return h('div', { key: n.id, className: 'mb-noti' + (n.read ? '' : ' is-new') },
          h('span', { className: 'mb-tx-ico' }, h(C.Icon, { name: n.icon, size: 20 })),
          h('span', { className: 'mb-noti-body' }, h('b', null, n.title), h('span', null, n.body), h('small', null, n.at)));
      })) : h('div', { className: 'pt-empty' }, 'Chưa có thông báo.'),
      h('button', { type: 'button', className: 'mb-link', onClick: function () { props.go('profile'); } }, 'Cài đặt kênh nhận thông báo', h(C.Icon, { name: 'chevron', size: 18 })));
  }

  function Profile(props) {
    var me = props.me, st = useState('main'), pw = useState(['', '', '']), err = useState(null);
    var ch = DB.channels[me.key] = DB.channels[me.key] || { web: true, zalo: true, sms: false };
    var row = function (icon, title, value, onClick, trailing) { return h(C.ListRow, { icon: icon, title: title, value: value, chevron: !!onClick && !trailing, onClick: onClick, trailing: trailing }); };
    if (st[0] === 'pw') {
      return h('div', { className: 'mb-screen' }, h(Header, { title: 'Đổi mật khẩu', onBack: function () { st[1]('main'); } }),
        h(C.Field, { id: 'pf-0', label: 'Mật khẩu hiện tại', type: 'password', icon: 'lock', value: pw[0][0], onChange: function (e) { pw[1]([e.target.value, pw[0][1], pw[0][2]]); err[1](null); } }), h('div', { style: { height: 12 } }),
        h(C.Field, { id: 'pf-1', label: 'Mật khẩu mới', type: 'password', icon: 'lock', placeholder: 'Tối thiểu 6 ký tự', value: pw[0][1], onChange: function (e) { pw[1]([pw[0][0], e.target.value, pw[0][2]]); err[1](null); } }), h('div', { style: { height: 12 } }),
        h(C.Field, { id: 'pf-2', label: 'Nhập lại mật khẩu mới', type: 'password', icon: 'lock', value: pw[0][2], error: err[0], onChange: function (e) { pw[1]([pw[0][0], pw[0][1], e.target.value]); err[1](null); } }),
        h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, onClick: function () {
          if (pw[0][0] !== DB.pass[me.key]) return err[1]('Mật khẩu hiện tại chưa đúng.');
          if (pw[0][1].length < 6) return err[1]('Mật khẩu mới tối thiểu 6 ký tự.');
          if (pw[0][1] !== pw[0][2]) return err[1]('Mật khẩu nhập lại chưa khớp.');
          DB.pass[me.key] = pw[0][1]; props.say('Đã đổi mật khẩu'); st[1]('main');
        } }, 'Lưu mật khẩu mới')));
    }
    if (st[0] === 'install') {
      return h('div', { className: 'mb-screen' }, h(Header, { title: 'Thêm vào màn hình chính', onBack: function () { st[1]('main'); } }),
        h('p', { className: 'mb-lead' }, 'Ví Canteen là trang web, không cần cài app. Thêm biểu tượng ra màn hình chính để mở nhanh, toàn màn hình như ứng dụng.'),
        h(C.SectionLabel, null, 'iPhone (Safari)'),
        h('ol', { className: 'mb-steps' }, h('li', null, 'Chạm nút Chia sẻ ở thanh dưới Safari.'), h('li', null, 'Chọn ', h('b', null, '“Thêm vào MH chính”'), '.'), h('li', null, 'Chạm ', h('b', null, 'Thêm'), '.')),
        h(C.SectionLabel, null, 'Android (Chrome)'),
        h('ol', { className: 'mb-steps' }, h('li', null, 'Chạm dấu ⋮ ở góc trên.'), h('li', null, 'Chọn ', h('b', null, '“Thêm vào màn hình chính”'), ' hoặc ', h('b', null, '“Cài đặt ứng dụng”'), '.')),
        h(C.InlineNote, { tone: 'info' }, 'Trình duyệt có thể tự đăng xuất sau 30 ngày không dùng — đăng nhập lại bằng mật khẩu hoặc mã OTP.'));
    }
    return h('div', { className: 'mb-screen' }, h(Header, { title: 'Tài khoản', onBack: function () { props.go('home'); } }),
      h('div', { className: 'mb-face-status' }, h('span', { className: 'mb-avatar' }, initials(me.name)),
        h('div', null, h('b', null, me.name), h('small', null, [ROLE[me.role] + (me.role === 'teacher' && isParent(me) ? ' · Phụ huynh' : ''), me.klass, me.id].filter(Boolean).join(' · ')))),
      h(C.SectionLabel, null, 'Thông tin'),
      h('div', { className: 'cp-card' },
        row('user', 'Đăng nhập bằng', me.login),
        row('info', 'Số điện thoại', me.phone || (me.role === 'parent' ? me.id : 'Chưa cập nhật')),
        row('lock', 'Đổi mật khẩu', 'Lần đổi gần nhất: chưa đổi', function () { st[1]('pw'); }),
        me.wallet ? row('face', 'Nhận diện khuôn mặt', me.face ? 'Đã đăng ký ' + me.face.at : 'Chưa đăng ký', function () { props.go('face'); }) : null,
        isParent(me) ? row('users', 'Con đã liên kết', (me.children || []).map(function (k) { return acc(k).name.split(' ').pop(); }).join(', ') || 'Chưa có', function () { props.go('manage'); }) : null),
      h(C.SectionLabel, null, 'Kênh nhận thông báo'),
      h('div', { className: 'cp-card' }, NOTI_CH.map(function (c) {
        return h('label', { key: c.id, className: 'mb-toggle-row' }, h('span', null, h('b', null, c.label), h('small', null, c.desc)),
          h('input', { type: 'checkbox', role: 'switch', className: 'mb-switch is-ok', disabled: c.id === 'web', checked: !!ch[c.id], 'aria-label': c.label, onChange: function () { ch[c.id] = !ch[c.id]; props.bump(); } }));
      })),
      h(C.SectionLabel, null, 'Hỗ trợ'),
      h('div', { className: 'cp-card' },
        row('chat', 'Trợ lý Canteen', 'Hỏi số dư, đơn hàng, hoàn tiền — chuyển nhân viên khi cần', function () { props.go('support'); }),
        row('doc', 'Khiếu nại & tra soát của tôi', DB.tickets.filter(function (t) { return t.key === me.key; }).length + ' yêu cầu', function () { props.go('tickets'); }),
        row('undo', 'Yêu cầu hoàn trả số dư', 'Nghỉ học, chuyển trường, cuối năm học', function () { props.go('refund'); }),
        row('home', 'Thêm vào màn hình chính', 'Mở Ví Canteen như một ứng dụng', function () { st[1]('install'); })),
      h('div', { style: { height: 16 } }),
      h(C.Button, { variant: 'secondary', block: true, size: 'lg', onClick: props.logout }, 'Đăng xuất'));
  }

  function txDetailOf(t) {
    var items = t.items || [];
    var orig = items.length ? items.reduce(function (s, l) { return s + l.price * l.qty; }, 0) : Math.abs((t.real || 0) + (t.bonus || 0)) + (t.disc || 0);
    return { orig: orig, disc: t.disc || 0, bonus: Math.abs(t.bonus || 0), real: Math.abs(t.real || 0) };
  }
  function TxDetail(props) {
    var t = props.tx, me = props.me, d = txDetailOf(t), buy = t.kind === 'buy', open = useState(false), text = useState('');
    var line = function (a, b, cls) { return h('div', { className: 'cp-sum-row' + (cls ? ' ' + cls : '') }, h('span', null, a), b); };
    return h('div', { className: 'mb-screen' }, h(Header, { title: 'Chi tiết giao dịch', onBack: props.back }),
      h('div', { className: 'mb-result', style: { paddingTop: 0 } },
        h('div', { className: 'mb-result-amt' }, h(C.Money, { value: (t.real || 0) + (t.bonus || 0), sign: true, size: 'xl', tone: (t.real || 0) + (t.bonus || 0) > 0 ? 'success' : null })),
        h('div', { className: 'cp-muted' }, (t.who ? t.who + ' · ' : '') + t.title)),
      h(C.SectionLabel, null, 'Thông tin'),
      h('div', { className: 'cp-card is-padded', style: { display: 'grid', gap: 8 } },
        line('Mã giao dịch', h('b', null, t.id)), line('Thời gian', h('b', null, t.t)), line('Nơi', h('b', null, t.place)), t.staff ? line('Nhân viên', h('b', null, t.staff)) : null),
      buy ? h(React.Fragment, null,
        h(C.SectionLabel, null, 'Món đã mua'),
        h('div', { className: 'cp-card is-padded', style: { display: 'grid', gap: 8 } },
          (t.items || []).map(function (l, i) { return line(l.qty + ' × ' + l.name, h(C.Money, { value: l.price * l.qty }), null); })),
        h(C.SectionLabel, null, 'Thanh toán'),
        h('div', { className: 'cp-card is-padded', style: { display: 'grid', gap: 8 } },
          line('Giá gốc', h(C.Money, { value: d.orig })),
          d.disc ? line(t.discLabel || 'Giảm giá / khuyến mại', h(C.Money, { value: -d.disc }), 'is-discount') : null,
          line('Trừ tiền thưởng', h(C.Money, { value: -d.bonus, tone: 'accent' })),
          line('Trừ tiền thật (thực thu)', h(C.Money, { value: -d.real }), 'is-total'))) : null,
      t.kind === 'pending' ? h(C.InlineNote, null, 'Canteen đang đối soát với ngân hàng. Kết quả sẽ có trong 1 ngày làm việc.') : null,
      open[0] ? h('div', { className: 'cp-card is-padded mb-items', style: { marginTop: 12 } },
        h(C.Field, { id: 'tk-txt', as: 'textarea', rows: 3, label: 'Mô tả sai sót', placeholder: 'VD: bị trừ tiền 2 lần, món không đúng, chưa nhận được món…', value: text[0], onChange: function (e) { text[1](e.target.value.slice(0, 300)); } }),
        h(C.Button, { block: true, disabled: text[0].trim().length < 5, onClick: function () {
          var id = 'HT-' + (2032 + DB.tickets.length); DB.tickets.unshift({ id: id, key: me.key, about: t.id, title: text[0].trim(), status: 'open', at: 'Hôm nay' });
          notify(me.key, 'doc', 'Đã nhận yêu cầu ' + id, 'Canteen sẽ phản hồi trong 1 ngày làm việc.'); props.say('Đã gửi tra soát ' + id); props.go('tickets');
        } }, 'Gửi yêu cầu tra soát')) : null,
      !open[0] && t.kind !== 'bonus' ? h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, variant: 'secondary', icon: 'alert', onClick: function () { open[1](true); } }, 'Báo sai sót giao dịch này')) : null);
  }

  var T_STATUS = { open: ['Đang xử lý', 'warning'], done: ['Đã trả lời', 'success'] };
  function Tickets(props) {
    var me = props.me, list = DB.tickets.filter(function (t) { return t.key === me.key; });
    return h('div', { className: 'mb-screen' }, h(Header, { title: 'Khiếu nại & tra soát', onBack: function () { props.go('profile'); } }),
      list.length ? list.map(function (t) {
        return h('section', { key: t.id, className: 'mb-order-card' },
          h('div', { className: 'mb-oc-head' }, h('span', { className: 'mb-oc-code' }, t.id), h(C.StatusBadge, { tone: T_STATUS[t.status][1] }, T_STATUS[t.status][0])),
          h('div', { className: 'mb-oc-items', style: { color: 'var(--ink)' } }, t.title),
          h('div', { className: 'mb-oc-items' }, 'Giao dịch ' + t.about + ' · gửi ' + t.at),
          t.reply ? h('div', { className: 'mb-reply' }, h('b', null, 'Canteen trả lời: '), t.reply) : null,
          t.status === 'open' ? h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng phía Canteen'),
            h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { t.status = 'done'; t.reply = 'Đã kiểm tra và hoàn ' + '20.000 ₫ về ví. Xin lỗi vì sự bất tiện.'; notify(me.key, 'doc', 'Yêu cầu ' + t.id + ' đã có kết quả', t.reply); props.bump(); } }, 'Trả lời & đóng')) : null);
      }) : h('div', { className: 'pt-empty' }, 'Chưa có yêu cầu nào. Mở một giao dịch trong Lịch sử và chọn “Báo sai sót”.'),
      h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, icon: 'chat', onClick: function () { props.go('support'); } }, 'Hỏi Trợ lý Canteen')));
  }

  var R_STEPS = ['Đã gửi', 'Canteen duyệt', 'Đã chuyển khoản'];
  function RefundBalance(props) {
    var me = props.me, owners = (me.wallet ? [me.key] : []).concat(me.children || []);
    var who = useState(owners[0]), reason = useState(''), bank = useState(''), acct = useState(''), tried = useState(false);
    var c = acc(who[0]), mine = DB.refunds.filter(function (r) { return owners.indexOf(r.for) >= 0; });
    var pending = mine.filter(function (r) { return r.for === who[0] && r.step < 2; })[0];
    var errs = { reason: !reason[0] ? 'Chọn lý do' : null, bank: bank[0].trim().length < 3 ? 'Nhập tên ngân hàng' : null, acct: !/^\d{6,19}$/.test(acct[0].replace(/\s/g, '')) ? 'Số tài khoản 6–19 chữ số' : null };
    var ok = !errs.reason && !errs.bank && !errs.acct && c.wallet.real > 0 && !pending;
    var e = function (k) { return tried[0] ? errs[k] : null; };
    return h('div', { className: 'mb-screen' }, h(Header, { title: 'Hoàn trả số dư', onBack: function () { props.go('profile'); } }),
      mine.length ? h(React.Fragment, null, h(C.SectionLabel, null, 'Yêu cầu đã gửi'), mine.map(function (r) {
        return h('section', { key: r.id, className: 'mb-order-card' },
          h('div', { className: 'mb-oc-head' }, h('span', { className: 'mb-oc-code' }, r.id), h(C.StatusBadge, { tone: r.step === 2 ? 'success' : 'warning' }, R_STEPS[r.step])),
          h('div', { className: 'mb-oc-items' }, acc(r.for).name + ' · ' + r.reason + ' · về ' + r.bank + ' ' + r.acct),
          h('div', { className: 'cp-steps', style: { gridTemplateColumns: 'repeat(3, 1fr)' } }, [0, 1, 2].map(function (k) { return h('i', { key: k, className: k <= r.step ? 'on' : '' }); })),
          h('div', { className: 'mb-oc-foot' }, h(C.Money, { value: r.amount }),
            r.step < 2 ? h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { r.step++; if (r.step === 2) { notify(r.for, 'undo', 'Đã hoàn trả số dư ' + fmt(r.amount), 'Chuyển khoản về ' + r.bank + ' ' + r.acct + '.'); } props.bump(); } }, r.step === 0 ? 'Mô phỏng: Canteen duyệt' : 'Mô phỏng: đã chuyển') : null));
      })) : null,
      h(C.SectionLabel, null, 'Gửi yêu cầu mới'),
      owners.length > 1 ? h('div', { className: 'mb-seg', style: { marginBottom: 10 } }, owners.map(function (k) { return h('button', { key: k, type: 'button', 'aria-pressed': String(who[0] === k), onClick: function () { who[1](k); } }, h('b', null, k === me.key ? 'Tôi' : acc(k).name.split(' ').pop()), h('small', null, 'Tiền thật ' + fmt(acc(k).wallet.real))); })) : null,
      h('div', { className: 'cp-card is-padded', style: { display: 'grid', gap: 8 } },
        h('div', { className: 'cp-sum-row' }, h('span', null, 'Tiền thật được hoàn'), h(C.Money, { value: c.wallet.real, size: 'lg' })),
        h('div', { className: 'cp-sum-row' }, h('span', { className: 'cp-muted' }, 'Tiền thưởng (không hoàn)'), h(C.Money, { value: c.wallet.bonus }))),
      pending ? h(C.InlineNote, null, 'Đang có yêu cầu ' + pending.id + ' chờ xử lý cho tài khoản này.') : null,
      h('div', { style: { height: 12 } }),
      h(C.Field, { id: 'rf-r', as: 'select', label: 'Lý do', value: reason[0], error: e('reason'), options: ['', 'Nghỉ học', 'Chuyển trường', 'Kết thúc năm học', 'Không dùng dịch vụ nữa', 'Khác'], onChange: function (ev) { reason[1](ev.target.value); } }), h('div', { style: { height: 12 } }),
      h(C.Field, { id: 'rf-b', label: 'Ngân hàng nhận', placeholder: 'VD: Vietcombank', value: bank[0], error: e('bank'), onChange: function (ev) { bank[1](ev.target.value); } }), h('div', { style: { height: 12 } }),
      h(C.Field, { id: 'rf-a', label: 'Số tài khoản (tên chủ tài khoản phải trùng tên phụ huynh/người dùng)', numeric: true, placeholder: '0123456789', value: acct[0], error: e('acct'), onChange: function (ev) { acct[1](ev.target.value.replace(/[^\d ]/g, '')); } }),
      h(C.InlineNote, { tone: 'info' }, 'Sau khi gửi, ví của ' + (c.key === me.key ? 'bạn' : c.name.split(' ').pop()) + ' tạm khóa phần tiền thật đang hoàn. Canteen duyệt trong 3 ngày làm việc.'),
      h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, disabled: !c.wallet.real || !!pending, onClick: function () {
        tried[1](true); if (!ok) return;
        var r = { id: 'HTS-' + (501 + DB.refunds.length), for: c.key, amount: c.wallet.real, reason: reason[0], bank: bank[0].trim(), acct: acct[0].replace(/\s/g, ''), step: 0 };
        DB.refunds.unshift(r); c.wallet = { real: 0, bonus: c.wallet.bonus };
        DB.tx[c.key] = [{ id: r.id, t: 'Hôm nay · ' + now(), kind: 'pending', title: 'Yêu cầu hoàn trả số dư', place: 'Chờ Canteen duyệt', real: -r.amount }].concat(DB.tx[c.key] || []);
        notify(c.key, 'undo', 'Đã gửi yêu cầu hoàn ' + fmt(r.amount), 'Mã ' + r.id + ' · chờ Canteen duyệt.'); props.say('Đã gửi yêu cầu ' + r.id); props.bump();
      } }, c.wallet.real ? 'Gửi yêu cầu hoàn ' + fmt(c.wallet.real) : 'Không có tiền thật để hoàn')));
  }

  function Support(props) {
    var me = props.me, owners = (me.wallet ? [me.key] : []).concat(me.children || []);
    var msgs = useState([{ from: 'bot', text: 'Chào ' + me.name.split(' ').pop() + ', mình là Trợ lý Canteen. Bạn cần hỗ trợ gì?' }]), txt = useState('');
    var endRef = useRef();
    useEffect(function () { if (endRef.current) endRef.current.scrollIntoView({ block: 'end' }); }, [msgs[0].length]);
    function answer(q) {
      var l = q.toLowerCase(), a;
      if (/số dư|so du|tiền|ví/.test(l)) a = owners.map(function (k) { var x = acc(k); return (k === me.key ? 'Ví của bạn' : 'Ví của ' + x.name.split(' ').pop()) + ': ' + fmt(x.wallet.real + x.wallet.bonus) + ' (thật ' + fmt(x.wallet.real) + ', thưởng ' + fmt(x.wallet.bonus) + ')'; }).join('\n');
      else if (/đơn|don|đặt/.test(l)) { var os = (DB.orders || []).filter(function (o) { return owners.indexOf(o.for) >= 0 && ['placed', 'preparing', 'ready'].indexOf(o.status) >= 0; }); a = os.length ? os.map(function (o) { return o.id + ': ' + O_STATUS[o.status][0] + ', nhận ' + o.day.toLowerCase() + ' ' + o.slot + ' tại Quầy ' + o.counter; }).join('\n') : 'Hiện không có đơn đặt trước nào đang chờ.'; }
      else if (/hoàn|hoan|rút/.test(l)) a = 'Tiền thật trong ví được hoàn khi nghỉ học, chuyển trường hoặc cuối năm. Tiền thưởng không hoàn. Mở Tài khoản → Yêu cầu hoàn trả số dư, Canteen duyệt trong 3 ngày làm việc.';
      else if (/hạn mức|han muc|chặn/.test(l)) a = isParent(me) ? 'Vào tab “Con” → chọn con → đặt hạn mức theo ngày, khung giờ được mua và nhóm món bị chặn.' : 'Hạn mức và món bị chặn do bố mẹ đặt trong tài khoản phụ huynh.';
      else if (/nhân viên|người|gặp/.test(l)) a = null;
      else a = 'Mình chưa hiểu câu hỏi. Bạn có thể hỏi về số dư, đơn hàng, hoàn tiền, hạn mức — hoặc chọn “Gặp nhân viên”.';
      return a;
    }
    function send(q) {
      if (!q.trim()) return;
      var a = answer(q), next = msgs[0].concat([{ from: 'me', text: q }]);
      if (a === null) {
        var id = 'HT-' + (2032 + DB.tickets.length); DB.tickets.unshift({ id: id, key: me.key, about: 'Trợ lý', title: 'Yêu cầu gặp nhân viên: ' + (msgs[0].filter(function (m) { return m.from === 'me'; }).map(function (m) { return m.text; }).pop() || q), status: 'open', at: 'Hôm nay' });
        next.push({ from: 'bot', text: 'Mình đã chuyển cho nhân viên hỗ trợ (mã ' + id + '). Nhân viên sẽ trả lời trong giờ hành chính, bạn xem trong mục Khiếu nại & tra soát.' });
      } else next.push({ from: 'bot', text: a });
      msgs[1](next); txt[1]('');
    }
    var quick = ['Số dư hiện tại', 'Đơn đặt trước của tôi', 'Hoàn tiền thế nào?', 'Đặt hạn mức', 'Gặp nhân viên'];
    return h('div', { className: 'mb-screen mb-chat' }, h(Header, { title: 'Trợ lý Canteen', onBack: function () { props.go('profile'); } }),
      h('div', { className: 'mb-msgs' }, msgs[0].map(function (m, i) { return h('div', { key: i, className: 'mb-msg is-' + m.from }, m.text); }), h('div', { ref: endRef })),
      h('div', { className: 'mb-quick' }, quick.map(function (q) { return h('button', { key: q, type: 'button', onClick: function () { send(q); } }, q); })),
      h('form', { className: 'mb-chat-in', onSubmit: function (e) { e.preventDefault(); send(txt[0]); } },
        h('input', { id: 'ct-msg', 'aria-label': 'Nhập câu hỏi', placeholder: 'Nhập câu hỏi…', value: txt[0], onChange: function (e) { txt[1](e.target.value); } }),
        h(C.Button, { type: 'submit', icon: 'chevron', 'aria-label': 'Gửi', disabled: !txt[0].trim() })),
      h('div', { className: 'mb-chat-note' }, 'Trợ lý chỉ tra cứu dữ liệu của tài khoản đang đăng nhập.'));
  }

  function Statement(props) {
    var me = props.me, k = props.owner, a = acc(k), list = (DB.tx[k] || []);
    var inc = list.reduce(function (s, t) { var v = (t.real || 0) + (t.bonus || 0); return s + (v > 0 ? v : 0); }, 0), out = list.reduce(function (s, t) { var v = (t.real || 0) + (t.bonus || 0); return s + (v < 0 ? -v : 0); }, 0);
    return h('div', { className: 'mb-screen' }, h(Header, { title: 'Sao kê ví', onBack: function () { props.go('history'); } }),
      h('div', { className: 'mb-paper' },
        h('div', { className: 'mb-paper-head' }, h('b', null, 'SAO KÊ VÍ CANTEEN'), h('span', null, SCHOOL + ' · ' + props.range)),
        h('div', { className: 'mb-paper-row' }, h('span', null, 'Chủ ví'), h('b', null, a.name + ' · ' + a.id)),
        h('div', { className: 'mb-paper-row' }, h('span', null, 'Tổng tiền vào'), h('b', null, fmt(inc))),
        h('div', { className: 'mb-paper-row' }, h('span', null, 'Tổng tiền ra'), h('b', null, fmt(out))),
        h('div', { className: 'mb-paper-row' }, h('span', null, 'Số dư cuối kỳ'), h('b', null, fmt(a.wallet.real + a.wallet.bonus))),
        h('table', null, h('thead', null, h('tr', null, h('th', null, 'Thời gian'), h('th', null, 'Nội dung'), h('th', null, 'Thưởng'), h('th', null, 'Thật'))),
          h('tbody', null, list.map(function (t) { return h('tr', { key: t.id }, h('td', null, t.t.replace('Hôm nay · ', 'Nay ').replace('Hôm qua · ', 'Qua ')), h('td', null, t.title), h('td', null, t.bonus ? fmt(t.bonus) : '—'), h('td', null, t.real ? fmt(t.real) : '—')); })))),
      h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, icon: 'doc', onClick: function () { props.say('Bản dùng thử: file PDF sẽ được tải về điện thoại khi chạy thật', 'doc'); } }, 'Tải sao kê PDF')));
  }

  /* Suất ăn theo lớp — GVCN (5.3) */
  var MEALS = [{ id: 'std', name: 'Suất trưa tiêu chuẩn', price: 30000 }, { id: 'veg', name: 'Suất chay', price: 30000 }];
  DB.classOrders = [];
  function ClassMeal(props) {
    var me = props.me, st = useState('new'), day = useState('Ngày mai'), meal = useState({}), pick = useState(null), cur = useState(null);
    var kids = (me.students || []).map(acc);
    var eligible = function (s) { return s.classMeal && s.wallet.real + s.wallet.bonus >= 30000 && (s.windows || ALL_W).indexOf('w3') >= 0; };
    var sel = pick[0] || kids.filter(eligible).map(function (s) { return s.key; });
    var total = sel.length * 30000;
    var why = function (s) { return !s.classMeal ? 'Phụ huynh chưa đồng ý' : (s.windows || ALL_W).indexOf('w3') < 0 ? 'Bố mẹ không cho mua giờ trưa' : s.wallet.real + s.wallet.bonus < 30000 ? 'Số dư không đủ (' + fmt(s.wallet.real + s.wallet.bonus) + ')' : null; };
    if (st[0] === 'track' && cur[0]) {
      var o = cur[0];
      return h('div', { className: 'mb-screen' }, h(Header, { title: 'Đơn ' + o.id, onBack: function () { st[1]('new'); } }),
        h('div', { className: 'mb-order-card' },
          h('div', { className: 'mb-oc-head' }, h('span', { className: 'mb-oc-code' }, o.id), h(C.StatusBadge, { tone: o.status === 'done' ? 'neutral' : o.status === 'ready' ? 'success' : 'info' }, { placed: 'Đã gửi bếp', ready: 'Sẵn sàng tại Quầy 3', done: 'Đã phát suất' }[o.status])),
          h('div', { className: 'mb-oc-when' }, h(C.Icon, { name: 'clock', size: 16 }), o.day + ' · 11:00 · Quầy 3 · Lớp ' + me.homeroom),
          h('div', { className: 'mb-oc-foot' }, h('span', null, o.lines.filter(function (l) { return !l.absent; }).length + ' suất · đã hoàn ' + o.lines.filter(function (l) { return l.absent; }).length + ' suất vắng'), h(C.Money, { value: o.lines.filter(function (l) { return !l.absent; }).length * 30000 }))),
        h(C.SectionLabel, null, 'Điểm danh — chạm để đánh dấu vắng'),
        h('div', { className: 'cp-card' }, o.lines.map(function (l) {
          var s = acc(l.key);
          return h(C.ListRow, { key: l.key, icon: 'user', title: s.name, value: MEALS.filter(function (m) { return m.id === l.meal; })[0].name + (l.absent ? ' · đã hoàn 30.000 ₫ về ví' : ' · đã trừ ví 30.000 ₫'),
            trailing: h(C.Button, { size: 'sm', variant: l.absent ? 'secondary' : 'danger', disabled: o.status === 'done' || (l.absent && false), onClick: function () {
              l.absent = !l.absent; var amt = l.absent ? 30000 : -30000; s.wallet = { real: s.wallet.real + amt, bonus: s.wallet.bonus };
              DB.tx[s.key] = [{ id: (l.absent ? 'HT-' : 'DH-') + o.id, t: 'Hôm nay · ' + now(), kind: l.absent ? 'refund' : 'buy', title: (l.absent ? 'Hoàn suất ăn lớp (vắng) ' : 'Suất ăn lớp ') + o.id, place: 'GVCN ' + me.name, real: amt }].concat(DB.tx[s.key] || []);
              notify(s.key, l.absent ? 'undo' : 'receipt', l.absent ? 'Hoàn suất ăn vắng' : 'Bỏ đánh dấu vắng', s.name + ' · ' + fmt(Math.abs(amt)) + (l.absent ? ' đã hoàn về ví.' : ' đã trừ lại.')); props.bump();
            } }, l.absent ? 'Có mặt' : 'Vắng') });
        })),
        h(C.InlineNote, { tone: 'info' }, 'Đánh dấu vắng trước khi phát suất: tiền hoàn ngay về ví học sinh và phụ huynh nhận thông báo.'),
        o.status !== 'done' ? h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng phía Canteen'),
          h(C.Button, { size: 'sm', variant: 'secondary', onClick: function () { o.status = o.status === 'placed' ? 'ready' : 'done'; props.bump(); } }, o.status === 'placed' ? 'Bếp báo sẵn sàng' : 'Đã phát suất cho lớp')) : null);
    }
    return h('div', { className: 'mb-screen' }, h(Header, { title: 'Suất ăn lớp ' + me.homeroom, onBack: function () { props.go('home'); } }),
      DB.classOrders.filter(function (x) { return x.by === me.key; }).map(function (x) {
        return h('button', { key: x.id, type: 'button', className: 'mb-up', onClick: function () { cur[1](x); st[1]('track'); } }, h('span', null, h('b', null, x.id + ' · ' + x.day), h('small', null, x.lines.filter(function (l) { return !l.absent; }).length + ' suất · nhận 11:00 Quầy 3')), h(C.StatusBadge, { tone: 'info' }, 'Xem / điểm danh'));
      }),
      h(C.SectionLabel, null, 'Ngày'),
      h('div', { className: 'mb-seg' }, ['Ngày mai', 'Thứ Năm 08/10'].map(function (x) { return h('button', { key: x, type: 'button', 'aria-pressed': String(day[0] === x), onClick: function () { day[1](x); } }, h('b', null, x), h('small', null, 'Nhận 11:00 · Quầy 3')); })),
      h(C.SectionLabel, null, 'Học sinh (' + sel.length + '/' + kids.length + ' được chọn)'),
      h('div', { className: 'cp-card' }, kids.map(function (s) {
        var w = why(s), on = sel.indexOf(s.key) >= 0, m = meal[0][s.key] || 'std';
        return h('div', { key: s.key, className: 'mb-cm-row' + (w ? ' is-off' : '') },
          h('label', null, h('input', { type: 'checkbox', checked: on, disabled: !!w, onChange: function () { pick[1](on ? sel.filter(function (x) { return x !== s.key; }) : sel.concat([s.key])); } }),
            h('span', null, h('b', null, s.name), h('small', null, w || 'Ví ' + fmt(s.wallet.real + s.wallet.bonus)))),
          on ? h('select', { 'aria-label': 'Loại suất', value: m, onChange: function (e) { var n = Object.assign({}, meal[0]); n[s.key] = e.target.value; meal[1](n); } }, MEALS.map(function (x) { return h('option', { key: x.id, value: x.id }, x.name); })) : null);
      })),
      h(C.InlineNote, { tone: 'info' }, 'Tiền suất trừ từ ví từng học sinh (phụ huynh đã đồng ý). Học sinh vắng được hoàn về ví khi bạn điểm danh.'),
      h('div', { className: 'mb-bottom' },
        h('div', { className: 'cp-sum-row' }, h('span', null, sel.length + ' suất × 30.000 ₫'), h(C.Money, { value: total })),
        h(C.Button, { size: 'lg', block: true, icon: 'check', disabled: !sel.length, onClick: function () {
          var o = { id: 'LOP-' + me.homeroom + '-' + (DB.classOrders.length + 1), by: me.key, day: day[0], status: 'placed', lines: sel.map(function (k) { return { key: k, meal: meal[0][k] || 'std', absent: false }; }) };
          o.lines.forEach(function (l) { var s = acc(l.key); s.wallet = { real: s.wallet.real - Math.max(0, 30000 - s.wallet.bonus), bonus: Math.max(0, s.wallet.bonus - 30000) };
            DB.tx[l.key] = [{ id: 'DH-' + o.id, t: 'Hôm nay · ' + now(), kind: 'buy', title: 'Suất ăn lớp ' + me.homeroom + ' · ' + o.day, place: 'GVCN ' + me.name, real: -30000, items: [{ name: MEALS.filter(function (m) { return m.id === l.meal; })[0].name, qty: 1, price: 30000 }] }].concat(DB.tx[l.key] || []);
            notify(l.key, 'users', 'GVCN đặt suất ăn lớp', acc(l.key).name + ' · ' + o.day + ' · 30.000 ₫ trừ từ ví.'); });
          DB.classOrders.unshift(o); props.say('Đã gửi ' + o.id + ' · ' + sel.length + ' suất'); cur[1](o); st[1]('track'); pick[1](null);
        } }, 'Gửi đơn ' + sel.length + ' suất')));
  }

  /* ---------------- Quét QR đăng nhập kiosk ---------------- */
  function KioskLogin(props) {
    var me = props.me, st = useState('scan'), sec = useState(60);
    useEffect(function () {
      if (st[0] !== 'done') return;
      var t = setInterval(function () { sec[1](function (s) { return s > 0 ? s - 1 : 0; }); }, 1000);
      return function () { clearInterval(t); };
    }, [st[0]]);
    if (st[0] === 'scan') {
      return h('div', { className: 'mb-screen' },
        h(Header, { title: 'Quét mã kiosk', onBack: function () { props.go('home'); } }),
        h('div', { className: 'mb-cam' }, h('i', { className: 'kx-c tl' }), h('i', { className: 'kx-c tr' }), h('i', { className: 'kx-c bl' }), h('i', { className: 'kx-c br' }),
          h('div', { className: 'mb-cam-line' }), h('span', null, 'Hướng camera vào mã QR trên màn hình kiosk')),
        h('ol', { className: 'mb-steps' },
          h('li', null, 'Trên kiosk, chạm ', h('b', null, '“Đăng nhập bằng điện thoại”'), '.'),
          h('li', null, 'Quét mã QR hiện trên kiosk bằng màn hình này.'),
          h('li', null, 'Xác nhận trên điện thoại — kiosk mở menu bằng tài khoản của bạn.')),
        h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng'),
          h('div', { className: 'cp-row' }, h(C.Button, { size: 'sm', variant: 'secondary', icon: 'qr', onClick: function () { st[1]('confirm'); } }, 'Quét mã trên Kiosk K1'),
            h(C.Button, { size: 'sm', variant: 'secondary', icon: 'alert', onClick: function () { props.say('Mã kiosk đã hết hạn — chạm “Làm mới mã” trên kiosk', 'alert'); } }, 'Mã đã hết hạn'))));
    }
    if (st[0] === 'confirm') {
      return h('div', { className: 'mb-screen' },
        h(Header, { title: 'Xác nhận đăng nhập', onBack: function () { st[1]('scan'); } }),
        h('div', { className: 'mb-result' },
          h('div', { className: 'mb-result-ico is-info' }, h(C.Icon, { name: 'store', size: 36 })),
          h('div', { className: 'mb-result-title' }, 'Đăng nhập kiosk bằng tài khoản'),
          h('div', { className: 'mb-confirm-name' }, me.name),
          h('div', { className: 'cp-card is-padded mb-result-sum' },
            h('div', { className: 'cp-sum-row' }, h('span', null, 'Thiết bị'), h('b', null, 'Kiosk K1')),
            h('div', { className: 'cp-sum-row' }, h('span', null, 'Nơi đặt'), h('b', null, 'Canteen A · cạnh Quầy 2')),
            h('div', { className: 'cp-sum-row' }, h('span', null, 'Thời gian'), h('b', null, now() + ' hôm nay'))),
          h(C.InlineNote, null, 'Chỉ xác nhận khi bạn đang đứng trước kiosk này. Nếu không phải bạn quét, chọn “Từ chối”.')),
        h('div', { className: 'mb-bottom mb-2btn' },
          h(C.Button, { size: 'lg', variant: 'secondary', onClick: function () { props.say('Đã từ chối đăng nhập', 'x'); props.go('home'); } }, 'Từ chối'),
          h(C.Button, { size: 'lg', icon: 'check', onClick: function () { st[1]('done'); } }, 'Xác nhận')));
    }
    return h('div', { className: 'mb-screen' },
      h(Header, { title: 'Đã đăng nhập kiosk', onBack: function () { props.go('home'); } }),
      h('div', { className: 'mb-result' },
        h('div', { className: 'mb-result-ico' }, h(C.Icon, { name: 'check', size: 40, stroke: 2.4 })),
        h('div', { className: 'mb-result-title' }, 'Kiosk K1 đang mở menu cho'),
        h('div', { className: 'mb-confirm-name' }, me.name),
        h('div', { className: 'cp-muted' }, 'Phiên tự kết thúc khi bạn thanh toán xong hoặc sau ' + sec[0] + ' giây không thao tác.')),
      h('div', { className: 'mb-bottom' }, h(C.Button, { size: 'lg', block: true, variant: 'secondary', icon: 'x', onClick: function () { props.say('Đã đăng xuất khỏi Kiosk K1', 'check'); props.go('home'); } }, 'Đăng xuất khỏi kiosk')));
  }

  /* ---------------- Nạp tiền ---------------- */
  function Topup(props) {
    var me = props.me, kids = isParent(me) ? (me.wallet ? [me.key] : []).concat(me.children) : null;
    var target = useState(props.target || (kids ? kids[0] : me.key));
    var step = useState('amount'), amt = useState(200000), raw = useState(''), order = useState(null), st = useState('pending'), left = useState(900);
    var a = raw[0] ? Number(raw[0]) : amt[0], who = acc(target[0]);
    var err = a < MIN ? 'Tối thiểu ' + fmt(MIN) : a > MAX ? 'Tối đa ' + fmt(MAX) + ' mỗi lần' : null;
    useEffect(function () {
      if (step[0] !== 'qr' || st[0] !== 'pending') return;
      var t = setInterval(function () { left[1](function (s) { if (s <= 1) { st[1]('expired'); return 0; } return s - 1; }); }, 1000);
      return function () { clearInterval(t); };
    }, [step[0], st[0]]);

    if (step[0] === 'amount') {
      return h('div', { className: 'mb-screen' },
        h(Header, { title: 'Nạp tiền vào ví', onBack: function () { props.go('home'); } }),
        h(C.SectionLabel, null, 'Nạp cho'),
        kids ? h('div', { className: 'mb-seg' }, kids.map(function (k) {
          var c = acc(k);
          return h('button', { key: k, type: 'button', 'aria-pressed': String(target[0] === k), onClick: function () { target[1](k); } }, h('b', null, k === me.key ? 'Tôi · ' + c.name : c.name), h('small', null, c.klass + ' · số dư ' + fmt(c.wallet.real + c.wallet.bonus)));
        })) : h('div', { className: 'cp-card' }, h(C.ListRow, { icon: 'user', title: who.name, value: [who.klass, who.id].join(' · ') })),
        h(C.SectionLabel, null, 'Chọn số tiền'),
        h('div', { className: 'mb-presets' }, PRESETS.map(function (p) {
          return h('button', { key: p, type: 'button', 'aria-pressed': String(!raw[0] && amt[0] === p), onClick: function () { amt[1](p); raw[1](''); } },
            h('b', null, shortMoney(p)), bonusFor(p) ? h('small', null, '+' + fmt(bonusFor(p)) + ' thưởng') : h('small', null, ' '));
        })),
        h(C.Field, { id: 'mb-amt', label: 'Hoặc nhập số khác', numeric: true, suffix: '₫', placeholder: '0', value: raw[0] ? Number(raw[0]).toLocaleString('vi-VN') : '', error: raw[0] ? err : null, hint: 'Từ ' + fmt(MIN) + ' đến ' + fmt(MAX), onChange: function (e) { raw[1](e.target.value.replace(/\D/g, '').slice(0, 8)); } }),
        h(C.SectionLabel, null, 'Phương thức'),
        h('div', { className: 'cp-card' }, h(C.ListRow, { icon: 'qr', title: 'Chuyển khoản VietQR', value: 'Quét bằng app ngân hàng bất kỳ · miễn phí' })),
        h('div', { className: 'mb-bottom' },
          h('div', { className: 'mb-sum' },
            h('div', { className: 'cp-sum-row' }, h('span', null, 'Nạp cho ' + who.name.split(' ').pop()), h(C.Money, { value: err ? 0 : a })),
            bonusFor(a) && !err ? h('div', { className: 'cp-sum-row is-discount' }, h('span', null, 'Tặng tiền thưởng · hạn ' + expIn(PROMO.days)), h(C.Money, { value: bonusFor(a), sign: true })) : null),
          h(C.Button, { size: 'lg', block: true, icon: 'qr', disabled: !!err, onClick: function () { order[1]({ id: 'NAP' + Math.floor(100000 + Math.random() * 899999), amount: a, bonus: bonusFor(a), to: target[0] }); st[1]('pending'); left[1](900); step[1]('qr'); } }, 'Tạo mã QR nạp ' + (err ? '' : fmt(a)))));
    }

    var o = order[0], mm = ('0' + Math.floor(left[0] / 60)).slice(-2) + ':' + ('0' + left[0] % 60).slice(-2);
    var memo = o.id + ' ' + who.id;
    function copy(text, label) {
      try { navigator.clipboard.writeText(text).then(function () { props.say('Đã sao chép ' + label); }, function () { props.say('Chưa sao chép được — hãy giữ để chọn chữ', 'info'); }); }
      catch (e) { props.say('Chưa sao chép được — hãy giữ để chọn chữ', 'info'); }
    }
    var kv = function (label, val, copyLabel) { return h('div', { className: 'mb-kv' }, h('small', null, label), h('div', null, h('b', null, val), copyLabel ? h('button', { type: 'button', className: 'mb-copy', onClick: function () { copy(val.replace(/[^\dA-Z\- ]/g, '').trim(), copyLabel); } }, 'Sao chép') : null)); };

    if (st[0] === 'success') {
      return h('div', { className: 'mb-screen' },
        h(Header, { title: 'Nạp tiền thành công', onBack: function () { props.go('home'); } }),
        h('div', { className: 'mb-result' },
          h('div', { className: 'mb-result-ico' }, h(C.Icon, { name: 'check', size: 40, stroke: 2.4 })),
          h('div', { className: 'mb-result-title' }, 'Đã cộng vào ví của ' + who.name),
          h('div', { className: 'mb-result-amt' }, '+' + fmt(o.amount + o.bonus)),
          h('div', { className: 'cp-muted' }, 'Mã giao dịch ' + o.id + ' · ' + now()),
          h('div', { className: 'cp-card is-padded mb-result-sum' },
            h('div', { className: 'cp-sum-row' }, h('span', null, 'Tiền thật'), h(C.Money, { value: o.amount, sign: true })),
            o.bonus ? h('div', { className: 'cp-sum-row is-discount' }, h('span', null, 'Tiền thưởng khuyến mại'), h(C.Money, { value: o.bonus, sign: true })) : null,
            h('div', { className: 'cp-sum-row is-total' }, h('span', null, 'Số dư mới'), h(C.Money, { value: who.wallet.real + who.wallet.bonus })))),
        h('div', { className: 'mb-bottom mb-2btn' },
          h(C.Button, { size: 'lg', variant: 'secondary', onClick: function () { props.go('home'); } }, 'Về trang chủ'),
          o.to !== me.key && isParent(me) ? h(C.Button, { size: 'lg', icon: 'lock', onClick: function () { props.goControls(o.to); } }, 'Hạn mức & món') : h(C.Button, { size: 'lg', icon: 'receipt', onClick: function () { props.go('history'); } }, 'Xem lịch sử')));
    }

    return h('div', { className: 'mb-screen' },
      h(Header, { title: 'Quét mã để nạp', onBack: function () { step[1]('amount'); } }),
      h('div', { className: 'mb-pay-card' },
        h('div', { className: 'mb-topup-amt' }, h('small', null, 'Nạp cho ' + who.name + ' · số tiền chuyển'), h(C.Money, { value: o.amount, size: 'xl' })),
        h(QR, { value: 'VIETQR|' + BANK.account + '|' + o.amount + '|' + memo, logo: 'VietQR', label: 'Mã VietQR chuyển ' + fmt(o.amount), dim: st[0] === 'expired',
          overlay: st[0] === 'expired' ? h('div', { className: 'mb-qr-over' }, h('b', null, 'Mã đã hết hạn'), h(C.Button, { size: 'sm', icon: 'sync', onClick: function () { left[1](900); st[1]('pending'); } }, 'Tạo lại mã')) : null }),
        st[0] === 'pending' ? h('div', { className: 'cp-qr-state is-pending', role: 'status' }, h(C.Icon, { name: 'clock', size: 22 }),
          h('div', null, h('strong', null, 'Đang chờ ngân hàng xác nhận · ' + mm), h('p', null, 'Ví chỉ được cộng khi ngân hàng báo về đúng số tiền và nội dung.'))) : null,
        st[0] === 'check' ? h('div', { className: 'cp-qr-state is-check', role: 'status' }, h(C.Icon, { name: 'alert', size: 22 }),
          h('div', null, h('strong', null, 'Cần kiểm tra'), h('p', null, 'Ngân hàng báo về ' + fmt(o.amount - 50000) + ', khác số tiền đã tạo mã. Canteen sẽ đối soát và cộng đúng số thực nhận trong 1 ngày làm việc.'))) : null),
      h(C.SectionLabel, null, 'Hoặc chuyển khoản thủ công'),
      h('div', { className: 'cp-card is-padded mb-kvs' },
        kv('Ngân hàng', BANK.name), kv('Số tài khoản', BANK.account, 'số tài khoản'), kv('Chủ tài khoản', BANK.holder),
        kv('Số tiền', fmt(o.amount), 'số tiền'), kv('Nội dung (bắt buộc đúng)', memo, 'nội dung')),
      h(C.InlineNote, null, 'Ghi sai nội dung chuyển khoản sẽ làm chậm việc cộng tiền.'),
      h('div', { className: 'pt-demo' }, h('div', { className: 'pt-demo-label' }, 'Mô phỏng phản hồi ngân hàng'),
        h('div', { className: 'cp-row' },
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'check', disabled: st[0] !== 'pending', onClick: function () { props.topup(o); st[1]('success'); } }, 'Nhận đủ tiền'),
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'alert', disabled: st[0] !== 'pending', onClick: function () { props.pendingTx(o); st[1]('check'); } }, 'Thiếu 50.000 ₫'),
          h(C.Button, { size: 'sm', variant: 'secondary', icon: 'clock', disabled: st[0] !== 'pending', onClick: function () { left[1](1); } }, 'Hết hạn mã'))));
  }

  /* ---------------- Lịch sử ---------------- */
  function History(props) {
    var me = props.me, f = useState('all'), range = useState('30 ngày');
    var owners = (me.wallet ? [me.key] : []).concat(me.children || []);
    var who = useState(owners[0]);
    var src = (DB.tx[who[0]] || []);
    var inRange = function (t) { return range[0] !== 'Hôm nay' || /Hôm nay/.test(t.t); };
    var list = src.filter(function (t) { var v = (t.real || 0) + (t.bonus || 0); return inRange(t) && (f[0] === 'all' || (f[0] === 'in' ? v > 0 || t.kind === 'pending' : v < 0)); });
    return h('div', { className: 'mb-screen' },
      h(Header, { title: 'Lịch sử giao dịch', onBack: function () { props.go('home'); }, right: h('button', { type: 'button', className: 'mb-icon-btn', 'aria-label': 'Xuất sao kê PDF', onClick: function () { props.openStatement(who[0], range[0]); } }, h(C.Icon, { name: 'doc', size: 22 })) }),
      owners.length > 1 ? h('div', { className: 'mb-seg', style: { marginBottom: 10 } }, owners.map(function (k) { return h('button', { key: k, type: 'button', 'aria-pressed': String(who[0] === k), onClick: function () { who[1](k); } }, h('b', null, k === me.key ? 'Tôi' : acc(k).name.split(' ').pop()), h('small', null, acc(k).klass)); })) : null,
      h('div', { className: 'mb-filter' }, h(C.Icon, { name: 'calendar', size: 18 }), ['Hôm nay', '7 ngày', '30 ngày', 'Tháng 10'].map(function (r) { return h('button', { key: r, type: 'button', 'aria-pressed': String(range[0] === r), onClick: function () { range[1](r); } }, r); })),
      h(C.CategoryTabs, { items: [{ id: 'all', label: 'Tất cả' }, { id: 'in', label: 'Tiền vào' }, { id: 'out', label: 'Tiền ra' }], active: f[0], onChange: f[1] }),
      h('div', { className: 'cp-card', style: { marginTop: 12 } }, list.length ? list.map(function (t) { return h(TxRow, { key: t.id, t: t, hide: props.hide, onOpen: props.openTx }); }) : h('div', { className: 'pt-empty' }, 'Không có giao dịch trong khoảng này')),
      h('button', { type: 'button', className: 'mb-link', onClick: function () { props.openStatement(who[0], range[0]); } }, h(C.Icon, { name: 'doc', size: 18 }), 'Xuất sao kê PDF · ' + range[0]));
  }

  /* ---------------- App ---------------- */
  function App() {
    var authView = useState('login'), user = useState(null), view = useState('home'), target = useState(null), hide = useState(false), toast = useState(null), rev = useState(0);
    var tt = useRef(), prevView = useRef('home'), txSel = useRef(null), stmt = useRef(null);
    function say(t, i) { toast[1]({ text: t, icon: i }); clearTimeout(tt.current); tt.current = setTimeout(function () { toast[1](null); }, 2800); }
    function bump() { rev[1](function (x) { return x + 1; }); }
    function go(v) { view[1](v); target[1](null); var el = document.querySelector('.mb-scroll'); if (el) el.scrollTop = 0; }
    var toastEl = toast[0] ? h('div', { className: 'pt-toast', role: 'status' }, h(C.Icon, { name: toast[0].icon || 'check' }), toast[0].text) : null;

    if (!user[0]) return h('div', { className: 'mb-app' }, h('div', { className: 'mb-scroll' },
      authView[0] === 'register'
        ? h(Register, { say: say, onBack: function () { authView[1]('login'); }, onDone: function (k) { authView[1]('login'); user[1](k); go('home'); say('Chào mừng bạn đến với Ví Canteen'); } })
        : h(Login, { say: say, onRegister: function () { authView[1]('register'); }, onLogin: function (k) { user[1](k); go('home'); say('Đăng nhập thành công'); } })), toastEl);

    var me = acc(user[0]);
    function topup(o) {
      var t = acc(o.to); t.wallet = { real: t.wallet.real + o.amount, bonus: t.wallet.bonus + o.bonus };
      notify(o.to, 'plus', 'Nạp tiền thành công', 'Đã cộng ' + fmt(o.amount) + (o.bonus ? ' + ' + fmt(o.bonus) + ' tiền thưởng (hạn ' + expIn(PROMO.days) + ')' : '') + ' vào ví của ' + t.name.split(' ').pop() + '.'); if (o.bonus) t.bonusExp = expIn(PROMO.days);
      DB.tx[o.to] = [{ id: o.id, t: 'Hôm nay · ' + now(), kind: 'topup', title: 'Nạp tiền qua VietQR', place: o.to !== me.key ? 'Phụ huynh ' + me.name : BANK.name, real: o.amount, bonus: o.bonus || undefined }].concat(DB.tx[o.to] || []); bump();
    }
    function pendingTx(o) { DB.tx[o.to] = [{ id: o.id, t: 'Hôm nay · ' + now(), kind: 'pending', title: 'Nạp tiền — đang đối soát', place: 'Nhận ' + fmt(o.amount - 50000) + ' / tạo mã ' + fmt(o.amount), real: 0 }].concat(DB.tx[o.to] || []); bump(); }
    function goControls(k) { prevView.current = view[0] === 'controls' ? prevView.current : view[0]; view[1]('controls'); target[1](k); var el = document.querySelector('.mb-scroll'); if (el) el.scrollTop = 0; }
    function goTopup(k) { view[1]('topup'); target[1](k); }
    function logout() { user[1](null); hide[1](false); say('Đã đăng xuất', 'user'); }
    function openTx(t) { txSel.current = t; prevView.current = view[0]; view[1]('tx'); var el = document.querySelector('.mb-scroll'); if (el) el.scrollTop = 0; }
    function openStatement(k, r) { stmt.current = { k: k, r: r }; view[1]('statement'); }
    var p = { me: me, bump: bump, openTx: openTx, openStatement: openStatement, hide: hide[0], go: go, say: say, logout: logout, goControls: goControls, goTopup: goTopup, toggleHide: function () { hide[1](!hide[0]); } };

    var v = view[0], screen;
    if (v === 'notif') screen = h(Notifications, Object.assign({ key: 'notif' }, p));
    else if (v === 'profile') screen = h(Profile, Object.assign({ key: 'profile' }, p));
    else if (v === 'support') screen = h(Support, Object.assign({ key: 'support' }, p));
    else if (v === 'tickets') screen = h(Tickets, p);
    else if (v === 'refund') screen = h(RefundBalance, Object.assign({ key: 'refund' }, p));
    else if (v === 'classmeal') screen = h(ClassMeal, Object.assign({ key: 'classmeal' }, p));
    else if (v === 'tx' && txSel.current) screen = h(TxDetail, Object.assign({ key: 'tx-' + txSel.current.id, tx: txSel.current, back: function () { view[1](prevView.current || 'history'); } }, p));
    else if (v === 'statement' && stmt.current) screen = h(Statement, Object.assign({ owner: stmt.current.k, range: stmt.current.r }, p));
    else if (v === 'order') screen = h(Order, Object.assign({ key: 'order' }, p));
    else if (v === 'orders') screen = h(MyOrders, p);
    else if (v === 'face') screen = h(FaceEnroll, Object.assign({ key: 'face' }, p));
    else if (v === 'kiosk') screen = h(KioskLogin, Object.assign({ key: 'kiosk' }, p));
    else if (v === 'topup') screen = h(Topup, Object.assign({ key: 'topup-' + (target[0] || ''), target: target[0], topup: topup, pendingTx: pendingTx }, p));
    else if (v === 'history') screen = h(History, p);
    else if (v === 'manage') screen = h(Manage, p);
    else if (v === 'controls') screen = h(Controls, Object.assign({ key: 'ct-' + target[0], target: target[0], back: function () { bump(); view[1](prevView.current || 'home'); } }, p));
    else screen = me.wallet ? h(HomeSelf, p) : h(HomeParent, p);

    var tabs = isParent(me) ? [['home', 'Trang chủ', 'home'], ['order', 'Đặt món', 'bag'], ['manage', 'Con', 'users'], ['topup', 'Nạp tiền', 'plus'], ['history', 'Lịch sử', 'receipt']]
      : [['home', 'Trang chủ', 'home'], ['order', 'Đặt món', 'bag'], ['topup', 'Nạp tiền', 'plus'], ['history', 'Lịch sử', 'receipt']];
    var active = v === 'controls' ? 'manage' : v === 'orders' ? 'order' : v === 'tx' || v === 'statement' ? 'history' : ['kiosk', 'face', 'notif', 'profile', 'support', 'tickets', 'refund', 'classmeal'].indexOf(v) >= 0 ? 'home' : v;
    return h('div', { className: 'mb-app' },
      h('div', { className: 'mb-scroll' }, screen),
      h('nav', { className: 'mb-tabs', style: { gridTemplateColumns: 'repeat(' + tabs.length + ', 1fr)' }, 'aria-label': 'Điều hướng' }, tabs.map(function (t) {
        return h('button', { key: t[0], type: 'button', 'aria-current': active === t[0] ? 'page' : undefined, onClick: function () { go(t[0]); } }, h(C.Icon, { name: t[2], size: 22 }), t[1]);
      })),
      toastEl);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
