// main.js
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bgm');
    const toggleBtn = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const guide = document.querySelector('.play-guide');
    let userInteracted = false;

    // 初始化设置
    function initSettings() {
        audio.volume = localStorage.getItem('bgmVolume') || 0.5;
        volumeSlider.value = audio.volume;
        audio.muted = localStorage.getItem('bgmMuted') === 'true';
    }

    // 自动播放处理
    function handleAutoPlay() {
        // 先静音尝试播放
        audio.muted = true;
        audio.play()
            .then(() => {
                audio.muted = false;
                guide.style.display = 'none';
            })
            .catch(error => {
                console.log('自动播放需要交互:', error);
                showGuide();
            });
    }

    // 显示引导提示
    function showGuide() {
        guide.style.display = 'flex';
        document.querySelector('.guide-btn').addEventListener('click', firstInteraction);
    }

    // 首次交互处理
    function firstInteraction() {
        userInteracted = true;
        guide.style.display = 'none';
        audio.play().then(() => {
            audio.pause(); // 避免自动播放冲突
            initSettings();
        });
    }

    // 事件监听
    document.addEventListener('click', () => {
        if (!userInteracted) return;
        handlePlayback();
    });

    toggleBtn.addEventListener('click', () => {
        audio.paused ? audio.play() : audio.pause();
        updateButton();
        saveSettings();
    });

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
        saveSettings();
        updateButton();
    });

    // 核心播放逻辑
    function handlePlayback() {
        if (audio.readyState < 2) {
            audio.load(); // 确保音频已加载
            audio.play().catch(console.error);
        }
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => updateButton())
                .catch(e => {
                    if (e.name === 'NotAllowedError') {
                        showGuide();
                    }
                });
        }
    }

    // 状态保存
    function saveSettings() {
        localStorage.setItem('bgmVolume', audio.volume);
        localStorage.setItem('bgmMuted', audio.paused);
    }

    // 按钮状态更新
    function updateButton() {
        toggleBtn.textContent = audio.paused ? '🔇' : '🎵';
        toggleBtn.style.background = audio.paused ? '#666' : '#2196F3';
    }

    // 初始化流程
    initSettings();
    setTimeout(handleAutoPlay, 1000); // 延迟自动播放尝试

    // 处理页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !audio.paused) {
            audio.play().catch(console.error);
        }
    });
});