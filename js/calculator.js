/**
 * INZAG ETS - Equipment Financing Calculator
 * Compares local African bank financing vs European ECA-backed financing.
 *
 * Local bank  = monthly annuity (equal total payments)
 * ECA-backed  = semi-annual linear (equal principal + declining interest)
 *
 * No external dependencies.
 */

/* ===================================================================
   GLOBAL NAMESPACE
   =================================================================== */
window.INZAG = window.INZAG || {};

/* ===================================================================
   COUNTRY DATA
   =================================================================== */
var COUNTRY_DATA = {
    'ZA': { name: 'South Africa',  currency: 'ZAR', symbol: 'R',    fx: 18.5,  localRate: 12,   localTerm: 4   },
    'BW': { name: 'Botswana',      currency: 'BWP', symbol: 'P',    fx: 13.5,  localRate: 16,   localTerm: 3   },
    'NA': { name: 'Namibia',       currency: 'NAD', symbol: 'N$',   fx: 18.5,  localRate: 15,   localTerm: 3   },
    'MZ': { name: 'Mozambique',    currency: 'MZN', symbol: 'MT',   fx: 64,    localRate: 20,   localTerm: 3   },
    'GH': { name: 'Ghana',         currency: 'GHS', symbol: 'GH\u20B5', fx: 15,    localRate: 26,   localTerm: 2.5 },
    'AO': { name: 'Angola',        currency: 'AOA', symbol: 'Kz',   fx: 830,   localRate: 25,   localTerm: 2.5 },
    'KE': { name: 'Kenya',         currency: 'KES', symbol: 'KSh',  fx: 155,   localRate: 15.5, localTerm: 3   },
    'ZM': { name: 'Zambia',        currency: 'ZMW', symbol: 'ZK',   fx: 27,    localRate: 27,   localTerm: 2.5 },
    'TZ': { name: 'Tanzania',      currency: 'TZS', symbol: 'TSh',  fx: 2700,  localRate: 13.5, localTerm: 4   },
    'CD': { name: 'DRC',           currency: 'CDF', symbol: 'FC',   fx: 2800,  localRate: 22,   localTerm: 3   },
    'OTHER': { name: 'Other',      currency: 'USD', symbol: '$',    fx: 1,     localRate: 18,   localTerm: 3   }
};

/* ===================================================================
   ECA DEFAULTS
   =================================================================== */
var ECA_DEFAULTS = {
    rate: 5.5,          // Euribor + margin (%)
    term: 7,            // repayment term (years)
    down: 15,           // down payment (%)
    insuranceRate: 1.5  // ECA insurance premium (% p.a.)
};

/* ===================================================================
   CURRENCY SYMBOLS LOOKUP
   =================================================================== */
var CURRENCY_SYMBOLS = {
    'USD': '$',
    'ZAR': 'R',
    'BWP': 'P',
    'NAD': 'N$',
    'MZN': 'MT',
    'GHS': 'GH\u20B5',
    'AOA': 'Kz',
    'KES': 'KSh',
    'ZMW': 'ZK',
    'TZS': 'TSh',
    'CDF': 'FC'
};

/* ===================================================================
   STATE
   =================================================================== */
var _amortVisible = false;
var _showLocalCurrency = false;

/* ===================================================================
   FORMAT FUNCTIONS
   =================================================================== */

function _addCommas(n) {
    var str = Math.abs(Math.round(n)).toString();
    var formatted = '';
    var count = 0;
    for (var i = str.length - 1; i >= 0; i--) {
        if (count > 0 && count % 3 === 0) formatted = ',' + formatted;
        formatted = str[i] + formatted;
        count++;
    }
    return formatted;
}

function formatUSD(n) {
    if (n == null || isNaN(n)) return '$0';
    return (n < 0 ? '-' : '') + '$' + _addCommas(n);
}

function formatCurrency(n, currency) {
    if (n == null || isNaN(n)) n = 0;
    var symbol = CURRENCY_SYMBOLS[currency] || '$';
    return (n < 0 ? '-' : '') + symbol + _addCommas(n);
}

/* ===================================================================
   FINANCIAL MATH — LOCAL BANK (monthly annuity)
   =================================================================== */

