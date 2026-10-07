/* @ds-bundle: {"format":4,"namespace":"CanteenPOS","components":[{"name":"Button"},{"name":"StatusBadge"},{"name":"Money"},{"name":"Field"},{"name":"TopBar"},{"name":"OfflineBanner"},{"name":"CategoryTabs"},{"name":"MenuItemCard"},{"name":"OrderCart"},{"name":"BuyerCard"},{"name":"IdentifyPanel"},{"name":"CashPayment"},{"name":"QRPayment"},{"name":"PreorderTicket"},{"name":"ShiftSummary"},{"name":"NavBar"},{"name":"SectionLabel"},{"name":"ListRow"},{"name":"InlineNote"}]} */
(function () {
  var React = window.React, h = React.createElement, useState = React.useState;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function fmt(n) { var v = Math.round(Number(n) || 0); var s = Math.abs(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return (v < 0 ? '−' : '') + s + ' ₫'; }
  function initials(name) { var p = String(name || '?').trim().split(/\s+/); return (p.length > 1 ? p[p.length - 2][0] + p[p.length - 1][0] : p[0].slice(0, 2)).toUpperCase(); }

  /* ---------- icons (24px stroke, currentColor) ---------- */
  var P = function (d) { return ['path', { d: d }]; };
  var ICONS = {
    check: [P('M5 12.5l4.5 4.5L19 7.5')],
    alert: [P('M12 3.5l9.5 17h-19z'), P('M12 10v4.5'), P('M12 17.5v.01')],
    clock: [['circle', { cx: 12, cy: 12, r: 9 }], P('M12 7v5l3.5 2')],
    card: [['rect', { x: 3, y: 5.5, width: 18, height: 13, rx: 2 }], P('M3 10h18'), P('M7 15h4')],
    qr: [P('M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z'), P('M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM14 20h1M20 14v1')],
    face: [P('M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16'), P('M9 9.5v1M15 9.5v1M12 9.5v3.5h-1M9.5 15.5c1.4 1 3.6 1 5 0')],
    wifi: [P('M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 16a5 5 0 0 1 6.4 0'), P('M12 19.5v.01')],
    wifiOff: [P('M3 3l18 18'), P('M8.8 16a5 5 0 0 1 6.4 0M5.5 12.5a9.5 9.5 0 0 1 4-2.2M14.5 10.3a9.5 9.5 0 0 1 4 2.2M2.5 9a14 14 0 0 1 3.6-2.4M10.5 5.6A14 14 0 0 1 21.5 9'), P('M12 19.5v.01')],
    user: [['circle', { cx: 12, cy: 8, r: 4 }], P('M4.5 20.5c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5')],
    minus: [P('M6 12h12')],
    plus: [P('M12 6v12M6 12h12')],
    cash: [['rect', { x: 2.5, y: 6, width: 19, height: 12, rx: 2 }], ['circle', { cx: 12, cy: 12, r: 2.75 }], P('M6 9.5v.01M18 14.5v.01')],
    wallet: [P('M4 7.5h14.5a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5.5A1.5 1.5 0 0 1 4 18.5V6a2 2 0 0 1 2-2h10v3.5'), P('M16 14h.01')],
    sync: [P('M19.5 10A7.8 7.8 0 0 0 5.6 7.4L4 9.5M4 4.5v5h5'), P('M4.5 14a7.8 7.8 0 0 0 13.9 2.6l1.6-2.1M20 19.5v-5h-5')],
    ban: [['circle', { cx: 12, cy: 12, r: 9 }], P('M5.7 5.7l12.6 12.6')],
    store: [P('M3.5 9.5L5.5 4h13l2 5.5'), P('M3.5 9.5h17V20h-17z'), P('M9.5 20v-5.5h5V20')],
    receipt: [P('M6 3h12v18l-3-2-3 2-3-2-3 2z'), P('M9 8h6M9 12h6M9 16h3')],
    undo: [P('M9 14L4 9l5-5'), P('M4 9h10.5a5.5 5.5 0 0 1 0 11H11')],
    search: [['circle', { cx: 11, cy: 11, r: 6.5 }], P('M16 16l4.5 4.5')],
    tag: [P('M3.5 12.5V4h8.5l8.5 8.5-8 8z'), P('M8 8.5v.01')],
    users: [['circle', { cx: 9, cy: 8.5, r: 3.5 }], P('M2.5 20c.6-3.2 3.2-5 6.5-5s5.9 1.8 6.5 5'), P('M15.5 5.2a3.5 3.5 0 0 1 0 6.6M18 15.4c1.9.7 3.2 2.3 3.5 4.6')],
    lock: [['rect', { x: 4.5, y: 10.5, width: 15, height: 10, rx: 2 }], P('M8 10.5V7.5a4 4 0 0 1 8 0v3')],
    x: [P('M6 6l12 12M18 6L6 18')],
    chevron: [P('M9 6l6 6-6 6')],
    home: [P('M4 10.5L12 4l8 6.5V20h-5.5v-6h-5v6H4z')],
    image: [['rect', { x: 3.5, y: 4.5, width: 17, height: 15, rx: 2 }], ['circle', { cx: 9, cy: 9.5, r: 1.5 }], P('M20.5 15.5l-5-5-9 9')],
    bag: [P('M5.5 8h13l-1 12h-11z'), P('M9 8V6.5a3 3 0 0 1 6 0V8')],
    bell: [P('M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z'), P('M10 20.5a2 2 0 0 0 4 0')],
    chat: [P('M4 5.5h16v10H9l-4 3.5v-3.5H4z'), P('M8 10.5h.01M12 10.5h.01M16 10.5h.01')],
    calendar: [['rect', { x: 3.5, y: 5, width: 17, height: 15, rx: 2 }], P('M3.5 9.5h17M8 3v4M16 3v4')],
    doc: [P('M6 3h8l4 4v14H6z'), P('M14 3v4h4M9 12h6M9 16h6')],
    back: [P('M15 5l-7 7 7 7')],
    edit: [P('M5 19h3.5L19 8.5 15.5 5 5 15.5z'), P('M13.5 7l3.5 3.5')],
    info: [['circle', { cx: 12, cy: 12, r: 9 }], P('M12 11v5.5M12 7.5v.01')]
  };
  function Icon(props) {
    var size = props.size || 20, parts = ICONS[props.name] || [];
    return h('svg', { className: cx('cp-ico', props.className), width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: props.stroke || 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
      parts.map(function (p, i) { return h(p[0], Object.assign({ key: i }, p[1])); }));
  }

  /* ---------- Button ---------- */
  function Button(props) {
    var variant = props.variant || 'primary', size = props.size || 'md';
    var rest = Object.assign({}, props); ['variant', 'size', 'block', 'icon', 'iconRight', 'children', 'className'].forEach(function (k) { delete rest[k]; });
    return h('button', Object.assign({ type: 'button' }, rest, { className: cx('cp-btn', 'cp-btn-' + variant, size !== 'md' && 'cp-btn-' + size, props.block && 'cp-btn-block', props.className) }),
      props.icon ? h(Icon, { name: props.icon, size: size === 'lg' ? 22 : 18 }) : null, props.children,
      props.iconRight ? h(Icon, { name: props.iconRight, size: 18 }) : null);
  }

  /* ---------- StatusBadge ---------- */
  var TONE_ICON = { success: 'check', warning: 'clock', danger: 'alert', info: null, neutral: null, brand: null, accent: null };
  function StatusBadge(props) {
    var tone = props.tone || 'neutral', icon = props.icon === undefined ? TONE_ICON[tone] : props.icon;
    return h('span', { className: cx('cp-badge', 'cp-badge-' + tone, props.className) },
      icon ? h(Icon, { name: icon, size: 14, stroke: 2.5 }) : h('i', { className: 'cp-dot' }), props.children);
  }

  /* ---------- Money ---------- */
  function Money(props) {
    var size = props.size || 'md';
    return h('span', { className: cx('cp-money', size !== 'md' && 'cp-money-' + size, props.tone && 'cp-money-' + props.tone, props.strike && 'cp-money-strike', props.className) },
      (props.sign && props.value > 0 ? '+' : '') + fmt(props.value));
  }

  /* ---------- Field ---------- */
  function Field(props) {
    var as = props.as || 'input';
    var inner = as === 'select'
      ? h('select', { value: props.value, defaultValue: props.defaultValue, onChange: props.onChange, id: props.id, 'aria-label': props.label }, (props.options || []).map(function (o) { return h('option', { key: o, value: o }, o); }))
      : h(as, { type: props.type || 'text', value: props.value, defaultValue: props.defaultValue, placeholder: props.placeholder, onChange: props.onChange, id: props.id, inputMode: props.numeric ? 'numeric' : undefined, rows: as === 'textarea' ? (props.rows || 3) : undefined, 'aria-label': props.label });
    return h('div', { className: cx('cp-field', props.error && 'is-error', props.className) },
      props.label ? h('label', { htmlFor: props.id }, props.label) : null,
      h('div', { className: cx('cp-field-box', props.numeric && 'is-num') }, props.icon ? h(Icon, { name: props.icon, size: 18, className: 'cp-muted' }) : null, inner, props.suffix ? h('span', { className: 'cp-field-suffix' }, props.suffix) : null),
      props.hint || props.error ? h('div', { className: 'cp-field-hint' }, props.error || props.hint) : null);
  }

  /* ---------- TopBar ---------- */
  function TopBar(props) {
    var online = props.online !== false;
    return h('header', { className: 'cp-top' },
      h('div', { className: 'cp-top-name' }, 'Canteen ', h('b', null, 'POS')),
      props.canteen ? h('span', { className: 'cp-chip' }, h(Icon, { name: 'store', size: 16 }), props.canteen) : null,
      props.counter ? h('span', { className: 'cp-chip' }, h('span', null, 'Quầy'), props.counter) : null,
      props.shift ? h('span', { className: 'cp-chip' }, h('span', null, 'Ca'), props.shift) : null,
      h('div', { className: 'cp-top-spacer' }),
      props.right || null,
      online ? h(StatusBadge, { tone: 'success', icon: 'wifi' }, 'Trực tuyến') : h(StatusBadge, { tone: 'warning', icon: 'wifiOff' }, 'Offline' + (props.pending ? ' · ' + props.pending + ' chờ đồng bộ' : '')),
      props.staff ? h('div', { className: 'cp-top-user' }, h('span', { className: 'cp-avatar' }, initials(props.staff)), props.staff) : null);
  }

  /* ---------- OfflineBanner ---------- */
  function OfflineBanner(props) {
    if (props.syncing) {
      return h('div', { className: 'cp-offline is-syncing', role: 'status' }, h(Icon, { name: 'sync' }),
        h('span', null, h('strong', null, 'Đã có mạng — đang đồng bộ '), (props.done || 0) + '/' + (props.pending || 0) + ' giao dịch'),
        h('span', { className: 'cp-top-spacer' }), props.conflicts ? h(StatusBadge, { tone: 'danger' }, props.conflicts + ' xung đột cần xử lý') : null);
    }
    return h('div', { className: 'cp-offline', role: 'status' }, h(Icon, { name: 'wifiOff' }),
      h('span', null, h('strong', null, 'Mất kết nối. '), 'Vẫn bán được: tiền mặt; ví offline ≤ ' + fmt(props.walletLimit || 30000) + '/giao dịch. QR sẽ ở trạng thái chờ xác minh.'),
      h('span', { className: 'cp-top-spacer' }),
      h(StatusBadge, { tone: 'warning' }, (props.pending || 0) + ' giao dịch chờ đồng bộ'),
      props.qrPending ? h(StatusBadge, { tone: 'danger' }, props.qrPending + ' QR chưa xác minh') : null);
  }

  /* ---------- CategoryTabs ---------- */
  function CategoryTabs(props) {
    var st = useState(props.active || (props.items && props.items[0] && props.items[0].id));
    var active = props.active !== undefined && props.onChange ? props.active : st[0], ref = React.useRef();
    React.useEffect(function () { var el = ref.current && ref.current.querySelector('[aria-selected="true"]'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, [active]);
    return h('div', { className: 'cp-tabs', role: 'tablist', ref: ref }, (props.items || []).map(function (it) {
      return h('button', { key: it.id, role: 'tab', className: 'cp-tab', 'aria-selected': String(it.id === active), onClick: function () { st[1](it.id); props.onChange && props.onChange(it.id); } },
        it.label, it.count != null ? h('small', null, it.count) : null);
    }));
  }

  /* ---------- MenuItemCard ---------- */
  function MenuItemCard(props) {
    var status = props.status || 'available', qty = props.qty || 0;
    var disabled = status === 'soldout' || status === 'blocked';
    var badge = status === 'soldout' ? h(StatusBadge, { tone: 'neutral', icon: 'ban' }, 'Hết món')
      : status === 'blocked' ? h(StatusBadge, { tone: 'danger', icon: 'lock' }, props.blockedReason || 'Chặn với HS')
      : status === 'low' ? h('span', { className: 'cp-item-stock' }, 'Còn ' + props.stockLeft)
      : props.promo ? h(StatusBadge, { tone: 'accent', icon: 'tag' }, props.promo) : null;
    return h('button', { type: 'button', className: cx('cp-item', props.image !== undefined && 'has-media', qty > 0 && 'is-selected', status === 'soldout' && 'is-soldout', status === 'blocked' && 'is-blocked'), disabled: disabled, 'aria-disabled': disabled, onClick: props.onAdd },
      props.image !== undefined ? h('span', { className: cx('cp-item-media', !props.image && 'is-empty') },
        props.image ? h('img', { src: props.image, alt: '', loading: 'lazy' }) : h(Icon, { name: 'image', size: 28, stroke: 1.5 })) : null,
      props.code ? h('span', { className: 'cp-item-code' }, props.code) : null,
      h('span', { className: 'cp-item-name' }, props.name),
      h('span', { className: 'cp-item-foot' }, h(Money, { value: props.price }), badge),
      qty > 0 ? h('span', { className: 'cp-item-qty', 'aria-label': 'Số lượng ' + qty }, qty) : null);
  }

  /* ---------- OrderCart ---------- */
  function Stepper(props) {
    return h('span', { className: 'cp-stepper' },
      h('button', { type: 'button', 'aria-label': 'Giảm', onClick: props.onDec }, h(Icon, { name: props.value <= 1 ? 'x' : 'minus', size: 18 })),
      h('output', null, props.value),
      h('button', { type: 'button', 'aria-label': 'Tăng', onClick: props.onInc }, h(Icon, { name: 'plus', size: 18 })));
  }
  function OrderCart(props) {
    var st = useState(props.lines || []), controlled = !!props.onQty, lines = controlled ? (props.lines || []) : st[0], setLines = st[1];
    function bump(i, d) { if (controlled) return props.onQty(i, d); setLines(lines.map(function (l, j) { return j === i ? Object.assign({}, l, { qty: l.qty + d }) : l; }).filter(function (l) { return l.qty > 0; })); }
    var subtotal = lines.reduce(function (s, l) { return s + l.price * l.qty; }, 0);
    var disc = props.discount ? props.discount.amount : 0, total = Math.max(0, subtotal - disc);
    return h('section', { className: 'cp-cart', 'aria-label': 'Giỏ hàng' },
      h('div', { className: 'cp-cart-head' },
        h('div', { className: 'cp-cart-title' }, h('span', null, 'Đơn ', h('span', { className: 'cp-num' }, props.orderCode || '—')), props.badge || null),
        h('div', { className: 'cp-cart-meta' },
          props.staff ? h('span', null, 'NV: ' + props.staff) : null,
          props.counter ? h('span', null, 'Quầy ' + props.counter) : null,
          props.createdAt ? h('span', null, props.createdAt) : null)),
      lines.length ? h('div', { className: 'cp-cart-lines' }, lines.map(function (l, i) {
        return h('div', { className: 'cp-line', key: l.name + i },
          h('div', null, h('div', { className: 'cp-line-name' }, l.name), h('div', { className: 'cp-line-unit' }, fmt(l.price) + (l.note ? ' · ' + l.note : ''))),
          h(Stepper, { value: l.qty, onDec: function () { bump(i, -1); }, onInc: function () { bump(i, 1); } }),
          h('div', { className: 'cp-line-total' }, h(Money, { value: l.price * l.qty })));
      })) : h('div', { className: 'cp-cart-lines' }, h('div', { className: 'cp-cart-empty' }, 'Chạm vào món để thêm vào đơn')),
      h('div', { className: 'cp-cart-sum' },
        h('div', { className: 'cp-sum-row' }, h('span', null, 'Tạm tính (' + lines.reduce(function (s, l) { return s + l.qty; }, 0) + ' món)'), h(Money, { value: subtotal })),
        disc ? h('div', { className: 'cp-sum-row is-discount' }, h('span', null, props.discount.label), h(Money, { value: -disc })) : null,
        h('div', { className: 'cp-sum-row is-total' }, h('span', null, 'Phải thu'), h(Money, { value: total, size: 'lg' }))),
      props.children ? h('div', { className: 'cp-cart-foot' }, props.children) : null);
  }

  /* ---------- BuyerCard ---------- */
  var ROLE = { student: 'Học sinh', teacher: 'Giáo viên', university: 'Sinh viên', guest: 'Khách lẻ' };
  function BuyerCard(props) {
    var role = props.role || 'student';
    if (role === 'guest') {
      return h('section', { className: 'cp-buyer' },
        h('div', { className: 'cp-buyer-head' }, h('span', { className: 'cp-buyer-photo' }, h(Icon, { name: 'user', size: 24 })),
          h('div', null, h('div', { className: 'cp-buyer-name' }, 'Khách lẻ'), h('div', { className: 'cp-buyer-sub' }, 'Không cần tài khoản, thẻ hay ví · thanh toán tiền mặt hoặc QR'))),
        props.children || null);
    }
    var lim = props.limit, pct = lim ? Math.min(100, Math.round(lim.used / lim.max * 100)) : 0;
    var spendable = (props.real || 0) + (props.bonus || 0);
    return h('section', { className: 'cp-buyer', 'aria-label': 'Người mua' },
      h('div', { className: 'cp-buyer-head' },
        h('span', { className: 'cp-buyer-photo' }, initials(props.name)),
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('div', { className: 'cp-buyer-name' }, props.name),
          h('div', { className: 'cp-buyer-sub' }, [ROLE[role], props.klass, props.code].filter(Boolean).join(' · '))),
        props.method ? h(StatusBadge, { tone: 'success', icon: props.method === 'qr' ? 'qr' : props.method === 'bio' ? 'face' : 'card' }, props.method === 'qr' ? 'QR' : props.method === 'bio' ? 'Sinh trắc' : 'Thẻ') : null),
      h('div', { className: cx('cp-wallet', props.compact && lim && 'is-3') },
        h('div', { className: 'cp-wallet-cell' }, h('label', null, 'Tiền thật'), h(Money, { value: props.real, tone: 'brand' })),
        h('div', { className: 'cp-wallet-cell is-bonus' }, h('label', null, 'Tiền thưởng'), h(Money, { value: props.bonus, tone: 'accent' })),
        props.compact && lim ? h('div', { className: 'cp-wallet-cell is-limit' }, h('label', null, 'Còn hạn mức'), h(Money, { value: Math.max(0, Math.min(spendable, lim.max - lim.used)) })) : null),
      lim && !props.compact ? h('div', null,
        h('div', { className: 'cp-limit-row' }, h('span', null, 'Hạn mức hôm nay'), h('span', { className: 'cp-num' }, fmt(lim.used) + ' / ' + fmt(lim.max))),
        h('div', { className: cx('cp-meter', pct >= 100 ? 'is-over' : pct >= 80 && 'is-high'), role: 'meter', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('i', { style: { width: pct + '%' } })),
        h('div', { className: 'cp-limit-row', style: { marginTop: 6, marginBottom: 0 } }, h('span', null, 'Được dùng thêm'), h('strong', { className: 'cp-num', style: { color: 'var(--ink)' } }, fmt(Math.max(0, Math.min(spendable, lim.max - lim.used)))))) : null,
      props.blocked && props.blocked.length ? h('div', { className: 'cp-blocked' }, h('span', { className: 'cp-muted' }, 'Nhóm món bị chặn:'), props.blocked.map(function (b) { return h(StatusBadge, { key: b, tone: 'danger', icon: 'lock' }, b); })) : null,
      props.children || null);
  }

  /* ---------- IdentifyPanel ---------- */
  var METHODS = [{ id: 'card', label: 'Quẹt thẻ', icon: 'card' }, { id: 'qr', label: 'Quét QR', icon: 'qr' }, { id: 'bio', label: 'Sinh trắc', icon: 'face' }];
  var ID_TEXT = { idle: 'Chờ định danh người mua…', reading: 'Đang đọc — giữ thẻ/QR trước đầu đọc', found: 'Đã nhận diện người mua', error: 'Không nhận diện được — thử lại hoặc chọn cách khác' };
  function IdentifyPanel(props) {
    var st = useState(props.active || 'card'), state = props.state || 'idle';
    return h('section', { className: 'cp-identify', 'aria-label': 'Định danh người mua' },
      h('div', { className: 'cp-id-methods' }, METHODS.map(function (m) {
        return h('button', { key: m.id, type: 'button', className: 'cp-id-method', 'aria-pressed': String(st[0] === m.id), onClick: function () { st[1](m.id); } }, h(Icon, { name: m.icon, size: 28, stroke: 1.75 }), m.label);
      })),
      h('div', { className: cx('cp-id-status', 'is-' + state), role: 'status' }, h(Icon, { name: state === 'found' ? 'check' : state === 'error' ? 'alert' : state === 'reading' ? 'sync' : 'clock' }), props.message || ID_TEXT[state]),
      props.onGuest !== false ? h(Button, { variant: 'secondary', icon: 'user', block: true, onClick: props.onGuest }, 'Bán cho khách lẻ') : null);
  }

  /* ---------- CashPayment ---------- */
  function suggest(total) {
    var notes = [10000, 20000, 50000, 100000, 200000, 500000], out = [];
    notes.forEach(function (n) { var v = Math.ceil(total / n) * n; if (v > total && out.indexOf(v) < 0) out.push(v); });
    return out.sort(function (a, b) { return a - b; }).slice(0, 3);
  }
  function CashPayment(props) {
    var total = props.total || 0;
    var st = useState(props.given != null ? String(props.given) : ''), raw = st[0], setRaw = st[1];
    var given = Number(raw || 0), change = given - total, short = given < total;
    function key(k) { if (k === 'del') setRaw(raw.slice(0, -1)); else if (k === '000') setRaw(raw ? raw + '000' : ''); else setRaw((raw + k).replace(/^0+/, '')); }
    var pad = props.keypad !== false ? h('div', { className: 'cp-keypad' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'del'].map(function (k) {
        return h('button', { key: k, type: 'button', onClick: function () { key(k); }, 'aria-label': k === 'del' ? 'Xóa' : k }, k === 'del' ? '⌫' : k);
      })) : null;
    var wide = props.layout === 'wide';
    return h('section', { className: cx('cp-cash', wide && 'is-wide'), 'aria-label': 'Thanh toán tiền mặt' },
      h('div', { className: 'cp-cash-main' },
      h('div', { className: 'cp-due' }, h('span', { className: 'cp-h2' }, 'Phải thu'), h(Money, { value: total, size: 'xl' })),
      h(Field, { label: 'Khách đưa', numeric: true, value: raw ? Number(raw).toLocaleString('vi-VN') : '', placeholder: '0', suffix: '₫', onChange: function (e) { setRaw(e.target.value.replace(/\D/g, '')); } }),
      h('div', { className: 'cp-quick' },
        h('button', { type: 'button', className: 'is-exact', onClick: function () { setRaw(String(total)); } }, 'Đủ tiền'),
        suggest(total).map(function (v) { return h('button', { key: v, type: 'button', onClick: function () { setRaw(String(v)); } }, (v / 1000) + 'k'); })),
      wide ? null : pad,
      h('div', { className: cx('cp-change', short && 'is-short'), role: 'status' },
        h('label', null, h(Icon, { name: short ? 'alert' : 'cash' }), short ? 'Còn thiếu' : 'Tiền thừa trả khách'),
        h(Money, { value: Math.abs(change), size: 'lg' })),
      h(Button, { size: 'lg', block: true, icon: 'check', disabled: short || !raw, onClick: function () { props.onConfirm && props.onConfirm(given); } }, 'Xác nhận đã nhận tiền'),
      h('div', { className: 'cp-note' }, h(Icon, { name: 'receipt', size: 14 }), 'Tiền thu ghi vào ca ' + (props.shift || 'hiện tại') + (props.staff ? ' của ' + props.staff : '') + '.')),
      wide ? pad : null);
  }

  /* ---------- QRPayment ---------- */
  function qrCells(seed, n) {
    var s = 0; for (var i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
    function rnd() { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }
    var cells = [];
    function finder(x, y) { for (var a = 0; a < 7; a++) for (var b = 0; b < 7; b++) { var edge = a === 0 || a === 6 || b === 0 || b === 6, core = a >= 2 && a <= 4 && b >= 2 && b <= 4; if (edge || core) cells.push([x + a, y + b]); } }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var inF = (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
      if (!inF && rnd() > 0.52) cells.push([x, y]);
    }
    return cells;
  }
  var QR_STATE = {
    pending: { icon: 'clock', title: 'Đang chờ ngân hàng xác nhận', text: 'Không đánh dấu thành công chỉ vì khách đã quét. Trạng thái tự cập nhật khi nhận kết quả đã kiểm chứng.' },
    success: { icon: 'check', title: 'Thanh toán thành công', text: 'Đã khớp số tiền và mã đơn với kết quả ngân hàng.' },
    check: { icon: 'alert', title: 'Cần kiểm tra', text: 'Giao dịch không khớp đơn — chuyển sang tra soát.' },
    offline: { icon: 'wifiOff', title: 'Chờ xác minh (offline)', text: 'Chưa kiểm chứng được giao dịch. Đơn giữ trạng thái chờ xác minh và đối soát khi có mạng.' }
  };
  function QRPayment(props) {
    var state = props.state || 'pending', S = QR_STATE[state], n = 25, cell = 8, code = props.orderCode || 'DH-0000';
    var cells = qrCells(code + (props.total || 0), n);
    return h('section', { className: 'cp-qr', 'aria-label': 'Thanh toán QR' },
      h('div', { className: 'cp-qr-code' }, h('svg', { width: n * cell, height: n * cell, viewBox: '0 0 ' + n + ' ' + n, role: 'img', 'aria-label': 'Mã QR thanh toán ' + fmt(props.total) + ' cho đơn ' + code, shapeRendering: 'crispEdges' },
        cells.map(function (c, i) { return h('rect', { key: i, x: c[0], y: c[1], width: 1, height: 1 }); }))),
      h('div', { className: 'cp-qr-info' },
        h('div', null, h('div', { className: 'cp-muted', style: { font: '600 13px/18px var(--font-sans)' } }, 'Số tiền'), h(Money, { value: props.total, size: 'xl' })),
        h('dl', { className: 'cp-kv' },
          h('dt', null, 'Mã đơn'), h('dd', { className: 'cp-num' }, code),
          h('dt', null, 'Nội dung CK'), h('dd', { className: 'cp-num' }, props.memo || ('CANTEEN ' + code)),
          h('dt', null, 'Tài khoản nhận'), h('dd', null, props.account || 'Canteen · VietinBank'),
          props.elapsed ? h('dt', null, 'Đã chờ') : null, props.elapsed ? h('dd', { className: 'cp-num' }, props.elapsed) : null),
        h('div', { className: cx('cp-qr-state', 'is-' + state), role: 'status' }, h(Icon, { name: S.icon, size: 22 }),
          h('div', null, h('strong', null, S.title), h('p', null, props.issue || S.text))),
        props.children || null));
  }

  /* ---------- PreorderTicket ---------- */
  var PO_STATUS = { cash: ['Chờ thu tiền mặt', 'accent', 0], new: ['Mới', 'info', 1], preparing: ['Đang chuẩn bị', 'warning', 2], ready: ['Sẵn sàng giao', 'success', 3], done: ['Đã giao', 'neutral', 4], cancelled: ['Đã hủy', 'danger', 0] };
  function PreorderTicket(props) {
    var s = PO_STATUS[props.status || 'new'];
    var next = { cash: 'Đã thu ' + fmt(props.cashDue || 0), new: 'Bắt đầu chuẩn bị', preparing: 'Báo sẵn sàng', ready: 'Xác nhận đã giao' }[props.status || 'new'];
    return h('article', { className: 'cp-ticket' },
      h('div', { className: 'cp-ticket-head' },
        h('span', { className: 'cp-ticket-code' }, props.code),
        h('span', { className: 'cp-row' }, props.source === 'class' ? h(StatusBadge, { tone: 'brand', icon: 'users' }, 'Suất tập thể') : props.source === 'kiosk' ? h(StatusBadge, { tone: 'neutral', icon: 'face' }, 'Từ kiosk') : h(StatusBadge, { tone: 'neutral', icon: 'qr' }, 'Từ app'), h(StatusBadge, { tone: s[1] }, s[0]))),
      h('div', { className: 'cp-ticket-who' }, props.buyer),
      props.items ? h('ul', { className: 'cp-ticket-items' }, props.items.map(function (it, i) { return h('li', { key: i }, h('b', null, it.qty + '×'), it.name); })) : null,
      h('div', { className: 'cp-ticket-time' },
        h('span', null, 'Nhận lúc ', h('strong', null, props.pickupAt)),
        h('span', null, 'Quầy ', h('strong', null, props.counter)),
        props.eta ? h('span', null, 'Dự kiến ', h('strong', null, props.eta)) : null),
      props.cashDue ? h('div', { className: 'cp-ticket-cash' }, h(Icon, { name: 'cash', size: 18 }), h('span', null, props.cashNote || 'Cần thu tiền mặt'), h(Money, { value: props.cashDue })) : null,
      h('div', { className: 'cp-steps', 'aria-hidden': 'true' }, [1, 2, 3, 4].map(function (k) { return h('i', { key: k, className: k <= s[2] ? 'on' : '' }); })),
      next && props.actions !== false ? h(Button, { variant: props.status === 'ready' || props.status === 'cash' ? 'primary' : 'secondary', size: 'sm', block: true, icon: props.status === 'cash' ? 'cash' : undefined, onClick: props.onNext }, next) : null);
  }

  /* ---------- ShiftSummary ---------- */
  function ShiftSummary(props) {
    var cashIn = props.cash || 0, cashRefund = props.cashRefund || 0, opening = props.opening || 0;
    var expected = opening + cashIn - cashRefund;
    var st = useState(props.counted != null ? String(props.counted) : ''), raw = st[0];
    var counted = Number(raw || 0), diff = counted - expected;
    var vClass = !raw ? 'is-ok' : diff === 0 ? 'is-ok' : diff > 0 ? 'is-over' : 'is-short';
    var row = function (label, a, b, cls) { return h('tr', { className: cls }, h('td', null, label), h('td', { className: 'r cp-num' }, a), h('td', { className: 'r' }, b)); };
    return h('section', { className: 'cp-shift', 'aria-label': 'Chốt ca' },
      h('div', { className: 'cp-kpis' },
        h('div', { className: 'cp-kpi' }, h('label', null, 'Số đơn'), h('span', { className: 'cp-num' }, props.orders || 0)),
        h('div', { className: 'cp-kpi' }, h('label', null, 'Doanh thu thuần'), h(Money, { value: (props.wallet || 0) + cashIn + (props.qr || 0) - (props.refunds || 0) })),
        h('div', { className: 'cp-kpi' }, h('label', null, 'Hoàn / hủy'), h('span', { className: 'cp-num' }, (props.refundCount || 0) + ' / ' + (props.cancelCount || 0))),
        h('div', { className: 'cp-kpi' }, h('label', null, 'Tiền mặt phải có'), h(Money, { value: expected }))),
      h('table', { className: 'cp-table' },
        h('thead', null, h('tr', null, h('th', null, 'Phương thức'), h('th', { className: 'r' }, 'Số GD'), h('th', { className: 'r' }, 'Số tiền'))),
        h('tbody', null,
          row('Ví (tiền thật + thưởng)', props.walletCount || 0, h(Money, { value: props.wallet })),
          row('Tiền mặt', props.cashCount || 0, h(Money, { value: cashIn })),
          row('QR ngân hàng (đã đối soát)', props.qrCount || 0, h(Money, { value: props.qr })),
          props.qrPending ? row('QR chờ xác minh — chưa tính', props.qrPending, h(StatusBadge, { tone: 'warning' }, 'Tra soát')) : null,
          row('Hoàn / hủy', props.refundCount || 0, h(Money, { value: -(props.refunds || 0), tone: 'danger' })),
          row('Tổng', '', h(Money, { value: (props.wallet || 0) + cashIn + (props.qr || 0) - (props.refunds || 0) }), 'is-total'))),
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' } },
        h(Field, { label: 'Tiền mặt thực tế trong két', numeric: true, suffix: '₫', placeholder: '0', value: raw ? Number(raw).toLocaleString('vi-VN') : '', onChange: function (e) { var v = e.target.value.replace(/\D/g, ''); st[1](v); props.onCount && props.onCount(v === '' ? null : Number(v)); }, hint: 'Đầu ca ' + fmt(opening) + ' + thu ' + fmt(cashIn) + ' − hoàn ' + fmt(cashRefund) }),
        h('div', { className: cx('cp-variance', vClass) },
          h('span', { style: { font: '600 15px/22px var(--font-sans)', display: 'flex', gap: 8, alignItems: 'center' } }, h(Icon, { name: vClass === 'is-ok' ? 'check' : 'alert' }), !raw ? 'Chưa nhập tiền đếm' : diff === 0 ? 'Khớp' : diff > 0 ? 'Thừa' : 'Thiếu'),
          raw ? h(Money, { value: diff, size: 'lg', sign: true }) : null)),
      props.children || null);
  }


  /* ---------- List style ---------- */
  function NavBar(props) {
    return h('div', { className: 'cp-nav' },
      props.onBack !== false ? h('button', { type: 'button', 'aria-label': 'Quay lại', onClick: props.onBack }, h(Icon, { name: 'back', size: 26 })) : h('span'),
      h('h1', null, props.title), props.right || h('span'));
  }
  function SectionLabel(props) {
    return h('div', { className: 'cp-section-label' },
      h('span', { style: { display: 'inline-flex', gap: 6, alignItems: 'center' } }, props.children, props.help ? h(Icon, { name: 'info', size: 18, className: 'cp-muted' }) : null),
      props.onEdit ? h('button', { type: 'button', 'aria-label': 'Sửa', onClick: props.onEdit }, h(Icon, { name: 'edit', size: 20 })) : null);
  }
  function ListRow(props) {
    var tag = props.onClick || props.chevron ? 'button' : 'div';
    return h(tag, { type: tag === 'button' ? 'button' : undefined, className: 'cp-list-row', onClick: props.onClick },
      props.icon ? h(Icon, { name: props.icon, size: 28, stroke: 1.6 }) : null,
      h('span', { className: 'cp-list-body' },
        h('span', { className: 'cp-list-title' }, props.title),
        props.value != null ? h('span', { className: 'cp-list-value' }, props.value) : null,
        props.note ? h(InlineNote, { tone: props.noteTone }, props.note) : null,
        props.children || null),
      props.trailing || null,
      props.chevron ? h(Icon, { name: 'chevron', size: 22, className: 'cp-chev' }) : null);
  }
  function InlineNote(props) {
    var tone = props.tone || 'warn';
    return h('span', { className: cx('cp-inline-note', tone === 'danger' && 'is-danger', tone === 'info' && 'is-info') }, h(Icon, { name: tone === 'danger' ? 'alert' : 'info', size: 16 }), h('span', null, props.children));
  }

  var api = { Button: Button, StatusBadge: StatusBadge, Money: Money, Field: Field, TopBar: TopBar, OfflineBanner: OfflineBanner, CategoryTabs: CategoryTabs, MenuItemCard: MenuItemCard, OrderCart: OrderCart, BuyerCard: BuyerCard, IdentifyPanel: IdentifyPanel, CashPayment: CashPayment, QRPayment: QRPayment, PreorderTicket: PreorderTicket, ShiftSummary: ShiftSummary, Icon: Icon, formatVND: fmt, NavBar: NavBar, SectionLabel: SectionLabel, ListRow: ListRow, InlineNote: InlineNote };
  window.CanteenPOS = Object.assign(window.CanteenPOS || {}, api);
})();
