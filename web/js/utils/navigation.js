// Navigation functions
export const navigation = {
    // Navigate to page
    navigateTo: (path) => {
        window.location.href = path;
    },

    // Handle navigation links
    handleNavigation: () => {
        document.querySelectorAll('a[data-navigate]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('data-navigate');
                navigation.navigateTo(path);
            });
        });
    }
}; 