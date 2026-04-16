/* deliverables.js — Deliverable Review Queue */

function renderDeliverables() {
    const el = document.getElementById('page-deliverables');
    if (!el) return;

    const pending  = deliverablesQueue.filter(d => d.status === 'pending');
    const approved = deliverablesQueue.filter(d => d.status === 'approved');
    const returned = deliverablesQueue.filter(d => d.status === 'returned');

    const statusCfg = {
        pending:  { cls:'bg-amber-100 text-amber-700 border-amber-200',          icon:'solar:clock-circle-linear',   label:'Pending Review' },
        approved: { cls:'bg-emerald-100 text-emerald-700 border-emerald-200',    icon:'solar:check-circle-linear',   label:'Approved' },
        returned: { cls:'bg-red-100 text-red-700 border-red-200',                icon:'solar:close-circle-linear',   label:'Returned' },
    };
    const typeIcon = { renders:'solar:gallery-bold', blueprints:'solar:ruler-angular-bold', '3d':'solar:box-bold', documents:'solar:file-text-bold', vr:'solar:vr-bold' };

    const renderCard = (d) => {
        const s = statusCfg[d.status];
        return `
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all">
            <div class="flex items-start gap-4 p-5">
                <div class="w-16 h-16 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
                    ${d.thumb ? `<img src="${d.thumb}" class="w-full h-full object-cover">` : `<iconify-icon icon="${typeIcon[d.type]||'solar:file-bold'}" class="text-slate-400" width="28"></iconify-icon>`}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <p class="text-sm font-bold text-slate-800 truncate">${d.file}</p>
                        <span class="text-[9px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${s.cls}">${s.label}</span>
                    </div>
                    <p class="text-[10px] text-slate-400 mt-0.5">${d.projectName} · ${d.id}</p>
                    <p class="text-[10px] text-slate-400">Uploaded by <span class="font-semibold">${d.employee}</span> · ${d.uploadDate}</p>
                    ${d.notes ? `<p class="text-[11px] text-slate-500 mt-1.5 italic leading-relaxed">"${d.notes}"</p>` : ''}
                    ${d.returnNote ? `<div class="mt-2 flex items-start gap-1.5 bg-red-50 border border-red-100 rounded-lg px-3 py-2"><iconify-icon icon="solar:reply-linear" class="text-red-400 shrink-0 mt-0.5" width="12"></iconify-icon><p class="text-[10px] text-red-600">${d.returnNote}</p></div>` : ''}
                </div>
            </div>
            ${d.status === 'pending' ? `
            <div class="flex gap-2 px-5 pb-4">
                <button onclick="approveDeliverable('${d.id}')" class="flex-1 flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2.5 rounded-xl transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                    <iconify-icon icon="solar:check-circle-linear" width="14"></iconify-icon> Approve & Release to Client
                </button>
                <button onclick="openReturnDeliverable('${d.id}')" class="flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 border border-red-200 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all">
                    <iconify-icon icon="solar:reply-linear" width="14"></iconify-icon> Return
                </button>
            </div>` : ''}
        </div>`;
    };

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">Deliverable Review</h1>
            <p class="text-sm text-slate-400 mt-1">Review employee uploads before releasing them to clients.</p>
        </div>

        ${pending.length ? `
        <div>
            <div class="flex items-center gap-2 mb-3">
                <iconify-icon icon="solar:clock-circle-bold" class="text-amber-500" width="16"></iconify-icon>
                <p class="text-sm font-bold text-slate-700">Pending Review <span class="ml-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">${pending.length}</span></p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">${pending.map(renderCard).join('')}</div>
        </div>` : ''}

        ${returned.length ? `
        <div>
            <div class="flex items-center gap-2 mb-3">
                <iconify-icon icon="solar:close-circle-bold" class="text-red-400" width="16"></iconify-icon>
                <p class="text-sm font-bold text-slate-700">Returned for Revision <span class="ml-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">${returned.length}</span></p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">${returned.map(renderCard).join('')}</div>
        </div>` : ''}

        ${approved.length ? `
        <div>
            <div class="flex items-center gap-2 mb-3">
                <iconify-icon icon="solar:check-circle-bold" class="text-emerald-500" width="16"></iconify-icon>
                <p class="text-sm font-bold text-slate-700">Approved <span class="ml-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">${approved.length}</span></p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">${approved.map(renderCard).join('')}</div>
        </div>` : ''}

        ${!deliverablesQueue.length ? `<div class="text-center py-16 text-slate-400"><iconify-icon icon="solar:inbox-bold" width="40" class="mb-2"></iconify-icon><p class="text-sm">No deliverables in queue.</p></div>` : ''}
    </div>

    <!-- Return modal -->
    <div id="return-del-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl fade-in">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <p class="text-sm font-bold text-slate-800">Return for Revision</p>
                <button onclick="document.getElementById('return-del-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
            </div>
            <input type="hidden" id="return-del-id">
            <div class="p-6 space-y-4">
                <p class="text-xs text-slate-500">Describe what needs to be corrected. The employee will be notified.</p>
                <textarea id="return-del-note" rows="4" placeholder="e.g. Please darken the ambient lighting on the east wing..."></textarea>
                <button onclick="confirmReturnDeliverable()" class="w-full text-white font-bold py-3 rounded-xl text-sm transition-all" style="background:#dc2626" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">Return to Employee</button>
            </div>
        </div>
    </div>`;
}

function reviewDeliverable(id) { navigateTo('deliverables'); }

function approveDeliverable(id) {
    const d = deliverablesQueue.find(x => x.id === id);
    if (!d) return;
    d.status = 'approved';
    // Mark as released in vault
    const vf = adminVaultFiles.find(f => f.name === d.file);
    if (vf) vf.releasedToClient = true;
    renderDeliverables();
    showToast(`✅ "${d.file}" approved and released to client.`);
}

function openReturnDeliverable(id) {
    document.getElementById('return-del-id').value = id;
    document.getElementById('return-del-note').value = '';
    document.getElementById('return-del-modal').classList.remove('hidden');
}

function confirmReturnDeliverable() {
    const id   = document.getElementById('return-del-id').value;
    const note = document.getElementById('return-del-note').value.trim();
    if (!note) { showToast('Please describe what needs to change.'); return; }
    const d = deliverablesQueue.find(x => x.id === id);
    if (d) { d.status = 'returned'; d.returnNote = note; }
    document.getElementById('return-del-modal').classList.add('hidden');
    renderDeliverables();
    showToast('File returned to employee with notes.');
}

/* ─────────────────────────────────────────────────────────
   revisions.js — Revision Request Management
   ───────────────────────────────────────────────────────── */

function renderRevisions() {
    const el = document.getElementById('page-revisions');
    if (!el) return;

    const prioColor = { High:'text-[#F77F00]', Medium:'text-amber-500', Low:'text-slate-400' };
    const statusCfg = {
        pending:  { cls:'bg-amber-100 text-amber-700',          label:'Unassigned' },
        assigned: { cls:'bg-[#e6f7f9] text-[#003049]',          label:'Assigned' },
        resolved: { cls:'bg-emerald-100 text-emerald-700',      label:'Resolved' },
    };

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">Revision Requests</h1>
            <p class="text-sm text-slate-400 mt-1">Manage client revision requests. Assign to employees and track resolution.</p>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100 grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Request</span><span>Priority</span><span>Status</span><span>Assigned To</span><span>Action</span>
            </div>
            ${revisionsQueue.map(r => {
                const s = statusCfg[r.status];
                return `
                <div class="tbl-row px-5 py-4 border-b border-slate-50 last:border-0 grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 items-start">
                    <div class="min-w-0">
                        <p class="text-xs font-bold text-slate-800 truncate">${r.file}</p>
                        <p class="text-[10px] text-slate-400 mt-0.5">${r.projectName} · From ${r.client} · ${r.date}</p>
                        <p class="text-[11px] text-slate-500 mt-1 italic leading-relaxed line-clamp-2">"${r.note}"</p>
                    </div>
                    <span class="text-[10px] font-bold ${prioColor[r.priority]} mt-0.5">${r.priority}</span>
                    <span class="text-[9px] font-bold px-2.5 py-1 rounded-full ${s.cls} shrink-0 mt-0.5">${s.label}</span>
                    <span class="text-xs text-slate-500 mt-0.5">${r.assignedTo || '—'}</span>
                    <div class="flex gap-1.5 mt-0.5">
                        ${r.status !== 'resolved' ? `<button onclick="openAssignRevision('${r.id}')" class="text-[11px] font-bold text-[#00A3B4] border border-[#b2e8ed] px-3 py-1.5 rounded-lg hover:bg-[#e6f7f9] transition-all">${r.assignedTo ? 'Reassign' : 'Assign'}</button>` : ''}
                        ${r.status === 'assigned' ? `<button onclick="markRevisionResolved('${r.id}')" class="text-[11px] font-bold text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-all">Resolve</button>` : ''}
                    </div>
                </div>`;
            }).join('')}
        </div>
    </div>

    <!-- Assign modal -->
    <div id="assign-rev-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl fade-in">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <p class="text-sm font-bold text-slate-800">Assign Revision</p>
                <button onclick="document.getElementById('assign-rev-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
            </div>
            <input type="hidden" id="assign-rev-id">
            <div class="p-6 space-y-4">
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Assign To</label>
                    <select id="assign-rev-emp">${usersData.filter(u=>u.status==='active').map(u=>`<option>${u.name}</option>`).join('')}</select>
                </div>
                <button onclick="confirmAssignRevision()" class="w-full text-white font-bold py-3 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Assign</button>
            </div>
        </div>
    </div>`;
}

function openAssignRevision(id) {
    document.getElementById('assign-rev-id').value = id;
    document.getElementById('assign-rev-modal')?.classList.remove('hidden');
}

function confirmAssignRevision() {
    const id  = document.getElementById('assign-rev-id').value;
    const emp = document.getElementById('assign-rev-emp')?.value;
    const r   = revisionsQueue.find(x => x.id === id);
    if (r) { r.assignedTo = emp; r.status = 'assigned'; }
    document.getElementById('assign-rev-modal')?.classList.add('hidden');
    renderRevisions();
    showToast(`Revision assigned to ${emp}.`);
}

function markRevisionResolved(id) {
    const r = revisionsQueue.find(x => x.id === id);
    if (r) r.status = 'resolved';
    renderRevisions();
    showToast('Revision marked as resolved.');
}
