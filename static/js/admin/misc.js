/* filevault.js — Admin Full File Vault */

let adminVaultFilter = 'all';

function renderFileVault() {
    const el = document.getElementById('page-filevault');
    if (!el) return;

    const filtered = adminVaultFilter === 'all'
        ? adminVaultFiles
        : adminVaultFilter === 'unreleased'
        ? adminVaultFiles.filter(f => !f.releasedToClient)
        : adminVaultFiles.filter(f => f.type === adminVaultFilter);

    const typeIcon  = { renders:'solar:gallery-bold', blueprints:'solar:ruler-angular-bold', '3d':'solar:box-bold', documents:'solar:file-text-bold', vr:'solar:vr-bold' };
    const typeColor = { renders:'#00A3B4', blueprints:'#003049', '3d':'#9333ea', documents:'#F77F00', vr:'#16a34a' };

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">File Vault</h1>
            <p class="text-sm text-slate-400 mt-1">All project files across every client. Control what clients can see.</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            ${[
                { label:'Total Files', val:adminVaultFiles.length, color:'#003049' },
                { label:'Released to Clients', val:adminVaultFiles.filter(f=>f.releasedToClient).length, color:'#16a34a' },
                { label:'Unreleased', val:adminVaultFiles.filter(f=>!f.releasedToClient).length, color:'#F77F00' },
                { label:'Projects', val:[...new Set(adminVaultFiles.map(f=>f.project))].length, color:'#00A3B4' },
            ].map(s=>`<div class="bg-white rounded-2xl border border-slate-200 p-5">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">${s.label}</p>
                <p class="text-2xl font-bold" style="color:${s.color}">${s.val}</p>
            </div>`).join('')}
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-2 flex-wrap">
            ${['all','unreleased','renders','blueprints','3d','documents','vr'].map(f=>`
            <button onclick="adminVaultFilter='${f}';renderFileVault()" class="text-xs font-bold px-4 py-2 rounded-xl transition-all ${adminVaultFilter===f?'bg-[#003049] text-white':'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}">
                ${f==='all'?'All':f==='unreleased'?'Unreleased':f==='3d'?'3D Files':f.charAt(0).toUpperCase()+f.slice(1)}
            </button>`).join('')}
        </div>

        <!-- File grid -->
        ${filtered.length ? `
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            ${filtered.map(f => {
                const icon  = typeIcon[f.type]  || 'solar:file-bold';
                const color = typeColor[f.type] || '#94a3b8';
                return `
                <div class="bg-white border ${!f.releasedToClient?'border-amber-200':'border-slate-200'} rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                    <div class="aspect-square bg-slate-50 flex items-center justify-center relative">
                        ${f.thumb ? `<img src="${f.thumb}" class="w-full h-full object-cover">` : `<iconify-icon icon="${icon}" style="color:${color};opacity:.5" width="40"></iconify-icon>`}
                        <span class="absolute top-2 right-2 text-[9px] font-bold bg-white/90 px-1.5 py-0.5 rounded-md text-slate-500">${f.version}</span>
                        ${!f.releasedToClient ? `<span class="absolute bottom-2 left-2 text-[8px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-md">Unreleased</span>` : `<span class="absolute bottom-2 left-2 text-[8px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-md">Released</span>`}
                    </div>
                    <div class="p-3">
                        <p class="text-[11px] font-bold text-slate-700 truncate">${f.name}</p>
                        <p class="text-[10px] text-slate-400 mt-0.5 truncate">${f.projectName}</p>
                        <p class="text-[9px] text-slate-300 mt-0.5">${f.employee} · ${f.date}</p>
                        <button onclick="toggleFileRelease('${f.name}')" class="mt-2 w-full text-[10px] font-bold py-1.5 rounded-lg transition-all ${f.releasedToClient?'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100':'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'}">
                            ${f.releasedToClient ? 'Revoke Access' : 'Release to Client'}
                        </button>
                    </div>
                </div>`;
            }).join('')}
        </div>` : `<div class="text-center py-16 text-slate-400"><iconify-icon icon="solar:folder-with-files-linear" width="40" class="mb-2"></iconify-icon><p class="text-sm">No files in this category.</p></div>`}
    </div>`;
}

function toggleFileRelease(name) {
    const f = adminVaultFiles.find(x => x.name === name);
    if (!f) return;
    f.releasedToClient = !f.releasedToClient;
    renderFileVault();
    showToast(f.releasedToClient ? `"${name}" released to client.` : `"${name}" access revoked.`);
}

/* ─────────────────────────────────────────────────────────
   messages.js — Admin Messages
   ───────────────────────────────────────────────────────── */

function renderMessages(convKey) {
    const el = document.getElementById('page-messages');
    if (!el) return;

    adminActiveConv = convKey || adminActiveConv || Object.keys(adminConversations)[0];

    const convListHtml = Object.entries(adminConversations).map(([key, conv]) => {
        const lastMsg = conv.messages[conv.messages.length - 1];
        const isActive = key === adminActiveConv;
        return `
        <div id="conv-${key}" onclick="renderMessages('${key}')" class="conversation-item flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-all ${isActive?'active':''}">
            <div class="w-10 h-10 rounded-full ${conv.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0">${conv.avatarText}</div>
            <div class="flex-1 min-w-0">
                <div class="flex items-baseline justify-between gap-1">
                    <p class="text-xs font-bold text-slate-800 truncate">${conv.name}</p>
                    <p class="text-[10px] text-slate-400 shrink-0">${lastMsg?.time.split(',')[0]||''}</p>
                </div>
                <p class="text-[10px] text-slate-400 truncate mt-0.5">${conv.role}${conv.project?' · '+conv.project:''}</p>
                <p class="text-[11px] text-slate-500 truncate mt-0.5">${lastMsg?.text||''}</p>
            </div>
        </div>`;
    }).join('');

    const active = adminConversations[adminActiveConv];
    const msgsHtml = active ? active.messages.map(msg => {
        const isMe = msg.from === 'me';
        return `
        <div class="flex ${isMe?'justify-end':'justify-start'} items-end gap-2">
            ${!isMe ? `<div class="w-8 h-8 rounded-full ${active.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0">${active.avatarText}</div>` : ''}
            <div class="max-w-xs lg:max-w-sm">
                <div class="${isMe?'msg-bubble-out text-white':'msg-bubble-in text-slate-800'} px-4 py-3 text-sm leading-relaxed">${msg.text}</div>
                <p class="text-[10px] text-slate-400 mt-1 ${isMe?'text-right':''}">${msg.time}</p>
            </div>
            ${isMe ? `<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" class="w-8 h-8 rounded-full bg-slate-200 object-cover shrink-0">` : ''}
        </div>`;
    }).join('') : '';

    el.innerHTML = `
    <div class="flex h-full">
        <!-- Conv list -->
        <div class="w-72 border-r border-slate-200 bg-white flex flex-col shrink-0">
            <div class="p-5 border-b border-slate-100">
                <h2 class="font-bold text-slate-800 mb-3">Messages</h2>
                <div class="flex items-center bg-slate-100 rounded-xl px-3 py-2">
                    <iconify-icon icon="solar:magnifer-linear" class="text-slate-400 mr-2 shrink-0" width="14"></iconify-icon>
                    <input type="text" placeholder="Search..." class="bg-transparent border-none outline-none text-xs w-full">
                </div>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-slate-50">${convListHtml}</div>
        </div>
        <!-- Chat area -->
        <div class="flex-1 flex flex-col bg-white min-w-0">
            ${active ? `
            <div class="h-16 border-b border-slate-200 px-6 flex items-center gap-3 shrink-0">
                <div class="w-9 h-9 rounded-full ${active.avatarColor} flex items-center justify-center text-white text-xs font-bold">${active.avatarText}</div>
                <div>
                    <p class="text-sm font-bold text-slate-800">${active.name}</p>
                    <p class="text-[10px] ${active.statusColor}">${active.status}</p>
                </div>
            </div>
            <div id="chat-messages" class="flex-1 overflow-y-auto p-6 space-y-4">${msgsHtml}</div>
            <div class="border-t border-slate-100 p-4 flex items-center gap-3">
                <input id="msg-input" type="text" placeholder="Type a message..." class="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm outline-none"
                    onkeydown="if(event.key==='Enter')sendAdminMessage()">
                <button onclick="sendAdminMessage()" class="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shrink-0" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                    <iconify-icon icon="solar:plain-bold" width="16"></iconify-icon>
                </button>
            </div>` : '<div class="flex-1 flex items-center justify-center text-slate-400"><p class="text-sm">Select a conversation</p></div>'}
        </div>
    </div>`;

    // Scroll to bottom
    const chatEl = document.getElementById('chat-messages');
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
}

function sendAdminMessage() {
    const input = document.getElementById('msg-input');
    const text  = input?.value.trim();
    if (!text) return;
    const conv = adminConversations[adminActiveConv];
    if (!conv) return;
    const now = new Date();
    conv.messages.push({ from:'me', text, time:`Today, ${now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}` });
    input.value = '';
    renderMessages(adminActiveConv);
}

/* ─────────────────────────────────────────────────────────
   notifications.js — Admin Notifications Page
   ───────────────────────────────────────────────────────── */

let adminNotifFilter = 'all';

function renderAdminNotifications() {
    const el = document.getElementById('page-notifications');
    if (!el) return;

    const filtered = adminNotifFilter === 'unread'
        ? adminNotifications.filter(n => !n.read)
        : adminNotifications;

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div class="flex items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Notifications</h1>
                <p class="text-sm text-slate-400 mt-1">${adminNotifications.filter(n=>!n.read).length} unread notifications.</p>
            </div>
            <button onclick="markAllNotifRead()" class="text-xs font-semibold text-[#00A3B4] hover:underline transition-all">Mark all as read</button>
        </div>

        <div class="flex gap-2">
            ${['all','unread'].map(f=>`<button onclick="adminNotifFilter='${f}';renderAdminNotifications()" class="text-xs font-bold px-4 py-2 rounded-xl transition-all ${adminNotifFilter===f?'bg-[#003049] text-white':'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}">${f.charAt(0).toUpperCase()+f.slice(1)}</button>`).join('')}
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-50">
            ${filtered.length ? filtered.map(n => `
            <div class="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-all ${n.read?'':'bg-[#f0fbfc]'}" onclick="markSingleNotifRead('${n.id}');navigateTo('${n.action}')">
                <div class="w-10 h-10 rounded-xl ${n.color} flex items-center justify-center shrink-0 mt-0.5">
                    <iconify-icon icon="${n.icon}" class="text-white" width="18"></iconify-icon>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-800">${n.title}</p>
                    <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">${n.body}</p>
                    <p class="text-[10px] text-slate-400 mt-1.5">${n.time}</p>
                </div>
                ${!n.read ? `<div class="w-2.5 h-2.5 rounded-full bg-[#F77F00] shrink-0 mt-1.5"></div>` : ''}
            </div>`).join('') : `<div class="px-5 py-10 text-center text-slate-400"><iconify-icon icon="solar:bell-linear" width="36" class="mb-2"></iconify-icon><p class="text-sm">No notifications.</p></div>`}
        </div>
    </div>`;
}

