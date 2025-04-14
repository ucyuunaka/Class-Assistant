/**
 * 课堂助手 - 侧边栏导航组件
 * 处理侧边栏的交互效果，包括点击切换页面、响应式显示隐藏等
 */

class Sidebar {
  /**
   * 侧边栏组件构造函数
   * @param {string} containerId - 侧边栏容器的DOM ID
   */
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.init();
  }

  /**
   * 初始化侧边栏组件
   */
  init() {
    if (!this.container) {
      console.error('未找到侧边栏容器元素:', this.containerId);
      return;
    }

    // 添加侧边栏样式
    this.loadStyles();
    
    // 加载侧边栏HTML内容
    this.loadSidebarContent();
  }
  
  /**
   * 加载侧边栏样式
   */  loadStyles() {
    // 检查是否已经加载了样式
    if (!document.querySelector('link[href*="sidebar.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      
      // 使用相对于网站根目录的路径
      let rootPath = './components/sidebar/sidebar.css';
      
      // 如果在测试环境
      if (window.location.pathname.includes('/components/tests/')) {
        rootPath = '../../components/sidebar/sidebar.css';
      } 
      // 如果在pages子文件夹
      else if (window.location.pathname.includes('/pages/')) {
        rootPath = '../components/sidebar/sidebar.css';
      }
      
      link.href = rootPath;
      document.head.appendChild(link);
    }
  }
  /**
   * 加载侧边栏HTML内容
   */  loadSidebarContent() {
    // 添加sidebar类
    this.container.classList.add('sidebar');
    
    // 创建侧边栏悬停遮罩层元素
    this.createOverlay();
        // 确定正确的HTML模板路径
    let htmlPath = './components/sidebar/sidebar.html';
    
    // 如果在测试环境
    if (window.location.pathname.includes('/components/tests/')) {
      htmlPath = '../../components/sidebar/sidebar.html';
    } 
    // 如果在pages子文件夹
    else if (window.location.pathname.includes('/pages/')) {
      htmlPath = '../components/sidebar/sidebar.html';
    }
    
    // 加载开始提示
    console.log('正在加载侧边栏，路径:', htmlPath);
    
    // 加载侧边栏内容
    fetch(htmlPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('无法加载侧边栏模板');
        }
        return response.text();
      })      .then(html => {
        // 插入侧边栏内容
        this.container.innerHTML = html;
        
        // 成功加载提示
        console.log('✅ 侧边栏加载成功！');
        
        // 初始化侧边栏功能
        this.initSidebar();
        
        // 监听主题变化事件
        this.listenForThemeChanges();
        
        // 初始化侧边栏悬停功能
        this.initSidebarHover();
      })
      .catch(error => {
        console.error('侧边栏加载失败:', error);
        this.container.innerHTML = '<p style="color: red; padding: 1rem;">错误：无法加载侧边栏内容。</p>';
      });
  }

  /**
   * 创建侧边栏遮罩层
   */
  createOverlay() {
    // 检查是否已存在遮罩层
    if (!document.querySelector('.sidebar-hover-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'sidebar-hover-overlay';
      document.body.appendChild(overlay);
      this.overlay = overlay;
    } else {
      this.overlay = document.querySelector('.sidebar-hover-overlay');
    }
  }

  /**
   * 初始化侧边栏功能
   */
  initSidebar() {
    // 获取当前页面路径，用于高亮当前页对应的菜单项
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // 初始化菜单项高亮
    this.highlightCurrentMenuItem(pageName);
    
    // 为所有菜单项添加点击事件
    const menuItems = document.querySelectorAll('.sidebar-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        // 获取链接地址
        const link = item.getAttribute('data-href');
        if (link) {
          // 根据当前页面位置确定正确的链接路径
          let targetUrl = link;
          
          // 如果当前页面在pages目录中且链接以"pages/"开头
          if (window.location.pathname.includes('/pages/') && link.startsWith('pages/')) {
            // 将路径修改为相对于pages目录的路径
            targetUrl = link.replace('pages/', './');
          }
          
          // 页面跳转
          window.location.href = targetUrl;
        }
      });
    });

    // 移动端侧边栏切换
    this.setupMobileToggle();
    
    // 窗口大小改变时处理
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.toggleSidebar(false);
      }
    });
  }

  /**
   * 设置移动端切换功能
   */
  setupMobileToggle() {
    // 如果移动端切换按钮不存在，则创建一个
    if (!document.querySelector('.sidebar-toggle')) {
      const toggle = document.createElement('div');
      toggle.className = 'sidebar-toggle';
      toggle.innerHTML = '<i class="ri-menu-line"></i>';
      document.body.appendChild(toggle);
      
      toggle.addEventListener('click', () => {
        this.toggleSidebar(null);
      });
    }

    // 如果移动端遮罩层不存在，则创建一个
    if (!document.querySelector('.sidebar-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
      
      overlay.addEventListener('click', () => {
        this.toggleSidebar(false);
      });
    }
  }

  /**
   * 初始化侧边栏悬停效果
   */
  initSidebarHover() {
    if (this.container && this.overlay) {
      this.container.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
          // 显示遮罩层
          this.overlay.classList.add('active');
        }
      });

      this.container.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
          // 隐藏遮罩层
          this.overlay.classList.remove('active');
        }
      });

      // 确保遮罩层不会拦截点击事件
      this.overlay.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
          this.overlay.classList.remove('active');
        }
      });
    }
  }

  /**
   * 监听主题变化事件
   */
  listenForThemeChanges() {
    // 监听主题变化自定义事件
    window.addEventListener('themeChanged', (e) => {
      // 侧边栏不需要特殊处理，因为我们使用了 [data-theme="dark"] 选择器
      // CSS 会自动应用相应的样式
      console.log('主题已变更为: ' + e.detail.theme);
    });
  }

  /**
   * 高亮当前页面对应的菜单项
   * @param {string} pageName - 当前页面文件名
   */
  highlightCurrentMenuItem(pageName) {
    // 默认高亮首页
    let itemToHighlight = 'index.html';
    
    // 如果有特定的页面名
    if (pageName && pageName !== '') {
      itemToHighlight = pageName;
    }
    
    // 寻找并高亮对应的菜单项
    const menuItems = document.querySelectorAll('.sidebar-item');
    menuItems.forEach(item => {
      const itemLink = item.getAttribute('data-href');
      
      // 移除所有高亮
      item.classList.remove('active');
      
      // 如果匹配当前页面，添加高亮
      if (itemLink && itemLink.includes(itemToHighlight)) {
        item.classList.add('active');
      }
    });
  }

  /**
   * 切换侧边栏显示/隐藏
   * @param {boolean|null} show - 是否显示，null表示切换状态
   */
  toggleSidebar(show = null) {
    const overlay = document.querySelector('.sidebar-overlay');
    
    // 确定最终状态
    const shouldShow = show === null ? !this.container.classList.contains('active') : show;
    
    // 更新侧边栏和遮罩层状态
    if (shouldShow) {
      this.container.classList.add('active');
      if (overlay) overlay.classList.add('active');
    } else {
      this.container.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    }
  }
}

// 导出组件
if (typeof module !== 'undefined') {
  module.exports = Sidebar;
}
