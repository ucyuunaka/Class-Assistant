// filepath: d:\Users\linyu\Desktop\Class-Assistant\js\controllers\schedule_render.js
import { scheduleData } from "../data/schedule_data.js";

// 渲染周视图课表
export function renderTimetable() {
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
export function createHeader() {
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
}

// 创建课程卡片
export function createCourseCard(course, isNew = false, isUpdated = false) {
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
}

// 根据内容自动调整字体大小的函数
export function adjustFontSize(card) {
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

// 渲染列表视图
export function renderListView() {
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
    // 创建该天的卡片
    const dayCard = document.createElement("div");
    dayCard.className = day.id === 1 ? "card" : "card mt-4";

    // 添加标题
    const dayTitle = document.createElement("h3");
    dayTitle.className = "mb-3";
    dayTitle.textContent = day.name;
    dayCard.appendChild(dayTitle);
    
    // 如果该天没有课程，显示"此日无课"信息
    if (coursesByDay[day.id].length === 0) {
      const noCourseInfo = document.createElement("div");
      noCourseInfo.className = "no-course-info";
      noCourseInfo.innerHTML = '<i class="fas fa-coffee"></i> 此日无课';
      noCourseInfo.style.textAlign = "center";
      noCourseInfo.style.padding = "20px";
      noCourseInfo.style.color = "var(--text-secondary)";
      noCourseInfo.style.fontSize = "1.1rem";
      dayCard.appendChild(noCourseInfo);
      listContainer.appendChild(dayCard);
      return;
    }

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
export function getTimeRangeText(course) {
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

// 显示课程详情
export function showCourseDetails(course) {
  // 可以在这里实现课程详情查看功能
  // 例如：弹出模态框显示课程详细信息
  console.log("查看课程详情:", course);
}
