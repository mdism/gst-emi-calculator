/* Pure GST / EMI / SIP maths, kept apart from the page so it can be tested in Node. */
(function (root) {
  const round2 = n => Math.round(n * 100) / 100;

  /** mode "add": amount is before tax. mode "remove": amount already includes tax. */
  function gst(amount, rate, mode) {
    const base = mode === 'remove' ? amount / (1 + rate / 100) : amount;
    const tax = base * rate / 100;
    return { base: round2(base), tax: round2(tax), half: round2(tax / 2), total: round2(base + tax) };
  }

  /** Reducing-balance EMI with monthly compounding. Returns EMI, totals and a per-year schedule. */
  function emi(principal, annualRate, years) {
    const n = Math.round(years * 12), r = annualRate / 12 / 100;
    if (!(principal > 0) || !(n > 0)) return { emi: 0, interest: 0, total: 0, months: 0, schedule: [] };
    const pay = r === 0 ? principal / n : principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const schedule = [];
    let bal = principal;
    for (let m = 1; m <= n; m++) {
      const int = bal * r, prin = pay - int;
      bal = Math.max(0, bal - prin);
      const y = Math.ceil(m / 12);
      if (!schedule[y - 1]) schedule[y - 1] = { year: y, principal: 0, interest: 0, balance: 0 };
      schedule[y - 1].principal += prin;
      schedule[y - 1].interest += int;
      schedule[y - 1].balance = bal;
    }
    return { emi: round2(pay), interest: round2(pay * n - principal), total: round2(pay * n), months: n, schedule };
  }

  /** Monthly SIP, invested at the start of each month, with an optional yearly step-up. */
  function sip(monthly, annualRate, years, stepUp = 0) {
    const r = annualRate / 12 / 100;
    let value = 0, invested = 0, amt = monthly;
    const schedule = [];
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) { value = (value + amt) * (1 + r); invested += amt; }
      schedule.push({ year: y, monthly: amt, invested, value });
      amt *= 1 + stepUp / 100;
    }
    return { invested: round2(invested), value: round2(value), gains: round2(value - invested), schedule };
  }

  const api = { gst, emi, sip };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Calc = api;
})(this);
