/**
 * 通知组件 - JavaScript 功能
 * 提供页面中显示各类通知的功能
 */

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
  initNotificationContainer();
});

// 导出函数，使其在全局可用
window.showNotification = showNotification;
window.showDevelopingNotification = showDevelopingNotification;
