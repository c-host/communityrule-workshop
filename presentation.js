// Presentation Enhancement Script
document.addEventListener('DOMContentLoaded', function () {

    // Hide loading screen
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.remove();
            }, 500);
        }, 1000);
    }

    // Add scroll progress bar to the page
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    // Add section navigation dots
    const sections = document.querySelectorAll('.section');
    const sectionNav = document.createElement('div');
    sectionNav.className = 'section-nav';

    sections.forEach((section, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'section-nav-item';
        navItem.setAttribute('data-section', index);
        navItem.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        sectionNav.appendChild(navItem);
    });

    document.body.appendChild(sectionNav);

    // Update scroll progress and active section
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        const progressBarElement = document.querySelector('.scroll-progress-bar');
        progressBarElement.style.width = scrollPercent + '%';

        // Update active section in navigation
        const navItems = document.querySelectorAll('.section-nav-item');
        navItems.forEach((item, index) => {
            item.classList.remove('active');
        });

        // Find which section is currently in view
        const currentSection = Array.from(sections).findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        });

        if (currentSection >= 0) {
            navItems[currentSection].classList.add('active');
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', updateScrollProgress);

    // Initialize on load
    updateScrollProgress();

    // Add smooth reveal animations for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function (e) {
        const currentSection = Array.from(sections).findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        });

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSection < sections.length - 1) {
                sections[currentSection + 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSection > 0) {
                sections[currentSection - 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            sections[0].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'End') {
            e.preventDefault();
            sections[sections.length - 1].scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- Timeline Entry Navigation (Up/Down) ---
    const timelineEntries = Array.from(document.querySelectorAll('.timeline .time'));
    document.addEventListener('keydown', function (e) {
        // Only handle up/down for timeline navigation if not inside a tab
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const currentIndex = timelineEntries.findIndex(timeEl => {
                const rect = timeEl.getBoundingClientRect();
                return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
            });
            if (e.key === 'ArrowDown' && currentIndex < timelineEntries.length - 1) {
                e.preventDefault();
                // Scroll to next time element and its timeline-item
                const nextTime = timelineEntries[currentIndex + 1];
                const nextItem = nextTime.nextElementSibling && nextTime.nextElementSibling.classList.contains('timeline-item')
                    ? nextTime.nextElementSibling
                    : nextTime.parentElement.querySelectorAll('.timeline-item')[currentIndex + 1];
                nextTime.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (nextItem) nextItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                const prevTime = timelineEntries[currentIndex - 1];
                const prevItem = prevTime.nextElementSibling && prevTime.nextElementSibling.classList.contains('timeline-item')
                    ? prevTime.nextElementSibling
                    : prevTime.parentElement.querySelectorAll('.timeline-item')[currentIndex - 1];
                prevTime.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (prevItem) prevItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    // Add section counter
    const sectionCounter = document.createElement('div');
    sectionCounter.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(102, 126, 234, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        z-index: 1001;
    `;
    document.body.appendChild(sectionCounter);

    function updateSectionCounter() {
        const currentSection = Array.from(sections).findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        });
        sectionCounter.textContent = `${currentSection + 1} / ${sections.length}`;
    }

    window.addEventListener('scroll', updateSectionCounter);
    updateSectionCounter();

    // --- Timeline Tabs Functionality ---
    document.querySelectorAll('.timeline-item').forEach(item => {
        const details = item.querySelectorAll('.timeline-detail');
        if (details.length > 1) {
            // Create tab bar
            const tabBar = document.createElement('div');
            tabBar.className = 'timeline-tabs';
            details.forEach((detail, idx) => {
                const tab = document.createElement('button');
                tab.className = 'timeline-tab';
                tab.textContent = detail.querySelector('h2, h3, h4')?.textContent || `Tab ${idx + 1}`;
                tab.addEventListener('click', () => {
                    details.forEach(d => d.classList.remove('active'));
                    tabBar.querySelectorAll('.timeline-tab').forEach(t => t.classList.remove('active'));
                    detail.classList.add('active');
                    tab.classList.add('active');
                });
                if (idx === 0) {
                    tab.classList.add('active');
                    detail.classList.add('active');
                }
                tabBar.appendChild(tab);
            });
            item.insertBefore(tabBar, item.firstChild);
            // Hide all but first detail by default
            details.forEach((detail, idx) => {
                if (idx !== 0) detail.classList.remove('active');
            });
        } else if (details.length === 1) {
            details[0].classList.add('active');
        }
    });
});