function monthlyPayment(principal, annualRate, years) {
    if (principal <= 0) return 0;
    if (annualRate <= 0) return principal / (years * 12);
    var r = annualRate / 100 / 12;
    var n = Math.round(years * 12);
    var factor = Math.pow(1 + r, n);
    return principal * (r * factor) / (factor - 1);
}

function generateLocalAmortization(principal, annualRate, years) {
    var schedule = [];
    var n = Math.round(years * 12);
    var payment = monthlyPayment(principal, annualRate, years);
    var balance = principal;
    var r = annualRate / 100 / 12;

    for (var m = 1; m <= n; m++) {
        var interestPortion = balance * r;
        var principalPortion = payment - interestPortion;
        if (m === n) {
            principalPortion = balance;
            payment = principalPortion + interestPortion;
        }
        balance -= principalPortion;
        if (balance < 0) balance = 0;
        schedule.push({
            period: m,
            payment: payment,
            principal: principalPortion,
            interest: interestPortion,
            balance: balance
        });
    }
    return schedule;
}

/* ===================================================================
   FINANCIAL MATH — ECA (semi-annual linear amortization)
   Equal principal repayments every 6 months, interest on remaining
   balance, plus ECA insurance premium on remaining balance.
   =================================================================== */

function generateEcaSchedule(principal, annualRate, years, insuranceRate) {
    var nPeriods = years * 2; // semi-annual
    var equalPrincipal = principal / nPeriods;
    var schedule = [];
    var remaining = principal;
    var totalInterest = 0;
    var totalInsurance = 0;

    for (var i = 1; i <= nPeriods; i++) {
        var interest = remaining * (annualRate / 100 / 2);
        var insurance = remaining * (insuranceRate / 100 / 2);
        var total = equalPrincipal + interest + insurance;

        totalInterest += interest;
        totalInsurance += insurance;

        remaining -= equalPrincipal;
        if (remaining < 1) remaining = 0; // handle rounding

        schedule.push({
            period: i,
            principalRepayment: equalPrincipal,
            interest: interest,
            insurance: insurance,
            totalInstalment: total,
            remainingPrincipal: remaining
        });
    }

    return {
        schedule: schedule,
        totalInterest: totalInterest,
        totalInsurance: totalInsurance
    };
}

/* ===================================================================
   DOM HELPERS
   =================================================================== */

function _setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text;
}

function _readNum(selector, defaultValue) {
    var el = document.querySelector(selector);
    if (!el) return defaultValue;
    var val = parseFloat(el.value);
    return isNaN(val) ? defaultValue : val;
}

function _getCountryInfo() {
    var select = document.querySelector('#calc-country');
    if (!select) {
        return { countryCode: 'OTHER', localRate: 18, localTerm: 3, currency: 'USD', fx: 1, symbol: '$' };
    }
    var opt = select.options[select.selectedIndex];
    var code = select.value;
    var data = COUNTRY_DATA[code] || COUNTRY_DATA['OTHER'];

    return {
        countryCode: code,
        localRate: opt && opt.dataset.rate ? parseFloat(opt.dataset.rate) : data.localRate,
        localTerm: opt && opt.dataset.term ? parseFloat(opt.dataset.term) : data.localTerm,
        currency:  opt && opt.dataset.currency ? opt.dataset.currency : data.currency,
        fx:        opt && opt.dataset.fx ? parseFloat(opt.dataset.fx) : data.fx,
        symbol:    data.symbol || CURRENCY_SYMBOLS[data.currency] || '$'
    };
}

function _updateAmountDisplay() {
    var amount = _readNum('#calc-amount', 0);
    var el = document.querySelector('#calc-amount-display');
    if (el) el.textContent = 'USD ' + _addCommas(amount);
}

/* ===================================================================
   MAIN CALCULATION
   =================================================================== */

