// filepath: d:\Users\linyu\Desktop\Class-Assistant\js\events\schedule_drag.js
import { moveCourse } from "../data/schedule_data.js";
import { checkCanPlaceCourse, getMoveCourseFailReason, getPlacementBlockReason } from "../controllers/schedule_cache.js";

// 全局变量
let draggedItem = null;
let draggedCourseId = null;
let lastMouseOverTime = 0;
const mouseOverThrottle = 100; // 鼠标移动事件节流间隔(毫秒)

// DOM 操作优化 - 更新队列
export const uiUpdateQueue = {
  cells: new Map(), // 单元格更新队列
  pendingUpdate: false, // 是否有等待的更新
  
  // 添加单元格到更新队列
  queueCellUpdate(cell, updates) {
    if (!cell) return;
    
    const cellId = cell.dataset.day + '-' + cell.dataset.time;
    let cellUpdates = this.cells.get(cell);
    
    if (!cellUpdates) {
      cellUpdates = {
        element: cell,
        classes: { add: [], remove: [] },
        tooltip: null
      };
      this.cells.set(cell, cellUpdates);
    }
    
    // 合并类名操作
    if (updates.addClass) {
      if (Array.isArray(updates.addClass)) {
        updates.addClass.forEach(cls => {
          if (!cellUpdates.classes.add.includes(cls) && !cell.classList.contains(cls)) {
            cellUpdates.classes.add.push(cls);
          }
          // 从移除列表中删除，如果存在的话
          const removeIndex = cellUpdates.classes.remove.indexOf(cls);
          if (removeIndex !== -1) {
            cellUpdates.classes.remove.splice(removeIndex, 1);
          }
        });
      } else if (!cellUpdates.classes.add.includes(updates.addClass) && !cell.classList.contains(updates.addClass)) {
        cellUpdates.classes.add.push(updates.addClass);
        // 从移除列表中删除，如果存在的话
        const removeIndex = cellUpdates.classes.remove.indexOf(updates.addClass);
        if (removeIndex !== -1) {
          cellUpdates.classes.remove.splice(removeIndex, 1);
        }
      }
    }
    
    if (updates.removeClass) {
      if (Array.isArray(updates.removeClass)) {
        updates.removeClass.forEach(cls => {
          if (!cellUpdates.classes.remove.includes(cls) && cell.classList.contains(cls)) {
            cellUpdates.classes.remove.push(cls);
          }
          // 从添加列表中删除，如果存在的话
          const addIndex = cellUpdates.classes.add.indexOf(cls);
          if (addIndex !== -1) {
            cellUpdates.classes.add.splice(addIndex, 1);
          }
        });
      } else if (!cellUpdates.classes.remove.includes(updates.removeClass) && cell.classList.contains(updates.removeClass)) {
        cellUpdates.classes.remove.push(updates.removeClass);
        // 从添加列表中删除，如果存在的话
        const addIndex = cellUpdates.classes.add.indexOf(updates.removeClass);
        if (addIndex !== -1) {
          cellUpdates.classes.add.splice(addIndex, 1);
        }
      }
    }
    
    // 设置 tooltip
    if (updates.tooltip !== undefined) {
      cellUpdates.tooltip = updates.tooltip;
    }
    
    // 如果没有挂起的更新，请求动画帧
    if (!this.pendingUpdate) {
      this.pendingUpdate = true;
      requestAnimationFrame(() => this.processUpdates());
    }
  },
  
  // 处理所有待更新
  processUpdates() {
    // 处理所有单元格更新
    for (const [cell, updates] of this.cells.entries()) {
      // 添加类名
      if (updates.classes.add.length > 0) {
        cell.classList.add(...updates.classes.add);
      }
      
      // 移除类名
      if (updates.classes.remove.length > 0) {
        cell.classList.remove(...updates.classes.remove);
      }
      
      // 处理 tooltip
      if (updates.tooltip !== null) {
        const existingTooltip = cell.querySelector(".drag-tooltip");
        
        // 有新的提示且当前没有，或有新的提示且内容不同
        if (updates.tooltip && (!existingTooltip || existingTooltip.textContent !== updates.tooltip)) {
          if (existingTooltip) existingTooltip.remove();
          
          const tooltip = document.createElement("div");
          tooltip.className = "drag-tooltip";
          tooltip.textContent = updates.tooltip;
          cell.appendChild(tooltip);
        } 
        // 提示为空且存在当前提示，移除它
        else if (updates.tooltip === '' && existingTooltip) {
          existingTooltip.remove();
        }
      }
    }
    
    // 清空队列
    this.cells.clear();
    this.pendingUpdate = false;
  },
  
  // 清除所有单元格更新
  clearAllCellUpdates() {
    const cells = document.querySelectorAll(".timetable-cell");
    const dragClasses = ["drag-over", "drag-over-invalid", "drag-preview-valid", "drag-preview-invalid"];
    
    cells.forEach(cell => {
      cell.classList.remove(...dragClasses);
      const tooltip = cell.querySelector(".drag-tooltip");
      if (tooltip) tooltip.remove();
    });
    
    // 清空队列
    this.cells.clear();
    this.pendingUpdate = false;
  }
};

