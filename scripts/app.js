/* app.js */

// 等到 DOM 内容加载完毕后再执行脚本
document.addEventListener('DOMContentLoaded', () => {

    // 1. 选择 DOM 元素
    const menuToggle = document.querySelector('.menu-toggle');
    const navOverlay = document.querySelector('.nav-menu-overlay');

    // 2. 确保元素存在
    if (menuToggle && navOverlay) {
        
        // 3. 添加点击事件监听器
        menuToggle.addEventListener('click', () => {
            
            // 切换按钮的 'is-active' 类 (用于 "X" 动画)
            menuToggle.classList.toggle('is-active');
            
            // 切换菜单的 'is-active' 类 (用于显示/隐藏)
            navOverlay.classList.toggle('is-active');

            // 4. (可访问性) 更新 aria-expanded 状态
            const isActive = navOverlay.classList.contains('is-active');
            menuToggle.setAttribute('aria-expanded', isActive);

            // 5. (重要) 切换时锁定/解锁页面滚动
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
});
