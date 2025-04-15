/**
 * 顶栏组件
 * 用于在页面顶部显示标题和副标题
 * 支持两种模式：首页模式和普通页面模式
 * 两种模式都支持按钮组
 */
class Header {
  /**
   * 初始化顶栏组件
   * @param {string} containerId - 顶栏容器的ID
   * @param {Object} options - 配置选项
   * @param {boolean} options.isHomePage - 是否为首页样式
   * @param {string} options.title - 标题文本
   * @param {string} options.subtitle - 副标题文本
   * @param {Array} options.buttons - 按钮配置数组 [{text: '按钮文本', url: '链接地址', isPrimary: true/false, className: '可选自定义类'}]
   * @param {string} options.buttonPosition - 按钮位置，可选值：'right'(右侧), 'bottom'(底部)，默认为'bottom'
   * @param {string} options.backgroundClass - 背景样式类，可自定义顶栏的背景样式
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
      buttons: [],
      buttonPosition: 'bottom',
      backgroundClass: ''
    }, options);
    
    // 渲染顶栏
    this.render();
    
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
  }  /**
   * 渲染首页样式顶栏
   */
  renderHomeHeader() {
    // 添加自定义背景样式类
    const backgroundClass = this.options.backgroundClass ? ` ${this.options.backgroundClass}` : '';
    
    const html = `
      <section class="header-component home-header${backgroundClass}">
        <div class="container">
          <div class="home-header-content">
            <h1 class="home-header-title animate-on-scroll fade-up">${this.options.title}</h1>
            <p class="home-header-text animate-on-scroll fade-up delay-100">${this.options.subtitle}</p>
            ${this.renderButtons('home')}
          </div>
          <div class="home-header-decoration"></div>
        </div>
      </section>
    `;
    
    this.container.innerHTML = html;
    
    // 添加滚动动画初始化，确保新添加的元素能够正常应用动画
    if (typeof initScrollAnimation === 'function') {
      setTimeout(() => {
        initScrollAnimation();
      }, 100);
    }
  }/**
   * 渲染普通页面样式顶栏
   */
  renderPageHeader() {
    // 根据按钮位置选择布局类
    const layoutClass = this.options.buttonPosition === 'right' ? 'page-header-right' : '';
    
    // 添加自定义背景样式类
    const backgroundClass = this.options.backgroundClass ? ` ${this.options.backgroundClass}` : '';
    
    const html = `
      <section class="header-component page-header${backgroundClass}">
        <div class="container ${layoutClass}">
          <div>
            <h1 class="page-header-title animate-on-scroll fade-up">${this.options.title}</h1>
            <p class="page-header-subtitle animate-on-scroll fade-up delay-100">${this.options.subtitle}</p>
          </div>
          ${this.renderButtons('page')}
        </div>
      </section>
    `;
    
    this.container.innerHTML = html;
    
    // 添加滚动动画初始化，确保新添加的元素能够正常应用动画
    if (typeof initScrollAnimation === 'function') {
      setTimeout(() => {
        initScrollAnimation();
      }, 100);
    }
  }
  
  /**
   * 渲染按钮组
   * @param {string} type - 按钮组类型，'home'或'page'
   * @returns {string} 按钮HTML
   */
  renderButtons(type = 'home') {
    if (!this.options.buttons || !this.options.buttons.length) {
      return '';
    }
    
    const containerClass = type === 'home' ? 'home-header-buttons' : 'page-header-buttons';
    
    const buttonsHtml = this.options.buttons.map(button => {
      let btnClass = button.isPrimary ? 'btn' : 'btn btn-outline';
      
      // 页面模式下的按钮需要调整样式
      if (type === 'page' && button.isPrimary === false) {
        btnClass = 'btn btn-outline btn-sm';
      } else if (type === 'page') {
        btnClass = 'btn btn-sm';
      }
      
      // 添加自定义类
      if (button.className) {
        btnClass += ` ${button.className}`;
      }
      
      return `<a href="${button.url}" class="${btnClass}">${button.text}</a>`;
    }).join('');
    
    return `<div class="${containerClass} animate-on-scroll fade-up delay-200">${buttonsHtml}</div>`;
  }
}

// 如果使用CommonJS或ES模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Header;
}
