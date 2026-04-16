/* invoices.js — Invoices, detail modal, Pay Now modal with multiple payment methods */

const invoicesData = [
    {
        id: 'INV-001', project: 'Tagaytay Villa', date: 'Oct 12, 2023', due: 'Oct 26, 2023',
        amount: 50000, status: 'paid', paymentType: 'downpayment',
        client: 'Juan dela Cruz', clientAddr: '456 Rizal Ave, Quezon City', clientEmail: 'juan@email.com',
        items: [
            { service: 'Working Drawing (Architectural)', qty: 1, rate: 25000 },
            { service: '3D Exterior Model',              qty: 1, rate: 15000 },
            { service: 'Realistic Render (5 views)',     qty: 1, rate: 10000 },
        ],
        history: [
            { event: 'Invoice created by accounting@arcbase.ph', time: 'Oct 12, 2023 9:00 AM' },
            { event: 'Payment received via GCash',               time: 'Oct 20, 2023 2:14 PM' },
            { event: 'Invoice marked as PAID',                   time: 'Oct 20, 2023 2:15 PM' },
        ]
    },
    {
        id: 'INV-002', project: 'Tagaytay Villa', date: 'Nov 05, 2023', due: 'Nov 19, 2023',
        amount: 75000, status: 'pending', paymentType: 'progress', dueWarning: 'Due in 2 days',
        client: 'Juan dela Cruz', clientAddr: '456 Rizal Ave, Quezon City', clientEmail: 'juan@email.com',
        items: [
            { service: 'Full Working Drawing Set (Structural)', qty: 1, rate: 40000 },
            { service: 'Interior 3D Model',                    qty: 2, rate: 12500 },
            { service: 'Landscape Rendering',                  qty: 1, rate: 10000 },
        ],
        history: [
            { event: 'Invoice created by accounting@arcbase.ph', time: 'Nov 05, 2023 10:00 AM' },
            { event: 'Reminder sent to client',                  time: 'Nov 17, 2023 9:00 AM' },
        ]
    },
    {
        id: 'INV-003', project: 'Nimbus Villa', date: 'Dec 01, 2023', due: 'Dec 15, 2023',
        amount: 24000, status: 'overdue', paymentType: 'final',
        client: 'Juan dela Cruz', clientAddr: '456 Rizal Ave, Quezon City', clientEmail: 'juan@email.com',
        items: [
            { service: 'Consultation Package (4 sessions)', qty: 4, rate: 5000 },
            { service: 'Permit Assistance',                 qty: 1, rate: 4000 },
        ],
        history: [
            { event: 'Invoice created by accounting@arcbase.ph', time: 'Dec 01, 2023 8:30 AM' },
            { event: 'Overdue reminder sent',                    time: 'Dec 16, 2023 9:00 AM' },
        ]
    },
];

const statusStyles = {
    paid:    { badge: 'bg-emerald-100 text-emerald-700', label: 'PAID' },
    pending: { badge: 'bg-amber-100 text-amber-700',    label: 'PENDING' },
    overdue: { badge: 'bg-[#e6f7f9] text-[#003049]',      label: 'OVERDUE' },
};

function refreshInvoiceSummary() {
    const unpaid = invoicesData.filter(i => i.status === 'pending' || i.status === 'overdue');
    const outstanding = unpaid.reduce((s, i) => s + i.amount, 0);
    const pending     = invoicesData.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

    const outEl = document.getElementById('total-outstanding');
    const penEl = document.getElementById('total-pending');
    if (outEl) outEl.textContent = `₱${outstanding.toLocaleString()}`;
    if (penEl) penEl.textContent = `₱${pending.toLocaleString()}`;

    const payNowBtn = document.getElementById('pay-all-btn');
    if (payNowBtn) payNowBtn.style.display = outstanding > 0 ? 'block' : 'none';
}