// 显示提示函数 - 使用更新队列
export function showTooltip(cell, message) {
  uiUpdateQueue.queueCellUpdate(cell, { tooltip: message });
}

// 拖放主题更新函数
export function updateDragDropTheme(event) {
  const timetableGrid = document.getElementById("timetable-grid");
  if (!timetableGrid) return;
  
  const cells = timetableGrid.querySelectorAll(".timetable-cell");
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  
  if (currentTheme === 'dark') {
    // 深色模式下使用 requestAnimationFrame 批量更新
    requestAnimationFrame(() => {
      cells.forEach(cell => {
        if (cell.classList.contains("drag-preview-valid")) {
          cell.style.backgroundColor = "rgba(40, 167, 69, 0.2)"; // 深色主题中的有效预览颜色
        } else if (cell.classList.contains("drag-preview-invalid")) {
          cell.style.backgroundColor = "rgba(220, 53, 69, 0.2)"; // 深色主题中的无效预览颜色
        } else {
          cell.style.backgroundColor = "";
        }
      });
    });
  } else {
    // 浅色模式下使用 requestAnimationFrame 批量恢复默认样式
    requestAnimationFrame(() => {
      cells.forEach(cell => {
        cell.style.backgroundColor = "";
      });
    });
  }
}

// 获取更人性化的星期名称
export function getDayName(day) {
  const dayNames = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  return dayNames[day] || `星期${day}`;
}

