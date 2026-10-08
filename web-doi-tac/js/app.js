/* Web Đối tác — Application Logic. Global: window.WD, window.CanteenPOS */
(function () {
  var React = window.React, h = React.createElement, useState = React.useState, useEffect = React.useEffect;
  var C = window.CanteenPOS, WD = window.WD;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  // --- Common Dialog ---
  function Dialog(props) {
    var isOpen = props.isOpen, onClose = props.onClose;
    // Esc đóng hộp thoại
    useEffect(function() {
      if (!isOpen) return;
      function onKey(e) { if (e.key === 'Escape' && onClose) onClose(); }
      document.addEventListener('keydown', onKey);
      return function() { document.removeEventListener('keydown', onKey); };
    }, [isOpen, onClose]);
    if (!isOpen) return null;
    return window.ReactDOM.createPortal(
      h('div', { className: 'wd-scrim', style: { background: 'rgba(29,31,36,0.6)', inset: 0, display: 'grid', placeItems: 'center', margin: 0, height: '100vh', boxSizing: 'border-box' } },
        h('div', { className: cx('cp-panel wd-dialog', props.className), role: 'dialog', 'aria-modal': 'true', 'aria-label': typeof props.title === 'string' ? props.title : undefined, style: { background: 'var(--surface-raised)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column' } },
          h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 24px', borderBottom: '1px solid var(--line)', flex: '0 0 auto' } }, 
             h('h2', { style: { margin: 0, fontSize: 18, lineHeight: 1.3 } }, props.title), 
             h('button', { className: 'wd-icon-btn', style: { flex: '0 0 auto' }, onClick: props.onClose, 'aria-label': 'Đóng' }, h(C.Icon, { name: 'x' }))
          ),
          h('div', { style: { padding: 'var(--space-4)', overflowY: 'auto', flex: '1 1 auto' } }, props.children)
        )
      ),
      document.body
    );
  }

  // --- ReportsTab ---
  function ReportsTab(props) {
    var data = props.data;
    
    return h('div', { className: 'wd-dashboard' },
      h('div', { className: 'wd-dash-head' },
        h('div', null,
          h('h2', { className: 'wd-dash-title' }, 'Tổng quan kinh doanh'),
          h('p', { className: 'wd-dash-sub' }, 'Tất cả 1 canteen · 7 ngày')
        ),
        h('div', { className: 'wd-dash-actions' },
          h('button', { className: 'wd-btn-outline' }, h(C.Icon, {name:'download', size:16}), ' Xuất Excel'),
          h('button', { className: 'wd-btn-outline' }, h(C.Icon, {name:'file-text', size:16}), ' Xuất PDF')
        )
      ),
      h('div', { className: 'wd-dash-kpis' },
        h('div', { className: 'wd-dash-kpi' },
          h('label', null, h(C.Icon, {name:'bar-chart', size:14}), ' Doanh thu'),
          h('div', { className: 'wd-kpi-val' }, '3.710.000 đ'),
          h('div', { className: 'wd-kpi-sub' }, 'Kỳ trước chưa có doanh thu')
        ),
        h('div', { className: 'wd-dash-kpi' },
          h('label', null, h(C.Icon, {name:'doc', size:14}), ' Số đơn'),
          h('div', { className: 'wd-kpi-val' }, '76'),
          h('div', { className: 'wd-kpi-sub' }, 'TB 48.800 đ / đơn')
        ),
        h('div', { className: 'wd-dash-kpi' },
          h('label', null, h(C.Icon, {name:'cash', size:14}), ' Tiền nạp vào ví'),
          h('div', { className: 'wd-kpi-val' }, '3.686.000 đ'),
          h('div', { className: 'wd-kpi-sub' }, 'Hoàn 180.000 đ')
        ),
        h('div', { className: 'wd-dash-kpi' },
          h('label', null, h(C.Icon, {name:'percent', size:14}), ' % Lợi nhuận gộp (ước tính)'),
          h('div', { className: 'wd-kpi-val' }, '3.334.000 đ'),
          h('div', { className: 'wd-kpi-sub' }, 'Biên 89.9%')
        )
      ),
      h('div', { className: 'wd-dash-grid-2' },
        h('div', { className: 'wd-dash-panel' },
          h('h3', null, 'Doanh thu theo ngày'),
          h('p', { className: 'wd-dash-sub' }, 'Rê chuột để xem chi tiết'),
          h('div', { className: 'wd-mock-bar-chart' },
            h('div', { className: 'wd-bar-mock', style: {height: '10px'} }),
            h('div', { className: 'wd-bar-mock', style: {height: '30px'} }),
            h('div', { className: 'wd-bar-mock', style: {height: '50px'} }),
            h('div', { className: 'wd-bar-mock', style: {height: '90px'} }),
            h('div', { className: 'wd-bar-mock', style: {height: '120px'} }),
            h('div', { className: 'wd-bar-mock', style: {height: '160px'} })
          )
        ),
        h('div', { className: 'wd-dash-panel' },
          h('h3', null, 'Theo phương thức thanh toán'),
          h('div', { className: 'wd-mock-donut-chart-1' },
            h('div', { className: 'wd-donut-ring', style:{borderTopColor:'#f59e0b', borderRightColor:'#3b82f6', borderBottomColor:'#3b82f6', borderLeftColor:'#f59e0b'} }),
            h('div', { className: 'wd-donut-text' }, h('b', null, '3,9 tr'), h('br'), h('small', null, 'Tổng'))
          ),
          h('div', { className: 'wd-donut-legend' },
            h('div', { className: 'wd-dl-item' }, h('span', {style:{background:'#3b82f6'}}), 'Ví (thật + thưởng)', h('b', {style:{float:'right'}}, '52.4%')),
            h('div', { className: 'wd-dl-item' }, h('span', {style:{background:'#f59e0b'}}), 'Tiền mặt', h('b', {style:{float:'right'}}, '47.6%')),
            h('div', { className: 'wd-dl-item' }, h('span', {style:{background:'#cbd5e1'}}), 'QR ngân hàng', h('b', {style:{float:'right'}}, '0%'))
          )
        )
      ),
      h('div', { className: 'wd-dash-grid-3' },
        h('div', { className: 'wd-dash-panel' },
          h('h3', null, 'Doanh thu theo giờ'),
          h('p', { className: 'wd-dash-sub' }, 'Cao điểm 2:00-3:00'),
          h('div', { className: 'wd-mock-hour-chart' })
        ),
        h('div', { className: 'wd-dash-panel' },
          h('h3', null, 'Món bán chạy'),
          h('div', { className: 'wd-mock-top-items' },
            h('div', { className: 'wd-ti' }, h('span', {className:'wd-rank is-1'}, '1'), h('div', {className:'wd-ti-name'}, h('b', null, 'E2E Banh 10k'), h('div', {className:'wd-ti-bar'}, h('i', {style:{width:'90%'}}))), h('div', {className:'wd-ti-val'}, '87 phần')),
            h('div', { className: 'wd-ti' }, h('span', {className:'wd-rank'}, '2'), h('div', {className:'wd-ti-name'}, h('b', null, 'mỳ bò'), h('div', {className:'wd-ti-bar'}, h('i', {style:{width:'50%'}}))), h('div', {className:'wd-ti-val'}, '20 phần')),
            h('div', { className: 'wd-ti' }, h('span', {className:'wd-rank'}, '3'), h('div', {className:'wd-ti-name'}, h('b', null, 'mỳ cay'), h('div', {className:'wd-ti-bar'}, h('i', {style:{width:'40%'}}))), h('div', {className:'wd-ti-val'}, '16 phần')),
            h('div', { className: 'wd-ti' }, h('span', {className:'wd-rank'}, '4'), h('div', {className:'wd-ti-name'}, h('b', null, 'E2E Stock1'), h('div', {className:'wd-ti-bar'}, h('i', {style:{width:'10%'}}))), h('div', {className:'wd-ti-val'}, '4 phần'))
          )
        ),
        h('div', { className: 'wd-dash-panel' },
          h('h3', null, 'Theo nhóm khách hàng'),
          h('div', { className: 'wd-mock-customer-donut' },
            h('div', { className: 'wd-donut-ring', style:{borderTopColor:'#6b7280', borderRightColor:'#3b82f6', borderBottomColor:'#3b82f6', borderLeftColor:'#6b7280'} }),
            h('div', { className: 'wd-donut-text' }, h('b', null, '3,7 tr'), h('br'), h('small', null, 'Doanh thu'))
          ),
          h('div', { className: 'wd-donut-legend' },
            h('div', { className: 'wd-dl-item' }, h('span', {style:{background:'#3b82f6'}}), 'Học sinh', h('b', {style:{float:'right'}}, '61.5%')),
            h('div', { className: 'wd-dl-item' }, h('span', {style:{background:'#f59e0b'}}), 'Giáo viên', h('b', {style:{float:'right'}}, '0%')),
            h('div', { className: 'wd-dl-item' }, h('span', {style:{background:'#6b7280'}}), 'Khách lẻ', h('b', {style:{float:'right'}}, '38.5%'))
          )
        )
      ),
      h('div', { className: 'wd-dash-panel' },
        h('div', { className: 'wd-dash-head' },
          h('h3', null, 'So sánh các canteen'),
          h('button', { className: 'wd-btn-text' }, 'Báo cáo lãi lỗ ', h(C.Icon, {name:'chevron-right', size:16}))
        ),
        h('table', { className: 'wd-dash-table' },
           h('thead', null, h('tr', null, h('th', null, 'CANTEEN'), h('th', null, 'LOẠI HÌNH'), h('th', null, 'DOANH THU'), h('th', null, 'TỶ TRỌNG'), h('th', null, 'TRẠNG THÁI'))),
           h('tbody', null,
             h('tr', null,
               h('td', null, h('b', {style:{color:'#3b82f6'}}, '● can-a')),
               h('td', null, 'thcs-a'),
               h('td', null, h('div', {style:{display:"flex", alignItems:"center", gap:"8px"}}, h(C.Icon, {name:"folder", size:16, style:{color:"#f59e0b"}}), h(C.Icon, {name:"pie-chart", size:16, style:{color:"#10b981"}}), h(C.Icon, {name:"download", size:16, style:{color:"#3b82f6"}}))),
               h('td', null, h('div', {style:{display:"flex", alignItems:"center", gap:"8px"}}, h('div', {style:{width:"100px", height:"6px", background:"#3b82f6", borderRadius:"3px"}}), '100%')),
               h('td', null, h('span', { className: 'wd-status-tag is-success' }, h(C.Icon, {name:'check', size:12}), ' Đang mở'))
             )
           )
        )
      )
    );
  }

  function MenuDialog(props) {
    var item = props.item, onClose = props.onClose, onSave = props.onSave;
    var cats = props.data.cats || [{id:'com', label:'Cơm'}];
    var [form, setForm] = useState(item || {});

    function handleChange(field, val) {
      setForm(Object.assign({}, form, { [field]: val }));
    }

    if (!item) return null;

    return h(Dialog, { isOpen: !!item, title: item.code && item.name ? ('Sửa món ' + item.code) : 'Thêm món mới', onClose: onClose, className: 'is-sm' },
      h('div', { style: { display: 'grid', gap: 'var(--space-4)' } },
        h(C.Field, { label: 'Tên món', value: form.name, onChange: function(e) { handleChange('name', e.target.value); } }),
        h('div', { className: 'wd-2col' },
          h('div', { className: 'cp-field' },
            h('label', null, 'Nhóm món'),
            h('div', { className: 'cp-field-box' },
              h('select', { value: form.cat || cats[0].id, onChange: function(e) { handleChange('cat', e.target.value); } },
                cats.map(function(c) { return h('option', { key: c.id, value: c.id }, c.label); })
              )
            )
          ),
          h('div', { className: 'cp-field' },
            h('label', null, 'Trạng thái'),
            h('div', { className: 'cp-field-box' },
              h('select', { value: form.status || 'on', onChange: function(e) { handleChange('status', e.target.value); } },
                h('option', { value: 'on' }, 'Đang bán'),
                h('option', { value: 'soldout' }, 'Hết món'),
                h('option', { value: 'paused' }, 'Tạm ngừng')
              )
            )
          )
        ),
        h('div', { className: 'wd-2col' },
          h(C.Field, { label: 'Giá bán', numeric: true, value: form.price ? Number(form.price).toLocaleString('vi-VN') : '', suffix: '₫', onChange: function(e) { handleChange('price', Number(e.target.value.replace(/\D/g, ''))); } }),
          h(C.Field, { label: 'Giá vốn (để tính lãi)', numeric: true, value: form.cost ? Number(form.cost).toLocaleString('vi-VN') : '', suffix: '₫', onChange: function(e) { handleChange('cost', Number(e.target.value.replace(/\D/g, ''))); } })
        ),
        h(C.Field, { label: 'Thành phần dị ứng (nếu có)', placeholder: 'VD: đậu phộng, hải sản...', value: form.allergens || '', onChange: function(e) { handleChange('allergens', e.target.value); } }),
        h(C.Field, { label: 'Ảnh đại diện (URL)', placeholder: 'https://...', value: form.image || '', onChange: function(e) { handleChange('image', e.target.value); } }),
        h('div', { className: 'cp-field' },
          h('label', null, 'Áp dụng cho Canteen'),
          h('div', { className: 'wd-chips' },
            [{id:'all', name:'Tất cả Canteen'}, {id:'CT-CS1', name:'Cơ sở 1'}, {id:'CT-CS2', name:'Cơ sở 2'}].map(function(c) {
               var list = form.canteens || ['all'];
               var checked = list.includes(c.id);
               return h('button', { key: c.id, className: 'wd-chip-toggle', 'aria-pressed': String(checked), onClick: function() {
                  var newList = list.slice();
                  if (c.id === 'all') newList = ['all'];
                  else {
                     newList = newList.filter(function(x) { return x !== 'all'; });
                     if (checked) newList = newList.filter(function(x) { return x !== c.id; });
                     else newList.push(c.id);
                     if (newList.length === 0) newList = ['all'];
                  }
                  handleChange('canteens', newList);
               } }, h(C.Icon, { name: checked ? 'check' : 'plus', size: 16 }), c.name);
            })
          )
        ),
        h('div', { className: 'wd-dialog-foot' },
          h(C.Button, { variant: 'secondary', onClick: onClose }, 'Hủy'),
          h(C.Button, { variant: 'primary', disabled: !form.name, onClick: function() { onSave(form); } }, 'Lưu món')
        )
      )
    );
  }

  function MenuTab(props) {
    var data = props.data, setData = props.setData;
    var [cat, setCat] = useState('com');
    var [editing, setEditing] = useState(null);
    
    var items = data.menu.filter(function(m) { return m.cat === cat; });

    function add() {
      setEditing({ code: WD.nextItemCode(data.menu, data.cats, cat), name: '', price: 0, cost: 0, cat: cat, status: 'on', allergens: [], canteens: ['A'] });
    }

    function saveItem(item) {
      var copy = data.menu.slice();
      var idx = copy.findIndex(function(m) { return m.code === item.code; });
      if (idx >= 0) copy[idx] = item;
      else copy.push(item);
      setData(Object.assign({}, data, { menu: copy }));
      setEditing(null);
    }
    
    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Quản lý thực đơn')),
      h('div', { className: 'wd-toolbar' },
        h(C.CategoryTabs, { items: data.cats, active: cat, onChange: setCat }),
        h('div', { className: 'wd-spacer' }),
        h(C.Button, { icon: 'plus', onClick: add }, 'Thêm món mới')
      ),
      h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã'), h('th', null, 'Tên món'), h('th', { className: 'r' }, 'Giá bán'), h('th', { className: 'r' }, 'Giá vốn'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, items.map(function(m) {
            return h('tr', { key: m.code },
              h('td', null, m.code),
              h('td', null, 
                h('div', { style: { display: 'flex', gap: '12px', alignItems: 'center' } },
                  m.image 
                    ? h('img', { src: m.image, style: { width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' } }) 
                    : h('div', { className: 'wd-thumb', style: { width: '48px', height: '48px', borderRadius: '8px', background: 'var(--surface-sunken)' } }, h(C.Icon, {name: 'bag'})),
                  h('div', null, 
                    h('b', { style: { display: 'block', fontSize: '15px' } }, m.name), 
                    m.allergens ? h('small', { className: 'wd-tag is-warn', style: { marginTop: '4px' } }, '⚠️ Dị ứng: ' + m.allergens) : null,
                    m.canteens && !m.canteens.includes('all') ? h('small', { className: 'wd-tag', style: { marginTop: '4px', marginLeft: m.allergens ? '4px' : '0' } }, m.canteens.join(', ')) : null
                  )
                )
              ),
              h('td', { className: 'r cp-money' }, C.formatVND(m.price)),
              h('td', { className: 'r' }, C.formatVND(m.cost)),
              h('td', null, h('select', { className: 'wd-status-select is-' + (m.status === 'soldout' ? 'soldout' : m.status === 'paused' ? 'paused' : 'on'), value: m.status || 'on', onChange: function(e) {
                var copy = data.menu.slice();
                var idx = copy.findIndex(function(x) { return x.code === m.code; });
                copy[idx] = Object.assign({}, copy[idx], { status: e.target.value });
                setData(Object.assign({}, data, { menu: copy }));
              } }, h('option', { value: 'on' }, 'Đang bán'), h('option', { value: 'soldout' }, 'Hết món'), h('option', { value: 'paused' }, 'Tạm ngừng'))),
              h('td', { className: 'r wd-actions' },
                h('button', { className: 'wd-icon-btn', 'aria-label': 'Sửa', onClick: function() { setEditing(m); } }, h(C.Icon, { name: 'edit', size: 18 })),
                h('button', { className: 'wd-icon-btn is-danger', 'aria-label': 'Xóa', onClick: function() {
                  if (confirm('Xóa món ' + m.name + '?')) {
                    setData(Object.assign({}, data, { menu: data.menu.filter(function(x) { return x.code !== m.code; }) }));
                  }
                } }, h(C.Icon, { name: 'x', size: 18 }))
              )
            );
          }))
        )
      ),
      editing ? h(MenuDialog, { data: data, item: editing, onClose: function() { setEditing(null); }, onSave: saveItem }) : null
    );
  }

  // --- AccountsTab ---
  function AccountDialog(props) {
    var item = props.item, onClose = props.onClose, onSave = props.onSave;
    var [form, setForm] = useState(item || {});

    function handleChange(field, val) {
      setForm(Object.assign({}, form, { [field]: val }));
    }

    if (!item) return null;

    return h(Dialog, { isOpen: !!item, title: 'Sửa tài khoản ' + item.login, onClose: onClose, className: 'is-sm' },
      h('div', { style: { display: 'grid', gap: 'var(--space-4)' } },
        h(C.Field, { label: 'Họ tên', value: form.name, onChange: function(e) { handleChange('name', e.target.value); } }),
        item.role === 'student' ? h('div', { className: 'wd-2col' },
          h(C.Field, { label: 'Lớp', value: form.klass, onChange: function(e) { handleChange('klass', e.target.value); } }),
          h(C.Field, { label: 'SĐT Phụ huynh (Liên kết)', value: form.parent || '', onChange: function(e) { handleChange('parent', e.target.value); } })
        ) : item.role === 'teacher' ? h(C.Field, { label: 'Tổ bộ môn', value: form.klass, onChange: function(e) { handleChange('klass', e.target.value); } }) : null,
        h('div', { className: 'wd-2col' },
          h(C.Field, { label: 'Số điện thoại cá nhân', value: form.phone || '', onChange: function(e) { handleChange('phone', e.target.value); } }),
          h(C.Field, { label: 'Mã thẻ định danh (NFC/QR)', value: form.nfcCard || '', placeholder: 'Quẹt thẻ...', onChange: function(e) { handleChange('nfcCard', e.target.value); } })
        ),
        h('div', { className: 'wd-dialog-foot' },
          h(C.Button, { variant: 'secondary', onClick: onClose }, 'Hủy'),
          h(C.Button, { variant: 'primary', disabled: !form.name, onClick: function() { onSave(form); } }, 'Lưu')
        )
      )
    );
  }

  function AccountsTab(props) {
    var data = props.data, setData = props.setData;
    var [role, setRole] = useState('student');
    var [search, setSearch] = useState('');
    var [editing, setEditing] = useState(null);
    
    var items = data.accounts.filter(function(a) { return a.role === role && (a.name.toLowerCase().includes(search.toLowerCase()) || a.login.includes(search)); });

    function saveItem(item) {
      var copy = data.accounts.slice();
      var idx = copy.findIndex(function(x) { return x.id === item.id; });
      if (idx >= 0) copy[idx] = item;
      setData(Object.assign({}, data, { accounts: copy }));
      setEditing(null);
    }

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Quản lý Tài khoản')),
      h('div', { className: 'wd-toolbar' },
        h(C.CategoryTabs, { items: [{id:'student',label:'Học sinh'},{id:'teacher',label:'Giáo viên'},{id:'parent',label:'Phụ huynh'}], active: role, onChange: setRole }),
        h('div', { className: 'wd-spacer' }),
        h(C.Field, { placeholder: 'Tìm tên hoặc mã/SĐT...', value: search, onChange: function(e){ setSearch(e.target.value); }, icon: 'search' })
      ),
      h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã / Đăng nhập'), h('th', null, 'Họ tên'), role === 'student' ? h('th', null, 'Lớp') : role === 'teacher' ? h('th', null, 'Tổ') : h('th', null, 'SĐT'), h('th', { className: 'r' }, 'Số dư'), h('th', null, 'Mật khẩu'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, items.map(function(a) {
            var passDisp = a.password || '******';
            return h('tr', { key: a.id },
              h('td', null, h('b', null, a.login)),
              h('td', null, a.name),
              role === 'student' ? h('td', null, a.klass) : role === 'teacher' ? h('td', null, a.klass) : h('td', null, a.phone),
              h('td', { className: 'r cp-money' }, C.formatVND(a.real + (a.bonus||0))),
              h('td', null, h('span', { className: 'wd-pw' }, h('code', null, passDisp), h('button', { className: 'wd-icon-btn', 'aria-label': 'Reset', onClick: function() {
                if (confirm('Cấp lại mật khẩu mới cho ' + a.name + '?')) {
                  var copy = data.accounts.slice();
                  var idx = copy.findIndex(function(x) { return x.id === a.id; });
                  copy[idx] = Object.assign({}, copy[idx], { password: WD.genPw() });
                  setData(Object.assign({}, data, { accounts: copy }));
                }
              } }, h(C.Icon, { name: 'sync', size: 16 })))),
              h('td', { className: 'r wd-actions' },
                h('button', { className: 'wd-icon-btn', 'aria-label': 'Sửa', onClick: function() { setEditing(a); } }, h(C.Icon, { name: 'edit', size: 18 })),
                h('button', { className: 'wd-icon-btn ' + (a.status === 'locked' ? 'is-danger' : ''), 'aria-label': 'Khóa/Mở', onClick: function() {
                   var copy = data.accounts.slice();
                   var idx = copy.findIndex(function(x) { return x.id === a.id; });
                   copy[idx] = Object.assign({}, copy[idx], { status: a.status === 'locked' ? 'active' : 'locked' });
                   setData(Object.assign({}, data, { accounts: copy }));
                } }, h(C.Icon, { name: a.status === 'locked' ? 'lock' : 'check', size: 18 }))
              )
            );
          }))
        )
      ),
      editing ? h(AccountDialog, { data: data, item: editing, onClose: function() { setEditing(null); }, onSave: saveItem }) : null
    );
  }

  // --- ImportTab ---
  function ImportTab(props) {
    var data = props.data, setData = props.setData;
    var [file, setFile] = useState(null);
    var [preview, setPreview] = useState(null);
    var [status, setStatus] = useState('idle');

    function handleFile(e) {
      var f = e.target.files[0];
      if (!f) return;
      setFile(f);
      setStatus('parsing');
      window.XlsxLite.read(f).then(function(rows) {
        var parsed = [];
        for (var i = 1; i < rows.length; i++) {
          var r = rows[i];
          if (!r[1]) continue;
          var roleStr = (r[2] || '').toLowerCase();
          var role = roleStr.indexOf('giáo viên') >= 0 || roleStr.indexOf('gv') >= 0 ? 'teacher' : 'student';
          parsed.push({
            name: r[1],
            role: role,
            klass: r[3] || '',
            phone: WD.fixPhone(r[4] || ''),
            parentPhone: WD.fixPhone(r[5] || '')
          });
        }
        setPreview(parsed);
        setStatus('preview');
      }).catch(function(err) {
        alert('Lỗi đọc file: ' + err);
        setStatus('idle');
      });
      e.target.value = ''; // reset input
    }

    function doImport() {
      var copy = data.accounts.slice();
      var taken = {};
      copy.forEach(function(a) { taken[a.code] = 1; });
      var newAccs = [];
      preview.forEach(function(p) {
        var code = WD.newCode(copy, p.role, taken);
        taken[code] = 1;
        var acc = {
          id: p.role + ':' + code,
          role: p.role,
          login: code,
          code: code,
          name: p.name,
          klass: p.klass,
          phone: p.phone,
          parent: p.parentPhone,
          password: WD.genPw(),
          real: 0,
          bonus: 0,
          status: 'active'
        };
        newAccs.push(acc);
        copy.push(acc);
        
        if (p.role === 'student' && p.parentPhone && WD.validPhone(p.parentPhone)) {
           var hasParent = copy.find(function(x) { return x.role === 'parent' && x.login === p.parentPhone; });
           if (!hasParent) {
             var parentAcc = {
               id: 'parent:' + p.parentPhone,
               role: 'parent',
               login: p.parentPhone,
               phone: p.parentPhone,
               name: 'PH ' + p.name,
               password: WD.genPw(),
               real: 0,
               bonus: 0,
               status: 'active'
             };
             newAccs.push(parentAcc);
             copy.push(parentAcc);
           }
        }
      });
      setData(Object.assign({}, data, { accounts: copy }));
      setStatus('done');
      setPreview(newAccs);
    }

    if (status === 'done') {
      return h('div', { className: 'wd-page' },
        h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Nhập thành công')),
        h('div', { className: 'wd-memo is-info' }, 'Đã tạo ' + preview.length + ' tài khoản. Vui lòng lưu lại mật khẩu hoặc in phiếu để phát cho người dùng.'),
        h('div', { className: 'wd-toolbar' },
          h(C.Button, { onClick: function() { window.print(); } }, 'In phiếu'),
          h(C.Button, { variant: 'secondary', onClick: function() { setStatus('idle'); setFile(null); setPreview(null); } }, 'Nhập file khác')
        ),
        h('div', { className: 'wd-table-wrap' },
          h('table', { className: 'wd-table' },
            h('thead', null, h('tr', null, h('th', null, 'Họ tên'), h('th', null, 'Vai trò'), h('th', null, 'Tài khoản'), h('th', null, 'Mật khẩu'))),
            h('tbody', null, preview.map(function(p, i) {
              return h('tr', { key: i },
                h('td', null, p.name),
                h('td', null, p.role === 'parent' ? 'Phụ huynh' : p.role === 'teacher' ? 'Giáo viên' : 'Học sinh'),
                h('td', null, h('b', null, p.login)),
                h('td', null, h('code', null, p.password))
              );
            }))
          )
        ),
        h('div', { className: 'wd-print' }, preview.map(function(p, i) {
          return h('div', { key: i, className: 'wd-print-card' },
            h('b', null, p.name), h('br'),
            p.role === 'parent' ? 'Phụ huynh' : (p.role === 'teacher' ? 'Giáo viên - ' : 'Học sinh - ') + (p.klass || ''),
            h('br'), h('br'),
            'Tài khoản: ', h('b', null, p.login), h('br'),
            'Mật khẩu: ', h('b', null, p.password)
          );
        }))
      );
    }

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Nhập danh sách tài khoản')),
      h('div', { className: 'wd-import' },
        h('div', null,
          status === 'preview' ? h('div', null,
            h('div', { className: 'wd-memo' }, 'Tìm thấy ' + preview.length + ' dòng dữ liệu hợp lệ. Bấm "Thực hiện nhập" để tạo tài khoản.'),
            h('br'),
            h('div', { className: 'wd-table-wrap' },
              h('table', { className: 'wd-table wd-table-sm' },
                h('thead', null, h('tr', null, h('th', null, 'Họ tên'), h('th', null, 'Lớp/Tổ'), h('th', null, 'SĐT PH'))),
                h('tbody', null, preview.slice(0, 10).map(function(p, i) {
                  return h('tr', { key: i }, h('td', null, p.name), h('td', null, p.klass), h('td', null, p.parentPhone));
                }))
              )
            ),
            preview.length > 10 ? h('p', { className: 'cp-muted', style: {textAlign: 'center'} }, '... và ' + (preview.length - 10) + ' dòng khác') : null,
            h('br'),
            h(C.Button, { size: 'lg', block: true, onClick: doImport }, 'Thực hiện nhập ' + preview.length + ' tài khoản'),
            h('div', { style: { marginTop: 'var(--space-3)', textAlign: 'center' } },
              h('button', { className: 'wd-link', onClick: function() { setStatus('idle'); setFile(null); setPreview(null); } }, 'Hủy bỏ')
            )
          ) : h('label', { className: 'wd-file-drop' },
            h('input', { type: 'file', accept: '.xlsx,.csv', style: { display: 'none' }, onChange: handleFile }),
            h(C.Icon, { name: 'doc', size: 48 }),
            h('b', null, 'Bấm để chọn file Excel (.xlsx)'),
            h('small', null, 'Hoặc kéo thả file vào đây')
          )
        ),
        h('div', { className: 'wd-section' },
          h('h3', { style: { margin: 0, fontSize: 16 } }, 'Hướng dẫn cấu trúc file'),
          h('ul', { className: 'wd-rules' },
            h('li', null, 'Dòng 1 là tiêu đề cột (bỏ qua khi đọc).'),
            h('li', null, 'Cột 1: STT (tùy chọn)'),
            h('li', null, h('b', null, 'Cột 2: Họ và tên (Bắt buộc)')),
            h('li', null, 'Cột 3: Vai trò ("Học sinh" hoặc "Giáo viên")'),
            h('li', null, 'Cột 4: Lớp hoặc Tổ bộ môn'),
            h('li', null, 'Cột 5: SĐT của học sinh/giáo viên (nếu có)'),
            h('li', null, 'Cột 6: SĐT Phụ huynh (để tự động liên kết)')
          ),
          h('p', { className: 'cp-muted', style: { fontSize: 13, marginTop: 'var(--space-3)' } }, 'Hệ thống sẽ tự động sinh mã (HS-xxx, GV-xxx) và mật khẩu ngẫu nhiên cho từng tài khoản.')
        )
      )
    );
  }

  // --- OrderDialog ---
  function OrderDialog(props) {
    var order = props.order, onClose = props.onClose;
    if (!order) return null;
    return h(Dialog, { isOpen: !!order, title: 'Chi tiết đơn hàng ' + order.id, onClose: onClose, className: 'is-sm' },
      h('div', { style: { display: 'grid', gap: 'var(--space-4)' } },
        h('div', { className: 'wd-2col', style: { fontSize: '14px' } },
          h('div', null, h('b', null, 'Khách hàng: '), order.customerName),
          h('div', null, h('b', null, 'Thời gian: '), order.time),
          h('div', null, h('b', null, 'Loại đơn: '), order.type === 'pos' ? 'Tại quầy' : order.type === 'pre' ? 'Đặt trước' : 'Suất ăn lớp'),
          h('div', null, h('b', null, 'Giao nhận: '), order.fulfillStatus === 'done' ? h('span', { className: 'wd-tag is-info' }, 'Đã giao') : h('span', { className: 'wd-tag is-warn' }, 'Chờ giao'))
        ),
        h('div', { className: 'wd-table-wrap', style: { border: '1px solid var(--line)' } },
          h('table', { className: 'wd-table wd-table-sm' },
            h('thead', null, h('tr', null, h('th', null, 'Món'), h('th', { className: 'c' }, 'SL'), h('th', { className: 'r' }, 'Đơn giá'), h('th', { className: 'r' }, 'Thành tiền'))),
            h('tbody', null, order.items.map(function(it, i) {
              return h('tr', { key: i }, h('td', null, it.name), h('td', { className: 'c' }, it.qty), h('td', { className: 'r' }, C.formatVND(it.price)), h('td', { className: 'r' }, C.formatVND(it.price * it.qty)));
            }))
          )
        ),
        h('div', { style: { display: 'grid', gap: '8px', textAlign: 'right', fontSize: '14px' } },
          h('div', null, 'Tổng tiền hàng: ', h('b', null, C.formatVND(order.subtotal))),
          order.discount > 0 ? h('div', null, 'Khuyến mại / Thưởng: ', h('b', { style: { color: 'var(--danger)' } }, '-' + C.formatVND(order.discount))) : null,
          h('div', { style: { fontSize: '16px' } }, 'Khách phải trả: ', h('b', { style: { color: 'var(--info)' } }, C.formatVND(order.total)))
        ),
        h('div', { className: 'cp-panel', style: { padding: '12px', background: 'var(--surface-sunken)', fontSize: '13px' } },
          h('b', null, 'Thanh toán: '), order.payMethod, ' - ', order.payStatus === 'paid' ? h('span', { className: 'wd-tag is-info' }, 'Đã thanh toán') : h('span', { className: 'wd-tag is-warn' }, 'Chờ thanh toán'),
          h('div', { style: { marginTop: '8px', borderTop: '1px solid var(--line)', paddingTop: '8px' } },
            h('b', null, 'Lịch sử thao tác:'),
            h('div', { style: { marginTop: '4px', color: 'var(--ink-muted)' } }, order.time + ' - Tạo đơn (' + order.customerType + ')'),
            order.payStatus === 'paid' ? h('div', { style: { marginTop: '4px', color: 'var(--ink-muted)' } }, order.time + ' - Thanh toán thành công') : null
          )
        ),
        h('div', { className: 'wd-dialog-foot' },
          h(C.Button, { variant: 'secondary', onClick: onClose }, 'Đóng'),
          h('div', { style: { display: 'flex', gap: '8px' } },
             h(C.Button, { variant: 'secondary', icon: 'receipt' }, 'In Bill'),
             h(C.Button, { variant: 'primary', className: 'cp-btn-danger' }, 'Hoàn tiền')
          )
        )
      )
    );
  }

  // --- OrdersTab ---
  function OrdersTab(props) {
    var [cat, setCat] = useState('all');
    var [viewing, setViewing] = useState(null);
    var dummyOrders = [
      { id: 'DH-1001', time: '09:15 07/10', type: 'pos', customerType: 'Học sinh', customerName: 'HS001 - Nguyễn Văn A', items: [{name: 'Cơm sườn', qty: 1, price: 30000}], subtotal: 30000, discount: 0, total: 30000, payMethod: 'Ví Canteen', payStatus: 'paid', fulfillStatus: 'done' },
      { id: 'DH-1002', time: '09:20 07/10', type: 'pos', customerType: 'Khách lẻ', customerName: 'Khách vãng lai', items: [{name: 'Nước suối', qty: 2, price: 5000}], subtotal: 10000, discount: 0, total: 10000, payMethod: 'Tiền mặt', payStatus: 'paid', fulfillStatus: 'done' },
      { id: 'DH-1003', time: '10:00 07/10', type: 'pre', customerType: 'Giáo viên', customerName: 'GV005 - Trần Thị B', items: [{name: 'Bún bò', qty: 1, price: 35000}], subtotal: 35000, discount: 5000, total: 30000, payMethod: 'Ví Canteen', payStatus: 'paid', fulfillStatus: 'pending' },
      { id: 'DH-1004', time: '10:30 07/10', type: 'class', customerType: 'Giáo viên', customerName: 'GV010 - Lớp 5A1', items: [{name: 'Suất ăn trưa', qty: 35, price: 30000}], subtotal: 1050000, discount: 0, total: 1050000, payMethod: 'Ví Canteen', payStatus: 'pending', fulfillStatus: 'pending' },
    ];
    var items = cat === 'all' ? dummyOrders : dummyOrders.filter(function(o) { return o.type === cat; });

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Quản lý Đơn hàng')),
      h('div', { className: 'wd-toolbar' },
        h(C.CategoryTabs, { items: [{id:'all',label:'Tất cả'},{id:'pos',label:'Tại quầy'},{id:'pre',label:'Đặt trước'},{id:'class',label:'Suất ăn lớp'}], active: cat, onChange: setCat })
      ),
      h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã ĐH / TG'), h('th', null, 'Khách hàng'), h('th', null, 'Phân loại'), h('th', { className: 'r' }, 'Tổng tiền'), h('th', null, 'Thanh toán'), h('th', null, 'Giao nhận'), h('th', { className: 'r' }, 'Chi tiết'))),
          h('tbody', null, items.map(function(o) {
            return h('tr', { key: o.id },
              h('td', null, h('b', null, o.id), h('br'), h('small', { className: 'cp-muted' }, o.time)),
              h('td', null, h('b', null, o.customerName), h('br'), h('small', { className: 'cp-muted' }, o.customerType)),
              h('td', null, h('span', { className: 'wd-tag' }, o.type === 'pos' ? 'Tại quầy' : o.type === 'pre' ? 'Đặt trước' : 'Suất ăn lớp')),
              h('td', { className: 'r cp-money' }, C.formatVND(o.total)),
              h('td', null, o.payStatus === 'paid' ? h('span', { className: 'wd-tag is-info' }, 'Đã thanh toán') : h('span', { className: 'wd-tag is-warn' }, 'Chờ thanh toán')),
              h('td', null, o.fulfillStatus === 'done' ? h('span', { className: 'wd-tag is-info' }, 'Đã giao') : h('span', { className: 'wd-tag is-warn' }, 'Chờ giao')),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', onClick: function() { setViewing(o); } }, h(C.Icon, { name: 'receipt', size: 18 })))
            );
          }))
        )
      ),
      viewing ? h(OrderDialog, { order: viewing, onClose: function() { setViewing(null); } }) : null
    );
  }

  // --- InventoryTab ---
  function InventoryTab(props) {
    var [cat, setCat] = useState('stock');

    var stock = [
      { id: 'NL-01', name: 'Thịt heo xay', type: 'Nguyên liệu', unit: 'kg', qty: 5, min: 10, expiry: '10/10/2026', status: 'Tồn thấp (Cần nhập)' },
      { id: 'NL-02', name: 'Gạo ST25', type: 'Nguyên liệu', unit: 'kg', qty: 150, min: 50, expiry: '30/12/2026', status: 'Bình thường' },
      { id: 'SP-01', name: 'Nước suối Aquafina', type: 'Hàng hóa', unit: 'Chai', qty: 45, min: 24, expiry: '05/2027', status: 'Bình thường' },
      { id: 'VT-01', name: 'Hộp xốp đựng cơm', type: 'Vật tư tiêu hao', unit: 'Cái', qty: 20, min: 100, expiry: '---', status: 'Tồn thấp (Cần nhập)' }
    ];

    var transactions = [
      { id: 'PN-1001', date: '07/10/2026', type: 'Nhập hàng', ref: 'NCC-01 (Công ty A)', items: 'Gạo ST25 (100kg), Nước suối (5 thùng)', total: 3500000, status: 'Hoàn thành' },
      { id: 'PX-1002', date: '07/10/2026', type: 'Xuất bếp', ref: 'Ca Sáng CT-CS1', items: 'Thịt heo xay (5kg), Hộp xốp (100 cái)', total: 0, status: 'Hoàn thành' },
      { id: 'KK-1003', date: '06/10/2026', type: 'Kiểm kê / Hao hụt', ref: 'NV003 (Lê Văn C)', items: 'Hủy 2kg rau (Héo)', total: 40000, status: 'Đã duyệt' }
    ];

    var suppliers = [
      { id: 'NCC-01', name: 'Công ty Thực phẩm A', type: 'Nguyên liệu tươi', contact: '0901234567', items: 'Thịt, Rau củ', debt: 15000000 },
      { id: 'NCC-02', name: 'Đại lý Nước giải khát B', type: 'Đồ uống đóng chai', contact: '0987654321', items: 'Nước suối, Nước ngọt', debt: 0 },
      { id: 'NCC-03', name: 'Cửa hàng Bao bì C', type: 'Vật tư', contact: '0912345678', items: 'Hộp xốp, Cốc nhựa', debt: 2000000 }
    ];

    var recipes = [
      { id: 'MA-01', name: 'Cơm sườn', ingredients: 'Gạo ST25 (200g), Sườn heo (150g), Hộp xốp (1 cái)', cogs: 12500, price: 30000, margin: '58%', status: 'Tự động xuất kho' },
      { id: 'MA-02', name: 'Bún bò', ingredients: 'Bún tươi (200g), Thịt bò (100g), Nước dùng (300ml), Rau (50g)', cogs: 18000, price: 35000, margin: '48%', status: 'Tự động xuất kho' },
      { id: 'SP-01', name: 'Nước suối Aquafina', ingredients: 'Nước suối (1 chai)', cogs: 3500, price: 5000, margin: '30%', status: 'Tự động xuất kho' }
    ];

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Quản lý Kho & Định lượng')),
      h('div', { className: 'wd-toolbar' },
        h(C.CategoryTabs, { items: [{id:'stock',label:'Tồn kho & Cảnh báo'},{id:'transactions',label:'Phiếu Nhập/Xuất'},{id:'recipes',label:'Định lượng & Giá vốn'},{id:'suppliers',label:'Nhà cung cấp'}], active: cat, onChange: setCat }),
        h('div', { className: 'wd-spacer' }),
        cat === 'stock' ? h(C.Button, { icon: 'alert' }, 'Đề xuất nhập hàng') : 
        cat === 'transactions' ? h(C.Button, { icon: 'plus' }, 'Lập phiếu') : 
        cat === 'recipes' ? h(C.Button, { icon: 'plus' }, 'Tạo công thức') :
        h(C.Button, { icon: 'plus' }, 'Thêm NCC')
      ),
      cat === 'stock' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã / Tên'), h('th', null, 'Phân loại'), h('th', { className: 'c' }, 'ĐVT'), h('th', { className: 'r' }, 'Tồn / Tối thiểu'), h('th', null, 'Hạn sử dụng'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, stock.map(function(s, i) {
            var isLow = s.qty < s.min;
            return h('tr', { key: i },
              h('td', null, h('b', null, s.id), h('br'), s.name),
              h('td', null, h('span', { className: 'wd-tag' }, s.type)),
              h('td', { className: 'c' }, s.unit),
              h('td', { className: 'r', style: { color: isLow ? 'var(--danger)' : 'inherit', fontWeight: isLow ? '700' : 'normal' } }, s.qty + ' / ' + s.min),
              h('td', null, s.expiry),
              h('td', null, h('span', { className: 'wd-tag' + (isLow ? ' is-danger' : ' is-info') }, s.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Kiểm kê' }, h(C.Icon, { name: 'edit', size: 18 })))
            );
          }))
        )
      ) : cat === 'transactions' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã Phiếu / Ngày'), h('th', null, 'Loại phiếu'), h('th', null, 'Tham chiếu (NCC / NV)'), h('th', null, 'Chi tiết hàng hóa'), h('th', { className: 'r' }, 'Giá trị'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, transactions.map(function(t, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, t.id), h('br'), h('small', { className: 'cp-muted' }, t.date)),
              h('td', null, h('span', { className: 'wd-tag' + (t.type === 'Nhập hàng' ? ' is-info' : t.type === 'Kiểm kê / Hao hụt' ? ' is-warn' : '') }, t.type)),
              h('td', null, t.ref),
              h('td', null, t.items),
              h('td', { className: 'r cp-money' }, t.total > 0 ? C.formatVND(t.total) : '---'),
              h('td', null, h('span', { className: 'wd-tag is-info' }, t.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'In phiếu' }, h(C.Icon, { name: 'receipt', size: 18 })))
            );
          }))
        )
      ) : cat === 'recipes' ? h('div', null,
        h('div', { className: 'cp-panel', style: { padding: '16px', background: 'var(--surface-sunken)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          h('div', null, h('div', { className: 'wd-label' }, 'Phương pháp tính giá vốn đang áp dụng:'), h('b', { style: { color: 'var(--brand)' } }, 'Bình quân gia quyền (Weighted Average)')),
          h(C.Button, { variant: 'secondary' }, 'Thay đổi')
        ),
        h('div', { className: 'wd-table-wrap' },
          h('table', { className: 'wd-table' },
            h('thead', null, h('tr', null, h('th', null, 'Mã Món / Tên'), h('th', null, 'Thành phần định lượng (BOM)'), h('th', { className: 'r' }, 'Giá vốn ước tính'), h('th', { className: 'r' }, 'Giá bán'), h('th', { className: 'r' }, 'Biên lợi nhuận'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
            h('tbody', null, recipes.map(function(r, i) {
              return h('tr', { key: i },
                h('td', null, h('b', null, r.id), h('br'), r.name),
                h('td', null, r.ingredients),
                h('td', { className: 'r cp-money', style: { color: 'var(--danger)' } }, C.formatVND(r.cogs)),
                h('td', { className: 'r cp-money', style: { color: 'var(--info)' } }, C.formatVND(r.price)),
                h('td', { className: 'r' }, h('b', { style: { color: 'var(--success)' } }, r.margin)),
                h('td', null, h('span', { className: 'wd-tag is-info' }, r.status)),
                h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Cập nhật' }, h(C.Icon, { name: 'edit', size: 18 })))
              );
            }))
          )
        )
      ) : h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã NCC / Tên'), h('th', null, 'Loại hàng'), h('th', null, 'Liên hệ'), h('th', null, 'Mặt hàng cung cấp'), h('th', { className: 'r' }, 'Công nợ'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, suppliers.map(function(s, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, s.id), h('br'), s.name),
              h('td', null, h('span', { className: 'wd-tag' }, s.type)),
              h('td', null, s.contact),
              h('td', null, s.items),
              h('td', { className: 'r cp-money', style: { color: s.debt > 0 ? 'var(--danger)' : 'inherit' } }, C.formatVND(s.debt)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Chi tiết' }, h(C.Icon, { name: 'edit', size: 18 })))
            );
          }))
        )
      )
    );
  }

  // --- PromoTab ---
  function PromoTab(props) {
    var [cat, setCat] = useState('promotions');
    
    var promos = [
      { id: 'KM-01', type: 'Voucher', name: 'Giảm 10% Thứ Sáu', budget: '10,000,000 ₫', used: '2,500,000 ₫', target: 'Tất cả', time: 'Mỗi T6 (00:00 - 23:59)', status: 'Đang chạy' },
      { id: 'KM-02', type: 'Khung giờ vàng', name: 'Combo Sáng -20%', budget: 'Không giới hạn', used: '5,000,000 ₫', target: 'Học sinh', time: '06:00 - 08:00 Hàng ngày', status: 'Đang chạy' },
      { id: 'KM-03', type: 'Phí giao hàng', name: 'Miễn phí giao hàng tới lớp', budget: '5,000,000 ₫', used: '5,000,000 ₫', target: 'Giáo viên', time: 'T1 - T12 / 2026', status: 'Tạm dừng (Hết ngân sách)' }
    ];

    var topups = [
      { id: 'TU-01', name: 'Nạp đầu tháng tặng 10%', condition: 'Nạp tối thiểu 200,000 ₫', target: 'Học sinh, Giáo viên', budget: '20,000,000 ₫', used: '15,000,000 ₫', status: 'Đang chạy' },
      { id: 'CB-01', name: 'Cashback 5% qua ví Canteen', condition: 'Đơn từ 50,000 ₫', target: 'Giáo viên', budget: 'Không giới hạn', used: '1,200,000 ₫', status: 'Đang chạy' }
    ];

    var manual = [
      { id: 'PD-101', time: '10:30 07/10', orderId: 'DH-2005', requestedBy: 'NV002', target: 'Giáo viên (GV005)', discount: 15000, reason: 'Khách phàn nàn đồ ăn nguội', status: 'Chờ duyệt' },
      { id: 'PD-102', time: '08:15 06/10', orderId: 'DH-1950', requestedBy: 'NV001', target: 'Khách lẻ', discount: 5000, reason: 'Quẹt thẻ lỗi, đền bù', status: 'Đã duyệt' }
    ];

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Khuyến mại & Giảm trừ')),
      h('div', { className: 'wd-toolbar' },
        h(C.CategoryTabs, { items: [{id:'promotions',label:'Voucher & Giờ vàng'},{id:'topup',label:'Thưởng nạp & Cashback'},{id:'manual',label:'Phê duyệt giảm giá'}], active: cat, onChange: setCat }),
        h('div', { className: 'wd-spacer' }),
        cat !== 'manual' ? h(C.Button, { icon: 'plus' }, 'Tạo chương trình') : null
      ),
      cat === 'promotions' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã / Loại'), h('th', null, 'Tên chương trình'), h('th', null, 'Đối tượng'), h('th', null, 'Thời hạn & Điều kiện'), h('th', { className: 'r' }, 'Ngân sách'), h('th', { className: 'r' }, 'Đã dùng'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, promos.map(function(p, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, p.id), h('br'), h('small', { className: 'cp-muted' }, p.type)),
              h('td', null, p.name),
              h('td', null, h('span', { className: 'wd-tag' }, p.target)),
              h('td', null, p.time),
              h('td', { className: 'r' }, p.budget),
              h('td', { className: 'r cp-money' }, p.used),
              h('td', null, h('span', { className: 'wd-tag' + (p.status.includes('Tạm dừng') ? ' is-warn' : ' is-info') }, p.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Chỉnh sửa' }, h(C.Icon, { name: 'edit', size: 18 })))
            );
          }))
        )
      ) : cat === 'topup' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã CT'), h('th', null, 'Tên chương trình'), h('th', null, 'Đối tượng'), h('th', null, 'Điều kiện'), h('th', { className: 'r' }, 'Ngân sách'), h('th', { className: 'r' }, 'Đã phát'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, topups.map(function(t, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, t.id)),
              h('td', null, t.name),
              h('td', null, h('span', { className: 'wd-tag' }, t.target)),
              h('td', null, t.condition),
              h('td', { className: 'r' }, t.budget),
              h('td', { className: 'r cp-money' }, t.used),
              h('td', null, h('span', { className: 'wd-tag is-info' }, t.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Chỉnh sửa' }, h(C.Icon, { name: 'edit', size: 18 })))
            );
          }))
        )
      ) : h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã YC / TG'), h('th', null, 'Mã ĐH'), h('th', null, 'NV Yêu cầu'), h('th', null, 'Khách hàng'), h('th', { className: 'r' }, 'Số tiền giảm'), h('th', null, 'Lý do'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, manual.map(function(m, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, m.id), h('br'), h('small', { className: 'cp-muted' }, m.time)),
              h('td', null, m.orderId),
              h('td', null, m.requestedBy),
              h('td', null, m.target),
              h('td', { className: 'r cp-money' }, C.formatVND(m.discount)),
              h('td', null, m.reason),
              h('td', null, h('span', { className: 'wd-tag' + (m.status === 'Chờ duyệt' ? ' is-warn' : ' is-info') }, m.status)),
              h('td', { className: 'r wd-actions' }, m.status === 'Chờ duyệt' ? h('button', { className: 'wd-icon-btn', title: 'Phê duyệt' }, h(C.Icon, { name: 'check', size: 18 })) : null)
            );
          }))
        )
      )
    );
  }

  // --- PaymentsTab ---
  function PaymentsTab(props) {
    var [cat, setCat] = useState('revenue');

    var revenue = [
      { date: '07/10/2026', total: 4500000, wallet: 3000000, cash: 1000000, qr: 500000, topup: 1200000 },
      { date: '06/10/2026', total: 4200000, wallet: 2800000, cash: 900000, qr: 500000, topup: 800000 },
    ];

    var qrRecon = [
      { id: 'DH-1005', time: '12:30 07/10', amount: 50000, ref: 'VCB-998123', status: 'Đã khớp lệnh' },
      { id: 'DH-1006', time: '13:00 07/10', amount: 35000, ref: 'VCB-998124', status: 'Đã khớp lệnh' },
      { id: 'DH-1007', time: '13:15 07/10', amount: 40000, ref: '---', status: 'Chờ thanh toán (Lỗi)' }
    ];

    var shifts = [
      { id: 'CA-101', date: '07/10', shift: 'Sáng (06:00 - 14:00)', staff: 'NV002 (Trần Thị B)', counter: 'Quầy 1', sysCash: 500000, realCash: 500000, diff: 0, status: 'Đã chốt' },
      { id: 'CA-102', date: '07/10', shift: 'Chiều (14:00 - 22:00)', staff: 'NV001 (Nguyễn Văn A)', counter: 'Quầy 1', sysCash: 500000, realCash: 480000, diff: -20000, status: 'Đã chốt (Thiếu tiền)' },
      { id: 'CA-103', date: '08/10', shift: 'Sáng (06:00 - 14:00)', staff: 'NV002 (Trần Thị B)', counter: 'Quầy 1', sysCash: 120000, realCash: 0, diff: 0, status: 'Đang mở' }
    ];

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Quản lý Ca & Thanh toán')),
      h('div', { className: 'wd-toolbar' },
        h(C.CategoryTabs, { items: [{id:'revenue',label:'Tổng hợp doanh thu'},{id:'qr_recon',label:'Đối soát QR đơn hàng'},{id:'shifts',label:'Chốt ca & Tiền mặt'}], active: cat, onChange: setCat }),
        h('div', { className: 'wd-spacer' }),
        cat === 'shifts' ? h(C.Button, { icon: 'check' }, 'Chốt ca hiện tại') : null
      ),
      cat === 'revenue' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Ngày'), h('th', { className: 'r' }, 'Tổng DT đơn hàng'), h('th', { className: 'r' }, 'Thanh toán Ví'), h('th', { className: 'r' }, 'Thanh toán Tiền mặt'), h('th', { className: 'r' }, 'Thanh toán QR (Trực tiếp)'), h('th', { className: 'r' }, 'Tiền nạp vào Ví (Top-up)'))),
          h('tbody', null, revenue.map(function(r, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, r.date)),
              h('td', { className: 'r cp-money' }, C.formatVND(r.total)),
              h('td', { className: 'r cp-money' }, C.formatVND(r.wallet)),
              h('td', { className: 'r cp-money' }, C.formatVND(r.cash)),
              h('td', { className: 'r cp-money' }, C.formatVND(r.qr)),
              h('td', { className: 'r cp-money', style: { color: 'var(--info)' } }, '+' + C.formatVND(r.topup))
            );
          }))
        )
      ) : cat === 'qr_recon' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Đơn hàng / TG'), h('th', { className: 'r' }, 'Số tiền phải thu'), h('th', null, 'Mã GD Ngân hàng'), h('th', null, 'Trạng thái đối soát'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, qrRecon.map(function(q, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, q.id), h('br'), h('small', { className: 'cp-muted' }, q.time)),
              h('td', { className: 'r cp-money' }, C.formatVND(q.amount)),
              h('td', null, h('code', null, q.ref)),
              h('td', null, h('span', { className: 'wd-tag' + (q.status.includes('Lỗi') ? ' is-danger' : ' is-info') }, q.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Kiểm tra' }, h(C.Icon, { name: 'alert', size: 18 })))
            );
          }))
        )
      ) : h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã Ca / Ngày'), h('th', null, 'Ca làm việc'), h('th', null, 'Nhân viên / Quầy'), h('th', { className: 'r' }, 'Tiền mặt (Hệ thống)'), h('th', { className: 'r' }, 'Tiền mặt (Thực thu)'), h('th', { className: 'r' }, 'Chênh lệch'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, shifts.map(function(s, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, s.id), h('br'), h('small', { className: 'cp-muted' }, s.date)),
              h('td', null, s.shift),
              h('td', null, s.staff, h('br'), h('small', { className: 'cp-muted' }, s.counter)),
              h('td', { className: 'r cp-money' }, C.formatVND(s.sysCash)),
              h('td', { className: 'r cp-money' }, C.formatVND(s.realCash)),
              h('td', { className: 'r cp-money', style: { color: s.diff < 0 ? 'var(--danger)' : s.diff > 0 ? 'var(--success)' : 'inherit' } }, s.diff !== 0 ? C.formatVND(s.diff) : '0 ₫'),
              h('td', null, h('span', { className: 'wd-tag' + (s.status.includes('Thiếu') ? ' is-danger' : s.status === 'Đang mở' ? ' is-warn' : ' is-info') }, s.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Chi tiết' }, h(C.Icon, { name: 'receipt', size: 18 })))
            );
          }))
        )
      )
    );
  }

  // --- ExpensesTab ---
  function ExpensesTab(props) {
    var [cat, setCat] = useState('operating');

    var operating = [
      { id: 'CP-101', name: 'Tiền điện Tháng 9', amount: 4500000, type: 'Cố định', target: 'CT-CS1', status: 'Đã thanh toán', doc: 'Hóa đơn EVN' },
      { id: 'CP-102', name: 'Phí vệ sinh, bảo vệ', amount: 2000000, type: 'Cố định', target: 'Phân bổ (Hệ thống)', status: 'Chờ duyệt', doc: 'Phiếu thu DV' },
      { id: 'CP-103', name: 'Sửa bồn rửa chén', amount: 350000, type: 'Phát sinh', target: 'CT-CS2', status: 'Đã thanh toán', doc: 'Hóa đơn lẻ' }
    ];

    var payroll = [
      { id: 'NV001', name: 'Nguyễn Văn A', position: 'Quản lý', shifts: 24, salary: 8000000, bonus: 1500000, ins: -500000, total: 9000000, status: 'Đã thanh toán' },
      { id: 'NV002', name: 'Trần Thị B', position: 'Thu ngân', shifts: 26, salary: 6500000, bonus: 0, ins: -300000, total: 6200000, status: 'Chờ duyệt bảng lương' }
    ];

    var approvals = [
      { id: 'DN-101', time: '14:00 07/10', requestedBy: 'Phạm Văn D', item: 'Tạm ứng mua nguyên liệu', amount: 2000000, target: 'CT-CS2', status: 'Chờ duyệt' },
      { id: 'DN-102', time: '09:00 06/10', requestedBy: 'NV001', item: 'Phí vệ sinh, bảo vệ (Hệ thống)', amount: 2000000, target: 'Phân bổ 50/50', status: 'Chờ duyệt' }
    ];

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Quản lý Chi phí & Lương')),
      h('div', { className: 'wd-toolbar' },
        h(C.CategoryTabs, { items: [{id:'operating',label:'Chi phí vận hành'},{id:'approvals',label:'Phê duyệt đề nghị chi'},{id:'payroll',label:'Bảng lương & Thưởng'}], active: cat, onChange: setCat }),
        h('div', { className: 'wd-spacer' }),
        cat === 'operating' ? h(C.Button, { icon: 'plus' }, 'Tạo đề nghị chi') : 
        cat === 'payroll' ? h(C.Button, { icon: 'clock' }, 'Chấm công') : null
      ),
      cat === 'operating' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã / Tên chi phí'), h('th', null, 'Loại chi phí'), h('th', null, 'Phạm vi phân bổ'), h('th', null, 'Chứng từ'), h('th', { className: 'r' }, 'Số tiền'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, operating.map(function(o, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, o.id), h('br'), o.name),
              h('td', null, h('span', { className: 'wd-tag' }, o.type)),
              h('td', null, o.target),
              h('td', null, h('a', { href: '#' }, o.doc)),
              h('td', { className: 'r cp-money' }, C.formatVND(o.amount)),
              h('td', null, h('span', { className: 'wd-tag' + (o.status === 'Chờ duyệt' ? ' is-warn' : ' is-info') }, o.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Chi tiết' }, h(C.Icon, { name: 'edit', size: 18 })))
            );
          }))
        )
      ) : cat === 'approvals' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã ĐN / Thời gian'), h('th', null, 'Người đề nghị'), h('th', null, 'Nội dung chi'), h('th', null, 'Phân bổ'), h('th', { className: 'r' }, 'Số tiền'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, approvals.map(function(a, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, a.id), h('br'), h('small', { className: 'cp-muted' }, a.time)),
              h('td', null, a.requestedBy),
              h('td', null, a.item),
              h('td', null, a.target),
              h('td', { className: 'r cp-money' }, C.formatVND(a.amount)),
              h('td', null, h('span', { className: 'wd-tag is-warn' }, a.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Phê duyệt' }, h(C.Icon, { name: 'check', size: 18 })))
            );
          }))
        )
      ) : h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã NV / Tên'), h('th', null, 'Vị trí'), h('th', { className: 'c' }, 'Số công (Ca)'), h('th', { className: 'r' }, 'Lương cơ bản'), h('th', { className: 'r' }, 'Thưởng DT (KPI)'), h('th', { className: 'r' }, 'Khấu trừ (BH/CĐ)'), h('th', { className: 'r' }, 'Thực lĩnh'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, payroll.map(function(p, i) {
            return h('tr', { key: i },
              h('td', null, h('b', null, p.id), h('br'), p.name),
              h('td', null, h('span', { className: 'wd-tag' }, p.position)),
              h('td', { className: 'c' }, p.shifts),
              h('td', { className: 'r cp-money' }, C.formatVND(p.salary)),
              h('td', { className: 'r cp-money', style: { color: 'var(--success)' } }, p.bonus > 0 ? '+' + C.formatVND(p.bonus) : '0 ₫'),
              h('td', { className: 'r cp-money', style: { color: 'var(--danger)' } }, C.formatVND(p.ins)),
              h('td', { className: 'r cp-money', style: { color: 'var(--info)' } }, C.formatVND(p.total)),
              h('td', null, h('span', { className: 'wd-tag' + (p.status.includes('Chờ') ? ' is-warn' : ' is-info') }, p.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Phiếu lương' }, h(C.Icon, { name: 'receipt', size: 18 })))
            );
          }))
        )
      )
    );
  }

  // --- AccountingTab ---
  function AccountingTab(props) {
    var [cat, setCat] = useState('vibetech');
    
    function renderVibeTech() {
      return h('div', { className: 'wd-report-content', style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' } },
        h('div', { className: 'cp-panel' },
          h('div', { style: { padding: 'var(--space-4)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            h('h3', {style:{margin:0}}, 'Bảng kê phí dịch vụ Vibe Tech - Tháng 10/2026'),
            h('div', null,
              h('button', { className: 'cp-btn cp-btn-secondary', style: {marginRight: '8px'}, onClick: function() { alert('Đã gửi yêu cầu tra soát phí cho Vibe Tech.'); } }, 'Yêu cầu tra soát'),
              h('button', { className: 'cp-btn cp-btn-primary', onClick: function() { alert('Xác nhận bảng tính phí thành công!'); } }, 'Xác nhận bảng tính')
            )
          ),
          h('div', { className: 'wd-table-wrap' },
            h('table', { className: 'wd-table' },
              h('thead', null, h('tr', null, h('th', null, 'Dịch vụ'), h('th', null, 'Khối lượng'), h('th', null, 'Đơn giá'), h('th', null, 'Thành tiền'), h('th', null, 'Ghi chú'))),
              h('tbody', null,
                h('tr', null, h('td', null, 'Phí sử dụng nền tảng (SaaS)'), h('td', null, '1 tháng'), h('td', null, C.formatVND(500000)), h('td', {style:{fontWeight:'bold'}}, C.formatVND(500000)), h('td', null, 'Gói tiêu chuẩn')),
                h('tr', null, h('td', null, 'Phí xử lý giao dịch ví'), h('td', null, '1,420 GD'), h('td', null, C.formatVND(1000)), h('td', {style:{fontWeight:'bold'}}, C.formatVND(1420000)), h('td', null, 'Theo thực tế phát sinh')),
                h('tr', {style: {background: 'var(--surface-sunken)'}}, h('td', {colSpan:3, style:{fontWeight:'bold', textAlign:'right'}}, 'Tổng phí phải trả:'), h('td', {style:{fontWeight:'bold', color:'var(--danger)'}}, C.formatVND(1920000)), h('td', null, h('button', { className: 'cp-btn cp-btn-secondary cp-btn-sm', onClick: function() { alert('Đã ghi nhận vào chi phí hoạt động kinh doanh'); } }, 'Ghi nhận chi phí')))
              )
            )
          )
        )
      );
    }

    function renderGeneral() {
      return h('div', { className: 'wd-report-content', style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' } },
        h('div', { className: 'wd-kpis' },
          h('div', { className: 'wd-kpi' }, h('label', null, h(C.Icon, {name:'receipt', size:16}), 'Thu nhập khác'), h('div', { className: 'wd-kpi-val' }, C.formatVND(800000))),
          h('div', { className: 'wd-kpi' }, h('label', null, h(C.Icon, {name:'bag', size:16}), 'Chi phí tài chính'), h('div', { className: 'wd-kpi-val' }, C.formatVND(150000))),
          h('div', { className: 'wd-kpi' }, h('label', null, h(C.Icon, {name:'card', size:16}), 'Thuế GTGT/TNDN tạm tính'), h('div', { className: 'wd-kpi-val' }, C.formatVND(1250000)))
        ),
        h('div', { className: 'cp-panel' },
           h('div', { style: { padding: 'var(--space-4)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            h('h3', {style:{margin:0}}, 'Khóa sổ kỳ kế toán'),
            h('button', { className: 'cp-btn cp-btn-danger', onClick: function() { alert('Đã khóa sổ kỳ kế toán. Không thể thay đổi giao dịch gốc.'); } }, h(C.Icon, {name:'lock', size:16}), ' Khóa sổ (Lock Period)')
          ),
          h('div', { style: { padding: 'var(--space-4)' } },
            h('p', null, 'Tình trạng: ', h('strong', {style:{color:'var(--success)'}}, 'Đang mở (Tháng 10/2026)')),
            h('p', {className: 'cp-muted'}, 'Sau khi khóa sổ, các điều chỉnh sẽ phải hạch toán vào kỳ tiếp theo. Hệ thống sẽ chốt báo cáo thuế và kết quả kinh doanh.')
          )
        )
      );
    }

    function renderIntegration() {
      return h('div', { className: 'wd-report-content', style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' } },
        h('div', { className: 'cp-panel' },
          h('div', { style: { padding: 'var(--space-4)', borderBottom: '1px solid var(--line)' } },
            h('h3', {style:{margin:0}}, 'Kết nối phần mềm kế toán')
          ),
          h('div', { style: { padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '16px' } },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-sunken)', padding: '16px', borderRadius: '8px' } },
              h('div', null, h('b', {style:{fontSize:'16px'}}, 'MISA AMIS'), h('p', {className:'cp-muted', style:{margin:'4px 0 0 0'}}, 'Đồng bộ hóa đơn, phiếu nhập/xuất và danh mục khách hàng.')),
              h('button', { className: 'cp-btn cp-btn-primary', onClick: function() { alert('Đã kết nối tới MISA AMIS'); } }, 'Đang kết nối')
            ),
            h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-sunken)', padding: '16px', borderRadius: '8px' } },
              h('div', null, h('b', {style:{fontSize:'16px'}}, 'FAST Accounting'), h('p', {className:'cp-muted', style:{margin:'4px 0 0 0'}}, 'Đồng bộ chứng từ kế toán qua API.')),
              h('button', { className: 'cp-btn', onClick: function() { alert('Bắt đầu cấu hình kết nối FAST'); } }, 'Thiết lập kết nối')
            )
          )
        )
      );
    }

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, 
        h('div', null, h('h2', {style:{margin:0}}, 'Kế toán & Phí dịch vụ')),
        h('div', { className: 'wd-tabs', style: {marginTop:'16px'} },
          h('button', { className: 'wd-tab ' + (cat==='vibetech'?'is-active':''), onClick: function(){setCat('vibetech')} }, 'Phí Vibe Tech'),
          h('button', { className: 'wd-tab ' + (cat==='general'?'is-active':''), onClick: function(){setCat('general')} }, 'KT Tổng hợp & Thuế'),
          h('button', { className: 'wd-tab ' + (cat==='integration'?'is-active':''), onClick: function(){setCat('integration')} }, 'Kết nối MISA/FAST')
        )
      ),
      h('div', { className: 'wd-body', style: { padding: 'var(--space-4)' } },
        cat === 'vibetech' ? renderVibeTech() :
        cat === 'general' ? renderGeneral() :
        renderIntegration()
      )
    );
  }

  // --- SystemTab ---
  function SystemTab(props) {
    var [cat, setCat] = useState('canteens');
    
    var canteens = [
      { id: 'CT-CS1', name: 'Canteen Cơ sở 1 (Cấp 2)', manager: 'Nguyễn Văn A', status: 'Hoạt động', revenue: 15420000 },
      { id: 'CT-CS2', name: 'Canteen Cơ sở 2 (Cấp 3)', manager: 'Phạm Văn D', status: 'Hoạt động', revenue: 21500000 },
    ];
    
    var staff = [
      { id: 'NV001', name: 'Nguyễn Văn A', roles: ['Quản lý', 'Phê duyệt'], canteen: 'Tất cả', status: 'Hoạt động' },
      { id: 'NV002', name: 'Trần Thị B', roles: ['Bán hàng (POS)'], canteen: 'CT-CS1', status: 'Hoạt động' },
      { id: 'NV003', name: 'Lê Văn C', roles: ['Quản lý kho'], canteen: 'CT-CS1', status: 'Hoạt động' },
      { id: 'NV004', name: 'Hoàng Thị E', roles: ['Kế toán'], canteen: 'Tất cả', status: 'Hoạt động' }
    ];

    var logs = [
      { time: '14:30 07/10', user: 'NV001 (Nguyễn Văn A)', action: 'Phê duyệt đơn hoàn tiền DH-1004', target: 'Đơn hàng', canteen: 'CT-CS1' },
      { time: '10:15 07/10', user: 'NV003 (Lê Văn C)', action: 'Cập nhật định lượng món Cơm sườn', target: 'Kho & Định lượng', canteen: 'CT-CS1' },
      { time: '09:00 07/10', user: 'NV004 (Hoàng Thị E)', action: 'Xuất báo cáo doanh thu tuần', target: 'Báo cáo', canteen: 'Hệ thống' }
    ];

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Quản lý Canteen & Nhân sự')),
      h('div', { className: 'wd-toolbar' },
        h(C.CategoryTabs, { items: [{id:'canteens',label:'Danh sách Canteen'},{id:'staff',label:'Nhân viên & Phân quyền'},{id:'logs',label:'Nhật ký hoạt động (Audit)'}], active: cat, onChange: setCat }),
        h('div', { className: 'wd-spacer' }),
        h(C.Button, { icon: 'plus' }, cat === 'canteens' ? 'Thêm Canteen' : cat === 'staff' ? 'Thêm Nhân viên' : 'Xuất lịch sử')
      ),
      cat === 'canteens' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã Canteen'), h('th', null, 'Tên Canteen'), h('th', null, 'Người quản lý'), h('th', { className: 'r' }, 'Doanh thu tham khảo'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, canteens.map(function(c) {
            return h('tr', { key: c.id },
              h('td', null, h('b', null, c.id)),
              h('td', null, c.name),
              h('td', null, c.manager),
              h('td', { className: 'r cp-money' }, C.formatVND(c.revenue)),
              h('td', null, h('span', { className: 'wd-tag is-info' }, c.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Sửa' }, h(C.Icon, { name: 'edit', size: 18 })))
            );
          }))
        )
      ) : cat === 'staff' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã NV / Đăng nhập'), h('th', null, 'Họ tên'), h('th', null, 'Phân quyền'), h('th', null, 'Canteen làm việc'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, staff.map(function(s) {
            return h('tr', { key: s.id },
              h('td', null, h('b', null, s.id)),
              h('td', null, s.name),
              h('td', null, h('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap' } }, s.roles.map(function(r, i) {
                return h('span', { key: i, className: 'wd-tag' + (r === 'Quản lý' || r === 'Phê duyệt' ? ' is-info' : '') }, r);
              }))),
              h('td', null, s.canteen),
              h('td', null, h('span', { className: 'wd-tag is-info' }, s.status)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Phân quyền' }, h(C.Icon, { name: 'edit', size: 18 })))
            );
          }))
        )
      ) : h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Thời gian'), h('th', null, 'Người thực hiện'), h('th', null, 'Hành động'), h('th', null, 'Phân hệ'), h('th', null, 'Canteen'))),
          h('tbody', null, logs.map(function(l, i) {
            return h('tr', { key: i },
              h('td', null, l.time),
              h('td', null, h('b', null, l.user)),
              h('td', null, l.action),
              h('td', null, l.target),
              h('td', null, l.canteen)
            );
          }))
        )
      )
    );
  }

  // --- WalletTab ---
  function WalletTab(props) {
    var [cat, setCat] = useState('balances');
    
    var balances = [
      { id: 'HS001', name: 'Nguyễn Văn A', type: 'Học sinh', realBalance: 150000, promoBalance: 20000, total: 170000 },
      { id: 'GV005', name: 'Trần Thị B', type: 'Giáo viên', realBalance: 500000, promoBalance: 0, total: 500000 },
      { id: 'HS002', name: 'Lê Tuấn C', type: 'Học sinh', realBalance: 0, promoBalance: 5000, total: 5000 },
    ];
    
    var transactions = [
      { id: 'GD-101', time: '14:20 07/10', user: 'HS001 - Nguyễn Văn A', type: 'Nạp tiền', amount: 100000, source: 'Chuyển khoản NH', status: 'Thành công' },
      { id: 'GD-102', time: '09:15 07/10', user: 'HS001 - Nguyễn Văn A', type: 'Chi tiêu', amount: -30000, source: 'Thanh toán đơn DH-1001', status: 'Thành công' },
      { id: 'GD-103', time: '08:00 07/10', user: 'GV005 - Trần Thị B', type: 'Hoàn tiền', amount: 35000, source: 'Hủy đơn DH-1004', status: 'Thành công' },
      { id: 'GD-104', time: '07:30 07/10', user: 'HS002 - Lê Tuấn C', type: 'Điều chỉnh', amount: 5000, source: 'Thưởng nạp lần đầu (Promo)', status: 'Thành công' }
    ];

    var refunds = [
      { id: 'YC-501', time: '15:00 07/10', user: 'GV005 - Trần Thị B', amount: 500000, reason: 'Nghỉ hưu, rút số dư', status: 'Chờ duyệt' },
      { id: 'YC-502', time: '09:30 06/10', user: 'HS002 - Lê Tuấn C', amount: 150000, reason: 'Chuyển trường', status: 'Đã hoàn' }
    ];

    return h('div', { className: 'wd-page' },
      h('div', { className: 'wd-head' }, h('h2', {style:{margin:0}}, 'Quản lý Ví & Nạp tiền')),
      h('div', { className: 'wd-toolbar' },
        h(C.CategoryTabs, { items: [{id:'balances',label:'Số dư người dùng'},{id:'transactions',label:'Lịch sử giao dịch'},{id:'reconciliation',label:'Đối soát ngân hàng'},{id:'refunds',label:'Yêu cầu hoàn trả'}], active: cat, onChange: setCat }),
        h('div', { className: 'wd-spacer' }),
        cat === 'balances' ? h(C.Button, { icon: 'plus' }, 'Cộng/Trừ tiền') : 
        cat === 'reconciliation' ? h(C.Button, { icon: 'check' }, 'Khớp lệnh NH') : null
      ),
      cat === 'balances' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Khách hàng'), h('th', null, 'Phân loại'), h('th', { className: 'r' }, 'Tiền thật (Nạp)'), h('th', { className: 'r' }, 'Tiền thưởng (Promo)'), h('th', { className: 'r' }, 'Tổng khả dụng'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, balances.map(function(b) {
            return h('tr', { key: b.id },
              h('td', null, h('b', null, b.id), ' - ', b.name),
              h('td', null, h('span', { className: 'wd-tag' }, b.type)),
              h('td', { className: 'r cp-money' }, C.formatVND(b.realBalance)),
              h('td', { className: 'r cp-money', style: { color: 'var(--success)' } }, C.formatVND(b.promoBalance)),
              h('td', { className: 'r cp-money', style: { color: 'var(--info)' } }, C.formatVND(b.total)),
              h('td', { className: 'r wd-actions' }, h('button', { className: 'wd-icon-btn', title: 'Lịch sử' }, h(C.Icon, { name: 'receipt', size: 18 })))
            );
          }))
        )
      ) : cat === 'transactions' ? h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã GD / Thời gian'), h('th', null, 'Khách hàng'), h('th', null, 'Loại GD'), h('th', null, 'Nguồn / Ghi chú'), h('th', { className: 'r' }, 'Số tiền (+/-)'), h('th', null, 'Trạng thái'))),
          h('tbody', null, transactions.map(function(t) {
            return h('tr', { key: t.id },
              h('td', null, h('b', null, t.id), h('br'), h('small', { className: 'cp-muted' }, t.time)),
              h('td', null, t.user),
              h('td', null, h('span', { className: 'wd-tag' + (t.type === 'Nạp tiền' || t.type === 'Hoàn tiền' ? ' is-info' : t.type === 'Chi tiêu' ? ' is-warn' : '') }, t.type)),
              h('td', null, t.source),
              h('td', { className: 'r cp-money', style: { color: t.amount > 0 ? 'var(--success)' : 'var(--danger)' } }, (t.amount > 0 ? '+' : '') + C.formatVND(t.amount)),
              h('td', null, h('span', { className: 'wd-tag is-info' }, t.status))
            );
          }))
        )
      ) : cat === 'reconciliation' ? h('div', { className: 'wd-section', style: { padding: 'var(--space-4)' } },
        h('div', { className: 'wd-3col', style: { marginBottom: 'var(--space-4)' } },
          h('div', { className: 'cp-panel', style: { padding: '16px', background: 'var(--surface-sunken)' } }, h('div', { className: 'wd-label' }, 'Tổng tiền thật trên ví'), h('h3', { style: { margin: '8px 0 0', color: 'var(--info)' } }, C.formatVND(650000))),
          h('div', { className: 'cp-panel', style: { padding: '16px', background: 'var(--surface-sunken)' } }, h('div', { className: 'wd-label' }, 'Tổng giao dịch NH đã ghi nhận'), h('h3', { style: { margin: '8px 0 0', color: 'var(--success)' } }, C.formatVND(650000))),
          h('div', { className: 'cp-panel', style: { padding: '16px', background: 'var(--surface-sunken)' } }, h('div', { className: 'wd-label' }, 'Độ lệch (Chờ xử lý / Lỗi)'), h('h3', { style: { margin: '8px 0 0', color: 'var(--danger)' } }, C.formatVND(0)))
        ),
        h('h3', null, 'Lịch sử sao kê & Khớp lệnh NH'),
        h('p', { className: 'cp-muted' }, 'Danh sách các giao dịch chuyển khoản đã tự động khớp lệnh cộng tiền vào ví người dùng trong ngày.')
      ) : h('div', { className: 'wd-table-wrap' },
        h('table', { className: 'wd-table' },
          h('thead', null, h('tr', null, h('th', null, 'Mã YC / Thời gian'), h('th', null, 'Khách hàng'), h('th', { className: 'r' }, 'Số tiền rút'), h('th', null, 'Lý do'), h('th', null, 'Trạng thái'), h('th', { className: 'r' }, 'Thao tác'))),
          h('tbody', null, refunds.map(function(r) {
            return h('tr', { key: r.id },
              h('td', null, h('b', null, r.id), h('br'), h('small', { className: 'cp-muted' }, r.time)),
              h('td', null, r.user),
              h('td', { className: 'r cp-money' }, C.formatVND(r.amount)),
              h('td', null, r.reason),
              h('td', null, r.status === 'Chờ duyệt' ? h('span', { className: 'wd-tag is-warn' }, r.status) : h('span', { className: 'wd-tag is-info' }, r.status)),
              h('td', { className: 'r wd-actions' }, r.status === 'Chờ duyệt' ? h('button', { className: 'wd-icon-btn', title: 'Phê duyệt' }, h(C.Icon, { name: 'check', size: 18 })) : null)
            );
          }))
        )
      )
    );
  }

  // --- Main App ---
  function App() {
    var [data, setData] = useState(function() { return WD.load(); });
    var [tab, setTab] = useState('reports');
    
    useEffect(function() {
      WD.save(data);
      document.documentElement.classList.remove('dark'); // Force Light Mode
    }, [data]);

    return h('div', { className: 'wd-app' },
      h('aside', { className: 'wd-sidebar' },
        h('div', { className: 'wd-sidebar-logo' }, 
           h('b', null, 'Canteen ', h('span', {style:{color:'#3b82f6'}}, 'POS')), 
           h('div', { style: { fontSize: '10px', color: '#9ca3af', letterSpacing: '0.05em', marginTop: '4px' } }, 'QUẢN LÝ ĐỐI TÁC')
        ),
        h('div', { className: 'wd-sidebar-menu' },
          h('div', { className: 'wd-sidebar-label' }, 'TỔNG QUAN'),
          h('button', { className: cx('wd-sidebar-btn', tab==='reports' && 'is-active'), onClick: function(){setTab('reports');} }, h(C.Icon, {name:'home', size:16}), 'Tổng quan'),
          h('button', { className: cx('wd-sidebar-btn', tab==='pending' && 'is-active') }, h(C.Icon, {name:'clock', size:16}), 'Việc chờ duyệt'),
          
          h('div', { className: 'wd-sidebar-label' }, 'VẬN HÀNH'),
          h('button', { className: cx('wd-sidebar-btn', tab==='system' && 'is-active'), onClick: function(){setTab('system');} }, h(C.Icon, {name:'home', size:16}), 'Canteen & nhân viên'),
          h('button', { className: cx('wd-sidebar-btn', tab==='accounts' && 'is-active'), onClick: function(){setTab('accounts');} }, h(C.Icon, {name:'users', size:16}), 'HS, GV & phụ huynh'),
          h('button', { className: cx('wd-sidebar-btn', tab==='menu' && 'is-active'), onClick: function(){setTab('menu');} }, h(C.Icon, {name:'bag', size:16}), 'Thực đơn & giá'),
          h('button', { className: cx('wd-sidebar-btn', tab==='orders' && 'is-active'), onClick: function(){setTab('orders');} }, h(C.Icon, {name:'doc', size:16}), 'Đơn hàng'),

          h('div', { className: 'wd-sidebar-label' }, 'TÀI CHÍNH'),
          h('button', { className: cx('wd-sidebar-btn', tab==='wallet' && 'is-active'), onClick: function(){setTab('wallet');} }, h(C.Icon, {name:'cash', size:16}), 'Tiền nạp & số dư'),
          h('button', { className: cx('wd-sidebar-btn', tab==='payments' && 'is-active'), onClick: function(){setTab('payments');} }, h(C.Icon, {name:'card', size:16}), 'Thanh toán & ca'),
          h('button', { className: cx('wd-sidebar-btn', tab==='promo' && 'is-active'), onClick: function(){setTab('promo');} }, h(C.Icon, {name:'star', size:16}), 'Khuyến mại & giảm trừ'),

          h('div', { className: 'wd-sidebar-label' }, 'KHO & GIÁ VỐN'),
          h('button', { className: cx('wd-sidebar-btn', tab==='inventory' && 'is-active'), onClick: function(){setTab('inventory');} }, h(C.Icon, {name:'archive', size:16}), 'Kho & nhà cung cấp'),
          h('button', { className: cx('wd-sidebar-btn', tab==='recipes' && 'is-active') }, h(C.Icon, {name:'clipboard', size:16}), 'Định lượng & giá vốn'),

          h('div', { className: 'wd-sidebar-label' }, 'QUẢN TRỊ'),
          h('button', { className: cx('wd-sidebar-btn', tab==='expenses' && 'is-active'), onClick: function(){setTab('expenses');} }, h(C.Icon, {name:'doc', size:16}), 'Chi phí & nhân sự'),
          h('button', { className: cx('wd-sidebar-btn', tab==='accounting' && 'is-active'), onClick: function(){setTab('accounting');} }, h(C.Icon, {name:'pie-chart', size:16}), 'Báo cáo lãi lỗ'),
          h('button', { className: cx('wd-sidebar-btn', tab==='fees' && 'is-active') }, h(C.Icon, {name:'settings', size:16}), 'Kế toán & phí dịch vụ')
        )
      ),
      h('div', { className: 'wd-main-wrapper' },
        h('header', { className: 'wd-main-header' },
          h('div', { className: 'wd-header-left' },
            h('button', { className: 'wd-canteen-select' }, h(C.Icon, {name:'home', size:16}), ' Tất cả canteen ', h(C.Icon, {name:'chevron-down', size:16})),
            h('div', { className: 'wd-date-seg' }, 
              h('button', null, 'Hôm nay'),
              h('button', { className: 'is-active' }, '7 ngày'),
              h('button', null, '30 ngày')
            )
          ),
          h('div', { className: 'wd-header-right' },
            h('button', { className: 'wd-icon-btn', style:{background:'#fff', border:'1px solid var(--line)', borderRadius:'50%', width:'32px', height:'32px'} }, h(C.Icon, {name:'bell', size:16})),
            h('div', { className: 'wd-user-profile' },
              h('div', { className: 'wd-avatar', style:{background:'#e0e7ff', color:'#3b82f6', width:'32px', height:'32px'} }, 'T'),
              h('div', { className: 'wd-user-info' },
                h('b', null, 'Chủ Quán Test'),
                h('small', {style:{color:'#6b7280', fontSize:'12px', display:'block', fontWeight:400}}, 'Chủ canteen')
              ),
              h(C.Icon, {name:'chevron-down', size:16, style:{color:'#9ca3af'}})
            )
          )
        ),
        h('main', { className: 'wd-main-content' },
          tab === 'reports' ? h(ReportsTab, { data: data }) :
          tab === 'orders' ? h(OrdersTab, { data: data }) :
          tab === 'menu' ? h(MenuTab, { data: data, setData: setData }) :
          tab === 'inventory' ? h(InventoryTab, { data: data }) :
          tab === 'promo' ? h(PromoTab, { data: data }) :
          tab === 'wallet' ? h(WalletTab, { data: data }) :
          tab === 'payments' ? h(PaymentsTab, { data: data }) :
          tab === 'expenses' ? h(ExpensesTab, { data: data }) :
          tab === 'accounting' ? h(AccountingTab, { data: data }) :
          tab === 'accounts' ? h(AccountsTab, { data: data, setData: setData }) :
          tab === 'system' ? h(SystemTab, { data: data }) :
          tab === 'import' ? h(ImportTab, { data: data, setData: setData }) : null
        )
      )
    );
  }

  window.ReactDOM.render(h(App), document.getElementById('root'));
})();
