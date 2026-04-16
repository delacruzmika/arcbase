/* invoices.js — Admin Billing & Payment Management */

let adminInvFilter = 'all';

function renderInvoices() {
    const el = document.getElementById('page-invoices');
    if (!el) return;

    const filtered = adminInvFilter === 'all' ? adminInvoices : adminInvoices.filter(i => i.status === adminInvFilter);
    const totalPaid = adminInvoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0);
    const totalPending = adminInvoices.filter(i=>i.status==='pending').reduce((s,i)=>s+i.amount,0);
    const totalSubmitted = adminInvoices.filter(i=>i.status==='submitted').reduce((s,i)=>s+i.amount,0);

    const statusCfg = {
        paid:      { cls:'bg-emerald-100 text-emerald-700 border-emerald-200', label:'PAID' },
        pending:   { cls:'bg-amber-100 text-amber-700 border-amber-200',       label:'PENDING' },
        submitted: { cls:'bg-[#e6f7f9] text-[#003049] border-[#b2e8ed]',       label:'SUBMITTED' },
        overdue:   { cls:'bg-red-100 text-red-600 border-red-200',             label:'OVERDUE' },
    };
    const payTypeCfg = {
        downpayment: { cls:'bg-[#e6f7f9] text-[#003049]', label:'Downpayment' },
        progress:    { cls:'bg-amber-50 text-amber-700',   label:'Progress' },
        final:       { cls:'bg-red-50 text-red-700',       label:'Final' },
    };

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Invoices & Billing</h1>
                <p class="text-sm text-slate-400 mt-1">Generate invoices, confirm payments and track billing.</p>
            </div>
            <button onclick="openCreateInvoice()" class="flex items-center gap-2 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                <iconify-icon icon="solar:add-circle-linear" width="16"></iconify-icon> Create Invoice
            </button>
        </div>

        <!-- Summary cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            ${[
                { label:'Total Collected', val:'₱'+totalPaid.toLocaleString(), icon:'solar:check-circle-bold', color:'#16a34a' },
                { label:'Awaiting Confirm', val:'₱'+totalSubmitted.toLocaleString(), icon:'solar:clock-circle-bold', color:'#00A3B4' },
                { label:'Outstanding', val:'₱'+totalPending.toLocaleString(), icon:'solar:card-bold', color:'#F77F00' },
                { label:'Total Invoices', val:adminInvoices.length, icon:'solar:document-bold', color:'#003049' },
            ].map(c=>`
            <div class="bg-white rounded-2xl border border-slate-200 p-5">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${c.label}</p>
                    <iconify-icon icon="${c.icon}" style="color:${c.color}" width="18"></iconify-icon>
                </div>
                <p class="text-2xl font-bold" style="color:${c.color}">${c.val}</p>
            </div>`).join('')}
        </div>

        <!-- Submitted payments alert -->
        ${adminInvoices.filter(i=>i.status==='submitted').length ? `
        <div class="bg-[#e6f7f9] border border-[#b2e8ed] rounded-2xl p-5 space-y-3">
            <div class="flex items-center gap-2"><iconify-icon icon="solar:bell-bing-bold" style="color:#00A3B4" width="18"></iconify-icon><p class="text-sm font-bold" style="color:#003049">Payments Awaiting Confirmation</p></div>
            ${adminInvoices.filter(i=>i.status==='submitted').map(i=>`
            <div class="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-[#b2e8ed]">
                <div>
                    <p class="text-xs font-bold text-slate-800">${i.id} — ${i.clientName}</p>
                    <p class="text-[10px] text-slate-500">₱${i.amount.toLocaleString()} via ${i.method||'?'} · Ref: ${i.refNo||'—'}</p>
                </div>
                <button onclick="openConfirmPayment('${i.id}')" class="text-xs font-bold text-white px-4 py-2 rounded-xl transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Confirm</button>
            </div>`).join('')}
        </div>` : ''}

        <!-- Filters -->
        <div class="flex items-center gap-2 flex-wrap">
            ${['all','submitted','pending','paid'].map(f=>`
            <button onclick="adminInvFilter='${f}';renderInvoices()" class="text-xs font-bold px-4 py-2 rounded-xl transition-all ${adminInvFilter===f?'bg-[#003049] text-white':'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}">
                ${f.charAt(0).toUpperCase()+f.slice(1)} (${f==='all'?adminInvoices.length:adminInvoices.filter(i=>i.status===f).length})
            </button>`).join('')}
        </div>

        <!-- Invoice table -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="border-b border-slate-100">
                        <tr>${['Invoice ID','Client','Project','Type','Amount','Status','Action'].map(h=>`<th class="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${filtered.map(inv => {
                            const s  = statusCfg[inv.status] || statusCfg.pending;
                            const pt = payTypeCfg[inv.paymentType] || { cls:'bg-slate-100 text-slate-500', label:inv.paymentType };
                            return `
                            <tr class="tbl-row border-b border-slate-50 last:border-0">
                                <td class="px-5 py-3.5 text-xs font-bold text-slate-700">${inv.id}</td>
                                <td class="px-5 py-3.5 text-xs text-slate-600">${inv.clientName}</td>
                                <td class="px-5 py-3.5 text-xs text-slate-500">${inv.projectName}</td>
                                <td class="px-5 py-3.5"><span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${pt.cls}">${pt.label}</span></td>
                                <td class="px-5 py-3.5 text-xs font-bold text-slate-800">₱${inv.amount.toLocaleString()}</td>
                                <td class="px-5 py-3.5"><span class="text-[9px] font-bold px-2.5 py-1 rounded-full border ${s.cls}">${s.label}</span></td>
                                <td class="px-5 py-3.5">
                                    <div class="flex gap-1.5">
                                        <button onclick="openAdminInvDetail('${inv.id}')" class="text-[11px] font-semibold text-slate-500 border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-all">View</button>
                                        ${inv.status==='submitted'?`<button onclick="openConfirmPayment('${inv.id}')" class="text-[11px] font-bold text-[#00A3B4] border border-[#b2e8ed] px-2.5 py-1.5 rounded-lg hover:bg-[#e6f7f9] transition-all">Confirm</button>`:''}
                                        ${inv.status==='pending'?`<button onclick="sendPaymentReminder('${inv.id}')" class="text-[11px] font-semibold text-amber-600 border border-amber-200 px-2.5 py-1.5 rounded-lg hover:bg-amber-50 transition-all">Remind</button>`:''}
                                    </div>
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Confirm Payment Modal -->
    <div id="confirm-pay-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div id="confirm-pay-content" class="bg-white w-full max-w-md rounded-2xl shadow-2xl fade-in"></div>
    </div>

    <!-- Create Invoice Modal -->
    <div id="create-inv-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl fade-in">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <p class="text-sm font-bold text-slate-800">Create Invoice</p>
                <button onclick="document.getElementById('create-inv-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
            </div>
            <div class="p-6 space-y-4">
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Client</label>
                    <select id="ci-client">${clientsData.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select>
                </div>
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Project</label>
                    <select id="ci-project">${adminProjects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Payment Type</label>
                        <select id="ci-type"><option value="downpayment">Downpayment</option><option value="progress">Progress Billing</option><option value="final">Final Payment</option></select>
                    </div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Amount (₱)</label>
                        <input type="number" id="ci-amount" placeholder="0">
                    </div>
                </div>
                <button onclick="saveNewInvoice()" class="w-full text-white font-bold py-3 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Create Invoice</button>
            </div>
        </div>
    </div>

    <!-- Invoice Detail Modal -->
    <div id="admin-inv-detail-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div id="admin-inv-detail-content" class="bg-white w-full max-w-lg rounded-2xl shadow-2xl fade-in overflow-y-auto" style="max-height:90vh"></div>
    </div>`;
}

function openConfirmPayment(id) {
    const inv = adminInvoices.find(i => i.id === id);
    if (!inv) return;
    document.getElementById('confirm-pay-content').innerHTML = `
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p class="text-sm font-bold text-slate-800">Confirm Payment</p>
            <button onclick="document.getElementById('confirm-pay-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
        </div>
        <div class="p-6 space-y-4">
            <div class="bg-[#e6f7f9] border border-[#b2e8ed] rounded-xl px-4 py-3 space-y-1">
                <p class="text-xs font-bold text-[#003049]">${inv.id} — ${inv.clientName}</p>
                <p class="text-sm font-bold" style="color:#003049">₱${inv.amount.toLocaleString()}</p>
                <p class="text-[10px] text-slate-500">Method: ${inv.method||'—'} · Ref: ${inv.refNo||'—'}</p>
                ${inv.receiptUploaded ? `<p class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1"><iconify-icon icon="solar:check-circle-linear" width="11"></iconify-icon> Receipt uploaded by client</p>` : ''}
            </div>
            <p class="text-xs text-slate-500">Confirming this payment will mark the invoice as <strong>Paid</strong> and update the project's payment status.</p>
            <div class="flex gap-3">
                <button onclick="confirmPaymentAction('${inv.id}')" class="flex-1 text-white font-bold py-3 rounded-xl text-sm transition-all" style="background:#16a34a" onmouseover="this.style.background='#15803d'" onmouseout="this.style.background='#16a34a'">
                    <iconify-icon icon="solar:check-circle-bold" width="14"></iconify-icon> Confirm Payment
                </button>
                <button onclick="document.getElementById('confirm-pay-modal').classList.add('hidden')" class="flex-1 text-slate-600 font-bold py-3 rounded-xl text-sm border border-slate-200 hover:bg-slate-50 transition-all">Cancel</button>
            </div>
        </div>`;
    document.getElementById('confirm-pay-modal').classList.remove('hidden');
}

function confirmPaymentAction(id) {
    const inv = adminInvoices.find(i => i.id === id);
    if (!inv) return;
    inv.status = 'paid';
    inv.paidDate = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    // Update project payment flags
    const proj = adminProjects.find(p => p.id === inv.project);
    if (proj) {
        if (inv.paymentType === 'downpayment') proj.downpaymentPaid = true;
        if (inv.paymentType === 'final') { proj.finalPaymentPaid = true; }
    }
    document.getElementById('confirm-pay-modal').classList.add('hidden');
    renderInvoices();
    showToast(`✅ Payment for ${id} confirmed!`);
}

function openCreateInvoice() {
    document.getElementById('create-inv-modal')?.classList.remove('hidden');
}

function saveNewInvoice() {
    const amt = parseFloat(document.getElementById('ci-amount')?.value);
    if (!amt) { showToast('Amount is required.'); return; }
    const clientId = document.getElementById('ci-client')?.value;
    const projId   = document.getElementById('ci-project')?.value;
    const client   = clientsData.find(c => c.id === clientId);
    const proj     = adminProjects.find(p => p.id === projId);
    const newId    = 'INV-' + String(adminInvoices.length + 1).padStart(3,'0');
    adminInvoices.push({
        id:newId, project:projId, projectName:proj?.name||'—',
        clientId, clientName:client?.name||'—',
        paymentType: document.getElementById('ci-type')?.value || 'progress',
        amount:amt, status:'pending',
        date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
        due:'—', paidDate:null, method:null, refNo:null, items:[],
    });
    document.getElementById('create-inv-modal')?.classList.add('hidden');
    renderInvoices();
    showToast(`✅ Invoice ${newId} created.`);
}

function openAdminInvDetail(id) {
    const inv = adminInvoices.find(i => i.id === id);
    if (!inv) return;
    const statusCfg = { paid:'bg-emerald-100 text-emerald-700', pending:'bg-amber-100 text-amber-700', submitted:'bg-[#e6f7f9] text-[#003049]' };
    document.getElementById('admin-inv-detail-content').innerHTML = `
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p class="text-sm font-bold text-slate-800">${inv.id}</p>
            <button onclick="document.getElementById('admin-inv-detail-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
        </div>
        <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-lg font-bold text-slate-800">₱${inv.amount.toLocaleString()}</p>
                    <p class="text-xs text-slate-400 mt-0.5">${inv.clientName} · ${inv.projectName}</p>
                </div>
                <span class="text-xs font-bold px-3 py-1 rounded-full ${statusCfg[inv.status]||'bg-slate-100 text-slate-500'}">${inv.status.toUpperCase()}</span>
            </div>
            ${inv.items.length ? `
            <div class="border border-slate-100 rounded-xl overflow-hidden">
                <table class="w-full text-xs"><thead class="border-b border-slate-100 bg-slate-50"><tr>
                    <th class="px-4 py-2 text-left text-[10px] font-bold text-slate-400 uppercase">Service</th>
                    <th class="px-4 py-2 text-right text-[10px] font-bold text-slate-400 uppercase">Qty</th>
                    <th class="px-4 py-2 text-right text-[10px] font-bold text-slate-400 uppercase">Rate</th>
                    <th class="px-4 py-2 text-right text-[10px] font-bold text-slate-400 uppercase">Total</th>
                </tr></thead><tbody>
                ${inv.items.map(item=>`<tr class="border-b border-slate-50 last:border-0">
                    <td class="px-4 py-2.5 text-slate-700">${item.service}</td>
                    <td class="px-4 py-2.5 text-right text-slate-500">${item.qty}</td>
                    <td class="px-4 py-2.5 text-right text-slate-500">₱${item.rate.toLocaleString()}</td>
                    <td class="px-4 py-2.5 text-right font-bold text-slate-700">₱${(item.qty*item.rate).toLocaleString()}</td>
                </tr>`).join('')}
                </tbody></table>
            </div>` : ''}
            <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="bg-slate-50 rounded-xl px-4 py-3"><p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Payment Method</p><p class="font-semibold text-slate-700">${inv.method||'—'}</p></div>
                <div class="bg-slate-50 rounded-xl px-4 py-3"><p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Reference No.</p><p class="font-semibold text-slate-700">${inv.refNo||'—'}</p></div>
                <div class="bg-slate-50 rounded-xl px-4 py-3"><p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Invoice Date</p><p class="font-semibold text-slate-700">${inv.date}</p></div>
                <div class="bg-slate-50 rounded-xl px-4 py-3"><p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Paid Date</p><p class="font-semibold text-slate-700">${inv.paidDate||'—'}</p></div>
            </div>
            <button onclick="document.getElementById('admin-inv-detail-modal').classList.add('hidden')" class="w-full text-slate-600 font-bold py-2.5 rounded-xl text-sm border border-slate-200 hover:bg-slate-50 transition-all">Close</button>
        </div>`;
    document.getElementById('admin-inv-detail-modal').classList.remove('hidden');
}

function sendPaymentReminder(id) {
    showToast(`Payment reminder sent for ${id}.`);
}
