/* Web Đối tác — dữ liệu mẫu, lưu trữ trình duyệt, công cụ chung. Global: window.WD */
(function () {
  var WD = window.WD = window.WD || {};

  /* ---------- Công cụ ---------- */
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim(); }
  function pad(n, w) { return String(n).padStart(w || 2, '0'); }
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseKey(k) { var p = String(k).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dmy(d) { return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); }
  function dm(d) { return pad(d.getDate()) + '/' + pad(d.getMonth() + 1); }
  function now() { var d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function round1k(v) { return Math.round(v / 1000) * 1000; }
  function initials(name) { var p = String(name || '').trim().split(/\s+/); return ((p.length > 1 ? p[p.length - 2][0] : '') + (p[p.length - 1] || '?')[0]).toUpperCase(); }
  function genPw() { var L = 'abcdefghjkmnpqrstuvwxyz'; return L[Math.floor(Math.random() * L.length)] + L[Math.floor(Math.random() * L.length)] + String(1000 + Math.floor(Math.random() * 9000)); }
  function memo(code) { return 'MS' + String(code || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase(); }
  function fixPhone(s) { var d = String(s || '').replace(/\D/g, ''); if (d.length === 9 && /^[35789]/.test(d)) d = '0' + d; if (d.indexOf('84') === 0 && d.length === 11) d = '0' + d.slice(2); return d; }
  function validPhone(p) { return /^0\d{9}$/.test(p); }
  function shortMoney(v) { if (!v) return '0'; if (v >= 1e6) return (v / 1e6).toFixed(v >= 1e7 ? 0 : 1).replace('.', ',') + 'tr'; return Math.round(v / 1000) + 'k'; }

  Object.assign(WD, { hashStr: hashStr, rng: rng, norm: norm, pad: pad, startOfDay: startOfDay, addDays: addDays, dayKey: dayKey, parseKey: parseKey, dmy: dmy, dm: dm, now: now, round1k: round1k, initials: initials, genPw: genPw, memo: memo, fixPhone: fixPhone, validPhone: validPhone, shortMoney: shortMoney });

  /* ---------- Hằng số ---------- */
  WD.PARTNER = { name: 'Công ty TNHH Dịch vụ Ăn uống Hoa Sen', short: 'Hoa Sen Catering', school: 'Trường TH–THCS–THPT Nguyễn Trãi' };
  WD.OWNER = { name: 'Nguyễn Thị Lan Anh', login: '0900000001', password: 'matkhau123', title: 'Chủ Canteen' };
  WD.CANTEENS = [{ id: 'A', name: 'Canteen A — Nhà ăn chính', short: 'Canteen A' }, { id: 'B', name: 'Canteen B — Khu ký túc', short: 'Canteen B' }];
  WD.GROUPS = ['Không hạn chế', 'Đồ chiên rán', 'Nước ngọt có ga', 'Đồ ngọt nhiều đường'];
  WD.ALLERGENS = ['Sữa', 'Trứng', 'Đậu phộng', 'Hải sản', 'Gluten (lúa mì)', 'Đậu nành', 'Mè (vừng)'];
  WD.STATUS = { on: 'Đang bán', soldout: 'Hết món', paused: 'Tạm ngừng' };
  WD.ROLES = { student: 'Học sinh', teacher: 'Giáo viên', parent: 'Phụ huynh' };
  WD.CLASSES = ['6A1', '6A2', '7A1', '7A4', '8A3', '9A2', '10A2', '11B3', '12C1'];
  WD.TEAMS = ['Tổ Toán', 'Tổ Ngữ văn', 'Tổ Tiếng Anh', 'Tổ KHTN', 'Tổ Thể dục'];

  var CATS = [{ id: 'com', label: 'Cơm & món chính', prefix: 'C' }, { id: 'bun', label: 'Bún / Phở', prefix: 'B' }, { id: 'an', label: 'Ăn vặt', prefix: 'A' }, { id: 'nuoc', label: 'Đồ uống', prefix: 'N' }, { id: 'trang', label: 'Tráng miệng', prefix: 'T' }];
  var MENU = [
    { code: 'C01', name: 'Cơm gà xối mỡ', price: 35000, cost: 21000, cat: 'com', allergens: [], canteens: ['A', 'B'] },
    { code: 'C02', name: 'Cơm rang dưa bò', price: 38000, cost: 23000, cat: 'com', allergens: ['Trứng'], canteens: ['A', 'B'] },
    { code: 'C05', name: 'Cơm sườn nướng', price: 38000, cost: 22000, cat: 'com', allergens: ['Mè (vừng)'], canteens: ['A'], status: 'soldout' },
    { code: 'B03', name: 'Bún bò Huế', price: 40000, cost: 26000, cat: 'bun', allergens: ['Hải sản'], canteens: ['A'] },
    { code: 'B04', name: 'Phở gà', price: 35000, cost: 21000, cat: 'bun', allergens: [], canteens: ['A', 'B'] },
    { code: 'A07', name: 'Bánh mì trứng', price: 15000, cost: 8000, cat: 'an', allergens: ['Trứng', 'Gluten (lúa mì)'], canteens: ['A', 'B'] },
    { code: 'A09', name: 'Khoai tây chiên', price: 20000, cost: 10000, cat: 'an', group: 'Đồ chiên rán', allergens: [], canteens: ['A', 'B'] },
    { code: 'A10', name: 'Xôi xéo', price: 20000, cost: 11000, cat: 'an', allergens: [], canteens: ['A'] },
    { code: 'N01', name: 'Trà đào', price: 15000, cost: 6000, cat: 'nuoc', group: 'Đồ ngọt nhiều đường', allergens: [], canteens: ['A', 'B'] },
    { code: 'N02', name: 'Coca-Cola lon', price: 12000, cost: 7000, cat: 'nuoc', group: 'Nước ngọt có ga', allergens: [], canteens: ['A', 'B'] },
    { code: 'N05', name: 'Sữa tươi ít đường', price: 10000, cost: 6500, cat: 'nuoc', allergens: ['Sữa'], canteens: ['A', 'B'] },
    { code: 'N06', name: 'Nước cam', price: 18000, cost: 9000, cat: 'nuoc', allergens: [], canteens: ['A'], status: 'paused' },
    { code: 'T01', name: 'Sữa chua', price: 8000, cost: 4500, cat: 'trang', allergens: ['Sữa'], canteens: ['A', 'B'] },
    { code: 'T03', name: 'Hoa quả dầm', price: 20000, cost: 11000, cat: 'trang', group: 'Đồ ngọt nhiều đường', allergens: ['Sữa'], canteens: ['A'] }
  ];

  /* ---------- Tài khoản mẫu ---------- */
  function seedAccounts() {
    var r = rng(42), pick = function (a) { return a[Math.floor(r() * a.length)]; };
    var HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô', 'Dương', 'Lý'];
    var DM = ['Văn', 'Minh', 'Đức', 'Quang', 'Gia', 'Hải', 'Tuấn'], DF = ['Thị', 'Thu', 'Ngọc', 'Khánh', 'Phương', 'Bảo'];
    var TM = ['Khôi', 'Bảo', 'Huy', 'Nam', 'Long', 'Phúc', 'An', 'Minh', 'Đạt', 'Khang'], TF = ['Linh', 'Trang', 'Anh', 'Hà', 'Mai', 'Vy', 'Ngân', 'Chi', 'Yến', 'Trâm'];
    function person(ho) { var m = r() < 0.5; return (ho || pick(HO)) + ' ' + (m ? pick(DM) : pick(DF)) + ' ' + (m ? pick(TM) : pick(TF)); }
    var used = {}, list = [], created = '2026-08-25';
    function code(prefix, digits) { var c; do { c = prefix + '-' + String(Math.floor(Math.pow(10, digits - 1) + r() * 9 * Math.pow(10, digits - 1))); } while (used[c]); used[c] = 1; return c; }
    function bal() { return { real: Math.round(r() * 30) * 5000, bonus: r() < 0.35 ? Math.round(r() * 4) * 5000 : 0 }; }
    function add(a) { a.id = a.role + ':' + a.login; a.status = a.status || 'active'; a.password = a.password || genPw(); a.created = a.created || created; list.push(a); return a; }

    add({ role: 'parent', login: '0912345678', phone: '0912345678', name: 'Trần Văn Hùng', password: '123456', real: 0, bonus: 0 });
    used['HS-208317'] = 1; used['HS-208318'] = 1;
    add({ role: 'student', login: 'HS-208317', code: 'HS-208317', name: 'Trần Minh Khôi', klass: '8A3', parent: '0912345678', real: 42000, bonus: 10000, password: '123456' });
    add({ role: 'student', login: 'HS-208318', code: 'HS-208318', name: 'Trần Thu An', klass: '6A2', parent: '0912345678', real: 25000, bonus: 0 });
    for (var i = 0; i < 26; i++) {
      var ho = pick(HO), phone = '09' + String(10000000 + Math.floor(r() * 89999999));
      add({ role: 'parent', login: phone, phone: phone, name: person(ho), real: 0, bonus: 0 });
      var kids = r() < 0.3 ? 2 : 1;
      for (var k = 0; k < kids; k++) { var c = code('HS', 6), b = bal(); add({ role: 'student', login: c, code: c, name: person(ho), klass: pick(WD.CLASSES), parent: phone, real: b.real, bonus: b.bonus }); }
    }
    for (var j = 0; j < 4; j++) { var c2 = code('HS', 6), b2 = bal(); add({ role: 'student', login: c2, code: c2, name: person(), klass: pick(WD.CLASSES), real: b2.real, bonus: b2.bonus }); }
    used['GV-0451'] = 1;
    add({ role: 'teacher', login: 'GV-0451', code: 'GV-0451', name: 'Phạm Thu Hà', klass: 'Tổ Ngữ văn', phone: '0987654321', real: 315000, bonus: 20000, password: '123456' });
    for (var t = 0; t < 7; t++) { var c3 = code('GV', 4), b3 = bal(); add({ role: 'teacher', login: c3, code: c3, name: person(), klass: pick(WD.TEAMS), phone: '09' + String(10000000 + Math.floor(r() * 89999999)), real: b3.real * 3, bonus: b3.bonus }); }
    list[8].status = 'locked'; list[21].status = 'locked';
    return list;
  }

  /* ---------- Lưu trên trình duyệt ---------- */
  var KEY = 'vt-doitac-v1';
  WD.seed = function () { return { menu: JSON.parse(JSON.stringify(MENU)), cats: JSON.parse(JSON.stringify(CATS)), accounts: seedAccounts() }; };
  WD.load = function () { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.menu && s.accounts && s.cats) return s; } catch (e) {} return WD.seed(); };
  WD.save = function (data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch (e) { try { localStorage.setItem(KEY, JSON.stringify(Object.assign({}, data, { menu: data.menu.map(function (m) { var x = Object.assign({}, m); delete x.image; return x; }) }))); } catch (e2) {} return false; }
  };
  WD.reset = function () { localStorage.removeItem(KEY); return WD.seed(); };
  WD.session = {
    get: function () { try { return JSON.parse(localStorage.getItem(KEY + '-session')); } catch (e) { return null; } },
    set: function (u) { if (u) localStorage.setItem(KEY + '-session', JSON.stringify(u)); else localStorage.removeItem(KEY + '-session'); }
  };

  /* ---------- Mã tự sinh ---------- */
  WD.nextItemCode = function (menu, cats, catId) {
    var cat = cats.filter(function (c) { return c.id === catId; })[0]; if (!cat) return '';
    var n = menu.filter(function (m) { return m.code[0] === cat.prefix; }).map(function (m) { return Number(m.code.slice(1)) || 0; });
    return cat.prefix + pad((n.length ? Math.max.apply(null, n) : 0) + 1);
  };
  WD.addCat = function (cats, label) {
    var plain = norm(label).toUpperCase().replace(/[^A-Z]/g, ''), used = cats.map(function (c) { return c.prefix; });
    var prefix = plain.split('').filter(function (ch) { return used.indexOf(ch) < 0; })[0] || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(function (ch) { return used.indexOf(ch) < 0; })[0];
    return { id: 'cat' + Date.now().toString(36), label: label, prefix: prefix };
  };
  WD.newCode = function (accounts, role, taken) {
    var prefix = role === 'teacher' ? 'GV' : 'HS', digits = role === 'teacher' ? 4 : 6, c;
    var has = function (x) { return (taken && taken[x]) || accounts.some(function (a) { return a.code === x; }); };
    do { c = prefix + '-' + String(Math.floor(Math.pow(10, digits - 1) + Math.random() * 9 * Math.pow(10, digits - 1))); } while (has(c));
    return c;
  };
})();
