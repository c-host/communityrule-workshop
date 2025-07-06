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

    // Remove keyboard navigation for sections and timeline entries
    // (Deleted document.addEventListener('keydown', ...) blocks for ArrowDown, ArrowUp, PageDown, PageUp, Home, End)

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

    // --- Embed Fullscreen Button ---
    document.querySelectorAll('.embed-container').forEach(container => {
        // Add button if not present
        if (!container.querySelector('.fullscreen-btn')) {
            const btn = document.createElement('button');
            btn.className = 'fullscreen-btn';
            btn.title = 'Expand to fullscreen';
            btn.innerHTML = '⛶';

            function isFullscreen() {
                return document.fullscreenElement === container ||
                    document.webkitFullscreenElement === container ||
                    document.msFullscreenElement === container;
            }

            function enterFullscreen() {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            }

            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isFullscreen()) {
                    enterFullscreen();
                } else {
                    exitFullscreen();
                }
            });

            // Listen for fullscreen change to update button icon/title
            function updateBtn() {
                if (isFullscreen()) {
                    btn.innerHTML = '🡸';
                    btn.title = 'Exit fullscreen';
                } else {
                    btn.innerHTML = '⛶';
                    btn.title = 'Expand to fullscreen';
                }
            }
            document.addEventListener('fullscreenchange', updateBtn);
            document.addEventListener('webkitfullscreenchange', updateBtn);
            document.addEventListener('msfullscreenchange', updateBtn);

            container.appendChild(btn);
        }
    });

    // --- Worksheet Fly-out Panel Logic ---
    const worksheetToggle = document.getElementById('worksheet-toggle');
    const worksheetPanel = document.getElementById('worksheet-panel');
    const worksheetClose = document.getElementById('worksheet-close');
    const worksheetForm = document.getElementById('worksheet-form');
    const worksheetDownload = document.getElementById('worksheet-download');

    if (worksheetToggle && worksheetPanel && worksheetClose && worksheetForm && worksheetDownload) {
        worksheetToggle.addEventListener('click', () => {
            worksheetPanel.classList.toggle('open');
        });
        worksheetClose.addEventListener('click', () => {
            worksheetPanel.classList.remove('open');
        });
        // Optional: close panel on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') worksheetPanel.classList.remove('open');
        });
        // Download as .txt
        worksheetDownload.addEventListener('click', () => {
            const data = new FormData(worksheetForm);
            let txt = '';
            txt += `Group Name: ${data.get('groupName') || ''}\n\n`;
            txt += `Group Culture\n`;
            txt += `Purpose: ${data.get('culturePurpose') || ''}\n`;
            txt += `Values: ${data.get('cultureValues') || ''}\n`;
            txt += `Norms: ${data.get('cultureNorms') || ''}\n`;
            txt += `Other Important Cultural Elements: ${data.get('cultureOther') || ''}\n\n`;
            txt += `Making Decisions\n`;
            txt += `Methods: ${data.get('decisionMethods') || ''}\n`;
            txt += `Who Decides: ${data.get('decisionWho') || ''}\n`;
            txt += `Process: ${data.get('decisionProcess') || ''}\n`;
            txt += `Other Decision-Making Notes: ${data.get('decisionOther') || ''}\n\n`;
            txt += `Getting Things Done\n`;
            txt += `How: ${data.get('processHow') || ''}\n`;
            txt += `Changes: ${data.get('processChanges') || ''}\n`;
            txt += `Checking: ${data.get('processChecking') || ''}\n`;
            txt += `Other Process Notes: ${data.get('processOther') || ''}\n\n`;
            txt += `Group Structure\n`;
            txt += `Jobs: ${data.get('structureJobs') || ''}\n`;
            txt += `Membership: ${data.get('structureMembership') || ''}\n`;
            txt += `Rights: ${data.get('structureRights') || ''}\n`;
            txt += `Other Structural Elements: ${data.get('structureOther') || ''}\n`;
            const blob = new Blob([txt], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'communityrule-worksheet.txt';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        });
    }

    // --- Facilitator Background Dynamic Embed Logic ---
    (function () {
        const addBtn = document.querySelector('.add-embed-btn');
        const form = document.querySelector('.add-embed-form');
        const urlInput = form ? form.querySelector('.embed-url-input') : null;
        const cancelBtn = form ? form.querySelector('.cancel-embed-btn') : null;
        const embedList = document.getElementById('facilitator-embed-list');

        // Function to add fullscreen button to an embed container
        function addFullscreenButton(container) {
            if (!container.querySelector('.fullscreen-btn')) {
                const btn = document.createElement('button');
                btn.className = 'fullscreen-btn';
                btn.title = 'Expand to fullscreen';
                btn.innerHTML = '⛶';

                function isFullscreen() {
                    return document.fullscreenElement === container ||
                        document.webkitFullscreenElement === container ||
                        document.msFullscreenElement === container;
                }

                function enterFullscreen() {
                    if (container.requestFullscreen) {
                        container.requestFullscreen();
                    } else if (container.webkitRequestFullscreen) {
                        container.webkitRequestFullscreen();
                    } else if (container.msRequestFullscreen) {
                        container.msRequestFullscreen();
                    }
                }

                function exitFullscreen() {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }

                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!isFullscreen()) {
                        enterFullscreen();
                    } else {
                        exitFullscreen();
                    }
                });

                // Listen for fullscreen change to update button icon/title
                function updateBtn() {
                    if (isFullscreen()) {
                        btn.innerHTML = '🡸';
                        btn.title = 'Exit fullscreen';
                    } else {
                        btn.innerHTML = '⛶';
                        btn.title = 'Expand to fullscreen';
                    }
                }
                document.addEventListener('fullscreenchange', updateBtn);
                document.addEventListener('webkitfullscreenchange', updateBtn);
                document.addEventListener('msfullscreenchange', updateBtn);

                container.appendChild(btn);
            }
        }

        if (addBtn && form && urlInput && cancelBtn && embedList) {
            addBtn.addEventListener('click', () => {
                form.style.display = 'block';
                urlInput.focus();
            });
            cancelBtn.addEventListener('click', () => {
                form.style.display = 'none';
                urlInput.value = '';
            });
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let url = urlInput.value.trim();
                if (!url) return;
                if (!/^https?:\/\//i.test(url)) {
                    url = 'https://' + url;
                }
                let embedHtml = '';
                // YouTube
                const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
                if (ytMatch) {
                    const videoId = ytMatch[1];
                    embedHtml = `<div class="embed-container"><iframe src="https://www.youtube.com/embed/${videoId}?rel=0" width="100%" height="400" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
                }
                // CommunityRule
                else if (url.match(/communityrule\.info\/create\/?\?r=\d+/)) {
                    embedHtml = `<div class="embed-container"><iframe src="${url}" width="100%" height="600" frameborder="0"></iframe></div>`;
                }
                // Generic iframe fallback
                else {
                    embedHtml = `<div class="embed-container"><iframe src="${url}" width="100%" height="400" frameborder="0"></iframe></div>`;
                }
                const li = document.createElement('li');
                li.innerHTML = embedHtml;
                embedList.appendChild(li);

                // Add fullscreen button to the newly created embed container
                const newContainer = li.querySelector('.embed-container');
                if (newContainer) {
                    addFullscreenButton(newContainer);
                }

                form.style.display = 'none';
                urlInput.value = '';
            });
        }
    })();

    // --- Workshop Timer Functionality ---
    (function () {
        const timer = document.getElementById('workshop-timer');
        const timerDisplay = document.getElementById('timer-display');
        const playPauseBtn = document.getElementById('timer-play-pause');
        const resetBtn = document.getElementById('timer-reset');
        const fullscreenBtn = document.getElementById('timer-fullscreen');
        const minimizeBtn = document.getElementById('timer-minimize');
        const minimizedIcon = document.getElementById('timer-minimized-icon');
        const presetBtns = document.querySelectorAll('.preset-btn');
        const customMinutes = document.getElementById('custom-minutes');
        const customSeconds = document.getElementById('custom-seconds');
        const setCustomBtn = document.getElementById('set-custom-time');

        let timeLeft = 0;
        let timerInterval = null;
        let isRunning = false;
        let totalTime = 0;

        // --- Expansion State Management ---
        function showMediumTimer() {
            timer.classList.add('visible');
            minimizedIcon.style.display = 'none';
            timer.classList.remove('fullscreen');
        }
        function showMinimizedIcon() {
            timer.classList.remove('visible');
            minimizedIcon.style.display = 'flex';
            timer.classList.remove('fullscreen');
        }
        function showFullscreenTimer() {
            timer.classList.add('visible');
            timer.classList.add('fullscreen');
            minimizedIcon.style.display = 'none';
        }
        // Initial state: minimized icon only
        showMinimizedIcon();

        minimizedIcon.addEventListener('click', showMediumTimer);
        minimizeBtn.addEventListener('click', showMinimizedIcon);
        fullscreenBtn.addEventListener('click', () => {
            if (timer.classList.contains('fullscreen')) {
                timer.classList.remove('fullscreen');
                fullscreenBtn.textContent = '⛶';
                fullscreenBtn.title = 'Fullscreen Timer';
                showMediumTimer();
            } else {
                showFullscreenTimer();
                fullscreenBtn.textContent = '🡸';
                fullscreenBtn.title = 'Exit Fullscreen';
            }
        });

        // Hide minimized icon in fullscreen mode
        function updateIconVisibility() {
            if (timer.classList.contains('fullscreen')) {
                minimizedIcon.style.display = 'none';
            } else if (!timer.classList.contains('visible')) {
                minimizedIcon.style.display = 'flex';
            }
        }

        // --- Timer Logic ---
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        function updateDisplay() {
            timerDisplay.textContent = formatTime(timeLeft);
            timer.classList.remove('warning', 'urgent');
            if (timeLeft <= 120 && timeLeft > 0) {
                timer.classList.add('urgent');
            } else if (timeLeft <= 300 && timeLeft > 0) {
                timer.classList.add('warning');
            }
        }

        function startTimer() {
            if (timeLeft > 0 && !isRunning) {
                isRunning = true;
                playPauseBtn.textContent = '⏸️';
                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateDisplay();
                    if (timeLeft <= 0) {
                        stopTimer();
                        if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification('Time\'s up!', { body: 'Workshop timer has finished.' });
                        }
                    }
                }, 1000);
            }
        }

        function stopTimer() {
            isRunning = false;
            playPauseBtn.textContent = '▶️';
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }

        function resetTimer() {
            stopTimer();
            timeLeft = totalTime;
            updateDisplay();
        }

        function setTime(seconds) {
            stopTimer();
            timeLeft = seconds;
            totalTime = seconds;
            updateDisplay();
        }

        // Event Listeners
        playPauseBtn.addEventListener('click', () => {
            if (isRunning) {
                stopTimer();
            } else {
                startTimer();
            }
        });

        resetBtn.addEventListener('click', resetTimer);

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const time = parseInt(btn.dataset.time);
                setTime(time);
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        setCustomBtn.addEventListener('click', () => {
            const minutes = parseInt(customMinutes.value) || 0;
            const seconds = parseInt(customSeconds.value) || 0;
            const totalSeconds = minutes * 60 + seconds;
            if (totalSeconds > 0) {
                setTime(totalSeconds);
                customMinutes.value = '';
                customSeconds.value = '';
                presetBtns.forEach(b => b.classList.remove('active'));
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT') return;
            switch (e.key) {
                case ' ': e.preventDefault(); if (isRunning) stopTimer(); else startTimer(); break;
                case 'r': case 'R': resetTimer(); break;
                case 'f': case 'F':
                    if (timer.classList.contains('fullscreen')) {
                        timer.classList.remove('fullscreen');
                        fullscreenBtn.textContent = '⛶';
                        fullscreenBtn.title = 'Fullscreen Timer';
                        showMediumTimer();
                    } else {
                        showFullscreenTimer();
                        fullscreenBtn.textContent = '🡸';
                        fullscreenBtn.title = 'Exit Fullscreen';
                    }
                    break;
                case 'm': case 'M':
                    if (timer.classList.contains('visible') && !timer.classList.contains('fullscreen')) {
                        showMinimizedIcon();
                    } else if (!timer.classList.contains('visible')) {
                        showMediumTimer();
                    }
                    break;
            }
        });

        // Initialize timer
        updateDisplay();
    })();
});
