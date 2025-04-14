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
  console.log('正在初始化按钮组件...');
  
  // 初始化涟漪效果
  initRippleEffect();
  
  // 初始化加载按钮
  initLoadingButtons();
  
  // 初始化确认按钮
  initConfirmButtons();
  
  // 初始化开关切换按钮
  initToggleButtons();
  
  // 初始化颜色自适应
  initAutoColorButtons();
  
  console.log('✅ 按钮组件初始化成功！');
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
    // 保存原始内容，用于恢复
    const originalContent = button.innerHTML;
    
    button.addEventListener('click', function() {
      if (button.classList.contains('btn-loading')) return;
      
      // 添加加载状态
      setButtonLoading(button, true);
      
      // 示例：模拟异步操作
      // 实际使用时应该在异步操作完成后移除加载状态
      if (button.hasAttribute('data-demo')) {
        setTimeout(() => {
          setButtonLoading(button, false);
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
 * 初始化开关切换按钮
 */
function initToggleButtons() {
  const toggleButtons = document.querySelectorAll('.btn-toggle');
  
  toggleButtons.forEach(button => {
    const onText = button.getAttribute('data-on-text') || '开启';
    const offText = button.getAttribute('data-off-text') || '关闭';
    
    // 检查按钮是否只包含文本节点或为空
    const hasOnlyText = !button.children.length && button.textContent.trim();
    const isEmpty = !button.children.length && !button.textContent.trim();

    // 如果按钮为空或只包含文本，则清空内容，让 ::before 生效
    if (isEmpty || hasOnlyText) {
        button.textContent = ''; // 清空按钮文本
    }
    
    // 添加点击事件
    button.addEventListener('click', function() {
      button.classList.toggle('active');
      
      // 触发自定义事件
      const event = new CustomEvent('toggle', {
        detail: {
          isActive: button.classList.contains('active')
        },
        bubbles: true
      });
      button.dispatchEvent(event);
      
      // 不需要在这里更新 textContent，因为 ::before 会处理
    });
  });
}

/**
 * 初始化颜色自适应按钮
 * 根据按钮的背景颜色自动调整文本颜色
 */
function initAutoColorButtons() {
  const autoColorButtons = document.querySelectorAll('.btn[data-auto-color="true"]');
  
  autoColorButtons.forEach(button => {
    updateButtonTextColor(button);
    
    // 监听类名变化，更新文本颜色
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          updateButtonTextColor(button);
        }
      });
    });
    
    observer.observe(button, { attributes: true });
  });
}

/**
 * 根据背景颜色更新文本颜色
 * @param {Element} button - 按钮元素
 */
function updateButtonTextColor(button) {
  // 获取计算后的背景颜色
  const bgColor = window.getComputedStyle(button).backgroundColor;
  
  // 将RGB颜色转换为亮度值
  const rgb = bgColor.match(/\d+/g);
  if (!rgb || rgb.length < 3) return;
  
  const brightness = Math.round(
    ((parseInt(rgb[0]) * 299) +
    (parseInt(rgb[1]) * 587) +
    (parseInt(rgb[2]) * 114)) / 1000
  );
  
  // 根据亮度设置文本颜色
  // 亮度 > 125 视为浅色背景，使用深色文本
  // 亮度 <= 125 视为深色背景，使用浅色文本
  button.style.color = brightness > 125 ? '#212121' : '#ffffff';
}

/**
 * 设置按钮的加载状态
 * @param {string|Element} selectorOrElement 按钮的选择器或DOM元素
 * @param {boolean} isLoading 是否设置为加载状态
 * @param {string} [loadingText] 加载时显示的文本（不再使用，但保留参数以兼容旧代码）
 */
function setButtonLoading(selectorOrElement, isLoading) {
  const button = typeof selectorOrElement === 'string' ? document.querySelector(selectorOrElement) : selectorOrElement;
  if (!button) {
    console.warn(`Button element not found for selector: ${selectorOrElement}`);
    return;
  }

  if (isLoading) {
    // 保存原始文本和禁用状态
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.innerHTML;
    }
    if (!button.hasAttribute('data-original-disabled')) {
      button.dataset.originalDisabled = button.disabled ? 'true' : 'false';
    }

    button.classList.add('btn-loading');
    button.disabled = true;
  } else {
    // 恢复原始状态
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
      // 清理自定义属性
      delete button.dataset.originalText;
    }
    button.classList.remove('btn-loading');
    // 恢复原始禁用状态
    if (button.hasAttribute('data-original-disabled')) {
      button.disabled = button.dataset.originalDisabled === 'true';
      delete button.dataset.originalDisabled;
    }
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

/**
 * 为按钮添加或更新计数器徽章
 * @param {string|Element} selectorOrElement - 按钮的选择器或DOM元素
 * @param {number} count - 显示的数字
 */
function setButtonBadge(selectorOrElement, count) {
  const button = typeof selectorOrElement === 'string' ? document.querySelector(selectorOrElement) : selectorOrElement;
  if (!button) {
    console.warn(`Button element not found for selector: ${selectorOrElement}`);
    return;
  }
  
  // 添加徽章样式类
  if (!button.classList.contains('btn-badge')) {
    button.classList.add('btn-badge');
  }
  
  // 查找现有徽章或创建新徽章
  let badge = button.querySelector('.badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.classList.add('badge');
    button.appendChild(badge);
  }
  
  // 设置徽章内容
  badge.textContent = count;
  
  // 如果计数为0，可以选择隐藏徽章
  if (count === 0 && !button.hasAttribute('data-show-zero-badge')) {
    badge.style.display = 'none';
  } else {
    badge.style.display = 'flex';
  }
  
  return button;
}

/**
 * 设置切换按钮的状态
 * @param {string|Element} selectorOrElement - 按钮的选择器或DOM元素
 * @param {boolean} isActive - 是否为激活状态
 */
function setToggleState(selectorOrElement, isActive) {
  const button = typeof selectorOrElement === 'string' ? document.querySelector(selectorOrElement) : selectorOrElement;
  if (!button) {
    console.warn(`Button element not found for selector: ${selectorOrElement}`);
    return;
  }
  
  if (!button.classList.contains('btn-toggle')) {
    console.warn(`Button is not a toggle button: ${selectorOrElement}`);
    return;
  }
  
  // 设置激活状态
  if (isActive) {
    button.classList.add('active');
  } else {
    button.classList.remove('active');
  }
  
  // 检查按钮是否只包含文本节点或为空
  const hasOnlyText = !button.children.length && button.textContent.trim();
  const isEmpty = !button.children.length && !button.textContent.trim();

  // 如果按钮为空或只包含文本，确保其内容为空
  if (isEmpty || hasOnlyText) {
      button.textContent = ''; // 确保按钮文本为空
  }
  
  return button;
}

// 暴露公共API
window.ButtonUI = {
  setLoading: setButtonLoading,
  createConfirmButton: createConfirmButton,
  setBadge: setButtonBadge,
  setToggleState: setToggleState,
  updateTextColor: updateButtonTextColor
};
