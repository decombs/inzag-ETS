/**
 * INZAG ETS — Readiness Assessment Wizard
 *
 * Multi-step wizard that evaluates a company's fit for ECA-backed
 * equipment financing. Produces a score out of 100 and assigns
 * a tier (Excellent / Good / Possible / Challenging).
 *
 * No external dependencies. Expects wizard HTML already in the page
 * with an element id="wizard".
 */

(function () {
    'use strict';

    // ---------------------------------------------------------------
    // Global namespace — shared with the rest of the INZAG site
    // ---------------------------------------------------------------
    window.INZAG = window.INZAG || {};

    // ---------------------------------------------------------------
    // Constants
    // ---------------------------------------------------------------

    /** Total number of interactive steps (step 4 is the results screen). */
    var TOTAL_STEPS = 4;

    /** Current step the user is on (1-indexed). */
    var currentStep = 1;

    // Sector-to-score mapping (max 10 points)
    var SECTOR_SCORES = {
        'Mining & Resources':    10,
        'Construction':           9,
        'Manufacturing':          8,
        'Energy & Utilities':     9,
        'Logistics & Transport':  7,
        'Agriculture':            6,
        'Other':                  5
    };

    // Result tier definitions (evaluated top-down; first match wins)
    var TIERS = [
        {
            min:     75,
            label:   'Excellent Fit',
            color:   '#2E7D4F',
            message: 'Your company profile is a strong match for ECA-backed equipment financing. ' +
                     'Companies like yours are exactly who this program is designed for. ' +
                     "Let\u2019s start your application."
        },
        {
            min:     50,
            label:   'Good Fit',
            color:   '#2563EB',
            message: "You\u2019re likely eligible for ECA financing. There may be some aspects to " +
                     "structure carefully, but we see a clear path forward. Let\u2019s discuss the details."
        },
        {
            min:     30,
            label:   'Possible Fit',
            color:   '#D97706',
            message: 'ECA financing may work for you, but it will depend on specific factors ' +
                     "we\u2019d need to assess in more detail. We recommend a consultation to explore " +
                     'your options.'
        },
        {
            min:     0,
            label:   'Currently Challenging',
            color:   '#6B7280',
            message: 'Based on your current profile, standard ECA financing may be difficult. ' +
                     "Here\u2019s what would help: longer operating history, higher revenue, or " +
                     "hard-currency income. We\u2019re happy to discuss alternatives."
        }
    ];

    // ---------------------------------------------------------------
    // Helper: get selected radio value by group name
    // ---------------------------------------------------------------

    /**
     * Return the value of the currently selected radio button in a group,
     * or null if nothing is selected.
     *
     * @param  {string}      name  The `name` attribute of the radio group.
     * @return {string|null}
     */
    function getSelectedRadioValue(name) {
        var radios = document.querySelectorAll('input[type="radio"][name="' + name + '"]');
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return null;
    }

    // ---------------------------------------------------------------
    // Progress bar
    // ---------------------------------------------------------------

    /**
     * Update the visual progress indicator to reflect the given step.
     * Looks for elements with `data-step` attributes inside `#wizard-progress`.
     * Falls back gracefully if the progress bar HTML is absent.
     *
     * @param {number} step  Current step (1-4).
     */
    function updateProgressBar(step) {
        // Update individual step indicators (if present)
        var indicators = document.querySelectorAll('#wizard-progress [data-step]');
        for (var i = 0; i < indicators.length; i++) {
            var indicatorStep = parseInt(indicators[i].getAttribute('data-step'), 10);
            indicators[i].classList.remove('active', 'completed');
            if (indicatorStep === step) {
                indicators[i].classList.add('active');
            } else if (indicatorStep < step) {
                indicators[i].classList.add('completed');
            }
        }

        // Update a progress bar fill element (if present)
        var fill = document.getElementById('wizard-progress-fill');
        if (fill) {
            var pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);
            fill.style.width = pct + '%';
        }
    }

    // ---------------------------------------------------------------
    // Step navigation
    // ---------------------------------------------------------------

    /**
     * Show the step matching `stepNumber` and hide all others.
     * Updates the progress bar accordingly.
     *
     * @param {number} stepNumber  Step to display (1-4).
     */
    function showStep(stepNumber) {
        var steps = document.querySelectorAll('.wizard-step');
        for (var i = 0; i < steps.length; i++) {
            steps[i].classList.remove('active');
        }

        var target = document.getElementById('wizard-step-' + stepNumber);
        if (target) {
            target.classList.add('active');
        }

        currentStep = stepNumber;
        updateProgressBar(stepNumber);

        // Scroll wizard into view so the user isn't lost
        var wizard = document.getElementById('wizard');
        if (wizard) {
            wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ---------------------------------------------------------------
    // Validation
    // ---------------------------------------------------------------

    /**
     * Validate all required fields in the current step.
     * Returns true if valid, false otherwise.
     * Shows a brief browser-native alert on failure.
     *
     * @return {boolean}
     */
    function validateStep() {
        var stepEl = document.getElementById('wizard-step-' + currentStep);
        if (!stepEl) return true;

        // Check text / select inputs marked required
        var inputs = stepEl.querySelectorAll('input[required], select[required]');
        for (var i = 0; i < inputs.length; i++) {
            if (!inputs[i].value || inputs[i].value === '') {
                inputs[i].focus();
                alert('Please fill in all required fields before continuing.');
                return false;
            }
        }

        // Check radio groups: gather unique names, ensure one is selected
        var radios = stepEl.querySelectorAll('input[type="radio"]');
        var radioNames = {};
        for (var j = 0; j < radios.length; j++) {
            radioNames[radios[j].name] = true;
        }
        for (var name in radioNames) {
            if (radioNames.hasOwnProperty(name)) {
                if (getSelectedRadioValue(name) === null) {
                    alert('Please make a selection for every question before continuing.');
                    return false;
                }
            }
        }

        return true;
    }

    // ---------------------------------------------------------------
    // Score calculation & results rendering
    // ---------------------------------------------------------------

    /**
     * Gather all form values, compute a score (0-100), determine the
     * result tier, and render the results into step 4.
     */
    function wizardCalculateScore() {
        // --- Collect inputs ---
        var companyName = (document.getElementById('wiz-company') || {}).value || 'Your company';
        var country     = (document.getElementById('wiz-country') || {}).value || '—';
        var sector      = (document.getElementById('wiz-sector') || {}).value  || '—';
        var equipment   = (document.getElementById('wiz-equipment') || {}).value || '—';

        var yearsVal    = parseInt(getSelectedRadioValue('wiz-years') || '0', 10);
        var revenueVal  = parseInt(getSelectedRadioValue('wiz-revenue') || '0', 10);
        var currencyVal = parseInt(getSelectedRadioValue('wiz-currency') || '0', 10);
        var debtVal     = parseInt(getSelectedRadioValue('wiz-debt') || '0', 10);
        var equipVal    = parseInt(getSelectedRadioValue('wiz-value') || '0', 10);
        var timelineVal = parseInt(getSelectedRadioValue('wiz-timeline') || '0', 10);

        // Sector score
        var sectorScore = SECTOR_SCORES[sector] !== undefined ? SECTOR_SCORES[sector] : 5;

        // --- Total score ---
        var totalScore = yearsVal + revenueVal + currencyVal + debtVal + equipVal + timelineVal + sectorScore;

        // Clamp to 0-100
        if (totalScore > 100) totalScore = 100;
        if (totalScore < 0)   totalScore = 0;

        // --- Determine tier ---
        var tier = TIERS[TIERS.length - 1]; // default to last (Challenging)
        for (var i = 0; i < TIERS.length; i++) {
            if (totalScore >= TIERS[i].min) {
                tier = TIERS[i];
                break;
            }
        }

        // --- Expose result globally ---
        window.INZAG.readinessResult = {
            tier:  tier.label,
            score: totalScore
        };

        // --- Human-readable labels for summary ---
        var yearsLabel    = getLabelForRadio('wiz-years');
        var revenueLabel  = getLabelForRadio('wiz-revenue');
        var currencyLabel = getLabelForRadio('wiz-currency');
        var debtLabel     = getLabelForRadio('wiz-debt');
        var equipValLabel = getLabelForRadio('wiz-value');
        var originLabel   = getLabelForRadio('wiz-origin');
        var timelineLabel = getLabelForRadio('wiz-timeline');

        // --- Build summary text (for email / WhatsApp) ---
        var summaryText =
            'INZAG ETS Readiness Assessment\n' +
            '---\n' +
            'Score: ' + totalScore + '/100 (' + tier.label + ')\n' +
            'Company: ' + companyName + '\n' +
            'Country: ' + country + '\n' +
            'Sector: ' + sector + '\n' +
            'Years in operation: ' + yearsLabel + '\n' +
            'Annual revenue: ' + revenueLabel + '\n' +
            'Revenue currency: ' + currencyLabel + '\n' +
            'Debt situation: ' + debtLabel + '\n' +
            'Equipment type: ' + equipment + '\n' +
            'Equipment value: ' + equipValLabel + '\n' +
            'Preferred origin: ' + originLabel + '\n' +
            'Timeline: ' + timelineLabel;

        // --- CTA URLs ---
        var mailSubject = encodeURIComponent('ECA Financing Inquiry — ' + companyName);
        var mailBody    = encodeURIComponent(summaryText);
        var mailHref    = 'mailto:ets@inzag.de?subject=' + mailSubject + '&body=' + mailBody;

        var waText = encodeURIComponent(
            'Hi INZAG ETS, I just completed the readiness assessment and scored ' +
            totalScore + '/100 (' + tier.label + '). ' +
            'Company: ' + companyName + ', Country: ' + country + ', Sector: ' + sector + '. ' +
            "I\u2019d like to discuss next steps."
        );
        var waHref = 'https://wa.me/?text=' + waText;

        var bookCallHref = 'mailto:ets@inzag.de?subject=' + encodeURIComponent('Book a Call — ' + companyName);

        // --- Render results HTML ---
        var resultsContainer = document.getElementById('wizard-results');
        if (!resultsContainer) return;

        resultsContainer.innerHTML =
            // Score meter
            '<div class="wizard-score-section">' +
                '<h3 class="wizard-score-heading">Your Readiness Score</h3>' +
                '<div class="wizard-meter">' +
                    '<div class="wizard-meter-fill" id="wizard-meter-fill" ' +
                        'style="width:0%;background:' + tier.color + '"></div>' +
                '</div>' +
                '<div class="wizard-score-number" style="color:' + tier.color + '">' +
                    totalScore + '<span class="wizard-score-max">/100</span>' +
                '</div>' +

                // Tier badge
                '<span class="wizard-tier-badge" style="background:' + tier.color + '">' +
                    tier.label +
                '</span>' +

                // Tier message
                '<p class="wizard-tier-message">' + tier.message + '</p>' +
            '</div>' +

            // Input summary
            '<div class="wizard-summary">' +
                '<h4>Assessment Summary</h4>' +
                '<table class="wizard-summary-table">' +
                    summaryRow('Company',           companyName) +
                    summaryRow('Country',            country) +
                    summaryRow('Sector',             sector) +
                    summaryRow('Years in Operation',  yearsLabel) +
                    summaryRow('Annual Revenue',      revenueLabel) +
                    summaryRow('Revenue Currency',    currencyLabel) +
                    summaryRow('Debt Situation',      debtLabel) +
                    summaryRow('Equipment Type',      equipment) +
                    summaryRow('Estimated Value',     equipValLabel) +
                    summaryRow('Preferred Origin',    originLabel) +
                    summaryRow('Timeline',            timelineLabel) +
                '</table>' +
            '</div>' +

            // CTAs
            '<div class="wizard-ctas">' +
                '<a href="' + bookCallHref + '" class="wizard-cta wizard-cta--primary">Book a Call</a>' +
                '<a href="' + waHref + '" target="_blank" rel="noopener" class="wizard-cta wizard-cta--whatsapp">Chat on WhatsApp</a>' +
                '<a href="' + mailHref + '" class="wizard-cta wizard-cta--email">Email Us</a>' +
            '</div>';

        // Animate meter bar after a short delay so the CSS transition fires
        setTimeout(function () {
            var fill = document.getElementById('wizard-meter-fill');
            if (fill) {
                fill.style.width = totalScore + '%';
            }
        }, 100);
    }

    /**
     * Get the visible label text for the currently selected radio in a group.
     *
     * @param  {string} name  Radio group name.
     * @return {string}
     */
    function getLabelForRadio(name) {
        var radios = document.querySelectorAll('input[type="radio"][name="' + name + '"]');
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                // Try an associated <label>
                var label = document.querySelector('label[for="' + radios[i].id + '"]');
                if (label) return label.textContent.trim();

                // Fall back to a parent label
                var parentLabel = radios[i].closest('label');
                if (parentLabel) return parentLabel.textContent.trim();

                // Last resort: return the value
                return radios[i].value;
            }
        }
        return '—';
    }

    /**
     * Build a single <tr> for the summary table.
     *
     * @param  {string} label
     * @param  {string} value
     * @return {string} HTML string
     */
    function summaryRow(label, value) {
        return '<tr><td class="wizard-summary-label">' + label + '</td>' +
               '<td class="wizard-summary-value">' + value + '</td></tr>';
    }

    // ---------------------------------------------------------------
    // Public API (attached to window for onclick handlers in HTML)
    // ---------------------------------------------------------------

    /**
     * Advance to the next step. Validates the current step first.
     * When moving to step 4 (results), triggers score calculation.
     */
    function wizardNext() {
        if (!validateStep()) return;

        if (currentStep < TOTAL_STEPS) {
            var nextStep = currentStep + 1;

            // If we are about to show results, calculate the score first
            if (nextStep === TOTAL_STEPS) {
                wizardCalculateScore();
            }

            showStep(nextStep);
        }
    }

    /**
     * Go back to the previous step.
     */
    function wizardBack() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    }

    // ---------------------------------------------------------------
    // Initialization
    // ---------------------------------------------------------------

    /**
     * Set up the wizard: bind event listeners, show step 1, and
     * initialize the progress bar.
     * Only runs if `#wizard` exists in the DOM.
     */
    function initWizard() {
        var wizard = document.getElementById('wizard');
        if (!wizard) return;

        // Show step 1
        showStep(1);

        // Delegate click events for Next / Back buttons inside the wizard
        wizard.addEventListener('click', function (e) {
            var target = e.target.closest('[data-wizard-action]');
            if (!target) return;

            var action = target.getAttribute('data-wizard-action');
            if (action === 'next') {
                wizardNext();
            } else if (action === 'back') {
                wizardBack();
            }
        });
    }

    // Expose functions globally so they can be called from inline HTML handlers
    window.initWizard             = initWizard;
    window.wizardNext             = wizardNext;
    window.wizardBack             = wizardBack;
    window.wizardCalculateScore   = wizardCalculateScore;
    window.getSelectedRadioValue  = getSelectedRadioValue;
    window.updateProgressBar      = updateProgressBar;

    // ---------------------------------------------------------------
    // Auto-init on DOMContentLoaded (guarded by #wizard existence)
    // ---------------------------------------------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWizard);
    } else {
        // DOM already ready (script loaded defer / at bottom of body)
        initWizard();
    }
})();
