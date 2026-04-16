/* ============================================================
   notifications.js — Notifications page logic & badge
   ============================================================ */

const notificationsData = [
    {
        id: 1, category: 'today',
        icon: 'solar:document-bold', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
        title: 'Drafts Ready for Review',
        body: 'New floor plans for <strong>Nimbus Villa</strong> have been uploaded. Please approve or comment.',
        time: '2 hours ago', unread: true, important: true,
    },
    {
        id: 2, category: 'today',
        icon: 'solar:wallet-money-bold', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
        title: 'Payment Received',
        body: 'Thank you! Your deposit for <strong>Invoice #001</strong> has been confirmed.',
        time: '1 day ago', unread: true, important: false,
    },
    {
        id: 3, category: 'earlier',
        icon: 'solar:calendar-bold', iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
        title: 'Meeting Scheduled',
        body: 'Your consultation with the <strong>Design Team</strong> is set for Friday, 10:00 AM.',
        time: '2 days ago', unread: false, important: true,
    },
    {
        id: 4, category: 'earlier',
        icon: 'solar:box-bold', iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
        title: '3D Model Updated',
        body: 'Revision 3 of the <strong>Astra</strong> exterior model has been uploaded to your project.',
        time: '3 days ago', unread: false, important: false,
    },
    {
        id: 5, category: 'earlier',
        icon: 'solar:shield-check-bold', iconBg: 'bg-slate-100', iconColor: 'text-slate-500',
        title: 'Account Verified',
        body: 'Your ARCBASE account has been fully verified. All features are now unlocked.',
        time: '5 days ago', unread: false, important: false,
    },
];

let activeFilter = 'all';

function filterNotifs(filter) {
    activeFilter = filter;
    ['all', 'unread', 'important'].forEach(f => {
        const tab = document.getElementById(`nf-${f}`);
        if (f === filter) {
            tab.className = 'notif-tab px-4 py-1.5 rounded-lg text-xs font-semibold bg-white shadow-sm text-slate-800 transition-all';
        } else {
            tab.className = 'notif-tab px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 transition-all';
        }
    });
    renderNotifications(filter);
}

function renderNotifications(filter) {
    const list = document.getElementById('notif-list');
    let filtered = notificationsData;
    if (filter === 'unread')    filtered = notificationsData.filter(n => n.unread);
    if (filter === 'important') filtered = notificationsData.filter(n => n.important);

    const todayItems   = filtered.filter(n => n.category === 'today');
    const earlierItems = filtered.filter(n => n.category === 'earlier');

    list.innerHTML = '';

    if (filtered.length === 0) {
        list.innerHTML = `<div class="text-center py-16 text-slate-400">
            <iconify-icon icon="solar:bell-off-linear" width="40" class="mb-3 opacity-30"></iconify-icon>
            <p class="text-sm font-medium">No notifications here</p>
        </div>`;
        return;
    }

    const renderGroup = (label, items) => {
        if (!items.length) return;
        list.innerHTML += `<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 pt-2">${label}</p>`;
        items.forEach(n => {
            list.innerHTML += `
            <div class="bg-white border ${n.unread ? 'border-[#b2e8ed]' : 'border-slate-100'} rounded-2xl p-4 flex items-start gap-4 hover:shadow-sm transition-all cursor-pointer" onclick="markRead(${n.id})">
                <div class="w-10 h-10 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0">
                    <iconify-icon icon="${n.icon}" class="${n.iconColor}" width="20"></iconify-icon>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <p class="text-sm font-bold text-slate-800">${n.title}</p>
                        ${n.unread ? '<span class="w-2 h-2 bg-[#F77F00] rounded-full shrink-0 mt-1.5"></span>' : ''}
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">${n.body}</p>
                    <p class="text-[10px] text-slate-400 mt-1.5">${n.time}</p>
                </div>
            </div>`;
        });
    };

    renderGroup('Today', todayItems);
    renderGroup('Earlier', earlierItems);

    list.innerHTML += `<button class="w-full py-3 text-xs font-semibold text-slate-400 hover:text-slate-600 border border-dashed border-slate-200 rounded-2xl transition-all mt-2">Load more notifications</button>`;
}

function markRead(id) {
    const n = notificationsData.find(n => n.id === id);
    if (n) n.unread = false;
    updateBadge();
    renderNotifications(activeFilter);
}

function markAllRead() {
    notificationsData.forEach(n => n.unread = false);
    updateBadge();
    renderNotifications(activeFilter);
}

function updateBadge() {
    const unreadCount = notificationsData.filter(n => n.unread).length;
    const badge = document.getElementById('notif-badge');
    if (unreadCount === 0) {
        badge.classList.add('hidden');
    } else {
        badge.classList.remove('hidden');
        badge.textContent = unreadCount;
    }
}
