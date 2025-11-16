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

    /* * --- IV. TOC 滚动高亮逻辑 --- */
    
    // 1. 查找TOC和所有文章标题
    const toc = document.querySelector('.toc-navigation');
    const articleHeadings = document.querySelectorAll('.article-content h2[id], .article-content h3[id]');
    
    // 仅在TOC和标题都存在时才运行
    if (toc && articleHeadings.length > 0) {
    
    let currentActiveId = ''; // 用于跟踪当前高亮的ID
    
    // 2. IntersectionObserver 回调函数
    const observerCallback = (entries) => {
        let latestEntry = null; // 存储最近的、在"激活区"的条目
    
        entries.forEach(entry => {
            // 检查条目是否在视口"激活区"内
            if (entry.isIntersecting) {
                // 我们要找所有在"激活区"中 "最靠下" 的那一个
                if (!latestEntry || entry.boundingClientRect.top > latestEntry.boundingClientRect.top) {
                    latestEntry = entry;
                }
            }
        });
    
        // 如果找到了新的"激活"条目
        if (latestEntry) {
            const newActiveId = latestEntry.target.id;
            
            // 仅在ID变化时才更新，防止不必要的DOM操作
            if (newActiveId !== currentActiveId) {
                
                // 移除旧的 'is-active'
                if (currentActiveId) {
                    const oldLink = toc.querySelector(`a[href="#${currentActiveId}"]`);
                    if (oldLink) oldLink.classList.remove('is-active');
                }
                
                // 添加新的 'is-active'
                const newLink = toc.querySelector(`a[href="#${newActiveId}"]`);
                if (newLink) newLink.classList.add('is-active');
                
                currentActiveId = newActiveId;
            }
        }
        // 注意：如果没有条目在"激活区" (例如在标题之间滚动)，
        // 我们保持上一个ID高亮，这提供了更稳定的用户体验。
    };
    
    // 3. 创建 Observer 实例
    const observer = new IntersectionObserver(observerCallback, {
        // "root" 默认为视口
        // 定义 "激活区" 为视口顶部 40% 的区域
        // '0px 0px -60% 0px' 意味着 "顶部偏移0, 右侧偏移0, 底部偏移-60%, 左侧偏移0"
        // 这定义了一个从视口顶部到底部40%处的矩形区域
        rootMargin: '0px 0px -60% 0px',
        threshold: 0 // 只要有1像素进入该区域就触发
    });
    
    // 4. 让 Observer 观察所有标题
    articleHeadings.forEach(heading => {
        observer.observe(heading);
    });
    }
    
});
