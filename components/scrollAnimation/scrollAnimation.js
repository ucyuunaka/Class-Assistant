/**
 * 课堂助手 - 滚动动画组件
 * 提供页面元素在滚动时的淡入浮现效果
 */

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
  
  return {
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
}

// 导出函数以便可以从其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS模块系统
  module.exports = { initScrollAnimation };
} else {
  // 浏览器环境
  window.initScrollAnimation = initScrollAnimation;
}
