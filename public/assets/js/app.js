/* GST, EMI & SIP Calculator: wires the inputs to Calc and renders the breakdowns. */
(function () {
  const { gst, emi, sip } = window.Calc;
  const $ = s => document.querySelector(s);
  const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
  const inr0 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const num = el => Math.max(0, parseFloat(el.value) || 0);
  const tile = (k, v, hl) => `<div class="stat${hl ? ' hl' : ''}"><div class="k">${k}</div><div class="v">${v}</div></div>`;

  /* ---------- tabs (nothing is stored; #emi or #sip in the link opens that tab) ---------- */
  function showTab(name) {
    document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === name));
    document.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== name; });
    history.replaceState(null, '', '#' + name);
  }
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  const fromHash = location.hash.slice(1);
  showTab(['gst', 'emi', 'sip'].includes(fromHash) ? fromHash : 'gst');

  function segment(attr, onChange) {
    const btns = document.querySelectorAll(`[${attr}]`);
    btns.forEach(b => b.addEventListener('click', () => { btns.forEach(x => x.setAttribute('aria-pressed', x === b)); onChange(); }));
    return () => [...btns].find(b => b.getAttribute('aria-pressed') === 'true').getAttribute(attr);
  }

  /* ---------- GST ---------- */
  const gMode = segment('data-gmode', renderGst), gSup = segment('data-gsup', renderGst);
  function renderGst() {
    const rate = parseFloat($('#gRate').value);
    const g = gst(num($('#gAmt')), rate, gMode());
    const split = gSup() === 'intra'
      ? tile(`CGST (${rate / 2}%)`, inr.format(g.half)) + tile(`SGST (${rate / 2}%)`, inr.format(g.half))
      : tile(`IGST (${rate}%)`, inr.format(g.tax));
    $('#gOut').innerHTML = tile('Price before GST', inr.format(g.base)) + split + tile('Total GST', inr.format(g.tax)) + tile('Price with GST', inr.format(g.total), true);
  }
  ['#gAmt', '#gRate'].forEach(s => $(s).addEventListener('input', renderGst));

  /* ---------- EMI ---------- */
  function renderEmi() {
    const P = num($('#eAmt')), e = emi(P, num($('#eRate')), num($('#eYrs')));
    $('#eOut').innerHTML = tile('Monthly EMI', inr0.format(e.emi), true) + tile('Total interest', inr0.format(e.interest)) + tile('Total you pay', inr0.format(e.total)) + tile('Number of EMIs', e.months);
    const share = e.total ? P / e.total * 100 : 100;
    const [a, b] = $('#eBar').children; a.style.width = share + '%'; b.style.width = (100 - share) + '%';
    $('#eTable').innerHTML = '<tr><th>Year</th><th>Principal paid</th><th>Interest paid</th><th>Balance left</th></tr>' +
      e.schedule.map(r => `<tr><td>${r.year}</td><td>${inr0.format(r.principal)}</td><td>${inr0.format(r.interest)}</td><td>${inr0.format(r.balance)}</td></tr>`).join('');
  }
  ['#eAmt', '#eRate', '#eYrs'].forEach(s => $(s).addEventListener('input', renderEmi));

  /* ---------- SIP ---------- */
  function renderSip() {
    const s = sip(num($('#sAmt')), num($('#sRate')), Math.min(60, Math.round(num($('#sYrs')))), num($('#sStep')));
    $('#sOut').innerHTML = tile('You invest', inr0.format(s.invested)) + tile('Estimated gains', inr0.format(s.gains)) + tile('Estimated value', inr0.format(s.value), true);
    const share = s.value ? s.invested / s.value * 100 : 100;
    const [a, b] = $('#sBar').children; a.style.width = share + '%'; b.style.width = (100 - share) + '%';
    $('#sTable').innerHTML = '<tr><th>Year</th><th>Monthly SIP</th><th>Invested so far</th><th>Value</th></tr>' +
      s.schedule.map(r => `<tr><td>${r.year}</td><td>${inr0.format(r.monthly)}</td><td>${inr0.format(r.invested)}</td><td>${inr0.format(r.value)}</td></tr>`).join('');
  }
  ['#sAmt', '#sRate', '#sYrs', '#sStep'].forEach(s => $(s).addEventListener('input', renderSip));

  renderGst(); renderEmi(); renderSip();
})();
