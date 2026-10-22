document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation 
    document.querySelectorAll('.history-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Update active nav item
            document.querySelectorAll('.history-nav a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Highlight current section in nav
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 150;
        
        document.querySelectorAll('.history-section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.history-nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.history-figure, .timeline-item, .history-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.history-figure, .timeline-item, .history-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.5s ease';
    });
    
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add click effect to history cards
    document.querySelectorAll('.history-card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
});

// Auto-Transition Banner Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.banner-slide');

function rotateSlides() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
setInterval(rotateSlides, 2500);

// Initialize first slide
slides[0].classList.add('active');

// JavaScript for Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Sidebar Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('historyNavSidebar');
    const toggleBtn = document.getElementById('navToggle');
    const overlay = document.getElementById('historyNavOverlay');
    const items = document.querySelectorAll('.history-nav-item');
    let isMobile = window.innerWidth <= 768;

    function toggleNav() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        toggleArrow();
        document.body.style.overflow = (isMobile && sidebar.classList.contains('open')) ? 'hidden' : '';
    }

    function toggleArrow() {
        const icon = toggleBtn.querySelector('i');
        if (sidebar.classList.contains('open')) {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        } else {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        }
    }

    toggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        toggleNav();
    });

    overlay.addEventListener('click', () => toggleNav());

    // Nav item clicks
    items.forEach(item => {
        item.addEventListener('click', e => {
            const targetId = item.getAttribute('data-target');
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const section = document.getElementById(targetId);
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (isMobile) toggleNav();
            e.preventDefault();
        });
    });

    // Swipe open/close
    let touchStartX = 0, touchEndX = 0;
    document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        const threshold = 50;
        if (isMobile && diff > threshold && touchStartX < 50 && !sidebar.classList.contains('open')) toggleNav();
        if (isMobile && diff < -threshold && sidebar.classList.contains('open')) toggleNav();
    });

    // Resize handling
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
        if (window.innerWidth > 768) {
            document.body.style.overflow = '';
            overlay.classList.remove('active');
        }
    });

    // Initialize proper arrow direction
    toggleArrow();
});

