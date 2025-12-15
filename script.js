document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#sideNav ul li a');
    const sections = document.querySelectorAll('.resume-section');
    const toggler = document.querySelector('.navbar-toggler');
    const navCollapse = document.getElementById('navbarResponsive');
    
    // --- 1. 手機菜單開關邏輯 ---
    function toggleNavMenu(forceClose = false) {
        const isExpanded = toggler.getAttribute('aria-expanded') === 'true';
        
        if (window.innerWidth <= 992) {
            // 手機模式下，控制菜單的顯示與 ARIA 狀態
            if (forceClose && isExpanded) {
                toggler.setAttribute('aria-expanded', 'false');
                navCollapse.style.display = 'none';
            } else if (!forceClose) {
                const newState = !isExpanded;
                toggler.setAttribute('aria-expanded', newState);
                navCollapse.style.display = newState ? 'block' : 'none';
            }
        }
    }

    toggler.addEventListener('click', () => toggleNavMenu());

    // --- 2. 平滑滾動與連結高亮邏輯 ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // 點擊連結後，在手機上自動收回菜單
            toggleNavMenu(true); 
            
            if (targetElement) {
                // 計算滾動偏移量以避開導航欄
                let offset = 20; // 電腦版/側邊欄偏移量 (較小)
                
                // 如果是小於 992px 的螢幕 (手機模式)，偏移量要避開頂部固定導航欄
                if (window.innerWidth <= 992) {
                    offset = 54; // 側邊導航欄的高度
                }

                // 平滑滾動
                window.scrollTo({
                    top: targetElement.offsetTop - offset, 
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. 滾動時更新導航列的 active 狀態 (Intersection Observer) ---
    const observerOptions = {
        // RootMargin 讓 Intersection Observer 在區塊到達視窗頂部附近時觸發
        // 負值可以將觸發線上移
        rootMargin: '-50% 0px -50% 0px', 
        threshold: 0 // 只需進入或離開即可觸發
    };
    
    const observer = new IntersectionObserver((entries) => {
        let currentActiveLink = null;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                currentActiveLink = document.querySelector(`#sideNav ul li a[href="#${id}"]`);
            }
        });
        
        if (currentActiveLink) {
             // 移除所有連結的 active 類別
            navLinks.forEach(link => link.classList.remove('active'));
            // 為當前進入視野的區塊連結添加 active 類別
            currentActiveLink.classList.add('active');
        }
        
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});