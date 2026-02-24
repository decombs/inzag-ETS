/* =========================================================================
   INZAG ETS — main.js
   Shared JavaScript for all pages: nav, chatbot, WhatsApp widget, globals.
   ========================================================================= */

/* =====================================================================
   1. GLOBAL STATE
   Namespace for cross-component communication.
   Calculator and readiness pages write to these; WhatsApp reads them.
   ===================================================================== */
window.INZAG = window.INZAG || {};
window.INZAG.calcSavings    = null;   // set by calculator after calculation (e.g. "$66,000/mo")
window.INZAG.calcAmount     = null;   // set by calculator after calculation (e.g. "$5,000,000")
window.INZAG.readinessResult = null;  // set by readiness wizard after completion (e.g. "Excellent Fit")
window.INZAG.whatsappNumber  = '4961195001460';


/* =====================================================================
   2. NAV SCROLL BEHAVIOR
   Adds / removes `.scrolled` on `#nav` when the user scrolls past 50 px.
   ===================================================================== */
function initNavScroll() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}


/* =====================================================================
   3. MOBILE NAV TOGGLE
   Clicking `.nav-mobile-toggle` toggles `.mobile-open` on `.nav-links`.
   ===================================================================== */
function initMobileNav() {
    var toggle = document.querySelector('.nav-mobile-toggle');
    var links  = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
        links.classList.toggle('mobile-open');
    });
}


/* =====================================================================
   4. COUNTRY DROPDOWN NAV
   Desktop: show on hover.  Mobile / touch: show on click.
   Targets elements with `.nav-dropdown` (the <li> wrapper)
   and `.nav-dropdown-menu` (the flyout).
   ===================================================================== */
function initNavDropdown() {
    var dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(function (dropdown) {
        var menu = dropdown.querySelector('.nav-dropdown-menu');
        if (!menu) return;

        // Desktop — hover
        dropdown.addEventListener('mouseenter', function () {
            menu.classList.add('show');
        });
        dropdown.addEventListener('mouseleave', function () {
            menu.classList.remove('show');
        });

        // Mobile / touch — click on the toggle link
        var trigger = dropdown.querySelector('.nav-dropdown-toggle');
        if (trigger) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                menu.classList.toggle('show');
            });
        }
    });

    // Close all dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        dropdowns.forEach(function (dropdown) {
            if (!dropdown.contains(e.target)) {
                var menu = dropdown.querySelector('.nav-dropdown-menu');
                if (menu) menu.classList.remove('show');
            }
        });
    });
}


/* =====================================================================
   5. CHATBOT
   Guided-flow chatbot with free-text keyword fallback.
   ===================================================================== */