// 拖放功能设置 - 使用事件委托模式
export function setupDragAndDrop(isEditMode) {
  const timetableGrid = document.getElementById("timetable-grid");
  if (!timetableGrid) return;

  const cells = timetableGrid.querySelectorAll(".timetable-cell");

  // 先清除所有单元格的拖放相关样式和提示
  cells.forEach((cell) => {
    cell.classList.remove("drag-over", "drag-over-invalid", "drag-preview-valid", "drag-preview-invalid");
    const tooltip = cell.querySelector(".drag-tooltip");
    if (tooltip) tooltip.remove();
  });

  // 先移除父容器上可能存在的事件
  timetableGrid.removeEventListener("dragstart", handleGridDragStart);
  timetableGrid.removeEventListener("dragend", handleGridDragEnd);
  timetableGrid.removeEventListener("dragover", handleGridDragOver);
  timetableGrid.removeEventListener("dragenter", handleGridDragEnter);
  timetableGrid.removeEventListener("dragleave", handleGridDragLeave);
  timetableGrid.removeEventListener("drop", handleGridDrop);
  timetableGrid.removeEventListener("mouseover", handleGridMouseOver);
  timetableGrid.removeEventListener("mouseout", handleGridMouseOut);

  if (isEditMode) {
    // 使用事件委托：在父容器上绑定所有拖放事件
    timetableGrid.addEventListener("dragstart", handleGridDragStart);
    timetableGrid.addEventListener("dragend", handleGridDragEnd);
    timetableGrid.addEventListener("dragover", handleGridDragOver);
    timetableGrid.addEventListener("dragenter", handleGridDragEnter);
    timetableGrid.addEventListener("dragleave", handleGridDragLeave);
    timetableGrid.addEventListener("drop", handleGridDrop);
    timetableGrid.addEventListener("mouseover", handleGridMouseOver);
    timetableGrid.addEventListener("mouseout", handleGridMouseOut);
    
    // 单独设置每个课程卡片为可拖动
    const courseCards = timetableGrid.querySelectorAll(".course-card");
    courseCards.forEach((card) => {
      card.setAttribute("draggable", "true");
      card.classList.add("draggable");
    });
    
    // 监听主题变化事件
    window.addEventListener('themeChanged', updateDragDropTheme);
  } else {
    // 移除课程卡片的拖动属性
    const courseCards = timetableGrid.querySelectorAll(".course-card");
    courseCards.forEach((card) => {
      card.removeAttribute("draggable");
      card.classList.remove("draggable");
    });
    
    // 移除主题变化监听
    window.removeEventListener('themeChanged', updateDragDropTheme);
  }

  // 注入CSS动画样式，如果还没有添加过
  if (!document.getElementById("drag-animation-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "drag-animation-styles";
    styleElement.textContent = `
      /* 有效放置的脉冲动画 */
      .preview-pulse-animation {
        animation: validPulse 1.5s infinite;
      }
      
      @keyframes validPulse {
        0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
        70% { box-shadow: 0 0 0 8px rgba(40, 167, 69, 0); }
        100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
      }
      
      /* 无效放置的警告动画 */
      .preview-error-animation {
        animation: invalidPulse 1.5s infinite;
      }
      
      @keyframes invalidPulse {
        0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
        70% { box-shadow: 0 0 0 8px rgba(220, 53, 69, 0); }
        100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
      }
      
      /* 进入有效区域的动画 */
      .drag-enter-animation {
        animation: scaleIn 0.3s forwards;
      }
      
      @keyframes scaleIn {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      /* 进入无效区域的动画 */
      .drag-enter-error-animation {
        animation: shakeError 0.4s forwards;
      }
      
      @keyframes shakeError {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
      }
      
      /* 强化拖拽提示样式 */
      .drag-tooltip {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
        max-width: 250px;
        text-overflow: ellipsis;
        overflow: hidden;
        animation: fadeIn 0.2s;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      /* 强化可放置/不可放置样式 */
      .drag-preview-valid {
        background-color: rgba(40, 167, 69, 0.2) !important;
        border: 2px dashed #28a745 !important;
      }
      
      .drag-preview-invalid {
        background-color: rgba(220, 53, 69, 0.2) !important;
        border: 2px dashed #dc3545 !important;
      }
      
      .drag-over {
        background-color: rgba(40, 167, 69, 0.3) !important;
        border: 2px solid #28a745 !important;
      }
      
      .drag-over-invalid {
        background-color: rgba(220, 53, 69, 0.3) !important;
        border: 2px solid #dc3545 !important;
      }
    `;
    document.head.appendChild(styleElement);
  }
}

// 事件处理函数
export function handleGridDragStart(e) {
  const card = e.target.closest(".course-card");
  if (!card) return;
  
  draggedItem = card;
  draggedCourseId = card.getAttribute("data-course-id");
  
  // 添加拖动中的样式类
  setTimeout(() => {
    card.classList.add("dragging");
    card.style.opacity = "0.5"; // 使拖动项半透明
  }, 0);
  
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", draggedCourseId); // 传递课程ID
  
  // 预先为所有单元格添加预览效果
  updateAllCellsPreview(draggedCourseId);
  
  // 获取课程名称用于拖动提示
  const courseName = card.querySelector(".course-title").textContent;
  if (courseName) {
    // 添加拖动提示效果
    document.body.setAttribute('data-dragging-course', courseName);
  }
}

export function handleGridDragEnd(e) {
  const card = e.target.closest(".course-card");
  if (!card) return;
  
  setTimeout(() => {
    if (draggedItem) {
      draggedItem.style.opacity = "1"; // 恢复不透明度
      draggedItem.classList.remove("dragging");
    }
    draggedItem = null;
    draggedCourseId = null;
  }, 0);
  
  // 使用优化的批量清除方法
  uiUpdateQueue.clearAllCellUpdates();
  
  // 移除拖动提示
  document.body.removeAttribute('data-dragging-course');
}

export function handleGridDragOver(e) {
  const cell = e.target.closest(".timetable-cell");
  if (!cell) return;
  
  e.preventDefault(); // 必须阻止默认行为以允许drop
  e.dataTransfer.dropEffect = "move";
}

export function handleGridDragEnter(e) {
  const cell = e.target.closest(".timetable-cell");
  if (!cell) return;
  
  e.preventDefault();
  
  const day = parseInt(cell.dataset.day);
  const time = parseInt(cell.dataset.time);
  
  // 检查该位置是否可以放置课程
  const canPlace = checkCanPlaceCourse(draggedCourseId, day, time);
  
  // 获取当前单元格状态
  const currentState = cell.dataset.dragState || '';
  const newState = canPlace ? 'valid' : 'invalid';
  
  // 如果状态没变，不做更新
  if (currentState === newState) return;
  
  // 记录新状态
  cell.dataset.dragState = newState;
  
  // 使用更新队列批量更新UI
  uiUpdateQueue.queueCellUpdate(cell, {
    removeClass: ["drag-over", "drag-over-invalid", "drag-enter-animation", "drag-enter-error-animation"],
    addClass: canPlace ? ["drag-over", "drag-enter-animation"] : ["drag-over-invalid", "drag-enter-error-animation"],
    tooltip: canPlace ? "可以放置课程" : "无法放置课程：时段冲突或超出范围"
  });
}

export function handleGridDragLeave(e) {
  const cell = e.target.closest(".timetable-cell");
  if (!cell) return;
  
  // 检查是否真的离开了单元格（可能只是进入了单元格的子元素）
  const relatedTarget = e.relatedTarget;
  if (cell.contains(relatedTarget)) return;
  
  // 清除状态标记
  delete cell.dataset.dragState;
  
  // 使用更新队列批量更新UI
  uiUpdateQueue.queueCellUpdate(cell, {
    removeClass: ["drag-over", "drag-over-invalid", "drag-enter-animation", "drag-enter-error-animation"],
    tooltip: ''
  });
}

export function handleGridDrop(e) {
  const cell = e.target.closest(".timetable-cell");
  if (!cell) return;
  
  e.preventDefault();
  
  // 清除状态标记
  delete cell.dataset.dragState;
  
  // 使用更新队列批量清除UI
  uiUpdateQueue.queueCellUpdate(cell, {
    removeClass: ["drag-over", "drag-over-invalid", "drag-preview-valid", "drag-preview-invalid"],
    tooltip: ''
  });
  
  if (!draggedItem) return;
  
  const courseId = e.dataTransfer.getData("text/plain");
  const targetDay = parseInt(cell.dataset.day);
  const targetTime = parseInt(cell.dataset.time);
  
  // 检查能否放置课程
  const canPlace = checkCanPlaceCourse(courseId, targetDay, targetTime);
  if (!canPlace) {
    window.showNotification("目标时间段已被占用", "error");
    // 恢复拖动项的不透明度，因为拖放失败
    if (draggedItem) {
      draggedItem.style.opacity = "1";
    }
    draggedItem = null;
    draggedCourseId = null;
    return; // 不允许放置
  }

  try {
    // 调用移动课程的函数
    const success = moveCourse(courseId, targetDay, targetTime);      
    if (success) {
      // 移动成功后，通知需要更新数据
      window.dispatchEvent(new CustomEvent('courseDataChanged'));
      window.showNotification("课程已移动", "success");
    } else {
      // 如果移动失败，尝试获取具体原因
      const reason = getMoveCourseFailReason(courseId, targetDay, targetTime);
      window.showNotification("移动课程失败: " + reason, "error");
      // 恢复拖动项的不透明度，因为移动失败
      if (draggedItem) {
        draggedItem.style.opacity = "1";
      }
    }
  } catch (error) {
    console.error("移动课程时出错:", error);
    window.showNotification("移动课程时出错: " + error.message, "error");
    // 恢复拖动项的不透明度，因为发生错误
    if (draggedItem) {
      draggedItem.style.opacity = "1";
    }
  } finally {
    // 确保在拖放操作结束后清除拖动项引用
    draggedItem = null;
    draggedCourseId = null;
  }
}

export function handleGridMouseOver(e) {
  const cell = e.target.closest(".timetable-cell");
  if (!cell || !draggedCourseId) return;
  
  // 获取当前时间戳
  const now = Date.now();
  
  // 如果距离上次更新未达到节流间隔，则跳过
  if (now - lastMouseOverTime < mouseOverThrottle) return;
  
  // 更新上次处理时间
  lastMouseOverTime = now;
  
  const day = parseInt(cell.dataset.day);
  const time = parseInt(cell.dataset.time);
  
  // 检查该位置是否可以放置课程
  const canPlace = checkCanPlaceCourse(draggedCourseId, day, time);
  
  // 获取当前单元格预览状态
  const currentPreview = cell.dataset.previewState || '';
  const newPreview = canPlace ? 'valid' : 'invalid';
  
  // 如果预览状态没变，不做更新
  if (currentPreview === newPreview) return;
  
  // 记录新的预览状态
  cell.dataset.previewState = newPreview;
  
  // 使用更新队列批量更新UI
  uiUpdateQueue.queueCellUpdate(cell, {
    removeClass: ["drag-preview-valid", "drag-preview-invalid", "preview-pulse-animation", "preview-error-animation"],
    addClass: canPlace ? ["drag-preview-valid", "preview-pulse-animation"] : ["drag-preview-invalid", "preview-error-animation"]
  });
  
  // 显示拖放提示信息
  if (canPlace) {
    showTooltip(cell, `课程可放置到 ${getDayName(day)} 第${time}节`);
  } else {
    // 获取更具体的不可放置原因
    const reason = getPlacementBlockReason(draggedCourseId, day, time);
    showTooltip(cell, reason);
  }
}

export function handleGridMouseOut(e) {
  const cell = e.target.closest(".timetable-cell");
  if (!cell) return;
  
  // 检查是否真的离开了单元格
  const relatedTarget = e.relatedTarget;
  if (cell.contains(relatedTarget)) return;
  
  // 清除预览状态
  delete cell.dataset.previewState;
}

// 更新所有单元格预览
export function updateAllCellsPreview(courseId) {
  if (!courseId) return;
  
  const cells = document.querySelectorAll(".timetable-cell");
  const updates = [];
  
  // 收集所有需要更新的单元格
  cells.forEach(cell => {
    const day = parseInt(cell.dataset.day);
    const time = parseInt(cell.dataset.time);
    
    // 不显示在空白单元格上
    if (!day || !time) return;
    
    // 检查该位置是否可以放置课程
    const canPlace = checkCanPlaceCourse(courseId, day, time);
    
    // 重置单元格状态
    delete cell.dataset.dragState;
    delete cell.dataset.previewState;
    
    // 添加到更新列表
    updates.push({
      cell,
      canPlace,
      day,
      time
    });
  });
  
  // 使用 requestAnimationFrame 批量更新 UI
  requestAnimationFrame(() => {
    updates.forEach(update => {
      // 记录新的预览状态
      update.cell.dataset.previewState = update.canPlace ? 'valid' : 'invalid';
      
      // 移除所有之前的样式类
      update.cell.classList.remove(
        "drag-preview-valid", 
        "drag-preview-invalid", 
        "drag-over", 
        "drag-over-invalid",
        "preview-pulse-animation",
        "preview-error-animation",
        "drag-enter-animation",
        "drag-enter-error-animation"
      );
      
      // 添加合适的预览样式类
      if (update.canPlace) {
        update.cell.classList.add("drag-preview-valid");
      } else {
        update.cell.classList.add("drag-preview-invalid");
      }
      
      // 移除可能的tooltip
      const tooltip = update.cell.querySelector(".drag-tooltip");
      if (tooltip) tooltip.remove();
    });
  });
}
