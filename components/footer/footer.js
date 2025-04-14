/**
 * 页脚组件加载脚本
 * 用于在所有页面中加载统一的页脚
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
      
      // 使用相对于网站根目录的路径
      let rootPath = './components/footer/footer.css';
      
      // 如果在测试环境
      if (window.location.pathname.includes('/components/tests/')) {
        rootPath = '../../components/footer/footer.css';
      } 
      // 如果在pages子文件夹
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
      // 构建绝对路径，确保在任何页面都能正确加载
      let rootPath = './';
      
      // 如果在组件目录下
      if (window.location.pathname.includes('/components/')) {
        rootPath = '../../';
      } 
      // 如果在pages子文件夹
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
   * 设置页脚链接的导航功能
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

// 创建并导出Footer实例
const footer = new Footer();
export default footer;