// ---- 5a. Chat flow definition ----
var chatFlow = {
    start: {
        bot: "Hi! I'm the INZAG ETS Finance Assistant. I can help you understand if ECA-backed equipment financing could work for your business. What would you like to know?",
        options: [
            { text: "What is ECA financing?", next: "what_is_eca" },
            { text: "Do I qualify?",           next: "qualify_sector" },
            { text: "How much can I save?",    next: "savings" },
            { text: "Talk to a human",         next: "human" }
        ]
    },
    what_is_eca: {
        bot: "Export Credit Agencies (ECAs) are government institutions in Europe. When you buy equipment from a European manufacturer, the ECA guarantees the loan \u2014 meaning a European bank can offer you much better rates (4-7%) and longer terms (5-8 years) than your local bank. You only need 15% upfront. Think of it as the European government helping make the deal happen, because it supports their manufacturers too. It\u2019s a win-win.",
        options: [
            { text: "Do I qualify?",              next: "qualify_sector" },
            { text: "Which ECAs do you work with?", next: "which_ecas" },
            { text: "How much can I save?",       next: "savings" }
        ]
    },
    which_ecas: {
        bot: "We work with ECAs from six European countries: Euler Hermes (Germany), SACE (Italy), UKEF (United Kingdom), Bpifrance (France), EKN (Sweden), and OeKB (Austria). Each supports equipment exports from their country. SACE and UKEF are particularly active in African markets right now. We match you to the right ECA based on what equipment you need and where it\u2019s manufactured.",
        options: [
            { text: "Do I qualify?",       next: "qualify_sector" },
            { text: "What\u2019s the process?", next: "process" },
            { text: "Talk to a human",     next: "human" }
        ]
    },
    qualify_sector: {
        bot: "Let\u2019s do a quick check. First \u2014 what sector is your business in?",
        options: [
            { text: "Mining & Resources",              next: "qualify_size" },
            { text: "Construction",                    next: "qualify_size" },
            { text: "Manufacturing",                   next: "qualify_size" },
            { text: "Energy / Utilities / Logistics",  next: "qualify_size" }
        ]
    },
    qualify_size: {
        bot: "Great, that sector fits well. Now \u2014 roughly how much is the equipment you need?",
        options: [
            { text: "Under $1 million", next: "too_small" },
            { text: "$1\u20135 million",    next: "qualify_revenue" },
            { text: "$5\u201315 million",   next: "qualify_revenue" },
            { text: "Over $15 million", next: "qualify_revenue" }
        ]
    },
    too_small: {
        bot: "For amounts under $1M, ECA financing can be challenging due to the transaction costs involved. However, we sometimes bundle multiple equipment purchases into a single larger package. Would you like to discuss this with our team?",
        options: [
            { text: "Yes, let\u2019s talk",           next: "human" },
            { text: "What if I combine orders?", next: "qualify_revenue" },
            { text: "Start over",                next: "start" }
        ]
    },
    qualify_revenue: {
        bot: "Good. And roughly \u2014 what is your company\u2019s annual revenue?",
        options: [
            { text: "Under $20M",   next: "qualify_result_possible" },
            { text: "$20\u201350M",     next: "qualify_result_strong" },
            { text: "$50\u2013150M",    next: "qualify_result_strong" },
            { text: "Over $150M",   next: "qualify_result_strong" }
        ]
    },
    qualify_result_strong: {
        bot: "Based on what you\u2019ve told me, you look like a strong fit for ECA-backed financing. Companies in your range \u2014 private, established, with clear CAPEX needs \u2014 are exactly who this financing is designed for. The next step would be a confidential conversation with our team. We can assess feasibility in about 2 weeks, with no obligation or upfront fees.",
        options: [
            { text: "I\u2019d like to talk to your team", next: "human" },
            { text: "How much can I save?",          next: "savings" },
            { text: "What\u2019s the process?",           next: "process" }
        ]
    },
    qualify_result_possible: {
        bot: "Companies under $20M in revenue can sometimes qualify, depending on the specifics \u2014 your track record, the project economics, and whether you have hard-currency revenue. It\u2019s worth a conversation with our team to assess your situation. No obligation.",
        options: [
            { text: "Let\u2019s explore it",      next: "human" },
            { text: "What else do I need?", next: "process" },
            { text: "Start over",           next: "start" }
        ]
    },
    savings: {
        bot: "The savings can be significant. For example, on a $5M equipment purchase, a typical African company might pay ~$127,000/month with a local bank (18%, 3-year term). With ECA financing, that drops to ~$61,000/month (5.5%, 7-year term) \u2014 nearly half. Plus you need only 15% upfront instead of 30%. Try our Savings Calculator above for numbers specific to your situation!",
        options: [
            { text: "Do I qualify?",       next: "qualify_sector" },
            { text: "What\u2019s the process?", next: "process" },
            { text: "Talk to your team",   next: "human" }
        ]
    },
    process: {
        bot: "The process typically takes 6-12 months:\n\n1. You tell us what equipment you need\n2. We source the best European manufacturers\n3. We structure a financing package with an ECA guarantee\n4. A European bank provides the loan\n5. Equipment is delivered, you repay over 5-8 years\n\nYou deal with one partner (us). We handle all the coordination between manufacturers, banks, and ECAs. Our fee is built into the financing \u2014 no upfront cost to you.",
        options: [
            { text: "Do I qualify?",      next: "qualify_sector" },
            { text: "Let\u2019s get started", next: "human" },
            { text: "Start over",         next: "start" }
        ]
    },
    human: {
        bot: "You can reach our team at ets@inzag.de \u2014 or use the Contact button on this page. Tell us briefly about your company, the equipment you need, and the approximate value. We\u2019ll get back to you within a few business days with an initial assessment. Completely confidential, no obligation.",
        options: [
            { text: "Start over",               next: "start" },
            { text: "What is ECA financing?",    next: "what_is_eca" }
        ]
    }
};

