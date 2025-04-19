// filepath: d:\Users\linyu\Desktop\Class-Assistant\js\pages\schedule.js
// 课表页面入口文件
// 导入主控制器
import { initSchedule } from "../controllers/schedule_controller.js";

document.addEventListener("DOMContentLoaded", function () {
  // 初始化滚动动画
  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });
  
  // 初始化课表
  initSchedule();
});