function calculateSavings() {
    var amount  = _readNum('#calc-amount', 0);
    var country = _getCountryInfo();
    var ecaRate = _readNum('#calc-eca-rate', ECA_DEFAULTS.rate);
    var ecaTerm = _readNum('#calc-eca-term', ECA_DEFAULTS.term);

    // Format function
    var fx       = country.fx;
    var currency = country.currency;
    var fmt;
    if (_showLocalCurrency && currency !== 'USD') {
        fmt = function (n) { return formatCurrency(n * fx, currency); };
    } else {
        fmt = formatUSD;
    }

    // Update formatted cost display
    _updateAmountDisplay();

    // --- LOCAL BANK (monthly annuity) ---
    var localRate      = country.localRate;
    var localTerm      = country.localTerm;
    var localFinanced  = amount * 0.85;
    var localUpfront   = amount * 0.15;
    var localMonthly   = monthlyPayment(localFinanced, localRate, localTerm);
    var localMonths    = Math.round(localTerm * 12);
    var localTotalPaid = localMonthly * localMonths;
    var localTotalInt  = localTotalPaid - localFinanced;
    var localTotalCost = localUpfront + localTotalPaid;

    // --- ECA-BACKED (semi-annual linear) ---
    var ecaFinanced   = amount * 0.85;
    var ecaUpfront    = amount * 0.15;
    var ecaResult     = generateEcaSchedule(ecaFinanced, ecaRate, ecaTerm, ECA_DEFAULTS.insuranceRate);
    var ecaTotalInt   = ecaResult.totalInterest;
    var ecaTotalIns   = ecaResult.totalInsurance;
    var ecaFirstInst  = ecaResult.schedule[0].totalInstalment;
    var ecaTotalCost  = ecaUpfront + ecaFinanced + ecaTotalInt + ecaTotalIns;

    // --- SAVINGS ---
    var totalSavings  = localTotalCost - ecaTotalCost;
    var annualSavings = totalSavings / Math.max(localTerm, ecaTerm);

    // --- UPDATE DOM: Local bank ---
    _setText('#r-local-financed',       fmt(localFinanced));
    _setText('#r-local-upfront',        fmt(localUpfront));
    _setText('#r-local-rate',           localRate.toFixed(1) + '%');
    _setText('#r-local-term',           localTerm + ' yrs');
    _setText('#r-local-monthly',        fmt(localMonthly));
    _setText('#r-local-total-interest',  fmt(localTotalInt));
    _setText('#r-local-total-cost',     fmt(localTotalCost));

    // --- UPDATE DOM: ECA ---
    _setText('#r-eca-financed',       fmt(ecaFinanced));
    _setText('#r-eca-upfront',        fmt(ecaUpfront));
    _setText('#r-eca-rate',           ecaRate.toFixed(1) + '%');
    _setText('#r-eca-term',           ecaTerm + ' yrs');
    _setText('#r-eca-semiannual',     fmt(ecaFirstInst));
    _setText('#r-eca-total-interest',  fmt(ecaTotalInt));
    _setText('#r-eca-insurance',      fmt(ecaTotalIns));
    _setText('#r-eca-total-cost',     fmt(ecaTotalCost));

    // --- UPDATE DOM: Savings ---
    _setText('#r-savings',        fmt(totalSavings));
    _setText('#r-savings-annual', fmt(annualSavings) + ' / year');

    // Equivalency
    var equivTrucks = Math.floor(totalSavings / 150000);
    if (equivTrucks >= 2) {
        _setText('#r-savings-equiv', "That\u2019s enough to buy " + equivTrucks + ' additional trucks');
    } else if (equivTrucks === 1) {
        _setText('#r-savings-equiv', "That\u2019s enough to buy 1 additional truck");
    } else {
        var equivLight = Math.floor(totalSavings / 80000);
        if (equivLight >= 1) {
            _setText('#r-savings-equiv',
                "That\u2019s enough to buy " + equivLight + ' additional light vehicle' + (equivLight > 1 ? 's' : ''));
        } else {
            _setText('#r-savings-equiv', '');
        }
    }

    // --- Cost comparison bars ---
    var maxCost = Math.max(localTotalCost, ecaTotalCost, 1);
    var localBarEl = document.querySelector('.cost-bar-local');
    var ecaBarEl   = document.querySelector('.cost-bar-eca');
    if (localBarEl) localBarEl.style.width = ((localTotalCost / maxCost) * 100).toFixed(1) + '%';
    if (ecaBarEl)   ecaBarEl.style.width   = ((ecaTotalCost / maxCost) * 100).toFixed(1) + '%';

    // Store for WhatsApp message
    window.INZAG.calcSavings = totalSavings;
    window.INZAG.calcAmount  = amount;

    // Refresh amortization if visible
    if (_amortVisible) _renderAmortizationTable();
}

