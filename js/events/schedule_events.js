// 课表事件控制器
// 负责处理课表相关的各种事件

import { scheduleData, deleteCourse, updateCourse, addCourse, clearCourses } from "../data/schedule_data.js";
import { renderTimetable, renderListView } from "../controllers/schedule_render.js";
import { setupDragAndDrop } from "./schedule_drag.js";
import { updateCoursesCache } from "../controllers/schedule_cache.js";

// 当前编辑模式状态
let isEditMode = false;
// 当前要删除的课程ID
let currentCourseToDelete = null;

/**
 * 初始化课表事件
 * 设置所有事件监听器
 */
export function initScheduleEvents() {
  // 获取DOM元素
  const editScheduleBtn = document.getElementById("edit-schedule-btn");
  const weekViewBtn = document.getElementById("week-view");
  const listViewBtn = document.getElementById("list-view");
  const weekViewContainer = document.getElementById("week-view-container");
  const listViewContainer = document.getElementById("list-view-container");
  const addCourseModal = document.getElementById("add-course-modal");
  const closeCourseModal = document.getElementById("close-course-modal");
  const cancelCourse = document.getElementById("cancel-course");
  const addCourseForm = document.getElementById("add-course-form");
  const deleteConfirmModal = document.getElementById("delete-confirm-modal");
  const closeDeleteModal = document.getElementById("close-delete-modal");
  const cancelDelete = document.getElementById("cancel-delete");
  const confirmDelete = document.getElementById("confirm-delete");
  const clearScheduleModal = document.getElementById("clear-schedule-modal");
  const closeClearModal = document.getElementById("close-clear-modal");
  const cancelClear = document.getElementById("cancel-clear");
  const confirmClear = document.getElementById("confirm-clear");
  const colorOptions = document.querySelectorAll(".color-option");
  const courseColorInput = document.getElementById("course-color");

  // 编辑模式切换
  editScheduleBtn.addEventListener("click", function () {
    // 检查当前是否是列表视图
    if (listViewContainer.style.display === "block") {
      window.showNotification("请在周视图下编辑课表", "info");
      return;
    }

    // 切换编辑模式状态
    isEditMode = !isEditMode;

    // 更新按钮文本和图标
    if (isEditMode) {
      editScheduleBtn.innerHTML = '<i class="fas fa-check"></i> 完成编辑';
      editScheduleBtn.classList.add("btn-success");
      // 添加编辑模式类到容器
      weekViewContainer.classList.add("edit-mode");
    } else {
      editScheduleBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑课表';
      editScheduleBtn.classList.remove("btn-success");
      // 移除编辑模式类
      weekViewContainer.classList.remove("edit-mode");
    }

    setupDragAndDrop(isEditMode);
  });

  // 视图切换事件
  weekViewBtn.addEventListener("click", function () {
    // 退出编辑模式
    isEditMode = false;
    editScheduleBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑课表';
    editScheduleBtn.classList.remove("btn-success");
    weekViewContainer.classList.remove("edit-mode");

    weekViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
    weekViewContainer.style.display = "block";
    listViewContainer.style.display = "none";
  });

  listViewBtn.addEventListener("click", function () {
    // 退出编辑模式
    isEditMode = false;
    editScheduleBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑课表';
    editScheduleBtn.classList.remove("btn-success");
    weekViewContainer.classList.remove("edit-mode");    
    
    listViewBtn.classList.add("active");
    weekViewBtn.classList.remove("active");
    listViewContainer.style.display = "block";
    weekViewContainer.style.display = "none";
  });

  // 导出和清空事件
  document.getElementById("export-ical").addEventListener("click", function (e) {
    e.preventDefault();
    window.showNotification("导出为iCal功能正在开发中...", "info");
  });
  
  document.getElementById("export-csv").addEventListener("click", function (e) {
    e.preventDefault();
    window.showNotification("导出为CSV功能正在开发中...", "info");
  });
  
  document.getElementById("import-courses").addEventListener("click", function (e) {
    e.preventDefault();
    window.showNotification("导入课程功能正在开发中...", "info");
  });

  document.getElementById("print-schedule").addEventListener("click", function (e) {
    e.preventDefault();
    window.print();
  });

  // 清空课表相关事件
  document.getElementById("clear-schedule").addEventListener("click", function (e) {
    e.preventDefault();
    showClearConfirm();
  });

  closeClearModal.addEventListener("click", hideClearConfirm);
  cancelClear.addEventListener("click", hideClearConfirm);
  confirmClear.addEventListener("click", function() {
    // 使用clearCourses函数清空课程数据
    clearCourses();

    // 更新视图
    renderTimetable();
    renderListView();
    updateCoursesCache();

    // 隐藏确认对话框
    hideClearConfirm();

    // 显示成功通知
    window.showNotification("课表已清空", "success");
  });

  // 删除确认对话框事件
  closeDeleteModal.addEventListener("click", hideDeleteConfirm);
  cancelDelete.addEventListener("click", hideDeleteConfirm);
  confirmDelete.addEventListener("click", function () {
    if (currentCourseToDelete) {
      performDeleteCourse(currentCourseToDelete);
      hideDeleteConfirm();
    }
  });

  // 课程卡片事件
  setupCourseCardEvents();
  
  // 单元格点击事件
  setupCellClickEvents();

  // 添加/编辑课程表单提交
  addCourseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // 获取表单数据
    const courseName = document.getElementById("course-name").value;
    const courseTeacher = document.getElementById("course-teacher").value;
    const courseLocation = document.getElementById("course-location").value;
    const courseDay = parseInt(document.getElementById("course-day").value);
    const courseTime = parseInt(document.getElementById("course-time").value);
    const courseColor = document.getElementById("course-color").value;
    const courseNotes = document.getElementById("course-notes").value;

    // 验证数据
    if (!courseName || !courseDay || !courseTime) {
      window.showNotification("请填写所有必填项", "error");
      return;
    }

    const editingCourseId = this.dataset.editingCourseId;

    const courseData = {
      title: courseName,
      teacher: courseTeacher,
      location: courseLocation,
      day: courseDay,
      startTime: courseTime,
      endTime: courseTime, // 假设课程只占一节，可以根据需要修改
      color: courseColor,
      notes: courseNotes,
    };

    try {
      if (editingCourseId) {
        // 更新现有课程
        const success = updateCourse(parseInt(editingCourseId), courseData);
        if (success) {
          window.showNotification("课程已更新", "success");
          afterCourseDataChanged();
          closeAddCourseModal(); // 关闭模态框
        } else {
          window.showNotification("更新课程失败", "error");
        }
      } else {
        // 添加新课程
        const newCourse = addCourse(courseData);
        if (newCourse) {
          window.showNotification("课程已添加", "success");
          afterCourseDataChanged();
          closeAddCourseModal(); // 关闭模态框
        } else {
          window.showNotification("添加课程失败", "error");
        }
      }
    } catch (error) {
      console.error("保存课程时出错:", error);
      window.showNotification("保存课程失败: " + error.message, "error");
    } finally {
      // 清除编辑状态
      delete this.dataset.editingCourseId;
    }
  });

  // 关闭模态框事件
  closeCourseModal.addEventListener("click", closeAddCourseModal);
  cancelCourse.addEventListener("click", closeAddCourseModal);

  // 点击模态框外部关闭
  window.addEventListener("click", (event) => {
    if (event.target === addCourseModal) {
      closeAddCourseModal();
    }
    if (event.target === deleteConfirmModal) {
      hideDeleteConfirm();
    }
  });

  // 颜色选择逻辑
  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // 移除其他选项的选中状态
      colorOptions.forEach((opt) => opt.classList.remove("selected"));
      // 添加当前选项的选中状态
      this.classList.add("selected");
      // 更新隐藏输入框的值
      courseColorInput.value = this.getAttribute("data-class");
    });
  });

  /**
   * 关闭添加/编辑课程模态框
   */
  function closeAddCourseModal() {
    // 使用 Modal.hideExisting 隐藏模态窗口
    window.Modal.hideExisting(addCourseModal);
    
    // 重置表单状态
    addCourseForm.reset();
    
    // 重置颜色选择
    document.querySelector(".color-option.selected")?.classList.remove("selected");
    document.querySelector('.color-option[data-class="course-math"]').classList.add("selected");
    courseColorInput.value = "course-math";
    
    // 重置模态框标题
    document.querySelector("#add-course-modal h2").textContent = "添加新课程";
    
    // 清除编辑状态
    delete addCourseForm.dataset.editingCourseId;
  }

  /**
   * 显示删除确认对话框
   * @param {string} courseId - 课程ID
   */
  function showDeleteConfirm(courseId) {
    currentCourseToDelete = courseId;
    // 使用 Modal.showExisting 显示已存在的模态窗口
    window.Modal.showExisting(deleteConfirmModal);
  }

  /**
   * 隐藏删除确认对话框
   */
  function hideDeleteConfirm() {
    // 使用 Modal.hideExisting 隐藏已存在的模态窗口
    window.Modal.hideExisting(deleteConfirmModal);
    currentCourseToDelete = null;
  }

  /**
   * 显示清空课表确认对话框
   */
  function showClearConfirm() {
    // 使用 Modal.showExisting 显示已存在的模态窗口
    window.Modal.showExisting(clearScheduleModal);
  }

  /**
   * 隐藏清空课表确认对话框
   */
  function hideClearConfirm() {
    // 使用 Modal.hideExisting 隐藏已存在的模态窗口
    window.Modal.hideExisting(clearScheduleModal);
  }
}

