// js/auth.js - SIMPLIFIED, LOGOUT LOGIC REMOVED

function formatPhoneNumber(phone) {
    let phoneNumber = phone.trim();
    if (phoneNumber.startsWith('0')) {
        return '+98' + phoneNumber.substring(1);
    }
    if (phoneNumber.startsWith('+')) {
        return phoneNumber;
    }
    return '+98' + phoneNumber;
}

async function updateUserUI() {
    const { data: { session } } = await supabase.auth.getSession();
    const loggedOutElements = document.querySelectorAll('.auth-group-logged-out');
    const loggedInElements = document.querySelectorAll('.auth-group-logged-in');

    if (session) {
        loggedOutElements.forEach(el => el.style.display = 'none');
        loggedInElements.forEach(el => el.style.display = 'flex');
    } else {
        loggedOutElements.forEach(el => el.style.display = 'flex');
        loggedInElements.forEach(el => el.style.display = 'none');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let userPhoneForReset = ''; 
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.getElementById('close-auth-modal-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const authMessage = document.getElementById('auth-message');
    const showLoginBtn = document.getElementById('show-login-btn');
    const showSignupBtn = document.getElementById('show-signup-btn');
    const showForgotPasswordBtn = document.getElementById('show-forgot-password-btn');
    const backToLoginBtn = document.getElementById('back-to-login-btn');

    const showForm = (formToShow) => {
        [loginForm, signupForm, forgotPasswordForm].forEach(form => {
            if (form) form.style.display = form === formToShow ? 'flex' : 'none';
        });
        if (authMessage) authMessage.textContent = '';
    };

    const openAuthModal = () => { if (authModal) authModal.style.display = 'flex'; showForm(loginForm); };
    const closeAuthModal = () => { if (authModal) authModal.style.display = 'none'; };

    document.querySelectorAll('.signin-link').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); openAuthModal(); }));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAuthModal);
    if (authModal) authModal.addEventListener('click', (e) => { if (e.target === authModal) closeAuthModal(); });
    
    if (showLoginBtn) showLoginBtn.addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });
    if (showSignupBtn) showSignupBtn.addEventListener('click', (e) => { e.preventDefault(); showForm(signupForm); });
    if (showForgotPasswordBtn) showForgotPasswordBtn.addEventListener('click', (e) => { e.preventDefault(); showForm(forgotPasswordForm); });
    if (backToLoginBtn) backToLoginBtn.addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = signupForm.password.value;
            const phone = formatPhoneNumber(signupForm.phone.value);
            const { error } = await supabase.auth.signUp({ phone, password });
            authMessage.textContent = error ? `خطا: ${error.message}` : 'ثبت‌نام موفقیت‌آمیز بود! اکنون وارد شوید.';
            if (!error) {
                signupForm.reset();
                showForm(loginForm);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = loginForm.password.value;
            const phone = formatPhoneNumber(loginForm.phone.value);
            const { error } = await supabase.auth.signInWithPassword({ phone, password });
            if (error) {
                authMessage.textContent = 'شماره موبایل یا رمز عبور اشتباه است.';
            } else {
                closeAuthModal();
                location.reload();
            }
        });
    }
    
const updatePasswordForm = document.getElementById('update-password-form');
    
    if (forgotPasswordForm && updatePasswordForm) {
        // Handle the initial request to send an OTP
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('reset-phone').value;
            userPhoneForReset = formatPhoneNumber(phone); // Store formatted phone number

            const authMessage = document.getElementById('auth-message');
            const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');

            submitButton.disabled = true;
            submitButton.textContent = 'در حال ارسال...';
            authMessage.textContent = '';

            const { error } = await supabase.auth.signInWithOtp({
                phone: userPhoneForReset,
            });

            if (error) {
                authMessage.textContent = 'خطا: شماره موبایل یافت نشد یا در ارسال کد مشکلی پیش آمد.';
                console.error('OTP Error:', error);
                submitButton.disabled = false;
                submitButton.textContent = 'ارسال کد';
            } else {
                authMessage.textContent = 'کد با موفقیت ارسال شد. لطفا آن را در فرم زیر وارد کنید.';
                forgotPasswordForm.style.display = 'none';
                updatePasswordForm.style.display = 'flex';
            }
        });

        // Handle the final submission of OTP and new password
        updatePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const otp = document.getElementById('otp-code').value;
            const password = document.getElementById('new-password').value;
            const authMessage = document.getElementById('auth-message');

            // Step 1: Verify the OTP
            const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
                phone: userPhoneForReset,
                token: otp,
                type: 'sms' // Use 'sms' for password recovery via phone
            });

            if (verifyError) {
                authMessage.textContent = 'کد وارد شده اشتباه است.';
                console.error('Verify OTP Error:', verifyError);
                return;
            }

            // Step 2: If OTP is correct, a session is created. Now update the password.
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                authMessage.textContent = 'خطا در تغییر رمز عبور. لطفا دوباره تلاش کنید.';
                console.error('Update Password Error:', updateError);
            } else {
                authMessage.textContent = 'رمز عبور شما با موفقیت تغییر کرد! اکنون می‌توانید وارد شوید.';
                updatePasswordForm.style.display = 'none';
                // Show the main login form
                document.getElementById('login-form').style.display = 'flex';
            }
        });

        // Handle the second "back to login" button
        const backToLoginBtn2 = document.getElementById('back-to-login-btn-2');
        if(backToLoginBtn2) {
            backToLoginBtn2.addEventListener('click', (e) => {
                e.preventDefault();
                showForm(document.getElementById('login-form'));
            });
        }
    }
    updateUserUI();
});

supabase.auth.onAuthStateChange(() => {
    updateUserUI();
});