function markAllNotifRead() {
    adminNotifications.forEach(n => n.read = true);
    renderAdminNotifications();
    syncNotifBadge();
}

function markSingleNotifRead(id) {
    const n = adminNotifications.find(x => x.id === id);
    if (n) n.read = true;
    syncNotifBadge();
}

/* ─────────────────────────────────────────────────────────
   settings.js — Admin Settings
   ───────────────────────────────────────────────────────── */

let adminSettingsSection = 'firm';

function renderSettings() {
    const el = document.getElementById('page-settings');
    if (!el) return;

    const sections = [
        { key:'firm',     label:'Firm Profile',    icon:'solar:buildings-3-linear' },
        { key:'services', label:'Services & Pricing', icon:'solar:tag-price-linear' },
        { key:'payment',  label:'Payment Methods', icon:'solar:card-linear' },
        { key:'account',  label:'My Account',      icon:'solar:user-circle-linear' },
        { key:'security', label:'Security',         icon:'solar:lock-keyhole-linear' },
    ];

    const contentMap = {
        firm: `
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Firm Information</p>
            <div class="space-y-4 max-w-lg">
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Firm Name</label><input type="text" value="ArcVis Architecture Studio"></div>
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Address</label><input type="text" value="123 Architect Ave, Makati City, Metro Manila"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email</label><input type="email" value="hello@arcvis.ph"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Phone</label><input type="text" value="+63 2 8888 1234"></div>
                </div>
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Business License No.</label><input type="text" value="PRC-ARCH-0023456"></div>
                <button onclick="showToast('Firm profile saved!')" class="text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Save Changes</button>
            </div>`,
        services: `
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Service Catalog & Pricing</p>
            <div class="space-y-3 max-w-lg">
                ${[
                    { name:'Working Drawing / Blueprint (CAD)', price:'9,999' },
                    { name:'3D Model (Exterior/Interior)', price:'4,999' },
                    { name:'Realistic Render', price:'2,999' },
                    { name:'Basic Web Design', price:'14,999' },
                    { name:'Construction Management', price:'49,999' },
                    { name:'Sign & Seal', price:'3,500' },
                ].map(svc=>`
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p class="text-sm font-semibold text-slate-700">${svc.name}</p>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] text-slate-400">Starting at</span>
                        <input type="text" value="₱${svc.price}" class="w-28 text-right text-sm font-bold" style="background:white;border:1.5px solid #e2e8f0;border-radius:8px;padding:6px 10px">
                    </div>
                </div>`).join('')}
                <button onclick="showToast('Service catalog saved!')" class="text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all mt-2" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Save Pricing</button>
            </div>`,
        payment: `
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Payment Method Details</p>
            <div class="space-y-4 max-w-lg">
                ${[
                    { name:'GCash', bg:'bg-blue-600', fields:[{label:'Account Name',val:'ARCBASE Studio'},{label:'GCash Number',val:'0917-123-4567'}] },
                    { name:'BDO Online Banking', bg:'bg-red-700', fields:[{label:'Account Name',val:'ARCBASE Studio Inc.'},{label:'Account Number',val:'0012-3456-7890'}] },
                    { name:'BPI Online Banking', bg:'bg-red-500', fields:[{label:'Account Name',val:'ARCBASE Studio Inc.'},{label:'Account Number',val:'9876-5432-10'}] },
                    { name:'UnionBank Online', bg:'bg-orange-500', fields:[{label:'Account Name',val:'ARCBASE Studio Inc.'},{label:'Account Number',val:'1122-3344-5566'}] },
                ].map(pm=>`
                <div class="border border-slate-200 rounded-2xl p-5 space-y-3">
                    <p class="text-xs font-bold text-slate-700">${pm.name}</p>
                    <div class="grid grid-cols-2 gap-3">
                        ${pm.fields.map(f=>`<div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">${f.label}</label><input type="text" value="${f.val}"></div>`).join('')}
                    </div>
                </div>`).join('')}
                <button onclick="showToast('Payment details saved!')" class="text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Save Details</button>
            </div>`,
        account: `
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Admin Account</p>
            <div class="space-y-4 max-w-lg">
                <div class="flex items-center gap-4 mb-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" class="w-16 h-16 rounded-2xl bg-slate-100 object-cover border border-slate-200">
                    <button onclick="showToast('Change photo coming soon!')" class="text-xs font-bold text-[#00A3B4] border border-[#b2e8ed] px-3 py-2 rounded-xl hover:bg-[#e6f7f9] transition-all">Change Photo</button>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">First Name</label><input type="text" value="Admin"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Last Name</label><input type="text" value="User"></div>
                </div>
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email</label><input type="email" value="admin@arcbase.ph"></div>
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Role</label><input type="text" value="CEO / Administrator" readonly class="bg-slate-50"></div>
                <button onclick="showToast('Account saved!')" class="text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Save Changes</button>
            </div>`,
        security: `
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Security Settings</p>
            <div class="space-y-4 max-w-lg">
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Current Password</label><input type="password" placeholder="••••••••"></div>
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">New Password</label><input type="password" placeholder="••••••••"></div>
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Confirm Password</label><input type="password" placeholder="••••••••"></div>
                <button onclick="showToast('Password updated!')" class="text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Update Password</button>
            </div>`,
    };

    el.innerHTML = `
    <div class="flex h-full" style="height:calc(100vh - 64px)">
        <!-- Settings nav -->
        <div class="w-60 border-r border-slate-200 bg-white p-4 space-y-1 shrink-0">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Settings</p>
            ${sections.map(s=>`
            <button onclick="adminSettingsSection='${s.key}';renderSettings()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${adminSettingsSection===s.key?'text-[#00A3B4] bg-[#e6f7f9]':'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}">
                <iconify-icon icon="${s.icon}" width="18" class="shrink-0"></iconify-icon>
                <span>${s.label}</span>
            </button>`).join('')}
        </div>
        <!-- Settings content -->
        <div class="flex-1 overflow-y-auto p-8">${contentMap[adminSettingsSection]||''}</div>
    </div>`;
}
