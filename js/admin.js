// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const authCheckContainer = document.getElementById('auth-check-container');
    const authMessage = document.getElementById('auth-message');
    const adminContent = document.getElementById('admin-content');

    async function checkAdminAccess() {
        // 1. Get the current user session
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            authMessage.textContent = 'دسترسی غیرمجاز. در حال انتقال به صفحه اصلی...';
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }

        // 2. Check if the user has the 'admin' role
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('id', user.id)
                .single(); // We expect only one row

            if (error || !data) {
                throw new Error(error?.message || 'نقش کاربری یافت نشد.');
            }

            // 3. Grant or deny access based on the role
            if (data.role === 'admin') {
                authCheckContainer.style.display = 'none'; // Hide the checking message
                adminContent.style.display = 'block';   // Show the admin dashboard
                initializeAdminPanel(); // Function to set up panel logic
            } else {
                throw new Error('شما دسترسی ادمین ندارید.');
            }
        } catch (error) {
            authMessage.textContent = `خطا: ${error.message} در حال انتقال به صفحه اصلی...`;
            setTimeout(() => window.location.href = 'index.html', 3000);
        }
    }

    function initializeAdminPanel() {
        const navButtons = document.querySelectorAll('.admin-nav-btn');
        const panels = document.querySelectorAll('.admin-panel');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Deactivate all buttons and panels
                navButtons.forEach(btn => btn.classList.remove('active'));
                panels.forEach(panel => panel.classList.remove('active'));

                // Activate the clicked button and corresponding panel
                button.classList.add('active');
                const targetPanelId = button.dataset.target;
                document.getElementById(targetPanelId).classList.add('active');
            });
        });
    }

    checkAdminAccess();
});