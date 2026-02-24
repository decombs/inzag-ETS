/**
 * INZAG ETS - Enhanced Equipment Financing Calculator
 * Compares local African bank financing vs European ECA-backed financing.
 *
 * No external dependencies. All functions that need to be called from HTML
 * are attached to the window object.
 */

/* ===================================================================
   GLOBAL NAMESPACE
   =================================================================== */
window.INZAG = window.INZAG || {};

/* ===================================================================
   COUNTRY DATA
   Each entry contains the local currency info, exchange rate to USD,
   typical local bank lending rate (%), and typical local loan term (years).
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
   European Export Credit Agency-backed financing defaults.
   =================================================================== */
var ECA_DEFAULTS = {
    rate: 5.5,   // annual interest rate (%)
    term: 7,     // loan term (years)
    down: 15     // down payment (%)
};

/* ===================================================================
   CURRENCY SYMBOLS LOOKUP
   Maps ISO currency codes to their display symbols.
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
   Tracks whether the amortization schedule is visible and whether
   local currency display is active.
   =================================================================== */
var _showAllMonths = false;
var _amortVisible = false;
var _showLocalCurrency = false;

/* ===================================================================
   FORMAT FUNCTIONS
   =================================================================== */

/**
 * Format a number as a US Dollar string.
 * @param {number} n - The value to format.
 * @returns {string} Formatted string, e.g. "$5,000,000".
 */
function formatUSD(n) {
    if (n == null || isNaN(n)) return '$0';
    var sign = n < 0 ? '-' : '';
    var abs = Math.abs(Math.round(n));
    var str = abs.toString();
    var formatted = '';
    var count = 0;
    for (var i = str.length - 1; i >= 0; i--) {
        if (count > 0 && count % 3 === 0) {
            formatted = ',' + formatted;
        }
        formatted = str[i] + formatted;
        count++;
    }
    return sign + '$' + formatted;
}

/**
 * Format a number in the given currency.
 * @param {number} n  - The value to format.
 * @param {string} currency - ISO 4217 currency code (e.g. "ZAR").
 * @returns {string} Formatted string with the appropriate symbol.
 */
function formatCurrency(n, currency) {
    if (n == null || isNaN(n)) n = 0;
    var symbol = CURRENCY_SYMBOLS[currency] || '$';
    var sign = n < 0 ? '-' : '';
    var abs = Math.abs(Math.round(n));
    var str = abs.toString();
    var formatted = '';
    var count = 0;
    for (var i = str.length - 1; i >= 0; i--) {
        if (count > 0 && count % 3 === 0) {
            formatted = ',' + formatted;
        }
        formatted = str[i] + formatted;
        count++;
    }
    return sign + symbol + formatted;
}

/* ===================================================================
   FINANCIAL MATH
   =================================================================== */

/**
 * Standard amortization formula: calculates the fixed monthly payment.
 *
 * M = P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
 *
 * @param {number} principal  - Loan principal (amount financed).
 * @param {number} annualRate - Annual interest rate as a percentage (e.g. 12 for 12%).
 * @param {number} years      - Loan term in years (can be fractional, e.g. 2.5).
 * @returns {number} Monthly payment amount.
 */
function monthlyPayment(principal, annualRate, years) {
    if (principal <= 0) return 0;
    if (annualRate <= 0) return principal / (years * 12);

    var r = annualRate / 100 / 12;       // monthly interest rate
    var n = Math.round(years * 12);       // total number of payments
    var factor = Math.pow(1 + r, n);
    return principal * (r * factor) / (factor - 1);
}

/**
 * Generate a full month-by-month amortization schedule.
 *
 * @param {number} principal  - Loan principal.
 * @param {number} annualRate - Annual interest rate (%).
 * @param {number} years      - Loan term in years.
 * @returns {Array<Object>} Array of objects with:
 *   { month, payment, principal, interest, balance }
 */
