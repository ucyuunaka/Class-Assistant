/**
 * 课堂助手 - 滚动动画组件
 * 提供页面元素在滚动时的淡入浮现效果
 */

// 使用一个全局变量标记组件是否已初始化
window.scrollAnimationInitialized = false;

/**
 * 加载滚动动画样式
 */
function loadScrollAnimationStyles() {
  // 检查是否已经加载了样式
  if (!document.querySelector('link[href*="scrollAnimation.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    
    // 使用相对于网站根目录的路径
    let rootPath = './components/scrollAnimation/scrollAnimation.css';
    
    // 如果在测试环境
    if (window.location.pathname.includes('/components/tests/')) {
      rootPath = '../../components/scrollAnimation/scrollAnimation.css';
    } 
    // 如果在pages子文件夹
    else if (window.location.pathname.includes('/pages/')) {
      rootPath = '../components/scrollAnimation/scrollAnimation.css';
    }
    
    link.href = rootPath;
    document.head.appendChild(link);
    console.log('✅ 滚动动画CSS样式已自动加载');
  }
}

// 页面加载完成后自动加载样式
document.addEventListener('DOMContentLoaded', loadScrollAnimationStyles);

/**
 * 初始化滚动动画功能
 * @param {string} selector - 选择要应用动画的元素的CSS选择器
 * @param {Object} options - 配置选项
 * @param {number} options.threshold - 元素可见比例的阈值，默认为0.1（10%）
 * @param {string} options.activeClass - 激活状态的CSS类名，默认为'active'
 * @param {boolean} options.once - 是否只触发一次，默认为true
 * @returns {Object} - 返回控制对象，包含refresh和disconnect方法
 */
function initScrollAnimation(selector = '.animate-on-scroll', options = {}) {
  // 如果已经初始化过，则不再重复初始化
  if (window.scrollAnimationInitialized) {
    console.log('滚动动画组件已经初始化，跳过重复初始化');
    return window.scrollAnimationController;
  }
  
  console.log('正在初始化滚动动画组件...');
  
  const defaultOptions = {
    threshold: 0.1, // 默认当元素10%可见时触发
    activeClass: 'active',
    once: true, // 默认只触发一次
  };
  
  // 合并选项
  const settings = { ...defaultOptions, ...options };
  
  // 获取所有要动画的元素
  const elements = document.querySelectorAll(selector);
  
  // 如果没有找到元素，直接返回
  if (elements.length === 0) {
    console.warn(`没有找到与选择器 "${selector}" 匹配的元素`);
    return;
  }
  
  console.log(`找到 ${elements.length} 个滚动动画元素`);
  
  // 创建IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 当元素进入视口时添加活动类
          entry.target.classList.add(settings.activeClass);
          
          // 如果设置了只触发一次，则停止观察该元素
          if (settings.once) {
            observer.unobserve(entry.target);
          }
        } else if (!settings.once) {
          // 如果设置了可重复触发，则在元素离开视口时移除活动类
          entry.target.classList.remove(settings.activeClass);
        }
      });
    },
    {
      threshold: settings.threshold,
    }
  );
  // 开始观察所有元素
  elements.forEach((element) => {
    observer.observe(element);
  });
  
  console.log('✅ 滚动动画组件初始化成功！');
  
  // 设置标志为已初始化
  window.scrollAnimationInitialized = true;
  
  // 创建并保存控制器对象
  window.scrollAnimationController = {
    // 提供方法手动刷新（例如在动态添加元素后）
    refresh: function() {
      const newElements = document.querySelectorAll(selector);
      newElements.forEach((element) => {
        // 只观察尚未激活的元素
        if (!element.classList.contains(settings.activeClass)) {
          observer.observe(element);
        }
      });
    },
    // 提供方法停止观察所有元素
    disconnect: function() {
      observer.disconnect();
    }
  };
  
  return window.scrollAnimationController;
}

// 在文档加载完成后自动初始化滚动动画
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimation();
});

// 将函数暴露给全局作用域
window.initScrollAnimation = initScrollAnimation;