/* ===================================================================
   AMORTIZATION SCHEDULE
   Shows ECA semi-annual repayment schedule (like the bank reference).
   =================================================================== */

function _renderAmortizationTable() {
    var tbody = document.querySelector('#amort-table-body');
    if (!tbody) return;

    var amount  = _readNum('#calc-amount', 0);
    var country = _getCountryInfo();
    var ecaRate = _readNum('#calc-eca-rate', ECA_DEFAULTS.rate);
    var ecaTerm = _readNum('#calc-eca-term', ECA_DEFAULTS.term);
    var ecaFinanced = amount * 0.85;

    var fx       = country.fx;
    var currency = country.currency;
    var fmt;
    if (_showLocalCurrency && currency !== 'USD') {
        fmt = function (n) { return formatCurrency(n * fx, currency); };
    } else {
        fmt = formatUSD;
    }

    var ecaResult = generateEcaSchedule(ecaFinanced, ecaRate, ecaTerm, ECA_DEFAULTS.insuranceRate);

    var html = '';
    for (var i = 0; i < ecaResult.schedule.length; i++) {
        var row = ecaResult.schedule[i];
        var monthLabel = (row.period * 6);
        html += '<tr>';
        html += '<td>' + row.period + '</td>';
        html += '<td>' + monthLabel + '</td>';
        html += '<td>' + fmt(row.remainingPrincipal + row.principalRepayment) + '</td>';
        html += '<td>' + fmt(row.principalRepayment) + '</td>';
        html += '<td>' + fmt(row.interest) + '</td>';
        html += '<td>' + fmt(row.insurance) + '</td>';
        html += '<td>' + fmt(row.totalInstalment) + '</td>';
        html += '</tr>';
    }

    // Totals row
    html += '<tr style="font-weight:600;border-top:2px solid rgba(255,255,255,0.3)">';
    html += '<td colspan="3">Total</td>';
    html += '<td>' + fmt(ecaFinanced) + '</td>';
    html += '<td>' + fmt(ecaResult.totalInterest) + '</td>';
    html += '<td>' + fmt(ecaResult.totalInsurance) + '</td>';
    html += '<td>' + fmt(ecaFinanced + ecaResult.totalInterest + ecaResult.totalInsurance) + '</td>';
    html += '</tr>';

    tbody.innerHTML = html;
}

function toggleAmortization() {
    var section = document.querySelector('#amort-container') || document.querySelector('#amort-section');
    if (!section) return;
    _amortVisible = !_amortVisible;
    section.style.display = _amortVisible ? 'block' : 'none';
    if (_amortVisible) _renderAmortizationTable();
}

/* ===================================================================
   CURRENCY TOGGLE
   =================================================================== */

function toggleCurrency() {
    var el = document.querySelector('#calc-currency-toggle');
    if (el && el.type === 'checkbox') {
        _showLocalCurrency = el.checked;
    } else {
        _showLocalCurrency = !_showLocalCurrency;
        var country = _getCountryInfo();
        if (el) {
            el.textContent = _showLocalCurrency
                ? 'Show in USD'
                : ('Show in ' + country.currency);
        }
    }
    calculateSavings();
}

/* ===================================================================
   SHARE CALCULATION
   =================================================================== */

function shareCalculation() {
    var amount  = _readNum('#calc-amount', 0);
    var country = _getCountryInfo();
    var ecaRate = _readNum('#calc-eca-rate', ECA_DEFAULTS.rate);
    var ecaTerm = _readNum('#calc-eca-term', ECA_DEFAULTS.term);

    var params = [
        'amount='  + encodeURIComponent(amount),
        'country=' + encodeURIComponent(country.countryCode),
        'rate='    + encodeURIComponent(ecaRate),
        'term='    + encodeURIComponent(ecaTerm)
    ];

    var url = window.location.origin + window.location.pathname + '?' + params.join('&');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
            _showShareTooltip('Link copied!');
        }).catch(function () {
            _fallbackCopy(url);
        });
    } else {
        _fallbackCopy(url);
    }
}

function _fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        _showShareTooltip('Link copied!');
    } catch (e) {
        _showShareTooltip('Copy failed \u2014 use the URL bar');
    }
    document.body.removeChild(textarea);
}