function generateAmortization(principal, annualRate, years) {
    var schedule = [];
    var n = Math.round(years * 12);
    var payment = monthlyPayment(principal, annualRate, years);
    var balance = principal;
    var r = annualRate / 100 / 12;

    for (var m = 1; m <= n; m++) {
        var interestPortion = balance * r;
        var principalPortion = payment - interestPortion;

        // Handle final month rounding
        if (m === n) {
            principalPortion = balance;
            payment = principalPortion + interestPortion;
        }

        balance = balance - principalPortion;
        if (balance < 0) balance = 0;

        schedule.push({
            month: m,
            payment: payment,
            principal: principalPortion,
            interest: interestPortion,
            balance: balance
        });
    }

    return schedule;
}

/* ===================================================================
   HELPER: safely read a DOM element's text / value
   =================================================================== */

/**
 * Set the text content of a DOM element by selector, if it exists.
 * @param {string} selector - CSS selector.
 * @param {string} text     - Text to set.
 */
function _setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text;
}

/**
 * Read a numeric value from an input element, with a fallback default.
 * @param {string} selector     - CSS selector for the input.
 * @param {number} defaultValue - Fallback if empty or non-numeric.
 * @returns {number}
 */
function _readNum(selector, defaultValue) {
    var el = document.querySelector(selector);
    if (!el) return defaultValue;
    var val = parseFloat(el.value);
    return isNaN(val) ? defaultValue : val;
}

/**
 * Get the currently selected country data object.
 * Reads from the #calc-country <select> element's value and data-attributes,
 * falling back to the COUNTRY_DATA lookup.
 * @returns {Object} { countryCode, localRate, localTerm, currency, fx, symbol }
 */
function _getCountryInfo() {
    var select = document.querySelector('#calc-country');
    if (!select) {
        return {
            countryCode: 'OTHER',
            localRate: 18,
            localTerm: 3,
            currency: 'USD',
            fx: 1,
            symbol: '$'
        };
    }

    var opt = select.options[select.selectedIndex];
    var code = select.value;
    var data = COUNTRY_DATA[code] || COUNTRY_DATA['OTHER'];

    // Allow the DOM data-attributes to override COUNTRY_DATA if present
    var localRate = opt && opt.dataset.rate ? parseFloat(opt.dataset.rate) : data.localRate;
    var localTerm = opt && opt.dataset.term ? parseFloat(opt.dataset.term) : data.localTerm;
    var currency  = opt && opt.dataset.currency ? opt.dataset.currency : data.currency;
    var fx        = opt && opt.dataset.fx ? parseFloat(opt.dataset.fx) : data.fx;
    var symbol    = data.symbol || CURRENCY_SYMBOLS[currency] || '$';

    return {
        countryCode: code,
        localRate: localRate,
        localTerm: localTerm,
        currency: currency,
        fx: fx,
        symbol: symbol
    };
}

/* ===================================================================
   MAIN CALCULATION
   =================================================================== */

/**
 * Main calculation function.
 *
 * Reads all inputs from the DOM, computes local bank vs ECA-backed financing,
 * and writes every result back into the DOM. Also updates the cost comparison
 * bar chart widths and stores key results on window.INZAG.
 */
