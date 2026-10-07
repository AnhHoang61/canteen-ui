/* xlsx-lite — đọc/ghi Excel tối giản, không cần thư viện ngoài, chạy offline.
   window.XlsxLite.read(file)  -> Promise<string[][]>   (đọc sheet đầu tiên của .xlsx, hoặc file .csv)
   window.XlsxLite.write(sheets) -> Blob                 (sheets: [{ name, rows: any[][], widths?: number[] }])
   window.XlsxLite.download(blob, filename)
   Đọc .xlsx dùng DecompressionStream('deflate-raw') có sẵn trong Chrome/Edge/Firefox/Safari bản mới. */
(function () {
  var dec = new TextDecoder('utf-8'), enc = new TextEncoder();

  /* ---------- ZIP đọc ---------- */
  function unzip(buf) {
    var dv = new DataView(buf), u8 = new Uint8Array(buf), eocd = -1;
    for (var i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) { if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; } }
    if (eocd < 0) throw new Error('File không phải định dạng .xlsx hợp lệ');
    var n = dv.getUint16(eocd + 10, true), off = dv.getUint32(eocd + 16, true), files = {};
    for (var k = 0; k < n; k++) {
      var nlen = dv.getUint16(off + 28, true), xlen = dv.getUint16(off + 30, true), clen = dv.getUint16(off + 32, true);
      files[dec.decode(u8.subarray(off + 46, off + 46 + nlen))] = { method: dv.getUint16(off + 10, true), size: dv.getUint32(off + 20, true), lho: dv.getUint32(off + 42, true) };
      off += 46 + nlen + xlen + clen;
    }
    function get(name) {
      var f = files[name]; if (!f) return Promise.resolve(null);
      var l = f.lho, start = l + 30 + dv.getUint16(l + 26, true) + dv.getUint16(l + 28, true), data = u8.slice(start, start + f.size);
      if (f.method === 0) return Promise.resolve(dec.decode(data));
      if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error('Trình duyệt chưa hỗ trợ đọc .xlsx — lưu file dạng .csv rồi tải lại'));
      return new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer().then(function (b) { return dec.decode(b); });
    }
    return { files: files, get: get };
  }

  function xml(s) { return new DOMParser().parseFromString(s, 'application/xml'); }
  function colIndex(ref) { var m = /^([A-Z]+)/.exec(ref || ''), n = 0; if (!m) return -1; for (var i = 0; i < m[1].length; i++) n = n * 26 + (m[1].charCodeAt(i) - 64); return n - 1; }

  function readXlsx(buf) {
    var z = unzip(buf);
    return Promise.all([z.get('xl/workbook.xml'), z.get('xl/_rels/workbook.xml.rels'), z.get('xl/sharedStrings.xml')]).then(function (r) {
      var target = 'xl/worksheets/sheet1.xml';
      if (r[0] && r[1]) {
        var sheet = xml(r[0]).getElementsByTagName('sheet')[0];
        var rid = sheet && (sheet.getAttribute('r:id') || sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id'));
        var rels = xml(r[1]).getElementsByTagName('Relationship');
        for (var i = 0; i < rels.length; i++) if (rels[i].getAttribute('Id') === rid) { var t = rels[i].getAttribute('Target'); target = t.charAt(0) === '/' ? t.slice(1) : 'xl/' + t.replace(/^\.\//, ''); }
      }
      var shared = [];
      if (r[2]) { var si = xml(r[2]).getElementsByTagName('si'); for (var j = 0; j < si.length; j++) { var ts = si[j].getElementsByTagName('t'), s = ''; for (var q = 0; q < ts.length; q++) s += ts[q].textContent; shared.push(s); } }
      return z.get(target).then(function (sx) {
        if (!sx) throw new Error('Không tìm thấy trang tính trong file');
        var rows = xml(sx).getElementsByTagName('row'), out = [];
        for (var a = 0; a < rows.length; a++) {
          var rn = Number(rows[a].getAttribute('r')) || a + 1, cells = rows[a].getElementsByTagName('c'), line = [];
          for (var b = 0; b < cells.length; b++) {
            var c = cells[b], t = c.getAttribute('t'), ci = colIndex(c.getAttribute('r')); if (ci < 0) ci = b;
            var v = c.getElementsByTagName('v')[0], val = '';
            if (t === 's') val = v ? shared[Number(v.textContent)] || '' : '';
            else if (t === 'inlineStr') { var is = c.getElementsByTagName('t'); for (var w = 0; w < is.length; w++) val += is[w].textContent; }
            else val = v ? v.textContent : '';
            line[ci] = String(val);
          }
          for (var f = 0; f < line.length; f++) if (line[f] == null) line[f] = '';
          out[rn - 1] = line;
        }
        for (var g = 0; g < out.length; g++) if (!out[g]) out[g] = [];
        return out;
      });
    });
  }

  function readCsv(text) {
    text = text.replace(/^\uFEFF/, '');
    var first = text.split(/\r?\n/)[0] || '', delim = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : (first.indexOf('\t') >= 0 && first.indexOf(',') < 0 ? '\t' : ',');
    var rows = [], row = [], cur = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true;
      else if (ch === delim) { row.push(cur); cur = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
      else cur += ch;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }

  function read(file) {
    return file.arrayBuffer().then(function (buf) {
      var u8 = new Uint8Array(buf);
      if (u8[0] === 0x50 && u8[1] === 0x4b) return readXlsx(buf);
      if (/\.xls$/i.test(file.name)) throw new Error('File .xls (Excel 97–2003) chưa hỗ trợ — mở bằng Excel và lưu lại dạng .xlsx');
      return readCsv(dec.decode(buf));
    });
  }

  /* ---------- ZIP ghi (không nén) ---------- */
  var CRC;
  function crc32(u8) {
    if (!CRC) { CRC = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c >>> 0; } }
    var x = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) x = CRC[(x ^ u8[i]) & 255] ^ (x >>> 8);
    return (x ^ 0xFFFFFFFF) >>> 0;
  }
  function zip(entries, type) {
    var parts = [], central = [], off = 0, csize = 0;
    entries.forEach(function (e) {
      var name = enc.encode(e.name), data = enc.encode(e.data), crc = crc32(data);
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(12, 0x21, true);
      lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, name.length, true);
      parts.push(lh.buffer, name, data);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(14, 0x21, true);
      ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, name.length, true); ch.setUint32(42, off, true);
      central.push(ch.buffer, name); csize += 46 + name.length;
      off += 30 + name.length + data.length;
    });
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true); end.setUint32(12, csize, true); end.setUint32(16, off, true);
    return new Blob(parts.concat(central, [end.buffer]), { type: type });
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); }
  function colName(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function sheetXml(sh) {
    var cols = (sh.widths || []).map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('');
    var rows = sh.rows.map(function (r, ri) {
      return '<row r="' + (ri + 1) + '">' + r.map(function (v, ci) {
        if (v == null || v === '') return '';
        var ref = colName(ci) + (ri + 1), st = ri === 0 && sh.header !== false ? ' s="1"' : '';
        if (typeof v === 'number' && isFinite(v)) return '<c r="' + ref + '"' + st + '><v>' + v + '</v></c>';
        return '<c r="' + ref + '" t="inlineStr"' + st + '><is><t xml:space="preserve">' + esc(v) + '</t></is></c>';
      }).join('') + '</row>';
    }).join('');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      (sh.header !== false ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' : '') +
      (cols ? '<cols>' + cols + '</cols>' : '') + '<sheetData>' + rows + '</sheetData></worksheet>';
  }
  function write(sheets) {
    var ns = 'http://schemas.openxmlformats.org/', files = [
      { name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="' + ns + 'package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        sheets.map(function (s, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') + '</Types>' },
      { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="' + ns + 'package/2006/relationships"><Relationship Id="rId1" Type="' + ns + 'officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { name: 'xl/workbook.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="' + ns + 'spreadsheetml/2006/main" xmlns:r="' + ns + 'officeDocument/2006/relationships"><sheets>' +
        sheets.map(function (s, i) { return '<sheet name="' + esc(String(s.name).replace(/[\\\/?*\[\]:]/g, ' ').slice(0, 31)) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets></workbook>' },
      { name: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="' + ns + 'package/2006/relationships">' +
        sheets.map(function (s, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="' + ns + 'officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') +
        '<Relationship Id="rId' + (sheets.length + 1) + '" Type="' + ns + 'officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { name: 'xl/styles.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="' + ns + 'spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE9F1FD"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>' }
    ];
    sheets.forEach(function (s, i) { files.push({ name: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: sheetXml(s) }); });
    return zip(files, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
  function download(blob, filename) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  window.XlsxLite = { read: read, write: write, download: download, readCsv: readCsv };
})();
