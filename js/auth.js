// js/auth.js - Final Version with E.164 Phone Formatting

// Helper function to format the phone number
function formatPhoneNumber(phone) {
    let phoneNumber = phone.trim();
    // Remove leading 0 and add Iranian country code +98
    if (phoneNumber.startsWith('0')) {
        return '+98' + phoneNumber.substring(1);
    }
    // If it already has a country code, assume it's correct
    if (phoneNumber.startsWith('+')) {
        return phoneNumber;
    }
    // For numbers entered without a leading 0 (e.g., 912...), just add the country code
    return '+98' + phoneNumber;
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Form and Modal Selectors ---
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.getElementById('close-auth-modal-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const authMessage = document.getElementById('auth-message');

    // --- Button / Link Selectors ---
    const showLoginBtn = document.getElementById('show-login-btn');
    const showSignupBtn = document.getElementById('show-signup-btn');
    const showForgotPasswordBtn = document.getElementById('show-forgot-password-btn');
    const backToLoginBtn = document.getElementById('back-to-login-btn');

    // --- UI State Functions ---
    const showForm = (formToShow) => {
        [loginForm, signupForm, forgotPasswordForm].forEach(form => {
            if (form) form.style.display = form === formToShow ? 'flex' : 'none';
        });
        if (authMessage) authMessage.textContent = '';
    };

    const openAuthModal = () => { if (authModal) authModal.style.display = 'flex'; showForm(loginForm); };
    const closeAuthModal = () => { if (authModal) authModal.style.display = 'none'; };

    // --- Event Listeners ---
    document.querySelectorAll('.signin-link').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); openAuthModal(); }));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAuthModal);
    if (authModal) authModal.addEventListener('click', (e) => { if (e.target === authModal) closeAuthModal(); });
    
    // --- Form Switching Listeners ---
    if (showLoginBtn) showLoginBtn.addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });
    if (showSignupBtn) showSignupBtn.addEventListener('click', (e) => { e.preventDefault(); showForm(signupForm); });
    if (showForgotPasswordBtn) showForgotPasswordBtn.addEventListener('click', (e) => { e.preventDefault(); showForm(forgotPasswordForm); });
    if (backToLoginBtn) backToLoginBtn.addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });

    // --- Auth Logic Handlers ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = signupForm.password.value;
            const phone = formatPhoneNumber(signupForm.phone.value); // Format the phone number
            const { error } = await supabase.auth.signUp({ phone, password });
            authMessage.textContent = error ? `خطا: ${error.message}` : 'ثبت‌نام موفقیت‌آمیز بود! اکنون وارد شوید.';
            if (!error) signupForm.reset();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = loginForm.password.value;
            const phone = formatPhoneNumber(loginForm.phone.value); // Format the phone number
            const { error } = await supabase.auth.signInWithPassword({ phone, password });
            if (error) {
                authMessage.textContent = 'شماره موبایل یا رمز عبور اشتباه است.';
            } else {
                closeAuthModal();
                location.reload();
            }
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = formatPhoneNumber(forgotPasswordForm.phone.value); // Format the phone number
            authMessage.textContent = `قابلیت بازیابی رمز عبور برای ${phone} در آینده اضافه خواهد شد.`;
        });
    }
});

// --- UI Update on Auth State Change ---
async function updateUserUI() {
    const { data: { session } } = await supabase.auth.getSession();
    const signinLinks = document.querySelectorAll('.signin-link');
    
    signinLinks.forEach(link => {
        if (session) {
            link.innerHTML = 'حساب کاربری';
            link.href = 'account.html';
            let logoutBtn = document.getElementById('logout-btn');
            if (!logoutBtn) {
                logoutBtn = document.createElement('a');
                logoutBtn.textContent = 'خروج';
                logoutBtn.href = '#';
                logoutBtn.id = 'logout-btn';
                logoutBtn.classList.add('nav-link');
                link.parentNode.appendChild(logoutBtn);
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await supabase.auth.signOut();
                    location.reload();
                });
            }
        } else {
            link.innerHTML = 'ورود';
            link.href = '#';
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.remove();
        }
    });
}

supabase.auth.onAuthStateChange(() => {
    updateUserUI();
});