function renderInvoiceTable() {
    const payTypeCfg = {
        downpayment: { cls:'bg-[#e6f7f9] text-[#003049] border-[#b2e8ed]', label:'Downpayment' },
        progress:    { cls:'bg-amber-50 text-amber-700 border-amber-200',   label:'Progress Billing' },
        final:       { cls:'bg-red-50 text-red-700 border-red-200',         label:'Final Payment' },
    };
    const tbody = document.getElementById('invoice-table-body');
    tbody.innerHTML = '';
    invoicesData.forEach(inv => {
        const s = statusStyles[inv.status];
        const canPay = inv.status === 'pending' || inv.status === 'overdue';
        const pt = payTypeCfg[inv.paymentType] || { cls:'bg-slate-100 text-slate-500 border-slate-200', label: inv.paymentType || '—' };
        const finalNotice = inv.paymentType === 'final' && canPay
            ? `<p class="text-[9px] text-red-500 font-semibold mt-0.5">⚠ Files unlock after payment</p>` : '';
        tbody.innerHTML += `
        <tr class="border-b border-slate-50 hover:bg-slate-50 transition-all">
            <td class="px-6 py-4 text-sm font-bold text-slate-700">${inv.id}</td>
            <td class="px-6 py-4 text-sm text-slate-600">
                ${inv.project}
                ${inv.dueWarning ? `<span class="ml-2 text-[10px] font-bold text-[#00A3B4] border border-[#b2e8ed] bg-[#e6f7f9] px-2 py-0.5 rounded-full">${inv.dueWarning}</span>` : ''}
                ${finalNotice}
            </td>
            <td class="px-6 py-4">
                <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border ${pt.cls}">${pt.label}</span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">${inv.date}</td>
            <td class="px-6 py-4 text-sm font-bold text-slate-800">₱${inv.amount.toLocaleString()}</td>
            <td class="px-6 py-4"><span class="text-[10px] font-bold px-2.5 py-1 rounded-full ${s.badge}">${s.label}</span></td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    <button onclick="openInvoiceModal('${inv.id}')" class="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg transition-all hover:bg-slate-50">
                        <iconify-icon icon="solar:eye-linear" width="13"></iconify-icon> View
                    </button>
                    ${canPay ? `<button onclick="openPayModal('${inv.id}')" class="flex items-center gap-1 text-xs font-semibold text-[#00A3B4] hover:text-white border border-[#b2e8ed] hover:bg-[#00A3B4] px-3 py-1.5 rounded-lg transition-all">Pay Now</button>` : ''}
                </div>
            </td>
        </tr>`;
    });
    refreshInvoiceSummary();
}

function openInvoiceModal(id) {
    const inv = invoicesData.find(i => i.id === id);
    if (!inv) return;

    document.getElementById('inv-modal-title').textContent  = `Invoice ${inv.id}`;
    document.getElementById('inv-number').textContent       = `#${inv.id}`;
    document.getElementById('inv-client-name').textContent  = inv.client;
    document.getElementById('inv-client-addr').textContent  = inv.clientAddr;
    document.getElementById('inv-client-email').textContent = inv.clientEmail;
    document.getElementById('inv-date').textContent         = inv.date;
    document.getElementById('inv-due').textContent          = inv.due;
    document.getElementById('inv-project').textContent      = inv.project;

    const subtotal = inv.items.reduce((s, i) => s + (i.qty * i.rate), 0);
    const vat      = Math.round(subtotal * 0.12);
    const total    = subtotal + vat;

    document.getElementById('inv-line-items').innerHTML = inv.items.map(item => `
        <tr>
            <td class="py-2.5 text-sm text-slate-700">${item.service}</td>
            <td class="py-2.5 text-sm text-slate-500 text-right">${item.qty}</td>
            <td class="py-2.5 text-sm text-slate-500 text-right">₱${item.rate.toLocaleString()}</td>
            <td class="py-2.5 text-sm font-bold text-slate-800 text-right">₱${(item.qty * item.rate).toLocaleString()}</td>
        </tr>`).join('');

    document.getElementById('inv-subtotal').textContent = `₱${subtotal.toLocaleString()}`;
    document.getElementById('inv-vat').textContent      = `₱${vat.toLocaleString()}`;
    document.getElementById('inv-total').textContent    = `₱${total.toLocaleString()}`;

    document.getElementById('inv-history').innerHTML = inv.history.map(h => `
        <div class="flex items-start gap-3">
            <div class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <iconify-icon icon="solar:check-circle-bold" class="text-slate-400" width="12"></iconify-icon>
            </div>
            <div>
                <p class="text-xs text-slate-700">${h.event}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">${h.time}</p>
            </div>
        </div>`).join('');

    // Show/hide Pay Now button in modal
    const canPay = inv.status === 'pending' || inv.status === 'overdue';
    const payBtn = document.getElementById('inv-pay-btn');
    if (payBtn) payBtn.style.display = canPay ? 'flex' : 'none';

    currentInvoiceId = id;
    document.getElementById('invoice-modal').classList.remove('hidden');
}

function closeInvoiceModal() { document.getElementById('invoice-modal').classList.add('hidden'); }

