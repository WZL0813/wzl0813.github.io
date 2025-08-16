
document.addEventListener('DOMContentLoaded', function() {

    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.page-section');
    const footer = document.querySelector('.footer');
    const videoBackground = document.querySelector('.video-background video');
    const musicBtn = document.getElementById('musicBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    let currentSection = 'home';
    let isAnimating = false;
    let isMusicPlaying = false;
    let audio = null;
    

    const homeSection = document.querySelector('#home');
    if (homeSection) {
        homeSection.style.opacity = '1';
        homeSection.style.transform = 'translateY(0)';
        homeSection.classList.add('active');
    }
    

    initPage();
    

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            console.log('导航点击:', targetSection);
            navigateToSection(targetSection);
        });
    });
    

    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }
    

    if (shareBtn) {
        shareBtn.addEventListener('click', shareWebsite);
    }
    

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveSection();
            checkFooterVisibility();
        }, 100);
    });
    

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            navigateToNextSection();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            navigateToPreviousSection();
        }
    });
    

    function initPage() {

        activateSection('home');
        updateNavigation();
        

        const homeSection = document.querySelector('#home');
        if (homeSection) {
            homeSection.classList.add('active');
            homeSection.style.opacity = '1';
            homeSection.style.transform = 'translateY(0)';
        }
        

        initVideoBackground();
        

        initAudio();
        

        initParticles();
    }
    

    function initAudio() {

        audio = new Audio('./music/background.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        

        audio.addEventListener('error', function() {
            console.log('音频加载失败');
            musicBtn.style.opacity = '0.5';
        });
        

        audio.addEventListener('loadeddata', function() {
            console.log('音频加载成功');
        });
    }
    

    function initParticles() {
        const particlesContainer = document.getElementById('particlesBg');
        if (!particlesContainer) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            

            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            

            particle.style.animationDelay = Math.random() * 6 + 's';
            

            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            particlesContainer.appendChild(particle);
        }
    }
    

    function toggleMusic() {
        if (!audio) return;
        
        if (isMusicPlaying) {
            audio.pause();
            musicBtn.classList.remove('active');
            musicBtn.querySelector('.btn-icon').textContent = '🎵';
        } else {
            audio.play().catch(function(error) {
                console.log('音频播放失败:', error);
            });
            musicBtn.classList.add('active');
            musicBtn.querySelector('.btn-icon').textContent = '⏸️';
        }
        
        isMusicPlaying = !isMusicPlaying;
    }
    

    function shareWebsite() {
        const url = window.location.href;
        
        if (navigator.share) {

            navigator.share({
                title: 'Ryokuryuneko',
                text: '喵！新的开始！一切奇迹的起点！',
                url: url
            }).catch(function(error) {
                console.log('分享失败:', error);
                copyToClipboard(url);
            });
        } else {
            copyToClipboard(url);
        }
    }
    

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                showToast('网址已复制到剪贴板！');
            }).catch(function(error) {
                console.log('复制失败:', error);
                fallbackCopyToClipboard(text);
            });
        } else {
            fallbackCopyToClipboard(text);
        }
    }

    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('网址已复制到剪贴板！');
        } catch (error) {
            console.log('复制失败:', error);
            showToast('复制失败，请手动复制网址');
        }
        document.body.removeChild(textArea);
    }

    function showToast(message) {

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(66, 133, 244, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    

    function initVideoBackground() {
        if (videoBackground) {

            videoBackground.addEventListener('error', function() {
                console.log('视频加载失败，使用备用背景');
                document.body.style.background = 'linear-gradient(135deg, #000428, #004e92)';
            });
            

            videoBackground.addEventListener('loadeddata', function() {
                console.log('视频背景加载成功');
            });
        }
    }
    

    function navigateToSection(sectionId) {
        if (sectionId === currentSection || isAnimating) return;
        
        isAnimating = true;
        

        const currentSectionElement = document.querySelector(`#${currentSection}`);
        const targetSectionElement = document.querySelector(`#${sectionId}`);
        
        if (currentSectionElement && targetSectionElement) {

            const currentIndex = getSectionIndex(currentSection);
            const targetIndex = getSectionIndex(sectionId);
            const isForward = targetIndex > currentIndex;
            

            currentSectionElement.classList.add(isForward ? 'page-slide-down-out' : 'page-fade-out');
            currentSectionElement.classList.remove('active');
            
            setTimeout(() => {

                currentSectionElement.classList.remove('page-slide-down-out', 'page-fade-out');
                

                activateSection(sectionId);
                

                targetSectionElement.classList.add(isForward ? 'page-slide-down-in' : 'page-fade-in');
                targetSectionElement.classList.add('active');
                

                scrollToSection(sectionId);
                

                setTimeout(() => {
                    targetSectionElement.classList.remove('page-slide-down-in', 'page-fade-in');
                    isAnimating = false;
                }, 1000);
                
            }, 800); 
        }
    }
    

    function getSectionIndex(sectionId) {
        const sectionOrder = ['home', 'about', 'characters', 'download'];
        return sectionOrder.indexOf(sectionId);
    }
    

    function activateSection(sectionId) {

        sections.forEach(section => {
            section.classList.remove('active');
        });
        

        const targetSection = document.querySelector(`#${sectionId}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        currentSection = sectionId;
        updateNavigation();
    }
    

    function updateNavigation() {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === currentSection) {
                item.classList.add('active');
            }
        });
    }

    function scrollToSection(sectionId) {
        const targetSection = document.querySelector(`#${sectionId}`);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; 
            window.scrollTo({
                top: offsetTop,
                behavior: 'auto'
            });
        }
    }
    

    function navigateToNextSection() {
        const sectionOrder = ['home', 'about', 'characters', 'download'];
        const currentIndex = sectionOrder.indexOf(currentSection);
        const nextIndex = (currentIndex + 1) % sectionOrder.length;
        navigateToSection(sectionOrder[nextIndex]);
    }
    

    function navigateToPreviousSection() {
        const sectionOrder = ['home', 'about', 'characters', 'download'];
        const currentIndex = sectionOrder.indexOf(currentSection);
        const prevIndex = currentIndex === 0 ? sectionOrder.length - 1 : currentIndex - 1;
        navigateToSection(sectionOrder[prevIndex]);
    }

    function updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = section.id;
                if (sectionId !== currentSection) {
                    activateSection(sectionId);
                }
            }
        });
    }
    

    function checkFooterVisibility() {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition >= documentHeight - 100) {
            footer.classList.add('show');
        } else {
            footer.classList.remove('show');
        }
    }

    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                navigateToNextSection();
            } else {

                navigateToPreviousSection();
            }
        }
    }
    

    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {

            updateActiveSection();
        }
    });
    

    window.addEventListener('resize', function() {

        setTimeout(() => {
            updateActiveSection();
        }, 100);
    });
    

    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        

        if (videoBackground) {
            const translateX = (mouseX - 0.5) * 20;
            const translateY = (mouseY - 0.5) * 20;
            videoBackground.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    });

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        

        if (videoBackground) {
            videoBackground.style.transform = `translateY(${parallax}px)`;
        }
    });
    

    setTimeout(() => {
        addInteractionHints();
    }, 1000);
    
    function addInteractionHints() {
        console.log('Ryokuryuneko官网已初始化完成！');
        

        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        heroButtons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
});
