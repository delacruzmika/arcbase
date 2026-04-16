/* auth.js — Login / Logout */

// ── Hide loading screen once everything is ready ──────────────────────────
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
    const loginScreen = document.getElementById('login-screen');
    const dashboard   = document.getElementById('main-dashboard');
    loginScreen.style.transition = 'opacity 0.4s ease';
    loginScreen.style.opacity    = '0';
    setTimeout(() => {
        loginScreen.style.display = 'none';
        dashboard.style.display   = 'flex';
        initMobileNav();
    }, 420);
}

function handleLogout() { location.reload(); }

function initMobileNav() {
    // Wire bottom nav buttons
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('data-page');
            navigateTo(page);
            updateBottomNav(page);
        });
    });
}

function updateBottomNav(page) {
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
        const active = btn.getAttribute('data-page') === page;
        btn.querySelector('iconify-icon').style.color = active ? '#00A3B4' : '#94a3b8';
        const label = btn.querySelector('span');
        if (label) label.style.color = active ? '#00A3B4' : '#94a3b8';
    });
}
