/**
 * 通知组件 - JavaScript 功能
 * 提供页面中显示各类通知的功能
 */

// 自动加载组件样式
function loadNotificationStyles() {
  // 避免重复加载
  if (document.querySelector('link[href*="notifications.css"]')) {
    return;
  }
  
  // 动态创建 link 元素加载 CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = getComponentPath();
  document.head.appendChild(link);
  console.log('✅ 通知组件样式加载成功！');
}

// 获取组件路径
function getComponentPath() {
  // 获取当前脚本的路径
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const src = scripts[i].src;
    if (src.includes('notifications.js')) {
      // 将 .js 替换为 .css
      return src.replace('.js', '.css');
    }
  }
  
  // 如果找不到脚本路径，返回一个相对路径
  console.warn('⚠️ 无法确定通知组件样式的准确路径，使用相对路径');
  if (document.querySelector('script[src*="components/notifications/notifications.js"]')) {
    return 'components/notifications/notifications.css';
  } else {
    return '../components/notifications/notifications.css';
  }
}

/**
 * 初始化通知容器
 */
function initNotificationContainer() {
  console.log('正在初始化通知组件容器...');
  
  // 检查是否已有通知容器
  if (!document.querySelector('.notification-container')) {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    console.log('✅ 通知组件容器初始化成功！');
  } else {
    console.log('✅ 通知组件容器已存在，无需重复初始化');
  }
}

/**
 * 显示通知消息
 * @param {string} message - 要显示的消息
 * @param {string} type - 消息类型：'success', 'error', 'warning', 'info'
 * @param {number} duration - 显示时长（毫秒）
 */
function showNotification(message, type = 'info', duration = 3000) {
  // 确保有通知容器
  initNotificationContainer();
  
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `notification notification-${type} fade-in`;
  
  // 兼容主题系统中使用的类名格式
  notification.classList.add(type);
  
  // 根据类型设置图标
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-exclamation-circle"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle"></i>';
  }
  
  // 设置内容
  notification.innerHTML = `
    <div class="notification-content">
      ${icon}
      <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  // 添加到页面
  const notificationContainer = document.querySelector('.notification-container');
  notificationContainer.appendChild(notification);
  
  // 点击关闭按钮移除通知
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', function() {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  });
  
  // 设置自动移除
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }
  }, duration);
}

/**
 * 显示"功能正在开发中"的通知
 * @param {string} featureName - 正在开发的功能名称
 * @param {number} duration - 显示时长（毫秒）
 */
function showDevelopingNotification(featureName = '', duration = 3000) {
  const message = featureName 
    ? `${featureName}功能正在开发中，敬请期待！` 
    : `此功能正在开发中，敬请期待！`;
  
  showNotification(message, 'warning', duration);
}

// 在文档加载完成后初始化通知容器
document.addEventListener('DOMContentLoaded', function() {
  // 加载组件样式
  loadNotificationStyles();
  
  // 初始化通知容器
  initNotificationContainer();
  
  // 监听主题变化事件
  window.addEventListener('themeChanged', function(e) {
    console.log('通知组件: 检测到主题变化为 ' + e.detail.theme);
    // 主题变化时，通知组件本身不需要特殊处理
    // 因为它使用CSS变量，会自动适应主题变化
  });
});

/**
 * 通知系统与主题系统的兼容适配
 * 确保在各种情况下都能正常工作
 */
function ensureNotificationSystem() {
  if (!window.showNotification) {
    console.log('警告: 未检测到全局通知函数，正在恢复...');
    window.showNotification = showNotification;
  }
}

// 导出函数，使其在全局可用
window.showNotification = showNotification;
window.showDevelopingNotification = showDevelopingNotification;

// 确保通知系统在各种情况下都能正常工作
ensureNotificationSystem();

// 添加恢复机制，如果其他脚本覆盖了通知函数，会在5秒后尝试恢复
setTimeout(ensureNotificationSystem, 5000);