function printInvoice() {
    const content = document.getElementById('invoice-content').innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Invoice</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <style>body{font-family:sans-serif;padding:2rem;}<\/style>
        </head><body class="p-8">${content}
        <script>window.onload=()=>{window.print();window.close();}<\/script></body></html>`);
    win.document.close();
}

/* ── Pay Now Modal ── */
let currentInvoiceId = null;
let promoApplied     = false;

function openPayModal(invoiceId) {
    const targets = invoiceId
        ? invoicesData.filter(i => i.id === invoiceId)
        : invoicesData.filter(i => i.status === 'pending' || i.status === 'overdue');

    currentInvoiceId = invoiceId || null;
    promoApplied     = false;

    const first = targets[0];
    if (first) {
        document.getElementById('pay-order-id').textContent = invoiceId ? `#${first.id}` : '#Multiple';
        document.getElementById('pay-email').textContent    = first.clientEmail;
        document.getElementById('pay-name').value           = first.client;
        document.getElementById('pay-addr').value           = first.clientAddr;

        // Payment type banner
        const payTypeBanner = document.getElementById('pay-type-banner');
        if (payTypeBanner) {
            const ptLabels = { downpayment:'Downpayment', progress:'Progress Billing', final:'Final Payment' };
            const ptColors = { downpayment:'bg-[#e6f7f9] text-[#003049] border-[#b2e8ed]', progress:'bg-amber-50 text-amber-700 border-amber-200', final:'bg-red-50 text-red-700 border-red-200' };
            const pt = first.paymentType || 'progress';
            payTypeBanner.className = `flex items-center gap-3 border rounded-xl px-4 py-3 ${ptColors[pt] || ptColors.progress}`;
            payTypeBanner.innerHTML = `<iconify-icon icon="solar:tag-price-bold" width="16" class="shrink-0"></iconify-icon>
                <div>
                    <p class="text-xs font-bold">${ptLabels[pt] || 'Payment'}</p>
                    ${pt === 'final' ? '<p class="text-[10px] mt-0.5">Handover files will be unlocked after your payment is confirmed by admin.</p>' : pt === 'downpayment' ? '<p class="text-[10px] mt-0.5">This is the required downpayment to start your project.</p>' : '<p class="text-[10px] mt-0.5">Progress billing for completed milestones.</p>'}
                </div>`;
            payTypeBanner.classList.remove('hidden');
        }
    }

    const summaryEl = document.getElementById('pay-summary-items');
    summaryEl.innerHTML = '';
    targets.forEach(i => {
        summaryEl.innerHTML += `
        <div class="flex items-start gap-3 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
            <div class="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center shrink-0">
                <iconify-icon icon="solar:document-bold" class="text-slate-500" width="18"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-slate-800 truncate">${i.project}</p>
                <p class="text-[10px] text-slate-400">${i.id} · ${i.items.length} service${i.items.length > 1 ? 's' : ''}</p>
            </div>
            <p class="text-xs font-bold text-slate-800 shrink-0">₱${i.amount.toLocaleString()}</p>
        </div>`;
    });

    updatePayTotals(targets, 0);
    document.getElementById('promo-input').value = '';
    document.getElementById('promo-msg').classList.add('hidden');
    document.getElementById('pay-discount-row').classList.add('hidden');
    switchPayMethod('gcash');
    document.querySelector('input[name="pay_method"][value="gcash"]').checked = true;
    document.getElementById('invoice-modal').classList.add('hidden');
    document.getElementById('pay-modal').classList.remove('hidden');
}