// ---- 5b. DOM helpers ----

/**
 * Append a bot message bubble to the chat window.
 */
function addBotMessage(text) {
    var chatMessages = document.getElementById('chatbot-messages');
    if (!chatMessages) return;

    var msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    msg.textContent = text;
    chatMessages.appendChild(msg);
}

/**
 * Append a user message bubble to the chat window.
 */
function addUserMessage(text) {
    var chatMessages = document.getElementById('chatbot-messages');
    if (!chatMessages) return;

    var msg = document.createElement('div');
    msg.className = 'chat-msg user';
    msg.textContent = text;
    chatMessages.appendChild(msg);
}

/**
 * Render option buttons below the latest bot message.
 * Clicking an option sends the user reply and advances to the next step.
 */
function addOptions(options) {
    var chatMessages = document.getElementById('chatbot-messages');
    if (!chatMessages) return;

    var container = document.createElement('div');
    container.className = 'chat-options';

    options.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.className = 'chat-option';
        btn.textContent = opt.text;
        btn.onclick = function () {
            container.remove();
            addUserMessage(opt.text);
            setTimeout(function () { showStep(opt.next); }, 400);
        };
        container.appendChild(btn);
    });

    chatMessages.appendChild(container);
}

/**
 * Display a chat-flow step: bot message + option buttons (if any).
 */
