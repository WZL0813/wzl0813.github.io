function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return '早上好';
    if (hour >= 11 && hour < 13) return '中午好';
    if (hour >= 13 && hour < 18) return '下午好';
    return '晚上好';
}

function showGreeting() {
    const greeting = document.getElementById('greeting');
    greeting.textContent = getGreeting() + '，欢迎来到我的主页';
    greeting.classList.remove('hide');
    setTimeout(() => {
        greeting.classList.add('hide');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', showGreeting);

function updateDateTime() {
    const now = new Date();
    const dateStr = now.getFullYear() + '年' +
        String(now.getMonth() + 1).padStart(2, '0') + '月' +
        String(now.getDate()).padStart(2, '0') + '日 ' +
        ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][now.getDay()];
    const timeStr = now.toTimeString().slice(0,8);
    document.getElementById('date').textContent = dateStr;
    document.getElementById('time').textContent = timeStr;
}
setInterval(updateDateTime, 1000);
updateDateTime(); 