function submitPayment() {
    const name = document.getElementById('pay-name').value.trim();
    if (!name) { document.getElementById('pay-name').focus(); return; }

    // Validate reference number for the active payment method
    const method = document.querySelector('input[name="pay_method"]:checked')?.value;
    if (method && method !== 'cod') {
        const refInputs = {
            gcash: document.querySelector('#panel-gcash input[type="text"]'),
            bdo:   document.querySelector('#panel-bdo input[type="text"]'),
            bpi:   document.querySelector('#panel-bpi input[type="text"]'),
            unionbank: document.querySelector('#panel-unionbank input[type="text"]'),
        };
        const refInput = refInputs[method];
        if (refInput && !refInput.value.trim()) {
            refInput.style.borderColor = '#F77F00';
            refInput.focus();
            refInput.placeholder = '⚠ Reference number is required';
            setTimeout(() => { refInput.style.borderColor = ''; }, 3000);
            return;
        }
        // Validate receipt upload
        const receiptInputs = {
            gcash: document.querySelector('#panel-gcash input[type="file"]'),
            bdo:   document.querySelector('#panel-bdo input[type="file"]'),
            bpi:   document.querySelector('#panel-bpi input[type="file"]'),
            unionbank: document.querySelector('#panel-unionbank input[type="file"]'),
        };
        const receiptInput = receiptInputs[method];
        if (receiptInput && !receiptInput.files?.length) {
            const dropZone = receiptInput.closest('.receipt-upload-zone') || receiptInput.parentElement;
            if (dropZone) {
                dropZone.style.borderColor = '#F77F00';
                setTimeout(() => { dropZone.style.borderColor = ''; }, 3000);
            }
            if (typeof showToastMsg === 'function') showToastMsg('Please upload your payment receipt.');
            return;
        }
    }

    closePayModal();
    if (currentInvoiceId) {
        const inv = invoicesData.find(i => i.id === currentInvoiceId);
        if (inv) {
            inv.status = 'paid';
            delete inv.dueWarning;
            inv.history.push({ event: `Payment submitted by client via ${method?.toUpperCase() || 'Online'}`, time: new Date().toLocaleString() });
        }
    }
    renderInvoiceTable();
    showToastMsg('✅ Payment submitted! Admin will confirm your payment within 24 hours.');
}

function updatePayTotals(targets, discountAmt) {
    const subtotal = targets.reduce((s, i) => s + i.amount, 0);
    const vat      = Math.round(subtotal * 0.12);
    const total    = subtotal + vat - discountAmt;
    document.getElementById('pay-subtotal').textContent = `₱${subtotal.toLocaleString()}`;
    document.getElementById('pay-vat').textContent      = `₱${vat.toLocaleString()}`;
    document.getElementById('pay-total').textContent    = `₱${total.toLocaleString()}`;
    if (discountAmt > 0) {
        document.getElementById('pay-discount').textContent = `-₱${discountAmt.toLocaleString()}`;
        document.getElementById('pay-discount-row').classList.remove('hidden');
    }
}

function closePayModal() { document.getElementById('pay-modal').classList.add('hidden'); }

function switchPayMethod(method) {
    const methods = ['gcash','bdo','bpi','unionbank'];
    methods.forEach(m => {
        const card  = document.getElementById(`pm-${m}`);
        const panel = document.getElementById(`panel-${m}`);
        if (card)  card.className  = `pay-method-card flex items-center gap-4 border-2 ${m === method ? 'border-[#00A3B4] bg-[#e6f7f9]' : 'border-slate-200 bg-white hover:border-slate-300'} rounded-2xl px-5 py-4 cursor-pointer transition-all`;
        if (panel) panel.classList.toggle('hidden', m !== method);
    });
}

function applyPromo() {
    const code   = document.getElementById('promo-input').value.trim().toUpperCase();
    const msgEl  = document.getElementById('promo-msg');
    const target = currentInvoiceId
        ? invoicesData.filter(i => i.id === currentInvoiceId)
        : invoicesData.filter(i => i.status === 'pending' || i.status === 'overdue');
    msgEl.classList.remove('hidden');
    if (code === 'ARCBASE10') {
        const discount = Math.round(target.reduce((s, i) => s + i.amount, 0) * 0.10);
        updatePayTotals(target, discount);
        msgEl.className   = 'text-[10px] mt-1.5 text-emerald-600 font-semibold';
        msgEl.textContent = '✓ Promo code applied! 10% discount.';
        promoApplied = true;
    } else if (!code) {
        msgEl.className   = 'text-[10px] mt-1.5 text-slate-400';
        msgEl.textContent = 'Enter a promo code above.';
    } else {
        msgEl.className   = 'text-[10px] mt-1.5 text-[#00A3B4] font-semibold';
        msgEl.textContent = '✗ Invalid promo code.';
    }
}

function submitPayment() {
    const name = document.getElementById('pay-name').value.trim();
    if (!name) { document.getElementById('pay-name').focus(); return; }
    closePayModal();
    if (currentInvoiceId) {
        const inv = invoicesData.find(i => i.id === currentInvoiceId);
        if (inv) {
            inv.status = 'paid';
            delete inv.dueWarning;
            inv.history.push({ event: 'Payment submitted by client', time: new Date().toLocaleString() });
        }
    }
    renderInvoiceTable();
    showToastMsg('Payment Submitted Successfully!');
}
