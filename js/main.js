document.addEventListener('DOMContentLoaded', function() {
    const progress = document.querySelector('.progress');
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (!progress || !loadingScreen) return;
    
    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = '0%';
    progressText.style.cssText = `
        color: #4285F4;
        font-size: 16px;
        font-weight: bold;
        margin-top: 10px;
    `;
    loadingScreen.appendChild(progressText);

    let width = 0;
    const totalTime = Math.random() * 4000 + 2000;
    const interval = setInterval(function() {
        if (width >= 100) {
            clearInterval(interval);
            // 隐藏加载界面
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        } else {
            const increment = Math.random() * 8 + 2;
            width = Math.min(width + increment, 100);
            progress.style.width = width + '%';
            progressText.textContent = Math.floor(width) + '%';
        }
    }, totalTime / 100);
});