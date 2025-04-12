/**
 * 按钮UI组件 - JavaScript功能
 * 提供按钮的交互效果和功能增强
 */

// 在文档加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化按钮组件
  initButtons();
});

/**
 * 初始化所有按钮组件
 */
function initButtons() {
  // 初始化涟漪效果
  initRippleEffect();
  
  // 初始化加载按钮
  initLoadingButtons();
  
  // 初始化确认按钮
  initConfirmButtons();
}

/**
 * 为按钮添加涟漪点击效果
 */
function initRippleEffect() {
  // 获取所有启用涟漪效果的按钮
  const buttons = document.querySelectorAll('.btn-ripple');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // 创建涟漪元素
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple-effect');
      
      // 计算涟漪的尺寸（取按钮宽高的较大值，再乘以1.5以确保覆盖范围）
      const size = Math.max(button.offsetWidth, button.offsetHeight) * 1.5;
      ripple.style.width = ripple.style.height = `${size}px`;
      
      // 计算涟漪的位置
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // 添加涟漪元素到按钮
      button.appendChild(ripple);
      
      // 涟漪动画结束后移除元素
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * 初始化带加载状态的按钮
 */
function initLoadingButtons() {
  const loadingButtons = document.querySelectorAll('[data-loading-text]');
  
  loadingButtons.forEach(button => {
    const originalText = button.innerHTML;
    const loadingText = button.getAttribute('data-loading-text') || '加载中...';
    
    button.addEventListener('click', function() {
      if (button.classList.contains('btn-loading')) return;
      
      // 添加加载状态
      button.classList.add('btn-loading');
      if (!button.hasAttribute('data-no-text-change')) {
        button.innerHTML = loadingText;
      }
      
      // 示例：模拟异步操作
      // 实际使用时应该在异步操作完成后移除加载状态
      if (button.hasAttribute('data-demo')) {
        setTimeout(() => {
          button.classList.remove('btn-loading');
          button.innerHTML = originalText;
        }, 2000);
      }
    });
  });
}

/**
 * 初始化需要二次确认的按钮
 */
function initConfirmButtons() {
  const confirmButtons = document.querySelectorAll('[data-confirm]');
  
  confirmButtons.forEach(button => {
    const confirmMessage = button.getAttribute('data-confirm') || '确定要执行此操作吗？';
    const originalOnClick = button.onclick;
    
    // 覆盖原始的点击事件处理器
    button.onclick = function(e) {
      e.preventDefault();
      
      if (window.showConfirmModal) {
        // 使用模态确认弹窗（如果可用）
        window.showConfirmModal(
          '确认操作',
          confirmMessage,
          function() {
            // 确认后执行原始点击处理器
            if (originalOnClick) originalOnClick.call(button, e);
          }
        );
      } else if (confirm(confirmMessage)) {
        // 回退到浏览器原生确认弹窗
        if (originalOnClick) originalOnClick.call(button, e);
      }
    };
  });
}

/**
 * 设置按钮为加载状态
 * @param {Element|string} button - 按钮元素或选择器
 * @param {boolean} isLoading - 是否为加载状态
 * @param {string} [loadingText] - 加载状态显示的文本
 */
function setButtonLoading(button, isLoading, loadingText) {
  // 如果传入的是选择器字符串，获取对应的DOM元素
  if (typeof button === 'string') {
    button = document.querySelector(button);
  }
  
  if (!button) return;
  
  const originalText = button.getAttribute('data-original-text') || button.innerHTML;
  
  if (isLoading) {
    // 保存原始文本（如果尚未保存）
    if (!button.hasAttribute('data-original-text')) {
      button.setAttribute('data-original-text', originalText);
    }
    
    // 添加加载状态
    button.classList.add('btn-loading');
    if (loadingText) {
      button.innerHTML = loadingText;
    }
    button.disabled = true;
  } else {
    // 移除加载状态
    button.classList.remove('btn-loading');
    // 恢复原始文本
    button.innerHTML = originalText;
    button.disabled = false;
  }
}

/**
 * 创建一个带有确认功能的按钮
 * @param {string} selector - 按钮的CSS选择器
 * @param {string} confirmMessage - 确认提示信息
 * @param {Function} callback - 确认后执行的回调函数
 */
function createConfirmButton(selector, confirmMessage, callback) {
  const button = document.querySelector(selector);
  if (!button) return;
  
  button.setAttribute('data-confirm', confirmMessage);
  
  button.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (window.showConfirmModal) {
      // 使用模态确认弹窗（如果可用）
      window.showConfirmModal(
        '确认操作',
        confirmMessage,
        function() {
          if (callback) callback.call(button, e);
        }
      );
    } else if (confirm(confirmMessage)) {
      // 回退到浏览器原生确认弹窗
      if (callback) callback.call(button, e);
    }
  });
}

// 暴露公共API
window.ButtonUI = {
  setLoading: setButtonLoading,
  createConfirmButton: createConfirmButton
};
