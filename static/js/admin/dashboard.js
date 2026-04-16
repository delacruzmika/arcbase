/* dashboard.js — Admin Dashboard */

function renderDashboard() {
    const el = document.getElementById('page-dashboard');
    if (!el) return;

    const activeProj   = adminProjects.filter(p => p.status === 'active' || p.status === 'review').length;
    const pendingDel   = deliverablesQueue.filter(d => d.status === 'pending').length;
    const pendingRev   = revisionsQueue.filter(r => r.status === 'pending').length;
    const pendingPay   = adminInvoices.filter(i => i.status === 'submitted').length;
    const totalRevenue = adminInvoices.filter(i => i.status === 'paid').reduce((s,i) => s + i.amount, 0);
    const outstanding  = adminInvoices.filter(i => i.status === 'pending' || i.status === 'submitted').reduce((s,i) => s + i.amount, 0);

    // Build alert items
    const alerts = [
        ...deliverablesQueue.filter(d => d.status === 'pending').map(d => ({
            icon:'solar:upload-minimalistic-bold', color:'bg-[#00A3B4]',
            title:`File Pending Review: ${d.file}`,
            sub:`${d.projectName} · Uploaded by ${d.employee} · ${d.uploadDate}`,
            action:`reviewDeliverable('${d.id}')`, actionLabel:'Review',
            badge:'Deliverable', badgeCls:'bg-[#e6f7f9] text-[#003049]'
        })),
        ...revisionsQueue.filter(r => r.status === 'pending').map(r => ({
            icon:'solar:pen-2-bold', color:'bg-[#F77F00]',
            title:`Revision Unassigned: ${r.file}`,
            sub:`${r.projectName} · From ${r.client} · ${r.date}`,
            action:`openAssignRevision('${r.id}')`, actionLabel:'Assign',
            badge:'Revision', badgeCls:'bg-orange-100 text-orange-700'
        })),
        ...adminInvoices.filter(i => i.status === 'submitted').map(i => ({
            icon:'solar:card-bold', color:'bg-emerald-500',
            title:`Payment Awaiting Confirmation: ${i.id}`,
            sub:`${i.clientName} · ₱${i.amount.toLocaleString()} via ${i.method || '?'} · Ref: ${i.refNo || '—'}`,
            action:`openConfirmPayment('${i.id}')`, actionLabel:'Confirm',
            badge:'Payment', badgeCls:'bg-emerald-100 text-emerald-700'
        })),
        ...Object.entries(adminBOMData).filter(([,b]) => b.status === 'submitted').map(([pid,b]) => {
            const proj = adminProjects.find(p => p.id === pid);
            return {
                icon:'solar:clipboard-list-bold', color:'bg-[#003049]',
                title:`BOM Awaiting Review: ${proj?.name || pid}`,
                sub:`Submitted by ${b.employeeName} · ${b.submittedDate}`,
                action:`navigateTo('bom')`, actionLabel:'Review',
                badge:'BOM', badgeCls:'bg-slate-100 text-slate-600'
            };
        }),
    ];

    const alertsHtml = alerts.length
        ? alerts.map(a => `
            <div class="alert-row flex items-center gap-4 px-5 py-3.5 border-b border-slate-50 last:border-0">
                <div class="w-9 h-9 rounded-xl ${a.color} flex items-center justify-center shrink-0">
                    <iconify-icon icon="${a.icon}" class="text-white" width="16"></iconify-icon>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 truncate">${a.title}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5 truncate">${a.sub}</p>
                </div>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full border ${a.badgeCls} shrink-0">${a.badge}</span>
                <button onclick="${a.action}" class="shrink-0 text-[11px] font-bold text-[#00A3B4] hover:text-[#003049] transition-colors">${a.actionLabel} →</button>
            </div>`).join('')
        : `<div class="px-5 py-10 text-center text-slate-400"><iconify-icon icon="solar:check-circle-bold" width="36" class="mb-2 text-emerald-400"></iconify-icon><p class="text-sm font-semibold text-emerald-600">All clear! No pending items.</p></div>`;

    // Active projects strip
    const activeProjHtml = adminProjects.filter(p => p.status !== 'completed').map(p => {
        const statusColor = p.status === 'review' ? 'bg-[#e6f7f9] text-[#003049] border-[#b2e8ed]' : p.status === 'new' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
        return `
        <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer" onclick="navigateTo('projects')">
            <div class="flex items-start justify-between gap-2 mb-3">
                <div class="min-w-0">
                    <p class="text-sm font-bold text-slate-800 truncate">${p.name}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">${p.clientName} · ${p.type}</p>
                </div>
                <span class="text-[9px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusColor}">${p.statusLabel}</span>
            </div>
            <div class="progress-bar mb-1.5"><div class="progress-fill" style="width:${p.progress}%"></div></div>
            <div class="flex justify-between text-[10px] text-slate-400">
                <span>${p.milestones[p.completedMilestones] || 'Handover'}</span>
                <span>${p.progress}%</span>
            </div>
        </div>`;
    }).join('');

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p class="text-sm text-slate-400 mt-1">Welcome back. Here's what needs your attention today.</p>
            </div>
            <p class="text-xs text-slate-400 font-medium">${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            ${[
                { label:'Active Projects',  val:activeProj,   icon:'solar:buildings-3-bold',          color:'#003049',  sub:'currently running',     action:'projects' },
                { label:'Pending Reviews',  val:pendingDel,   icon:'solar:eye-scan-linear',            color:'#00A3B4',  sub:'files awaiting review', action:'deliverables' },
                { label:'Open Revisions',   val:pendingRev,   icon:'solar:pen-2-bold',                 color:'#F77F00',  sub:'unassigned requests',   action:'revisions' },
                { label:'Awaiting Confirm', val:pendingPay,   icon:'solar:card-bold',                  color:'#16a34a',  sub:'payments to confirm',   action:'invoices' },
            ].map(c => `
            <div class="stat-card bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer" onclick="navigateTo('${c.action}')">
                <div class="flex items-start justify-between mb-3">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${c.label}</p>
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:${c.color}20">
                        <iconify-icon icon="${c.icon}" style="color:${c.color}" width="18"></iconify-icon>
                    </div>
                </div>
                <p class="text-3xl font-bold text-slate-800">${c.val}</p>
                <p class="text-[10px] text-slate-400 mt-1">${c.sub}</p>
            </div>`).join('')}
        </div>

        <!-- Revenue row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="bg-white rounded-2xl border border-slate-200 p-5">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Revenue Collected</p>
                <p class="text-3xl font-bold" style="color:#003049">₱${totalRevenue.toLocaleString()}</p>
                <p class="text-xs text-slate-400 mt-1">From paid invoices</p>
            </div>
            <div class="bg-white rounded-2xl border border-slate-200 p-5">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
                <p class="text-3xl font-bold" style="color:#F77F00">₱${outstanding.toLocaleString()}</p>
                <p class="text-xs text-slate-400 mt-1">Pending + submitted invoices</p>
            </div>
        </div>

        <!-- Alerts -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <iconify-icon icon="solar:bell-bing-bold" style="color:#F77F00" width="18"></iconify-icon>
                    <p class="text-sm font-bold text-slate-800">Action Required</p>
                    ${alerts.length ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F77F00] text-white">${alerts.length}</span>` : ''}
                </div>
            </div>
            ${alertsHtml}
        </div>

        <!-- Active Projects -->
        <div>
            <div class="flex items-center justify-between mb-3">
                <p class="text-sm font-bold text-slate-700">Active Projects</p>
                <button onclick="navigateTo('projects')" class="text-xs font-semibold text-[#00A3B4] hover:underline">View all →</button>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">${activeProjHtml}</div>
        </div>
    </div>`;
}
