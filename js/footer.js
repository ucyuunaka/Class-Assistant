/**
 * 页脚组件加载脚本
 * 用于在所有页面中加载统一的页脚
 */
document.addEventListener('DOMContentLoaded', function() {
  // 查找页脚元素
  const footer = document.querySelector('.footer');
  
  if (footer) {    // 加载页脚内容
    fetch('./pages/footer.html')
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
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
          yearElement.textContent = new Date().getFullYear();
        }
        
        // 高亮当前页面链接
        highlightCurrentPage();
      })
      .catch(error => {
        console.error('页脚加载失败:', error);
        // Add more specific error handling if needed
        footer.innerHTML = '<div class="container"><p style="color: red;">错误：无法加载页脚内容。</p></div>';
      });
  }
  
  /**
   * 高亮当前页面在页脚中的链接
   */
  function highlightCurrentPage() {
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
});