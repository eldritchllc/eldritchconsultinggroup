document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Navigation ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = navOverlay.querySelectorAll('a');

    const toggleMenu = () => {
        hamburgerMenu.classList.toggle('is-active');
        navOverlay.classList.toggle('is-open');
        // Prevent body scroll when menu is open, but not if modal is also open
        if (!document.body.classList.contains('modal-open')) {
            document.body.style.overflow = navOverlay.classList.contains('is-open') ? 'hidden' : '';
        }
    };

    // Event listener for the hamburger button
    hamburgerMenu.addEventListener('click', toggleMenu);

    // Event listeners for each nav link to close the menu on click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if the link is an anchor link
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault(); // Prevent default jump
                const targetId = link.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }
            // Close the menu after clicking a link
            if (navOverlay.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    });

    // --- Blog Modal Functionality ---
    const modalOverlay = document.getElementById('blog-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.getElementById('modal-close-btn');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');

    const openModal = () => {
        modalOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('is-visible');
        document.body.style.overflow = ''; // Restore background scroll
        document.body.classList.remove('modal-open');
    };

    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const postPath = btn.dataset.post;
            fetch(postPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(markdown => {
                    // Use the 'marked' library (loaded in HTML) to parse the markdown
                    modalBody.innerHTML = marked.parse(markdown);
                    openModal();
                })
                .catch(error => {
                    console.error('Error fetching post:', error);
                    modalBody.innerHTML = `<p>Sorry, we couldn't load the blog post. Please try again later.</p>`;
                    openModal();
                });
        });
    });

    // Event listeners to close the modal
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal(); // Close only if clicking the overlay itself
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) closeModal();
    });
});