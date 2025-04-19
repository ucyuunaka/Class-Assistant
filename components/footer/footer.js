/**
 * 页脚组件 - 提供全站统一的页脚内容和功能
 * 
 * 为什么需要这个组件：
 * 1. 集中管理页脚内容和样式，避免重复代码
 * 2. 自动适应不同页面路径结构
 * 3. 提供智能链接高亮和导航功能
 * 
 * 主要功能：
 * - 自动加载CSS和HTML模板
 * - 动态更新版权年份
 * - 高亮当前页面链接
 * - 智能路径处理
 */
class Footer {
  constructor() {
    this.init();
  }

  /**
   * 初始化页脚组件
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // 添加页脚样式
      this.loadStyles();
      // 加载页脚内容
      this.loadFooter();
    });
  }
  
  /**
   * 加载页脚样式
   */
  loadStyles() {
    // 检查是否已经加载了样式
    if (!document.querySelector('link[href*="footer.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      
      // 动态计算CSS路径 - 根据当前页面位置调整相对路径
      // 为什么需要动态路径：确保在不同目录层级的页面都能正确加载资源
      let rootPath = './components/footer/footer.css';
      
      // 测试环境路径处理
      if (window.location.pathname.includes('/components/tests/')) {
        rootPath = '../../components/footer/footer.css';
      } 
      // 页面子目录路径处理
      else if (window.location.pathname.includes('/pages/')) {
        rootPath = '../components/footer/footer.css';
      }
        link.href = rootPath;
      document.head.appendChild(link);
      console.log('✅ 页脚CSS样式已自动加载');
    }
  }

  /**
   * 加载页脚内容
   */  
  loadFooter() {
    // 查找页脚元素
    const footer = document.querySelector('.footer');
    
    if (footer) {
      // 动态构建HTML模板路径
      // 为什么需要路径处理：页脚可能从不同层级的页面访问
      let rootPath = './';
      
      // 组件目录路径处理
      if (window.location.pathname.includes('/components/')) {
        rootPath = '../../';
      } 
      // 页面子目录路径处理
      else if (window.location.pathname.includes('/pages/')) {
        rootPath = '../';
      }
      
      const footerPath = `${rootPath}components/footer/footer.html`;
      
      console.log('正在加载页脚，路径:', footerPath);
      
      // 加载页脚内容
      fetch(footerPath)
        .then(response => {
          if (!response.ok) {
            throw new Error('无法加载页脚模板');
          }
          return response.text();
        })        .then(html => {
          // 插入页脚内容
          footer.innerHTML = `<div class="container">${html}</div>`;
          
          // 添加成功加载的提示
          console.log('✅ 页脚加载成功！');
          
          // 更新年份
          this.updateCurrentYear();
          
          // 高亮当前页面链接
          this.highlightCurrentPage();
          
          // 添加链接点击事件处理
          this.setupLinkNavigation();
        })
        .catch(error => {
          console.error('页脚加载失败:', error);
          // 优雅降级：显示错误信息但仍保持页脚区域可见
          footer.innerHTML = '<div class="container"><p style="color: red;">错误：无法加载页脚内容。</p></div>';
        });
    }
  }

  /**
   * 更新版权信息中的年份
   */
  updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * 高亮当前页面在页脚中的链接
   */
  highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const footerLinks = document.querySelectorAll('.footer-links a');
    
    footerLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.style.fontWeight = '600';
        link.style.color = 'var(--primary-color)';
      }
    });
  }
  
  /**
   * 设置页脚链接的智能导航功能
   * 
   * 为什么需要特殊处理：
   * 1. 确保在不同目录层级的页面间跳转时路径正确
   * 2. 处理index.html的特殊情况
   * 3. 保持SPA风格的平滑过渡
   */
  setupLinkNavigation() {
    const footerLinks = document.querySelectorAll('.footer-links a');
    
    footerLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        
        // 获取原始链接
        const href = link.getAttribute('href');
        
        // 构建最终的目标URL
        let targetUrl = href;
        
        // 如果当前页面在pages目录中且链接以"pages/"开头
        if (window.location.pathname.includes('/pages/') && href.startsWith('pages/')) {
          // 将路径修改为相对于pages目录的路径
          targetUrl = href.replace('pages/', './');
        } 
        // 如果当前在pages目录且链接是index.html
        else if (window.location.pathname.includes('/pages/') && href === 'index.html') {
          // 返回上一级目录的index.html
          targetUrl = '../index.html';
        }
        
        // 页面跳转
        window.location.href = targetUrl;
      });
    });
  }
}

/**
 * 创建并导出Footer单例
 * 
 * 为什么使用单例模式：
 * 1. 避免重复初始化
 * 2. 确保全站使用同一个页脚实例
 * 3. 方便其他组件访问
 */
const footer = new Footer();
export default footer;
