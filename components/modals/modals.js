/**
 * 模态弹窗组件 - JavaScript 功能
 * 提供创建和管理不同类型模态弹窗的功能
 */

// 创建全局Modal对象
window.Modal = {
  // 存储当前打开的模态弹窗ID
  activeModal: null,
  
  // 创建并显示基本模态弹窗
  show: function(options) {
    // 基本配置
    const config = Object.assign({
      title: '提示',
      content: '',
      type: '',  // '', 'info', 'success', 'warning', 'danger'
      size: '',  // '', 'sm', 'lg', 'xl', 'fullscreen'
      buttons: [
        {
          text: '确定',
          type: 'primary',
          onClick: () => this.close()
        }
      ],
      closeOnBackdrop: true,
      onOpen: null,
      onClose: null,
      footerAlign: ''  // '', 'centered', 'spaced', 'left', 'stacked'
    }, options);
    
    // 创建模态弹窗容器
    const modalId = 'modal-' + Date.now();
    const modalEl = document.createElement('div');
    modalEl.id = modalId;
    modalEl.className = `modal-container ${config.size ? 'modal-' + config.size : ''} ${config.type ? 'modal-' + config.type : ''}`;
    
    // 创建模态弹窗内容HTML
    let modalHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${config.title}</h3>
          <button class="modal-close" data-action="close">&times;</button>
        </div>
        <div class="modal-body">
          ${config.content}
        </div>
        <div class="modal-footer ${config.footerAlign}">`;
    
    // 添加按钮
    config.buttons.forEach(btn => {
      const btnClass = btn.type ? `modal-btn modal-btn-${btn.type}` : 'modal-btn modal-btn-secondary';
      modalHTML += `<button class="${btnClass}" data-action="${btn.action || ''}">${btn.text}</button>`;
    });
    
    modalHTML += `
        </div>
      </div>
    `;
    
    modalEl.innerHTML = modalHTML;
    document.body.appendChild(modalEl);
    
    // 绑定按钮事件
    const buttons = modalEl.querySelectorAll('.modal-footer button');
    buttons.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        if (config.buttons[index].onClick) {
          config.buttons[index].onClick(e);
        }
      });
    });
    
    // 绑定关闭按钮事件
    const closeBtn = modalEl.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    }
    
    // 绑定背景点击关闭事件
    if (config.closeOnBackdrop) {
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
          this.close();
        }
      });
    }
    
    // 存储回调函数
    this._onClose = config.onClose;
    
    // 存储当前模态弹窗引用
    this.activeModal = {
      id: modalId,
      element: modalEl
    };
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';

    // 延迟一帧添加active类，确保过渡动画正常
    requestAnimationFrame(() => {
      console.log(`[Modal] Adding .active class to ${modalEl.id}`); // Debug log
      modalEl.classList.add('active');
    });
    
    // 调用打开回调
    if (config.onOpen) {
      config.onOpen();
    }
    
    // 绑定ESC关闭
    document.addEventListener('keydown', this._handleEscKey);
    
    return modalId;
  },
  
  // 关闭当前模态弹窗
  close: function() {
    if (!this.activeModal) return;
    
    const modalEl = this.activeModal.element;
    
    // 移除active类
    modalEl.classList.remove('active');
    
    // 解绑ESC关闭
    document.removeEventListener('keydown', this._handleEscKey);
    
    // 等待过渡动画完成后移除元素
    setTimeout(() => {
      modalEl.remove();
      document.body.style.overflow = '';
      
      // 调用关闭回调
      if (this._onClose) {
        this._onClose();
      }
      
      this.activeModal = null;
      this._onClose = null;
    }, 300); // 与CSS过渡时间匹配
  },
  
  // 处理ESC键关闭
  _handleEscKey: function(e) {
    if (e.key === 'Escape' && window.Modal.activeModal) {
      window.Modal.close();
    }
  }
};

// 显示基本模态弹窗
window.showModal = function(title, content, buttons, options = {}) {
  const modalOptions = {
    title,
    content,
    ...options // 先合并其他选项
  };
  // 只有当 buttons 参数被提供时，才覆盖默认按钮
  if (buttons) {
    modalOptions.buttons = buttons;
  }
  // 否则，Modal.show 会使用其内部的默认按钮
  return window.Modal.show(modalOptions);
};

// 显示确认模态弹窗
window.showConfirmModal = function(title, message, confirmCallback, cancelCallback, options = {}) {
  const buttons = [
    {
      text: options.cancelText || '取消',
      type: 'secondary',
      onClick: () => {
        window.Modal.close();
        if (cancelCallback) cancelCallback();
      }
    },
    {
      text: options.confirmText || '确认',
      type: options.confirmType || 'primary',
      onClick: () => {
        window.Modal.close();
        if (confirmCallback) confirmCallback();
      }
    }
  ];
  
  return window.Modal.show({
    title,
    content: message,
    buttons,
    type: options.type || '',
    ...options
  });
};

// 显示警告确认模态弹窗
window.showWarningModal = function(title, message, confirmCallback, options = {}) {
  return window.showConfirmModal(
    title,
    message,
    confirmCallback,
    null,
    {
      type: 'warning',
      confirmType: 'warning',
      confirmText: options.confirmText || '继续',
      ...options
    }
  );
};

// 显示危险操作确认模态弹窗
window.showDangerModal = function(title, message, confirmCallback, options = {}) {
  return window.showConfirmModal(
    title,
    message,
    confirmCallback,
    null,
    {
      type: 'danger',
      confirmType: 'danger',
      confirmText: options.confirmText || '删除',
      ...options
    }
  );
};

// 显示成功模态弹窗
window.showSuccessModal = function(title, message, callback, options = {}) {
  // 创建带有图标的成功弹窗
  const content = `
    <div class="modal-icon">
      <i class="fas fa-check-circle"></i>
    </div>
    <div class="modal-body text-center">${message}</div>
  `;
  
  return window.Modal.show({
    title,
    content,
    type: 'success',
    footerAlign: 'centered',
    buttons: [
      {
        text: options.buttonText || '确定',
        type: 'success',
        onClick: () => {
          window.Modal.close();
          if (callback) callback();
        }
      }
    ],
    ...options
  });
};

// 显示错误模态弹窗
window.showErrorModal = function(title, message, callback, options = {}) {
  // 创建带有图标的错误弹窗
  const content = `
    <div class="modal-icon">
      <i class="fas fa-exclamation-circle"></i>
    </div>
    <div class="modal-body text-center">${message}</div>
  `;
  
  return window.Modal.show({
    title,
    content,
    type: 'danger',
    footerAlign: 'centered',
    buttons: [
      {
        text: options.buttonText || '确定',
        type: 'danger',
        onClick: () => {
          window.Modal.close();
          if (callback) callback();
        }
      }
    ],
    ...options
  });
};
