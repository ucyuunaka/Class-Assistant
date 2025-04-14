/**
 * 顶栏组件
 * 用于在页面顶部显示标题和副标题
 * 支持两种模式：首页模式和普通页面模式
 */
class Header {
  /**
   * 初始化顶栏组件
   * @param {string} containerId - 顶栏容器的ID
   * @param {Object} options - 配置选项
   * @param {boolean} options.isHomePage - 是否为首页样式
   * @param {string} options.title - 标题文本
   * @param {string} options.subtitle - 副标题文本
   * @param {Array} options.buttons - 按钮配置数组，仅在首页模式下可用 [{text: '按钮文本', url: '链接地址', isPrimary: true/false}]
   */
  constructor(containerId, options = {}) {
    // 加载样式
    this.loadStyles();
    
    // 获取容器元素
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Header组件初始化失败：找不到ID为 ${containerId} 的容器元素`);
      return;
    }
    
    // 设置默认选项
    this.options = Object.assign({
      isHomePage: false,
      title: '页面标题',
      subtitle: '页面副标题',
      buttons: []
    }, options);
    
    // 渲染顶栏
    this.render();
  }
    /**
   * 加载组件样式
   */
  loadStyles() {
    if (!document.getElementById('header-component-styles')) {
      const link = document.createElement('link');
      link.id = 'header-component-styles';
      link.rel = 'stylesheet';
      
      // 使用相对于当前页面的路径
      // 检查当前页面是否在components/tests目录下
      if (window.location.pathname.includes('/components/tests/')) {
        link.href = '../header/header.css'; // 测试页面
      } else if (window.location.pathname.includes('/pages/')) {
        link.href = '../components/header/header.css'; // 普通页面
      } else {
        link.href = 'components/header/header.css'; // 根目录页面
      }
      
      document.head.appendChild(link);
    }
  }
  
  /**
   * 渲染顶栏内容
   */
  render() {
    // 根据是否为首页选择不同的渲染方法
    if (this.options.isHomePage) {
      this.renderHomeHeader();
    } else {
      this.renderPageHeader();
    }
  }
  
  /**
   * 渲染首页样式顶栏
   */
  renderHomeHeader() {
    const html = `
      <section class="header-component home-header">
        <div class="container">
          <div class="home-header-content">
            <h1 class="home-header-title animate-on-scroll fade-up">${this.options.title}</h1>
            <p class="home-header-text animate-on-scroll fade-up delay-100">${this.options.subtitle}</p>
            ${this.renderButtons()}
          </div>
          <div class="home-header-decoration"></div>
        </div>
      </section>
    `;
    
    this.container.innerHTML = html;
  }
  
  /**
   * 渲染普通页面样式顶栏
   */
  renderPageHeader() {
    const html = `
      <section class="header-component page-header">
        <div class="container">
          <h1 class="page-header-title animate-on-scroll fade-up">${this.options.title}</h1>
          <p class="page-header-subtitle animate-on-scroll fade-up delay-100">${this.options.subtitle}</p>
        </div>
      </section>
    `;
    
    this.container.innerHTML = html;
  }
  
  /**
   * 渲染按钮组（仅在首页模式下可用）
   * @returns {string} 按钮HTML
   */
  renderButtons() {
    if (!this.options.isHomePage || !this.options.buttons || !this.options.buttons.length) {
      return '';
    }
    
    const buttonsHtml = this.options.buttons.map(button => {
      const btnClass = button.isPrimary ? 'btn' : '';
      return `<a href="${button.url}" class="${btnClass}">${button.text}</a>`;
    }).join('');
    
    return `<div class="home-header-buttons animate-on-scroll fade-up delay-200">${buttonsHtml}</div>`;
  }
}

// 如果使用CommonJS或ES模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Header;
}