function showStep(stepName) {
    var step = chatFlow[stepName];
    if (!step) return;

    addBotMessage(step.bot);

    var chatMessages = document.getElementById('chatbot-messages');
    if (!chatMessages) return;

    if (step.options) {
        setTimeout(function () {
            addOptions(step.options);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 300);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Toggle the chatbot window open / closed.
 * On first open, kick off the `start` step.
 */
function toggleChat() {
    var win = document.getElementById('chatbot-window');
    if (!win) return;

    win.classList.toggle('open');

    var chatMessages = document.getElementById('chatbot-messages');
    if (win.classList.contains('open') && chatMessages && chatMessages.children.length === 0) {
        showStep('start');
    }
}

/**
 * Handle free-text input from the chat input field.
 * Uses simple keyword matching to route to the best chat-flow step.
 */
function sendMessage() {
    var input = document.getElementById('chat-input');
    if (!input) return;

    var text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';

    var chatMessages = document.getElementById('chatbot-messages');
    var lower = text.toLowerCase();

    setTimeout(function () {
        if (lower.includes('qualify') || lower.includes('eligible') || lower.includes('can i') || lower.includes('do i')) {
            showStep('qualify_sector');
        } else if (lower.includes('save') || lower.includes('cost') || lower.includes('rate') || lower.includes('interest') || lower.includes('cheap')) {
            showStep('savings');
        } else if (lower.includes('eca') || lower.includes('what is') || lower.includes('explain') || lower.includes('how does')) {
            showStep('what_is_eca');
        } else if (lower.includes('process') || lower.includes('how long') || lower.includes('step') || lower.includes('work')) {
            showStep('process');
        } else if (lower.includes('contact') || lower.includes('talk') || lower.includes('email') || lower.includes('human') || lower.includes('call')) {
            showStep('human');
        } else if (lower.includes('sector') || lower.includes('mining') || lower.includes('construction') || lower.includes('energy') || lower.includes('manufactur')) {
            showStep('qualify_sector');
        } else {
            addBotMessage("I'm best at answering questions about ECA financing, qualification criteria, and the process. Let me help you with one of these:");
            addOptions(chatFlow.start.options);
        }

        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 500);
}

// Expose chatbot functions on window so HTML onclick handlers work
window.toggleChat  = toggleChat;
window.sendMessage = sendMessage;


/* =====================================================================
   6. WHATSAPP WIDGET
   Floating button that opens WhatsApp with a context-aware pre-filled
   message based on the current page and user activity.
   ===================================================================== */

/**
 * Build the appropriate WhatsApp pre-filled message based on context:
 *  - After calculator use  -> include savings figures
 *  - After readiness check -> include result
 *  - Country page          -> mention the country
 *  - Default               -> generic enquiry
 */
function getWhatsAppMessage() {
    // After calculator use
    if (window.INZAG.calcSavings && window.INZAG.calcAmount) {
        return 'Hi, I calculated savings of ' + window.INZAG.calcSavings + ' on ' + window.INZAG.calcAmount + ' equipment.';
    }

    // After readiness assessment
    if (window.INZAG.readinessResult) {
        return 'Hi, I scored ' + window.INZAG.readinessResult + ' on the readiness check.';
    }

    // Country-specific page (detected via data-country attribute on <body>)
    var country = document.body.getAttribute('data-country');
    if (country) {
        return 'Hi, I\'m interested in ECA financing for ' + country + '.';
    }

    // Default
    return 'Hi, I\'m interested in ECA equipment financing.';
}

/**
 * Create and inject the floating WhatsApp button into the page.
 */
function initWhatsApp() {
    var btn = document.createElement('a');
    btn.id = 'whatsapp-widget';
    btn.setAttribute('aria-label', 'Chat on WhatsApp');
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');

    // Build the WhatsApp URL dynamically on each click so the message
    // reflects the latest state (e.g. after a calculator run).
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        var message = encodeURIComponent(getWhatsAppMessage());
        var url = 'https://wa.me/' + window.INZAG.whatsappNumber + '?text=' + message;
        window.open(url, '_blank', 'noopener,noreferrer');
    });
    btn.href = '#'; // placeholder; real URL built on click

    // Inline styles — keeps the widget self-contained
    btn.style.cssText = [
        'position: fixed',
        'bottom: 100px',        // above the chatbot trigger
        'right: 24px',
        'z-index: 999',
        'width: 56px',
        'height: 56px',
        'border-radius: 50%',
        'background: #25D366',  // WhatsApp green
        'display: flex',
        'align-items: center',
        'justify-content: center',
        'box-shadow: 0 4px 12px rgba(0,0,0,0.25)',
        'cursor: pointer',
        'transition: transform 0.2s ease, box-shadow 0.2s ease',
        'text-decoration: none'
    ].join(';');

    // Hover effect
    btn.addEventListener('mouseenter', function () {
        btn.style.transform = 'scale(1.1)';
        btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.3)';
    });
    btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
    });

    // WhatsApp SVG icon (official outline style)
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white">'
        + '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15'
        + '-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475'
        + '-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52'
        + '.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207'
        + '-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297'
        + '-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487'
        + '.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413'
        + '.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378'
        + 'l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884'
        + ' 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884'
        + 'm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945'
        + 'L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893'
        + 'a11.821 11.821 0 0 0-3.48-8.413z"/>'
        + '</svg>';

    document.body.appendChild(btn);
}

// Expose WhatsApp helpers on window
window.getWhatsAppMessage = getWhatsAppMessage;
window.initWhatsApp       = initWhatsApp;


/* =====================================================================
   7. LUCIDE ICON INITIALIZATION
   ===================================================================== */
function initLucide() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}


/* =====================================================================
   8. DOMCONTENTLOADED — BOOTSTRAP EVERYTHING
   ===================================================================== */
document.addEventListener('DOMContentLoaded', function () {
    // Icons
    initLucide();

    // Navigation
    initNavScroll();
    initMobileNav();
    initNavDropdown();

    // WhatsApp floating widget
    initWhatsApp();

    // Chatbot — toggle is wired via onclick="toggleChat()" in the HTML;
    // no auto-open, just make sure the function is on window (done above).
});
