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
      this.loadFooter();
    });
  }

  /**
   * 加载页脚内容
   */  loadFooter() {
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
        })
        .then(html => {
          // 插入页脚内容
          footer.innerHTML = `<div class="container">${html}</div>`;
          
          // 更新年份
          this.updateCurrentYear();
          
          // 高亮当前页面链接
          this.highlightCurrentPage();
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
}

// 创建并导出Footer实例
const footer = new Footer();
export default footer;
