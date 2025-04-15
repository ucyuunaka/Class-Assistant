// 导入课表数据和相关函数
import {
  scheduleData,
  addCourse,
  deleteCourse,
  clearCourses,
  updateCourse,
  loadScheduleFromStorage,
  saveScheduleToStorage,
  moveCourse,
} from "../data/schedule_data.js";

document.addEventListener("DOMContentLoaded", function () {
  // 初始化滚动动画
  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  }); // 编辑模式切换
  const editScheduleBtn = document.getElementById("edit-schedule-btn");
  let isEditMode = false;

  // 保留模态框引用用于其他功能
  const addCourseModal = document.getElementById("add-course-modal");
  const closeCourseModal = document.getElementById("close-course-modal");
  const cancelCourse = document.getElementById("cancel-course");
  const addCourseForm = document.getElementById("add-course-form");

  // 视图切换
  const weekViewBtn = document.getElementById("week-view");
  const listViewBtn = document.getElementById("list-view");
  const weekViewContainer = document.getElementById(
    "week-view-container"
  );
  const listViewContainer = document.getElementById(
    "list-view-container"
  );

  // 颜色选择功能
  const colorOptions = document.querySelectorAll(".color-option");
  const courseColorInput = document.getElementById("course-color"); // 使用从js/data/schedule_data.js导入的课表数据

  // 删除确认相关元素
  const deleteConfirmModal = document.getElementById(
    "delete-confirm-modal"
  );
  const closeDeleteModal = document.getElementById("close-delete-modal");
  const cancelDelete = document.getElementById("cancel-delete");
  const confirmDelete = document.getElementById("confirm-delete");  let currentCourseToDelete = null;  // 显示删除确认对话框
  function showDeleteConfirm(courseId) {
    currentCourseToDelete = courseId;
    // 使用 Modal.showExisting 显示已存在的模态窗口
    window.Modal.showExisting(deleteConfirmModal);
  }

  // 隐藏删除确认对话框
  function hideDeleteConfirm() {
    // 使用 Modal.hideExisting 隐藏已存在的模态窗口
    window.Modal.hideExisting(deleteConfirmModal);
    currentCourseToDelete = null;
  }

  // 实际删除课程函数 - 增强错误处理
  function performDeleteCourse(courseId) {
    try {
      const courseCard = document.querySelector(
        `.course-card[data-course-id="${courseId}"]`
      );
      if (!courseCard) {
        showNotification("找不到要删除的课程", "error");
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
              renderTimetable();
              renderListView();
              showNotification("课程已删除", "success");
            } else {
              courseCard.classList.remove("deleting");
              showNotification("删除课程失败: 课程仍存在", "error");
            }
          } else {
            courseCard.classList.remove("deleting");
            showNotification("删除课程失败", "error");
          }
        } catch (error) {
          courseCard.classList.remove("deleting");
          console.error("删除课程时出错:", error);
          showNotification("删除课程时出错: " + error.message, "error");
        }
      }, 300);
    } catch (error) {
      console.error("删除课程初始化时出错:", error);
      showNotification("删除课程初始化失败", "error");
    }
  }

  // 编辑模式切换逻辑
  editScheduleBtn.addEventListener("click", function () {
    // 检查当前是否是列表视图
    if (listViewContainer.style.display === "block") {
      showNotification("请在周视图下编辑课表", "info");
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

    setupDragAndDrop(); // 添加这行
  });

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

      renderTimetable();
      renderListView();
      setupCourseCardEvents();
      setupCellClickEvents();
      setupDragAndDrop();
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
      showNotification("初始化课表数据失败，请刷新页面重试", "error");
    }
  }

  // 渲染周视图课表（增强稳定性）
  function renderTimetable() {
    const timetableGrid = document.getElementById("timetable-grid");
    if (!timetableGrid) return;

    // 保存当前滚动位置
    const scrollTop = timetableGrid.scrollTop;
    const scrollLeft = timetableGrid.scrollLeft;

    // 清空现有内容
    timetableGrid.innerHTML = "";

    // 添加表头
    timetableGrid.appendChild(createHeader());

    // 添加时间行和课程单元格
    scheduleData.timePeriods.forEach((period) => {
      // 添加时间单元格
      const timeCell = document.createElement("div");
      timeCell.className = "timetable-time";
      timeCell.textContent = period.time;
      timetableGrid.appendChild(timeCell);

      // 为每一天添加课程单元格
      for (let dayId = 1; dayId <= 7; dayId++) {
        const cell = document.createElement("div");
        cell.className = "timetable-cell";
        cell.setAttribute("data-day", dayId);
        cell.setAttribute("data-time", period.id);
        timetableGrid.appendChild(cell);

        // 查找并显示该单元格对应的课程
        const coursesInCell = scheduleData.courses.filter(
          (course) =>
            course.day === dayId &&
            course.startTime <= period.id &&
            course.endTime >= period.id
        );

        if (coursesInCell.length > 0) {
          coursesInCell.forEach((course) => {
            // 只在连续课程的第一个时间段显示课程卡片
            if (period.id === course.startTime) {
              cell.appendChild(createCourseCard(course, false, false));
            }
          });
        }
      }
    });

    // 恢复滚动位置
    timetableGrid.scrollTop = scrollTop;
    timetableGrid.scrollLeft = scrollLeft;
  }

  // 创建表头
  function createHeader() {
    const headerFragment = document.createDocumentFragment();

    // 时间表头
    const timeHeader = document.createElement("div");
    timeHeader.className = "timetable-header";
    timeHeader.textContent = "时间";
    headerFragment.appendChild(timeHeader);

    // 星期表头
    scheduleData.days.forEach((day) => {
      const dayHeader = document.createElement("div");
      dayHeader.className = "timetable-header";
      dayHeader.textContent = day.name;
      headerFragment.appendChild(dayHeader);
    });

    return headerFragment;
  } // 创建课程卡片
  function createCourseCard(course, isNew = false, isUpdated = false) {
    const card = document.createElement("div");
    card.className = `course-card ${course.color}`;
    card.setAttribute("data-course-id", course.id);

    // 添加动画类
    if (isNew) {
      card.classList.add("added");
    } else if (isUpdated) {
      card.classList.add("updated");
    }

    // 添加删除图标（初始隐藏）
    const deleteIcon = document.createElement("div");
    deleteIcon.className = "course-delete-icon";
    deleteIcon.innerHTML = '<i class="fas fa-times"></i>';

    // 创建课程标题元素
    const titleElement = document.createElement("div");
    titleElement.className = "course-title";
    titleElement.textContent = course.title;

    // 创建教师信息元素
    const teacherElement = document.createElement("div");
    teacherElement.className = "course-info";
    teacherElement.textContent = course.teacher;

    // 创建位置信息元素
    const locationElement = document.createElement("div");
    locationElement.className = "course-location";

    // 添加位置图标
    const locationIcon = document.createElement("i");
    locationIcon.className = "fas fa-map-marker-alt";
    locationElement.appendChild(locationIcon);

    // 添加位置文本
    locationElement.appendChild(
      document.createTextNode(" " + course.location)
    );

    // 按顺序将所有元素添加到卡片中
    card.appendChild(deleteIcon);
    card.appendChild(titleElement);
    card.appendChild(teacherElement);
    card.appendChild(locationElement);

    // 添加字体自适应逻辑
    adjustFontSize(card);

    return card;
  } // 根据内容自动调整字体大小的函数
  function adjustFontSize(card) {
    const titleElement = card.querySelector(".course-title");
    const infoElements = card.querySelectorAll(".course-info");
    const locationElement = card.querySelector(".course-location");

    // 设置最小字体大小和基准字体大小
    const minFontSize = 0.6; // rem - 允许更小的字体以确保完整显示
    const baseTitleSize = 0.95; // rem
    const baseInfoSize = 0.8; // rem

    try {
      // 调整课程名称字体大小 - 始终应用自适应缩放
      if (titleElement) {
        const titleLength = titleElement.textContent.length;

        // 课程名称自适应算法 - 根据字符数更积极地缩放
        let scaleFactor = 1;
        if (titleLength > 4) {
          // 字符越多，缩放越明显
          scaleFactor = Math.min(1, 4 / titleLength + 0.1);
        }

        const newSize = Math.max(
          minFontSize,
          baseTitleSize * scaleFactor
        );
        titleElement.style.fontSize = `${newSize}rem`;
      }

      // 调整教师信息字体大小 - 所有内容都应用自适应缩放
      infoElements.forEach((element) => {
        if (element) {
          const textLength = element.textContent.length;
          let scaleFactor = 1;

          if (textLength > 6) {
            scaleFactor = Math.min(1, 6 / textLength + 0.15);
          }

          const newSize = Math.max(
            minFontSize,
            baseInfoSize * scaleFactor
          );
          element.style.fontSize = `${newSize}rem`;
        }
      });

      // 调整位置信息字体大小 - 所有内容都应用自适应缩放
      if (locationElement) {
        const locationText = locationElement.textContent.trim();
        const textLength = locationText.length;
        let scaleFactor = 1;

        if (textLength > 6) {
          scaleFactor = Math.min(1, 6 / textLength + 0.15);
        }

        const newSize = Math.max(minFontSize, baseInfoSize * scaleFactor);
        locationElement.style.fontSize = `${newSize}rem`;

        // 确保图标与文字对齐且大小协调
        const icon = locationElement.querySelector("i");
        if (icon) {
          icon.style.fontSize = `${newSize}rem`;
        }
      }
    } catch (e) {
      console.error("调整字体大小发生错误:", e);
    }
  }

  // 渲染列表视图（增强稳定性）
  function renderListView() {
    const listContainer = document.getElementById("list-view-container");
    if (!listContainer) return;

    // 保存当前滚动位置
    const scrollTop = listContainer.scrollTop;

    // 清空现有内容
    listContainer.innerHTML = "";

    // 按天组织课程
    const coursesByDay = {};
    scheduleData.days.forEach((day) => {
      coursesByDay[day.id] = [];
    });

    scheduleData.courses.forEach((course) => {
      if (coursesByDay[course.day]) {
        coursesByDay[course.day].push(course);
      }
    });

    // 为每一天创建卡片
    scheduleData.days.forEach((day) => {
      // 如果该天没有课程，跳过
      if (coursesByDay[day.id].length === 0) return;

      // 创建该天的卡片
      const dayCard = document.createElement("div");
      dayCard.className = day.id === 1 ? "card" : "card mt-4";

      // 添加标题
      const dayTitle = document.createElement("h3");
      dayTitle.className = "mb-3";
      dayTitle.textContent = day.name;
      dayCard.appendChild(dayTitle);

      // 添加该天的课程
      coursesByDay[day.id]
        .sort((a, b) => a.startTime - b.startTime)
        .forEach((course) => {
          const courseWrapper = document.createElement("div");
          courseWrapper.className = "mb-3";

          const timeRange = getTimeRangeText(course);
          const courseCard = document.createElement("div");
          courseCard.className = `course-card ${course.color}`;
          courseCard.setAttribute("data-course-id", course.id);

          // 添加删除图标（初始隐藏）
          const deleteIcon = document.createElement("div");
          deleteIcon.className = "course-delete-icon";
          deleteIcon.innerHTML = '<i class="fas fa-times"></i>';
          courseCard.appendChild(deleteIcon);

          courseCard.innerHTML += `

          <div class="course-title">${course.title}</div>
          <div class="course-info">${course.teacher}</div>
          <div class="course-info">${timeRange}</div>
          <div class="course-location">
            <i class="fas fa-map-marker-alt"></i> ${course.location}
          </div>
        `;

          courseWrapper.appendChild(courseCard);
          dayCard.appendChild(courseWrapper);
        });

      listContainer.appendChild(dayCard);
    });

    // 恢复滚动位置
    listContainer.scrollTop = scrollTop;
  }

  // 获取课程时间范围文本
  function getTimeRangeText(course) {
    if (scheduleData.timePeriods && scheduleData.timePeriods.length > 0) {
      const startPeriod = scheduleData.timePeriods.find(
        (period) => period.id === course.startTime
      );
      const endPeriod = scheduleData.timePeriods.find(
        (period) => period.id === course.endTime
      );

      if (startPeriod && endPeriod) {
        const startTime = startPeriod.time.split("-")[0];
        const endTime = endPeriod.time.split("-")[1];
        return `${startTime}-${endTime}`;
      }
    }

    return `第${course.startTime}-${course.endTime}节`;
  }

  // 设置课程卡片事件
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
  } // 显示课程详情
  function showCourseDetails(course) {
    // 可以在这里实现课程详情查看功能
    // 例如：弹出模态框显示课程详细信息
    console.log("查看课程详情:", course);
  } // 切换课表视图
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
  document
    .getElementById("export-ical")
    .addEventListener("click", function (e) {
      e.preventDefault();
      alert("导出为iCal功能正在开发中...");
    });

  document
    .getElementById("export-csv")
    .addEventListener("click", function (e) {
      e.preventDefault();
      alert("导出为CSV功能正在开发中...");
    });

  document
    .getElementById("import-courses")
    .addEventListener("click", function (e) {
      e.preventDefault();
      alert("导入课程功能正在开发中...");
    });

  document
    .getElementById("print-schedule")
    .addEventListener("click", function (e) {
      e.preventDefault();
      window.print();
    });

  document
    .getElementById("clear-schedule")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("确定要清空所有课程吗？此操作无法撤销。")) {
        // 使用clearCourses函数清空课程数据
        clearCourses();

        // 更新视图
        renderTimetable();
        renderListView();

        showNotification("课表已清空", "success");
      }
    });

  // 显示通知
  function showNotification(message, type = "info") {
    // 简单的通知实现，可以替换为更复杂的通知系统
    alert(message);
  }

  // 删除确认对话框事件
  closeDeleteModal.addEventListener("click", hideDeleteConfirm);
  cancelDelete.addEventListener("click", hideDeleteConfirm);
  confirmDelete.addEventListener("click", function () {
    if (currentCourseToDelete) {
      performDeleteCourse(currentCourseToDelete);
      hideDeleteConfirm();
    }
  });

  // 新增：设置单元格点击事件
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
        showNotification("操作失败: " + error.message, "error");
      }
    });
  }

  // 修改editCourse函数，添加边缘情况处理
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

      // 更新模态框标题
      document.querySelector(
        "#add-course-modal h2"
      ).textContent = `编辑课程 - ${course.title || "未命名课程"}`;

      // 显示模态框
      document.getElementById("add-course-modal").style.display = "flex";

      // 保存当前编辑的课程ID
      document.getElementById("add-course-form").dataset.editingCourseId =
        course.id;
    } catch (error) {
      console.error("编辑课程时出错:", error);
      showNotification("编辑课程失败: " + error.message, "error");
    }
  }

  // 修改表单提交处理逻辑，确保数据正确更新并持久化
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
      showNotification("请填写所有必填项", "error");
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
          showNotification("课程已更新", "success");
          renderTimetable(); // 重新渲染周视图
          renderListView(); // 重新渲染列表视图
          closeAddCourseModal(); // 关闭模态框
        } else {
          showNotification("更新课程失败", "error");
        }
      } else {
        // 添加新课程
        const newCourse = addCourse(courseData);
        if (newCourse) {
          showNotification("课程已添加", "success");
          renderTimetable(); // 重新渲染周视图
          renderListView(); // 重新渲染列表视图
          closeAddCourseModal(); // 关闭模态框
        } else {
          showNotification("添加课程失败", "error");
        }
      }
    } catch (error) {
      console.error("保存课程时出错:", error);
      showNotification("保存课程失败: " + error.message, "error");
    } finally {
      // 清除编辑状态
      delete this.dataset.editingCourseId;
    }
  });  // 关闭添加/编辑课程模态框
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

  // 添加关闭和取消按钮的事件监听器
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
  });  // 新增：创建新课程函数
  function createNewCourse(day, time) {
    // 重置表单并设置默认值
    addCourseForm.reset();
    document.getElementById("course-day").value = day;
    document.getElementById("course-time").value = time;
    // 重置颜色选择
    document.querySelector(".color-option.selected")?.classList.remove("selected");
    document.querySelector('.color-option[data-class="course-math"]').classList.add("selected");
    courseColorInput.value = "course-math";
    // 重置模态框标题
    document.querySelector("#add-course-modal h2").textContent = "添加新课程";
    // 清除编辑状态
    delete addCourseForm.dataset.editingCourseId;

    // 使用 Modal.showExisting 显示模态窗口
    window.Modal.showExisting(addCourseModal);
  }

  // 新增：拖放功能设置
  function setupDragAndDrop() {
    const timetableGrid = document.getElementById("timetable-grid");
    if (!timetableGrid) return;

    const courseCards = timetableGrid.querySelectorAll(".course-card");
    const cells = timetableGrid.querySelectorAll(".timetable-cell");

    if (isEditMode) {
      // 使课程卡片可拖动
      courseCards.forEach((card) => {
        card.setAttribute("draggable", "true");
        card.addEventListener("dragstart", handleDragStart);
        card.addEventListener("dragend", handleDragEnd);
      });

      // 为单元格添加拖放事件监听器
      cells.forEach((cell) => {
        cell.addEventListener("dragover", handleDragOver);
        cell.addEventListener("dragenter", handleDragEnter);
        cell.addEventListener("dragleave", handleDragLeave);
        cell.addEventListener("drop", handleDrop);
      });
    } else {
      // 移除拖动属性和事件监听器
      courseCards.forEach((card) => {
        card.removeAttribute("draggable");
        card.removeEventListener("dragstart", handleDragStart);
        card.removeEventListener("dragend", handleDragEnd);
      });

      cells.forEach((cell) => {
        cell.removeEventListener("dragover", handleDragOver);
        cell.removeEventListener("dragenter", handleDragEnter);
        cell.removeEventListener("dragleave", handleDragLeave);
        cell.removeEventListener("drop", handleDrop);
        cell.classList.remove("drag-over"); // 清除可能残留的样式
      });
    }
  }

  let draggedItem = null;

  function handleDragStart(e) {
    draggedItem = this;
    setTimeout(() => {
      this.style.opacity = "0.5"; // 使拖动项半透明
    }, 0);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", this.dataset.courseId); // 传递课程ID
  }

  function handleDragEnd() {
    setTimeout(() => {
      if (draggedItem) {
        draggedItem.style.opacity = "1"; // 恢复不透明度
      }
      draggedItem = null;
    }, 0);
    // 清除所有单元格的高亮状态
    document.querySelectorAll(".timetable-cell.drag-over").forEach(cell => {
      cell.classList.remove("drag-over");
    });
  }

  function handleDragOver(e) {
    e.preventDefault(); // 必须阻止默认行为以允许drop
    e.dataTransfer.dropEffect = "move";
  }

  function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add("drag-over"); // 添加高亮效果
  }

  function handleDragLeave() {
    this.classList.remove("drag-over"); // 移除高亮效果
  }

  function handleDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");

    if (!draggedItem) return;

    const courseId = parseInt(e.dataTransfer.getData("text/plain"));
    const targetDay = parseInt(this.dataset.day);
    const targetTime = parseInt(this.dataset.time);

    // 检查目标单元格是否已被占用（检查时间范围）
    const isOccupied = scheduleData.courses.some(
      (course) =>
        course.id !== courseId && // 排除正在拖动的课程
        course.day === targetDay &&
        targetTime >= course.startTime && // 目标时间在课程开始之后
        targetTime <= course.endTime    // 目标时间在课程结束之前
    );

    if (isOccupied) {
      showNotification("目标时间段已被占用", "error");
      // 恢复拖动项的不透明度，因为拖放失败
      if (draggedItem) {
        draggedItem.style.opacity = "1";
      }
      draggedItem = null; // 清除拖动项引用
      return; // 不允许放置
    }

    try {
      // 调用移动课程的函数
      const success = moveCourse(courseId, targetDay, targetTime);

      if (success) {
        // 移动成功后重新渲染课表
        renderTimetable();
        renderListView(); // 同时更新列表视图
        setupDragAndDrop(); // 重新设置拖放，因为元素已重新渲染
        showNotification("课程已移动", "success");
      } else {
        showNotification("移动课程失败", "error");
        // 恢复拖动项的不透明度，因为移动失败
        if (draggedItem) {
          draggedItem.style.opacity = "1";
        }
      }
    } catch (error) {
      console.error("移动课程时出错:", error);
      showNotification("移动课程时出错: " + error.message, "error");
      // 恢复拖动项的不透明度，因为发生错误
      if (draggedItem) {
        draggedItem.style.opacity = "1";
      }
    } finally {
       // 确保在拖放操作结束后清除拖动项引用
       draggedItem = null;
    }
  }


  // 初始加载
  loadScheduleData();
});
