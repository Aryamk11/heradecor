// js/auth.js - Modified for Phone Authentication

document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.getElementById('close-auth-modal-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const showSignupBtn = document.getElementById('show-signup-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authMessage = document.getElementById('auth-message');

    // Function to open the modal
    function openAuthModal() {
        if (authModal) authModal.style.display = 'flex';
    }

    // Function to close the modal
    function closeAuthModal() {
        if (authModal) authModal.style.display = 'none';
        if (authMessage) authMessage.textContent = '';
    }

    // Event listeners for opening/closing modal
    document.querySelectorAll('.signin-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal();
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAuthModal);
    if (authModal) authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });

    // Event listeners for switching between login and signup forms
    if (showLoginBtn) showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        authMessage.textContent = '';
    });

    if (showSignupBtn) showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authMessage.textContent = '';
    });

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = signupForm.phone.value;
            const password = signupForm.password.value;
            const { error } = await supabase.auth.signUp({ phone, password });
            if (error) {
                authMessage.textContent = 'خطا در ثبت‌نام: ' + error.message;
            } else {
                authMessage.textContent = 'ثبت‌نام موفقیت‌آمیز بود! اکنون می‌توانید وارد شوید.';
                signupForm.reset();
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = loginForm.phone.value;
            const password = loginForm.password.value;
            const { error } = await supabase.auth.signInWithPassword({ phone, password });
            if (error) {
                authMessage.textContent = 'شماره موبایل یا رمز عبور اشتباه است.';
            } else {
                closeAuthModal();
                location.reload(); // Reload the page to update UI
            }
        });
    }
});

// Function to update UI based on user session state
async function updateUserUI() {
    const { data: { session } } = await supabase.auth.getSession();
    const signinLinks = document.querySelectorAll('.signin-link');
    
    if (session) { // User is logged in
        signinLinks.forEach(link => {
            link.innerHTML = 'حساب کاربری';
            link.href = 'account.html';
            
            // Create and append logout button if it doesn't exist
            if (!document.getElementById('logout-btn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.textContent = 'خروج';
                logoutBtn.href = '#';
                logoutBtn.id = 'logout-btn';
                logoutBtn.classList.add('nav-link');
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await supabase.auth.signOut();
                    location.reload();
                });
                link.parentNode.appendChild(logoutBtn);
            }
        });
    } else { // User is logged out
        signinLinks.forEach(link => {
            link.innerHTML = 'ورود';
            link.href = '#';
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.remove();
        });
    }
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
    updateUserUI();
});