/**
 * 在课程数据变更后更新界面
 */
export function afterCourseDataChanged() {
  renderTimetable();
  renderListView();
  setupDragAndDrop(isEditMode);
  updateCoursesCache();
}

/**
 * 设置课程卡片事件
 */
function setupCourseCardEvents() {
  // 动态绑定所有课程卡片点击事件
  document.addEventListener("click", function (e) {
    // 检查是否点击了删除图标
    if (
      e.target.closest(".course-delete-icon") ||
      e.target.classList.contains("fa-times")
    ) {
      if (isEditMode) {
        e.preventDefault();
        e.stopImmediatePropagation(); // 使用更严格的事件阻止

        const deleteIcon = e.target.closest(".course-delete-icon");
        const courseCard = deleteIcon.closest(".course-card");
        const courseId = courseCard.getAttribute("data-course-id");

        showDeleteConfirm(courseId);
      }
      return; // 确保不会继续处理其他事件
    }

    // 原有的课程卡片点击事件
    const courseCard = e.target.closest(".course-card");
    if (courseCard && !isEditMode) {
      const courseId = courseCard.getAttribute("data-course-id");
      if (courseId) {
        const course = scheduleData.courses.find(
          (c) => c.id == courseId
        );
        if (course) {
          showCourseDetails(course);
        }
      }
    }
  });
}