// Custom Audio Player Functionality - FIXED VERSION (Mobile Compatible)
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('gedeoAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const progress = document.querySelector('.progress');
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    
    // Store audio state globally to prevent conflicts
    window.audioPlayer = {
        audio: audio,
        isPlaying: false,
        initialized: false
    };
    
    // Format time from seconds to MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Update progress bar and time
    function updateProgress() {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = `${percent}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            
            // Update duration if not already set
            if (durationEl.textContent === '0:00') {
                durationEl.textContent = formatTime(audio.duration);
            }
        }
    }
    
    // Set progress on click
    function setProgress(e) {
        e.stopPropagation(); // Prevent event bubbling
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    }
    
    // Toggle play/pause
    function togglePlayPause(e) {
        if (e) e.stopPropagation(); // Prevent event bubbling
        
        if (audio.paused) {
            audio.play().catch(error => {
                console.error('Audio play failed:', error);
            });
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            window.audioPlayer.isPlaying = true;
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            window.audioPlayer.isPlaying = false;
        }
    }
    
    // Toggle mute
    function toggleMute(e) {
        if (e) e.stopPropagation(); // Prevent event bubbling
        audio.muted = !audio.muted;
        muteBtn.innerHTML = audio.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    }
    
    // Initialize duration when metadata is loaded
    function loadedMetadata() {
        durationEl.textContent = formatTime(audio.duration);
        window.audioPlayer.initialized = true;
    }
    
    // Re-initialize audio player if needed
    function ensureAudioPlayer() {
        if (!window.audioPlayer.initialized && audio.readyState >= 2) {
            loadedMetadata();
        }
    }
    
    // Event listeners with proper event handling
    playPauseBtn.addEventListener('click', togglePlayPause, true); // Use capture phase
    muteBtn.addEventListener('click', toggleMute, true); // Use capture phase
    progressBar.addEventListener('click', setProgress, true); // Use capture phase
    
    // Touch events for mobile with improved handling
    progressBar.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        const clickX = touch.clientX - rect.left;
        const duration = audio.duration;
        
        if (duration) {
            audio.currentTime = (clickX / rect.width) * duration;
        }
    }, true);
    
    // Prevent navigation items from interfering with audio
    const navLinks = document.querySelectorAll('.history-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ensure audio player remains functional after navigation
            setTimeout(ensureAudioPlayer, 100);
        });
    });
    
    // Audio event listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', loadedMetadata);
    audio.addEventListener('ended', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        window.audioPlayer.isPlaying = false;
    });
    
    // Error handling
    audio.addEventListener('error', function(e) {
        console.error('Audio error:', e);
        playPauseBtn.disabled = true;
        playPauseBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        playPauseBtn.style.background = '#ff6b6b';
    });
    
    // Re-initialize audio when page becomes visible again (after navigation)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(ensureAudioPlayer, 500);
        }
    });
    
    // Additional fix for sidebar navigation interference
    const sidebar = document.getElementById('historyNavSidebar');
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            // If clicking on nav items, ensure audio player isn't affected
            if (e.target.closest('.history-nav-link')) {
                setTimeout(ensureAudioPlayer, 300);
            }
        });
    }
    
    // Mobile touch improvements
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        const controlBtns = document.querySelectorAll('.control-btn');
        controlBtns.forEach(btn => {
            btn.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                this.style.transform = 'scale(0.95)';
                this.style.background = '#8ab3f0';
            }, true);
            
            btn.addEventListener('touchend', function(e) {
                e.stopPropagation();
                this.style.transform = '';
                this.style.background = '';
            }, true);
            
            btn.addEventListener('touchcancel', function(e) {
                e.stopPropagation();
                this.style.transform = '';
                this.style.background = '';
            }, true);
        });
        
        // Prevent default on audio player to avoid conflicts
        const audioPlayer = document.querySelector('.custom-audio-player');
        if (audioPlayer) {
            audioPlayer.addEventListener('touchstart', function(e) {
                e.stopPropagation();
            }, true);
            
            audioPlayer.addEventListener('touchend', function(e) {
                e.stopPropagation();
            }, true);
        }
    }
    
    // Initial audio setup
    setTimeout(ensureAudioPlayer, 1000);
});

// ===== READ MORE BUTTON FUNCTIONALITY - FIXED VERSION =====
document.addEventListener('DOMContentLoaded', function() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    
    // Load saved states when page loads
    readMoreBtns.forEach(btn => {
        const content = btn.closest('.text-content');
        if (!content) return;
        
        const fullText = content.querySelector('.full-text');
        const section = btn.closest('.history-section');
        const sectionId = section ? section.id : 'unknown';
        
        // Check if this section was expanded before
        const isExpanded = localStorage.getItem(`readMore-${sectionId}`) === 'true';
        
        if (isExpanded && fullText) {
            fullText.classList.add('expanded');
            btn.classList.add('active');
            btn.innerHTML = 'Close <i class="fas fa-times"></i>';
        }
    });
    
    // Add click event listeners
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.closest('.text-content');
            if (!content) return;
            
            const fullText = content.querySelector('.full-text');
            const section = this.closest('.history-section');
            const sectionId = section ? section.id : 'unknown';
            
            if (!fullText) return;
            
            // Toggle expanded state
            const isNowExpanded = !fullText.classList.contains('expanded');
            fullText.classList.toggle('expanded');
            this.classList.toggle('active');
            
            // Save state to localStorage
            localStorage.setItem(`readMore-${sectionId}`, isNowExpanded);
            
            // Update button text and icon
            if (isNowExpanded) {
                this.innerHTML = 'Close <i class="fas fa-times"></i>';
                
                // Smooth scroll to show the expanded content
                setTimeout(() => {
                    fullText.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }, 350);
                
            } else {
                this.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
                
                // Smooth scroll back to the Read More button
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                    });
                }, 100);
            }
        });
    });
    
    console.log('Read More functionality loaded successfully');
});