function calculateSavings() {
    // --- Read inputs ---
    var amount    = _readNum('#calc-amount', 0);
    var country   = _getCountryInfo();
    var ecaRate   = _readNum('#calc-eca-rate', ECA_DEFAULTS.rate);
    var downLocal = 15;
    var downECA   = 15;

    // Equipment type (optional, for display purposes only)
    var equipTypeEl = document.querySelector('#calc-equipment-type');
    var equipType   = equipTypeEl ? equipTypeEl.value : '';

    // Determine which format function and currency to use
    var fx       = country.fx;
    var currency = country.currency;
    var fmt;
    if (_showLocalCurrency && currency !== 'USD') {
        fmt = function (n) { return formatCurrency(n * fx, currency); };
    } else {
        fmt = formatUSD;
    }

    // --- Local bank calculations ---
    var localRate      = country.localRate;
    var localTerm      = country.localTerm;
    var localFinanced  = amount * (1 - downLocal / 100);
    var localUpfront   = amount * (downLocal / 100);
    var localMonthly   = monthlyPayment(localFinanced, localRate, localTerm);
    var localMonths    = Math.round(localTerm * 12);
    var localTotalPaid = localMonthly * localMonths;
    var localTotalInt  = localTotalPaid - localFinanced;
    var localTotalCost = localUpfront + localTotalPaid;

    // --- ECA-backed calculations ---
    var ecaTerm      = ECA_DEFAULTS.term;
    var ecaFinanced  = amount * (1 - downECA / 100);
    var ecaUpfront   = amount * (downECA / 100);
    var ecaMonthly   = monthlyPayment(ecaFinanced, ecaRate, ecaTerm);
    var ecaMonths    = Math.round(ecaTerm * 12);
    var ecaTotalPaid = ecaMonthly * ecaMonths;
    var ecaTotalInt  = ecaTotalPaid - ecaFinanced;
    var ecaTotalCost = ecaUpfront + ecaTotalPaid;

    // --- Savings ---
    var monthlySavings = localMonthly - ecaMonthly;
    var totalSavings   = localTotalCost - ecaTotalCost;
    var annualSavings  = monthlySavings * 12;
    var upfrontSaved   = localUpfront - ecaUpfront;

    // --- Update DOM: Local bank results ---
    _setText('#r-local-financed',      fmt(localFinanced));
    _setText('#r-local-upfront',       fmt(localUpfront));
    _setText('#r-local-rate',          localRate.toFixed(1) + '%');
    _setText('#r-local-term',          localTerm + ' years');
    _setText('#r-local-monthly',       fmt(localMonthly));
    _setText('#r-local-total-interest', fmt(localTotalInt));
    _setText('#r-local-total-cost',    fmt(localTotalCost));

    // --- Update DOM: ECA results ---
    _setText('#r-eca-financed',      fmt(ecaFinanced));
    _setText('#r-eca-upfront',       fmt(ecaUpfront));
    _setText('#r-eca-rate',          ecaRate.toFixed(1) + '%');
    _setText('#r-eca-term',          ecaTerm + ' years');
    _setText('#r-eca-monthly',       fmt(ecaMonthly));
    _setText('#r-eca-total-interest', fmt(ecaTotalInt));
    _setText('#r-eca-total-cost',    fmt(ecaTotalCost));

    // --- Update DOM: Savings ---
    _setText('#r-savings',        fmt(monthlySavings));
    _setText('#r-savings-total',  fmt(totalSavings));
    _setText('#r-savings-annual', fmt(annualSavings));

    // "Plus $X less upfront capital needed"
    if (upfrontSaved > 0) {
        _setText('#r-savings-extra', 'Plus ' + fmt(upfrontSaved) + ' less upfront capital needed');
    } else {
        _setText('#r-savings-extra', '');
    }

    // Equivalency line (approximate: a heavy truck ~$150k, light truck ~$80k)
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

    // --- Update cost comparison bar chart ---
    var maxCost = Math.max(localTotalCost, ecaTotalCost, 1); // avoid division by zero
    var localBarEl = document.querySelector('.cost-bar-local');
    var ecaBarEl   = document.querySelector('.cost-bar-eca');
    if (localBarEl) localBarEl.style.width = ((localTotalCost / maxCost) * 100).toFixed(1) + '%';
    if (ecaBarEl)   ecaBarEl.style.width   = ((ecaTotalCost / maxCost) * 100).toFixed(1) + '%';

    // --- Store results on global namespace ---
    window.INZAG.calcSavings = totalSavings;
    window.INZAG.calcAmount  = amount;

    // If amortization is already visible, refresh it
    if (_amortVisible) {
        _renderAmortizationTable();
    }
}

/* ===================================================================
   AMORTIZATION SCHEDULE
   =================================================================== */

/**
 * Render the amortization table into #amort-table-body.
 * Shows local bank and ECA schedules side by side.
 * By default only every 12th month (annual summary) is displayed;
 * the _showAllMonths flag toggles full monthly detail.
 * @private
 */