/**
 * 设置单元格点击事件
 */
function setupCellClickEvents() {
  document.addEventListener("click", function (e) {
    // 检查是否处于编辑模式
    if (!isEditMode) return;

    const cell = e.target.closest(".timetable-cell");
    if (!cell) return;

    try {
      const day = parseInt(cell.getAttribute("data-day"));
      const time = parseInt(cell.getAttribute("data-time"));

      // 验证获取的day和time是否有效
      if (isNaN(day)) throw new Error("无效的星期数据");
      if (isNaN(time)) throw new Error("无效的时间数据");

      // 检查单元格内是否有课程
      const hasCourse = cell.querySelector(".course-card") !== null;

      if (hasCourse) {
        // 编辑现有课程
        const courseCard = cell.querySelector(".course-card");
        const courseId = courseCard.getAttribute("data-course-id");
        if (!courseId) throw new Error("课程ID无效");

        const course = scheduleData.courses.find(
          (c) => c.id == courseId
        );
        if (!course) throw new Error("找不到对应课程");

        editCourse(course);
      } else {
        // 创建新课程
        createNewCourse(day, time);
      }
    } catch (error) {
      console.error("处理单元格点击时出错:", error);
      window.showNotification("操作失败: " + error.message, "error");
    }
  });
}

/**
 * 修改课程
 * @param {Object} course - 课程数据
 */
