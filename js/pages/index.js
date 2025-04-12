document.addEventListener("DOMContentLoaded", function () {
  // 初始化滚动动画
  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });

  // 滚动动画效果
  const animateStatistics = () => {
    const stats = document.querySelectorAll(".stat-number");

    stats.forEach((stat) => {
      const target = parseInt(stat.textContent);
      let current = 0;
      const increment = target / 30; // 将动画分成30步

      const updateCount = () => {
        if (current < target) {
          current += increment;
          stat.textContent =
            Math.ceil(current) +
            (stat.textContent.includes("%") ? "%" : "+");
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent =
            target + (stat.textContent.includes("%") ? "%" : "+");
        }
      };

      // 当元素滚动到可见范围时启动动画
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              updateCount();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(stat);
    });
  };

  // 初始化统计数字动画
  animateStatistics();
});