function _renderAmortizationTable() {
    var tbody = document.querySelector('#amort-table-body');
    if (!tbody) return;

    // Read current values
    var amount    = _readNum('#calc-amount', 0);
    var country   = _getCountryInfo();
    var ecaRate   = _readNum('#calc-eca-rate', ECA_DEFAULTS.rate);
    var downLocal = 15;
    var downECA   = 15;

    var localFinanced = amount * (1 - downLocal / 100);
    var ecaFinanced   = amount * (1 - downECA / 100);

    var localSchedule = generateAmortization(localFinanced, country.localRate, country.localTerm);
    var ecaSchedule   = generateAmortization(ecaFinanced, ecaRate, ECA_DEFAULTS.term);

    // Determine currency formatting
    var fx       = country.fx;
    var currency = country.currency;
    var fmt;
    if (_showLocalCurrency && currency !== 'USD') {
        fmt = function (n) { return formatCurrency(n * fx, currency); };
    } else {
        fmt = formatUSD;
    }

    // Determine the maximum number of months across both schedules
    var maxMonths = Math.max(localSchedule.length, ecaSchedule.length);

    var html = '';
    for (var i = 0; i < maxMonths; i++) {
        // Skip non-12th months unless "show all" is active
        if (!_showAllMonths && (i + 1) % 12 !== 0 && i !== 0 && i !== maxMonths - 1) {
            continue;
        }

        var local = localSchedule[i] || null;
        var eca   = ecaSchedule[i]   || null;

        html += '<tr>';

        // Month number
        html += '<td>' + (i + 1) + '</td>';

        // Local bank columns
        if (local) {
            html += '<td>' + fmt(local.payment)   + '</td>';
            html += '<td>' + fmt(local.principal)  + '</td>';
            html += '<td>' + fmt(local.interest)   + '</td>';
            html += '<td>' + fmt(local.balance)    + '</td>';
        } else {
            html += '<td colspan="4" style="text-align:center;color:#999;">Paid off</td>';
        }

        // ECA columns
        if (eca) {
            html += '<td>' + fmt(eca.payment)   + '</td>';
            html += '<td>' + fmt(eca.principal)  + '</td>';
            html += '<td>' + fmt(eca.interest)   + '</td>';
            html += '<td>' + fmt(eca.balance)    + '</td>';
        } else {
            html += '<td colspan="4" style="text-align:center;color:#999;">Paid off</td>';
        }

        html += '</tr>';
    }

    tbody.innerHTML = html;

    // Update the toggle label
    var toggleLabel = document.querySelector('#amort-toggle-months');
    if (toggleLabel) {
        toggleLabel.textContent = _showAllMonths ? 'Show annual summary' : 'Show all months';
    }
}

/**
 * Toggle visibility of the amortization schedule section.
 * When shown for the first time (or after recalculation), the table is
 * generated / refreshed.
 */
function toggleAmortization() {
    var section = document.querySelector('#amort-container');
    if (!section) return;

    _amortVisible = !_amortVisible;
    section.style.display = _amortVisible ? 'block' : 'none';

    if (_amortVisible) {
        _renderAmortizationTable();
    }
}

/**
 * Toggle between showing every month and showing only annual summaries
 * in the amortization table.
 */
function toggleAllMonths() {
    _showAllMonths = !_showAllMonths;
    _renderAmortizationTable();
}

/* ===================================================================
   CURRENCY TOGGLE
   =================================================================== */

/**
 * Toggle between USD and local currency display.
 * Flips the checkbox state and re-runs the full calculation so all
 * displayed values update accordingly.
 */
function toggleCurrency() {
    _showLocalCurrency = !_showLocalCurrency;
    var btn = document.querySelector('#calc-currency-toggle');
    if (btn) {
        btn.textContent = _showLocalCurrency ? 'Show in USD' : 'Show in Local Currency';
    }
    calculateSavings();
}

/* ===================================================================
   SHARE CALCULATION
   =================================================================== */

/**
 * Encode the current calculator inputs into URL query parameters,
 * copy the resulting URL to the clipboard, and show a brief tooltip.
 */
