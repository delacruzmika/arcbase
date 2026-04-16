/* auth.js — Admin login / logout */

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const ls = document.getElementById('loading-screen');
        if (ls) {
            ls.style.transition = 'opacity 0.5s ease';
            ls.style.opacity = '0';
            setTimeout(() => ls.classList.add('hidden'), 500);
        }
    }, 1200);
});

function handleLogin() {
    const email = document.getElementById('login-email')?.value.trim();
    const pass  = document.getElementById('login-pass')?.value.trim();
    // Demo: any input works
    const loginScreen = document.getElementById('login-screen');
    const dashboard   = document.getElementById('main-dashboard');
    loginScreen.style.transition = 'opacity 0.4s ease';
    loginScreen.style.opacity    = '0';
    setTimeout(() => {
        loginScreen.style.display = 'none';
        dashboard.style.display   = 'flex';
        navigateTo('dashboard');
    }, 420);
}

function handleLogout() { location.reload(); }

function toggleSidebar() {
    const sidebar  = document.getElementById('main-sidebar');
    const overlay  = document.getElementById('sidebar-overlay');
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

function closeSidebar() {
    document.getElementById('main-sidebar').classList.remove('mobile-open');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

function showToast(msg, duration = 2800) {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        t.className = 'bg-[#003049] text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

function toggleNotifDropdown() {
    const d = document.getElementById('notif-dropdown');
    d.classList.toggle('hidden');
    if (!d.classList.contains('hidden')) renderNotifDropdown();
    document.addEventListener('click', closeNotifOnOutside, { once: true });
}
function closeNotifOnOutside(e) {
    const wrap = document.getElementById('notif-dropdown-wrap');
    if (!wrap?.contains(e.target)) document.getElementById('notif-dropdown')?.classList.add('hidden');
}
function markAllReadDropdown() {
    adminNotifications.forEach(n => n.read = true);
    renderNotifDropdown();
    syncNotifBadge();
}
function renderNotifDropdown() {
    const list = document.getElementById('notif-dropdown-list');
    if (!list) return;
    const shown = adminNotifications.slice(0, 6);
    list.innerHTML = shown.map(n => `
        <div class="px-5 py-4 flex items-start gap-3 ${n.read ? '' : 'bg-[#f0fbfc]'} cursor-pointer hover:bg-slate-50 transition-all" onclick="markNotifRead('${n.id}')">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.color}">
                <iconify-icon icon="${n.icon}" width="16" class="text-white"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-slate-800 leading-snug">${n.title}</p>
                <p class="text-[11px] text-slate-500 mt-0.5 line-clamp-2">${n.body}</p>
                <p class="text-[10px] text-slate-400 mt-1">${n.time}</p>
            </div>
            ${!n.read ? '<div class="w-2 h-2 rounded-full bg-[#F77F00] shrink-0 mt-1.5"></div>' : ''}
        </div>`).join('');
}
function markNotifRead(id) {
    const n = adminNotifications.find(x => x.id === id);
    if (n) n.read = true;
    renderNotifDropdown();
    syncNotifBadge();
}
function syncNotifBadge() {
    const unread = adminNotifications.filter(n => !n.read).length;
    const dot = document.getElementById('notif-dot');
    const badge = document.getElementById('notif-badge');
    if (dot) dot.style.display = unread ? '' : 'none';
    if (badge) badge.textContent = unread || '';
}
function toggleProfileDropdown() {
    const d = document.getElementById('profile-dropdown');
    d.classList.toggle('hidden');
    document.addEventListener('click', e => {
        if (!document.getElementById('profile-dropdown-wrap')?.contains(e.target))
            d.classList.add('hidden');
    }, { once: true });
}