function _showShareTooltip(message) {
    var btn = document.querySelector('#btn-share');
    if (!btn) return;
    var tip = document.querySelector('#share-tooltip');
    if (!tip) {
        tip = document.createElement('span');
        tip.id = 'share-tooltip';
        tip.style.cssText =
            'position:absolute;background:#1a3d5c;color:#fff;padding:6px 14px;' +
            'border-radius:4px;font-size:13px;white-space:nowrap;z-index:1000;' +
            'transition:opacity 0.3s;pointer-events:none;';
        btn.style.position = 'relative';
        btn.appendChild(tip);
    }
    tip.textContent = message;
    tip.style.opacity = '1';
    tip.style.top = '-36px';
    tip.style.left = '50%';
    tip.style.transform = 'translateX(-50%)';
    clearTimeout(tip._hideTimer);
    tip._hideTimer = setTimeout(function () { tip.style.opacity = '0'; }, 2000);
}

/* ===================================================================
   EXPORT / PRINT
   =================================================================== */

function exportPDF() {
    window.print();
}

/* ===================================================================
   INITIALIZATION
   =================================================================== */

function _prefillFromURL() {
    var params = new URLSearchParams(window.location.search);
    var amountEl  = document.querySelector('#calc-amount');
    var countryEl = document.querySelector('#calc-country');
    var ecaRateEl = document.querySelector('#calc-eca-rate');
    var ecaTermEl = document.querySelector('#calc-eca-term');

    if (params.has('amount') && amountEl)   amountEl.value  = params.get('amount');
    if (params.has('rate')   && ecaRateEl)  ecaRateEl.value = params.get('rate');
    if (params.has('term')   && ecaTermEl)  ecaTermEl.value = params.get('term');

    if (params.has('country') && countryEl) {
        var code = params.get('country');
        for (var i = 0; i < countryEl.options.length; i++) {
            if (countryEl.options[i].value === code) {
                countryEl.selectedIndex = i;
                break;
            }
        }
    }
}

function initCalculator() {
    var amountEl = document.querySelector('#calc-amount');
    if (!amountEl) return;

    _prefillFromURL();

    // Input listeners
    var inputs = ['#calc-amount', '#calc-eca-rate'];
    inputs.forEach(function (sel) {
        var el = document.querySelector(sel);
        if (el) el.addEventListener('input', calculateSavings);
    });

    // Selects
    ['#calc-country', '#calc-equipment-type', '#calc-eca-term'].forEach(function (sel) {
        var el = document.querySelector(sel);
        if (el) el.addEventListener('change', calculateSavings);
    });

    // Currency toggle (only addEventListener — no onclick in HTML)
    var currToggle = document.querySelector('#calc-currency-toggle');
    if (currToggle) {
        var evt = (currToggle.type === 'checkbox') ? 'change' : 'click';
        currToggle.addEventListener(evt, toggleCurrency);
    }

    // Update currency button label to show actual currency
    if (currToggle && currToggle.type !== 'checkbox') {
        var country = _getCountryInfo();
        currToggle.textContent = 'Show in ' + country.currency;
        // Update label when country changes
        var countryEl = document.querySelector('#calc-country');
        if (countryEl) {
            countryEl.addEventListener('change', function () {
                if (!_showLocalCurrency) {
                    var c = _getCountryInfo();
                    currToggle.textContent = 'Show in ' + c.currency;
                }
            });
        }
    }

    // Amortization toggle
    var amortBtn = document.querySelector('#btn-amortization');
    if (amortBtn) amortBtn.addEventListener('click', toggleAmortization);

    // Share button
    var shareBtn = document.querySelector('#btn-share');
    if (shareBtn) shareBtn.addEventListener('click', shareCalculation);

    // Export/Print
    var exportBtn = document.querySelector('#btn-export');
    if (exportBtn) exportBtn.addEventListener('click', exportPDF);

    // Format cost display on input
    amountEl.addEventListener('input', _updateAmountDisplay);

    // Initial calculation
    calculateSavings();
}

/* ===================================================================
   PUBLIC API
   =================================================================== */
window.calculateSavings   = calculateSavings;
window.toggleAmortization = toggleAmortization;
window.toggleCurrency     = toggleCurrency;
window.shareCalculation   = shareCalculation;
window.exportPDF          = exportPDF;

/* ===================================================================
   AUTO-INIT
   =================================================================== */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
} else {
    initCalculator();
}