function shareCalculation() {
    var amount    = _readNum('#calc-amount', 0);
    var country   = _getCountryInfo();
    var ecaRate   = _readNum('#calc-eca-rate', ECA_DEFAULTS.rate);

    var params = [
        'amount='    + encodeURIComponent(amount),
        'country='   + encodeURIComponent(country.countryCode),
        'rate='      + encodeURIComponent(ecaRate)
    ];

    var url = window.location.origin + window.location.pathname + '?' + params.join('&');

    // Copy to clipboard
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

/**
 * Fallback copy method for older browsers that don't support
 * navigator.clipboard.
 * @param {string} text - Text to copy.
 * @private
 */
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

/**
 * Display a brief "Link copied!" tooltip near the share button.
 * Auto-hides after 2 seconds.
 * @param {string} message - Message to display.
 * @private
 */
function _showShareTooltip(message) {
    var btn = document.querySelector('#btn-share');
    if (!btn) return;

    // Reuse or create tooltip element
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
    tip._hideTimer = setTimeout(function () {
        tip.style.opacity = '0';
    }, 2000);
}

/* ===================================================================
   EXPORT / PRINT
   =================================================================== */

/**
 * Trigger a browser print dialog. The page's print CSS (in styles.css)
 * is expected to isolate the calculator results for a clean PDF export.
 */
function exportPDF() {
    window.print();
}

/* ===================================================================
   INITIALIZATION
   =================================================================== */

/**
 * Read URL query parameters and pre-fill the calculator form inputs.
 * @private
 */
function _prefillFromURL() {
    var params = new URLSearchParams(window.location.search);

    var amountEl    = document.querySelector('#calc-amount');
    var countryEl   = document.querySelector('#calc-country');
    var ecaRateEl   = document.querySelector('#calc-eca-rate');

    if (params.has('amount')    && amountEl)    amountEl.value    = params.get('amount');
    if (params.has('rate')      && ecaRateEl)   ecaRateEl.value   = params.get('rate');

    if (params.has('country') && countryEl) {
        var code = params.get('country');
        // Set the <select> to the matching option
        for (var i = 0; i < countryEl.options.length; i++) {
            if (countryEl.options[i].value === code) {
                countryEl.selectedIndex = i;
                break;
            }
        }
    }
}

/**
 * Initialize the calculator.
 *
 * Called on DOMContentLoaded when the #calc-amount input is present on the
 * page. Sets up all event listeners, pre-fills from URL params if present,
 * and runs the initial calculation.
 */
function initCalculator() {
    var amountEl = document.querySelector('#calc-amount');
    if (!amountEl) return; // Calculator not on this page

    // Pre-fill form from URL query params (e.g. shared links)
    _prefillFromURL();

    // --- Attach event listeners to all calculator inputs ---
    var inputIds = [
        '#calc-amount',
        '#calc-eca-rate'
    ];

    inputIds.forEach(function (sel) {
        var el = document.querySelector(sel);
        if (el) {
            el.addEventListener('input', calculateSavings);
        }
    });

    // Country select - fires on change
    var countryEl = document.querySelector('#calc-country');
    if (countryEl) {
        countryEl.addEventListener('change', calculateSavings);
    }

    // Equipment type select (optional) - fires on change
    var equipEl = document.querySelector('#calc-equipment-type');
    if (equipEl) {
        equipEl.addEventListener('change', calculateSavings);
    }

    // --- Run the initial calculation ---
    calculateSavings();
}

/* ===================================================================
   ATTACH PUBLIC FUNCTIONS TO WINDOW
   These are callable from inline HTML event handlers (onclick, etc.).
   =================================================================== */
window.calculateSavings   = calculateSavings;
window.toggleAmortization = toggleAmortization;
window.toggleCurrency     = toggleCurrency;
window.shareCalculation   = shareCalculation;
window.exportPDF          = exportPDF;

/* ===================================================================
   AUTO-INIT ON DOM READY
   Guarded: only runs if the calculator form is present on the page.
   =================================================================== */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
} else {
    // DOM is already ready (script loaded with defer or at end of body)
    initCalculator();
}
