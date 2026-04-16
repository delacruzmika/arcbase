/* bom.js — Admin BOM Review */

let adminBomActiveProject = 'ARC-2023-902'; // default to the submitted one

function renderBOM() {
    const el = document.getElementById('page-bom');
    if (!el) return;

    const submittedProjects = Object.entries(adminBOMData).filter(([,b]) => b.status === 'submitted');
    const allProjects       = Object.keys(adminBOMData);

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">Bill of Materials Review</h1>
            <p class="text-sm text-slate-400 mt-1">Review and approve employee BOM submissions for construction projects.</p>
        </div>

        ${submittedProjects.length ? `
        <div class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <iconify-icon icon="solar:bell-bing-bold" class="text-amber-500 shrink-0 mt-0.5" width="18"></iconify-icon>
            <div>
                <p class="text-sm font-bold text-amber-800">${submittedProjects.length} BOM${submittedProjects.length>1?'s':''} Awaiting Review</p>
                <p class="text-xs text-amber-600 mt-0.5">Review and approve or return to employee.</p>
            </div>
        </div>` : ''}

        <!-- Project selector -->
        <div class="flex items-center gap-3 flex-wrap">
            ${allProjects.map(pid => {
                const proj = adminProjects.find(p => p.id === pid);
                const bom  = adminBOMData[pid];
                const statusCls = bom.status==='submitted'?'border-amber-300 bg-amber-50':bom.status==='approved'?'border-emerald-300 bg-emerald-50':'border-slate-200 bg-white';
                return `<button onclick="adminBomActiveProject='${pid}';renderBOM()" class="px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${adminBomActiveProject===pid?'bg-[#003049] text-white border-[#003049]':statusCls+' text-slate-600 hover:border-slate-300'}">
                    ${proj?.name||pid}
                    <span class="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${bom.status==='submitted'?'bg-amber-200 text-amber-800':bom.status==='approved'?'bg-emerald-200 text-emerald-800':'bg-slate-200 text-slate-600'}">${bom.status}</span>
                </button>`;
            }).join('')}
        </div>

        ${renderBOMContent()}
    </div>

    <!-- Return BOM Modal -->
    <div id="return-bom-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl fade-in">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <p class="text-sm font-bold text-slate-800">Return BOM for Revision</p>
                <button onclick="document.getElementById('return-bom-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
            </div>
            <div class="p-6 space-y-4">
                <textarea id="return-bom-note" rows="4" placeholder="Describe what needs to be corrected..."></textarea>
                <button onclick="confirmReturnBOM()" class="w-full text-white font-bold py-3 rounded-xl text-sm transition-all" style="background:#dc2626" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">Return to Employee</button>
            </div>
        </div>
    </div>`;
}

function renderBOMContent() {
    const bom  = adminBOMData[adminBomActiveProject];
    const proj = adminProjects.find(p => p.id === adminBomActiveProject);
    if (!bom) return `<div class="text-center py-16 text-slate-400"><p class="text-sm">No BOM data for this project.</p></div>`;

    const grandTotal = bom.items.reduce((s,i) => s+i.total, 0);
    const grouped = {};
    bom.items.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    });

    const statusCfg = {
        draft:     { cls:'bg-slate-100 text-slate-600 border-slate-200',       label:'Draft — Not yet submitted' },
        submitted: { cls:'bg-amber-100 text-amber-700 border-amber-200',       label:'Submitted — Awaiting Your Review' },
        approved:  { cls:'bg-emerald-100 text-emerald-700 border-emerald-200', label:'Approved' },
        returned:  { cls:'bg-red-100 text-red-700 border-red-200',             label:'Returned for Revision' },
    };
    const s = statusCfg[bom.status];

    return `
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div>
                <p class="text-sm font-bold text-slate-800">${proj?.name || adminBomActiveProject}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">Submitted by ${bom.employeeName||'—'}${bom.submittedDate?' · '+bom.submittedDate:''}</p>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold px-3 py-1.5 rounded-full border ${s.cls}">${s.label}</span>
                ${bom.status==='submitted' ? `
                <button onclick="approveBOM()" class="text-white text-xs font-bold px-4 py-2 rounded-xl transition-all" style="background:#16a34a" onmouseover="this.style.background='#15803d'" onmouseout="this.style.background='#16a34a'">
                    <iconify-icon icon="solar:check-circle-linear" width="14"></iconify-icon> Approve
                </button>
                <button onclick="document.getElementById('return-bom-modal').classList.remove('hidden')" class="text-xs font-bold text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-all">
                    <iconify-icon icon="solar:reply-linear" width="14"></iconify-icon> Return
                </button>` : ''}
            </div>
        </div>

        <!-- Summary row -->
        <div class="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
            <div class="px-5 py-3"><p class="text-[10px] text-slate-400 font-bold uppercase">Items</p><p class="text-lg font-bold text-slate-800">${bom.items.length}</p></div>
            <div class="px-5 py-3"><p class="text-[10px] text-slate-400 font-bold uppercase">Estimated Total</p><p class="text-lg font-bold" style="color:#003049">₱${grandTotal.toLocaleString()}</p></div>
            <div class="px-5 py-3"><p class="text-[10px] text-slate-400 font-bold uppercase">+ 20% Contingency</p><p class="text-lg font-bold" style="color:#F77F00">₱${Math.round(grandTotal*1.2).toLocaleString()}</p></div>
        </div>

        ${bom.items.length ? `<div class="overflow-x-auto">
            <table class="w-full">
                <thead class="border-b border-slate-100 bg-slate-50/50">
                    <tr>${['Material','Unit','Qty','Unit Cost','Total'].map(h=>`<th class="px-5 py-3 text-${h==='Material'?'left':'right'} text-[10px] font-bold text-slate-400 uppercase tracking-widest">${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${Object.entries(grouped).map(([cat, items]) => `
                    <tr class="bg-slate-50/80"><td colspan="5" class="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">${cat}</td></tr>
                    ${items.map(item=>`
                    <tr class="tbl-row border-b border-slate-50">
                        <td class="px-5 py-3 text-sm text-slate-700">${item.material}</td>
                        <td class="px-5 py-3 text-sm text-slate-500 text-right">${item.unit}</td>
                        <td class="px-5 py-3 text-sm font-semibold text-slate-700 text-right">${item.qty.toLocaleString()}</td>
                        <td class="px-5 py-3 text-sm text-slate-500 text-right">₱${item.unitCost.toLocaleString()}</td>
                        <td class="px-5 py-3 text-sm font-bold text-slate-800 text-right">₱${item.total.toLocaleString()}</td>
                    </tr>`).join('')}`).join('')}
                    <tr class="border-t-2 border-slate-200 bg-slate-50">
                        <td colspan="4" class="px-5 py-4 text-sm font-bold text-slate-700">Grand Total</td>
                        <td class="px-5 py-4 text-sm font-bold text-right" style="color:#003049">₱${grandTotal.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>` : `<div class="p-10 text-center text-slate-400"><p class="text-sm">No items in this BOM.</p></div>`}
    </div>`;
}

function approveBOM() {
    const bom = adminBOMData[adminBomActiveProject];
    if (!bom) return;
    bom.status = 'approved';
    renderBOM();
    showToast('✅ BOM approved and employee notified.');
}

function confirmReturnBOM() {
    const note = document.getElementById('return-bom-note')?.value.trim();
    if (!note) { showToast('Please describe what needs to change.'); return; }
    const bom = adminBOMData[adminBomActiveProject];
    if (bom) { bom.status = 'returned'; bom.returnNote = note; }
    document.getElementById('return-bom-modal')?.classList.add('hidden');
    renderBOM();
    showToast('BOM returned to employee with notes.');
}
