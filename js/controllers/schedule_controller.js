// filepath: d:\Users\linyu\Desktop\Class-Assistant\js\controllers\schedule_controller.js
import { scheduleData, loadScheduleFromStorage, saveScheduleToStorage } from "../data/schedule_data.js";
import { updateCoursesCache } from "./schedule_cache.js";
import { renderTimetable, renderListView } from "./schedule_render.js";
import { setupDragAndDrop } from "../events/schedule_drag.js";
import { initScheduleEvents, setupCourseCardEvents, setupCellClickEvents } from "../events/schedule_events.js";

// 初始化滚动动画
function initScrollAnimation(selector, options) {
  const elements = document.querySelectorAll(selector);
  
  const defaultOptions = {
    threshold: 0.1,
    once: true
  };
  
  const opts = {...defaultOptions, ...options};
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-visible");
        if (opts.once) {
          observer.unobserve(entry.target);
        }
      } else if (!opts.once) {
        entry.target.classList.remove("animate-visible");
      }
    });
  }, {
    threshold: opts.threshold
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

// 初始化课表数据
function loadScheduleData() {
  try {
    console.log("正在初始化课表数据...");
    // 尝试从本地存储加载数据
    const loadedFromStorage = loadScheduleFromStorage();
    if (loadedFromStorage) {
      console.log("从本地存储成功加载课表数据");
    } else {
      console.log("使用默认课表数据");
    }

    // 更新缓存数据
    updateCoursesCache();
    
    // 渲染视图
    renderTimetable();
    renderListView();
    
    // 设置事件监听器
    setupCourseCardEvents(false);
    setupCellClickEvents(false);
    setupDragAndDrop(false);
    
    console.log("课表数据初始化成功");
  } catch (error) {
    console.error("初始化课表数据失败:", error);
    document.getElementById("week-view-container").innerHTML = `
      <div class="alert alert-danger">
        <h4>初始化数据失败</h4>
        <p>${error.message}</p>
        <p>请检查控制台获取详细信息</p>
      </div>
    `;
    window.showNotification("初始化课表数据失败，请刷新页面重试", "error");
  }
}

// 当课程数据变更后的处理
function afterCourseDataChanged() {
  // 更新缓存
  updateCoursesCache();
  
  // 重新渲染视图
  renderTimetable();
  renderListView();
  
  // 更新拖放功能
  const isEditMode = document.getElementById("week-view-container").classList.contains("edit-mode");
  setupDragAndDrop(isEditMode);
  
  // 保存到本地存储
  saveScheduleToStorage();
}

// 初始化课表页面
export function initSchedulePage() {
  // 初始化滚动动画
  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });
  
  // 初始化课表数据
  loadScheduleData();
  
  // 初始化事件监听
  const eventsController = initScheduleEvents();
  
  // 监听课程数据变化事件
  window.addEventListener('courseDataChanged', afterCourseDataChanged);
  
  // 监听编辑模式变化事件
  window.addEventListener('editModeChanged', (e) => {
    const isEditMode = e.detail.isEditMode;
    setupDragAndDrop(isEditMode);
    setupCourseCardEvents(isEditMode);
    setupCellClickEvents(isEditMode);
  });
  
  // 返回控制器接口
  return {
    refreshData: () => {
      loadScheduleData();
    },
    isEditMode: eventsController.isEditMode
  };
}