function editCourse(course) {
  try {
    if (!course) throw new Error("课程数据无效");

    // 获取对应的时间段文本
    const timePeriod = scheduleData.timePeriods.find(
      (t) => t.id === course.startTime
    );
    const timeText = timePeriod
      ? timePeriod.time
      : `第${course.startTime}节`;

    // 填充模态框中的课程数据
    document.getElementById("course-name").value = course.title || "";
    document.getElementById("course-teacher").value =
      course.teacher || "";
    document.getElementById("course-location").value =
      course.location || "";
    document.getElementById("course-day").value = course.day || "";
    document.getElementById("course-time").value =
      course.startTime || "";

    // 设置课程颜色
    document
      .querySelector(".color-option.selected")
      ?.classList.remove("selected");
    const colorOption = document.querySelector(
      `.color-option[data-class="${course.color}"]`
    );
    if (colorOption) {
      colorOption.classList.add("selected");
      document.getElementById("course-color").value = course.color;
    } else {
      // 默认颜色
      document
        .querySelector('.color-option[data-class="course-computer"]')
        .classList.add("selected");
      document.getElementById("course-color").value = "course-computer";
    }

    // 把弹窗标题改为"编辑课程"
    document.querySelector("#add-course-modal h2").textContent = "编辑课程";
    // 显示 添加/编辑 课程弹窗
    window.Modal.showExisting(document.getElementById("add-course-modal"));

    // 保存当前编辑的课程ID
    document.getElementById("add-course-form").dataset.editingCourseId = course.id;
  } catch (error) {
    console.error("编辑课程时出错:", error);
    window.showNotification("编辑课程失败: " + error.message, "error");
  }
}

/**
 * 实际删除课程
 * @param {string} courseId - 课程ID
 */
function performDeleteCourse(courseId) {
  try {
    const courseCard = document.querySelector(
      `.course-card[data-course-id="${courseId}"]`
    );
    if (!courseCard) {
      window.showNotification("找不到要删除的课程", "error");
      return;
    }

    courseCard.classList.add("deleting");

    setTimeout(() => {
      try {
        const success = deleteCourse(parseInt(courseId));

        if (success) {
          // 重新渲染前检查课程是否还存在
          const courseStillExists = scheduleData.courses.some(
            (c) => c.id == courseId
          );
          if (!courseStillExists) {
            afterCourseDataChanged();
            window.showNotification("课程已删除", "success");
          } else {
            courseCard.classList.remove("deleting");
            window.showNotification("删除课程失败: 课程仍存在", "error");
          }
        } else {
          courseCard.classList.remove("deleting");
          window.showNotification("删除课程失败", "error");
        }
      } catch (error) {
        courseCard.classList.remove("deleting");
        console.error("删除课程时出错:", error);
        window.showNotification("删除课程时出错: " + error.message, "error");
      }
    }, 300);
  } catch (error) {
    console.error("删除课程初始化时出错:", error);
    window.showNotification("删除课程初始化失败", "error");
  }
}

/**
 * 创建新课程
 * @param {number} day - 星期几
 * @param {number} time - 课程节数
 */
function createNewCourse(day, time) {
  // 重置表单并设置默认值
  document.getElementById("add-course-form").reset();
  document.getElementById("course-day").value = day;
  document.getElementById("course-time").value = time;
  
  // 重置颜色选择
  document.querySelector(".color-option.selected")?.classList.remove("selected");
  document.querySelector('.color-option[data-class="course-math"]').classList.add("selected");
  document.getElementById("course-color").value = "course-math";
  
  // 重置模态框标题
  document.querySelector("#add-course-modal h2").textContent = "添加新课程";
  
  // 清除编辑状态
  delete document.getElementById("add-course-form").dataset.editingCourseId;

  // 使用 Modal.showExisting 显示模态窗口
  window.Modal.showExisting(document.getElementById("add-course-modal"));
}

/**
 * 显示课程详情
 * @param {Object} course - 课程数据
 */
function showCourseDetails(course) {
  // 可以在这里实现课程详情查看功能
  console.log("查看课程详情:", course);
}

/**
 * 显示删除确认对话框
 * @param {string} courseId - 课程ID
 */
function showDeleteConfirm(courseId) {
  currentCourseToDelete = courseId;
  // 使用 Modal.showExisting 显示已存在的模态窗口
  window.Modal.showExisting(document.getElementById("delete-confirm-modal"));
}

/**
 * 隐藏删除确认对话框
 */
function hideDeleteConfirm() {
  // 使用 Modal.hideExisting 隐藏已存在的模态窗口
  window.Modal.hideExisting(document.getElementById("delete-confirm-modal"));
  currentCourseToDelete = null;
}

// 导出当前的编辑模式状态
export { isEditMode };
