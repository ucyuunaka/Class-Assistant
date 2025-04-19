// 课表页面入口文件
// 导入主控制器和课程数据变更函数
import { initSchedule } from "../controllers/schedule_controller.js";
import { afterCourseDataChanged } from "../data/schedule_data.js";

document.addEventListener("DOMContentLoaded", function () {
  // 初始化滚动动画
  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });
  
  // 初始化课表
  initSchedule();
  
  // 确保所有课程数据变化都触发afterCourseDataChanged
  document.addEventListener("course-form-submitted", () => {
    afterCourseDataChanged();
  });
});
