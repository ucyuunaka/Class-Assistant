// 课程评价页面的主要脚本
import { getAllCourses, subscribeToCourseUpdates } from "../data/schedule_data.js";

// 初始化变量
let reactionMap = new Map(); // 存储用户选择的表情

// DOM元素
let courseSelect;
let messageList;
let selectedReactions;
let emojiButton;
let sendButton;
let emojiPicker;
let usingFallbackPicker = false; // 标记是否使用备用emoji选择器

// 初始化函数
document.addEventListener("DOMContentLoaded", function () {
  // 初始化界面元素
  initUI();
  
  // 初始化表情选择器
  initEmojiPicker();
  
  // 加载课程数据
  renderOptionalCourses();
  
  // 初始化事件监听
  initEvents();
  
  // 订阅课程数据变化
  subscribeToCourseUpdates(handleCourseUpdates);
  
  // 监听主题变化
  listenForThemeChanges();
  
  // 立即应用当前主题
  const currentTheme = document.body.getAttribute('data-theme') || 'classic-blue-pink';
  updateLessonUIForTheme(currentTheme);
});

// 初始化UI元素 - 添加这个函数以修复未定义错误
function initUI() {
  courseSelect = document.getElementById("courseSelect");
  messageList = document.getElementById("messageList");
  selectedReactions = document.getElementById("selectedReactions");
  emojiButton = document.getElementById("emojiButton");
  sendButton = document.getElementById("sendButton");
  
  // 确保元素存在
  if (!courseSelect || !messageList || !selectedReactions || !emojiButton || !sendButton) {
    console.error("初始化UI失败：无法找到必要的DOM元素");
    return;
  }
  
  console.log("UI元素初始化成功");
}

// 初始化事件监听
function initEvents() {
  if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
  }
  
  // 添加消息过滤功能
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      filterMessages(this.dataset.category);
    });
  });
  
  // 添加窗口调整大小监听
  window.addEventListener('resize', handleResize);
}

// 处理窗口大小变化
function handleResize() {
  // 调整UI布局或元素大小
  console.log("窗口大小已调整");
}

// 加载课程数据并渲染到选择框
function renderOptionalCourses() {
  try {
    const courses = getAllCourses();
    
    if (!courseSelect) {
      console.error("无法找到课程选择框元素");
      return;
    }
    
    // 清空现有选项（保留第一个默认选项）
    while (courseSelect.options.length > 1) {
      courseSelect.remove(1);
    }
    
    // 添加课程选项
    courses.forEach(course => {
      const option = document.createElement("option");
      option.value = course.name;
      option.textContent = course.name;
      courseSelect.appendChild(option);
    });
    
    console.log(`已加载${courses.length}个课程`);
  } catch (error) {
    console.error("加载课程数据失败:", error);
  }
}

// 初始化表情选择器
function initEmojiPicker() {
  const emojiPickerContainer = document.getElementById("emojiPickerContainer");
  
  if (!emojiPickerContainer) {
    console.error("无法找到emoji选择器容器");
    return;
  }
  
  // 检查是否存在原生emoji-picker元素
  try {
    // 使用备用选择器（假设CDN资源加载可能失败）
    usingFallbackPicker = true;
    console.log('使用备用emoji选择器');
    
    // 绑定表情按钮事件
    if (emojiButton) {
      emojiButton.addEventListener("click", toggleEmojiPicker);
    }
    
    // 监听备用emoji选择器的事件
    window.addEventListener('emoji-click', event => {
      addReaction(event.detail.emoji.unicode);
    });
  } catch (error) {
    console.error("初始化表情选择器失败:", error);
  }
}

// 显示/隐藏emoji选择器
function toggleEmojiPicker(e) {
  e.stopPropagation();
  const emojiPickerContainer = document.getElementById("emojiPickerContainer");
  
  // 如果容器不存在，则退出
  if (!emojiPickerContainer) return;
  
  const fallback = document.getElementById('emojiFallback');
  if (fallback) {
    if (fallback.style.display === "none" || fallback.style.display === "") {
      fallback.style.display = "block";
      
      // 定位到按钮附近
      const rect = emojiButton.getBoundingClientRect();
      fallback.style.position = 'absolute';
      fallback.style.top = `${rect.bottom + 5}px`;
      fallback.style.left = `${rect.left}px`;
    } else {
      fallback.style.display = "none";
    }
  }
}

// 添加表情反应
function addReaction(emoji) {
  if (!selectedReactions) return;
  
  if (!reactionMap.has(emoji)) {
    reactionMap.set(emoji, 1);
    
    const reactionTag = document.createElement("div");
    reactionTag.className = "reaction-tag";
    reactionTag.dataset.emoji = emoji;
    reactionTag.innerHTML = `
      <span class="reaction-emoji">${emoji}</span>
      <span class="remove"><i class="fas fa-times"></i></span>
    `;
    
    // 点击删除标签
    reactionTag.querySelector(".remove").addEventListener("click", () => {
      reactionMap.delete(emoji);
      reactionTag.remove();
    });
    
    selectedReactions.appendChild(reactionTag);
  }
}

// 发送消息
function sendMessage() {
  if (!courseSelect || !selectedReactions) return;
  
  const selectedCourse = courseSelect.value;
  if (!selectedCourse) {
    window.showNotification("请先选择一个课程", "warning");
    return;
  }
  
  if (reactionMap.size === 0) {
    window.showNotification("请至少添加一个表情反应", "warning");
    return;
  }
  
  // 创建新消息
  const message = {
    course: selectedCourse,
    reactions: Array.from(reactionMap.entries()).map(([emoji, count]) => ({
      emoji, count
    })),
    time: new Date().toLocaleString()
  };
  
  // 添加消息到UI
  addMessageToUI(message);
  
  // 重置表单
  courseSelect.value = "";
  selectedReactions.innerHTML = "";
  reactionMap.clear();
  
  window.showNotification("评价已添加", "success");
}

// 添加消息到UI
function addMessageToUI(message) {
  if (!messageList) return;
  
  const messageElement = document.createElement("div");
  messageElement.className = "message sent animate-on-scroll fade-up";
  messageElement.dataset.course = message.course;
  
  let reactionsHTML = '';
  message.reactions.forEach(reaction => {
    reactionsHTML += `
      <div class="reaction-bubble" data-emoji="${reaction.emoji}">
        <span class="reaction-emoji">${reaction.emoji}</span>
        <span class="reaction-count">${reaction.count}</span>
      </div>
    `;
  });
  
  messageElement.innerHTML = `
    <div class="message-content">
      <div class="course-name">${message.course}</div>
      <div class="message-reactions">
        ${reactionsHTML}
      </div>
      <div class="message-time">${message.time}</div>
    </div>
  `;
  
  // 插入到列表最前面
  if (messageList.firstChild) {
    messageList.insertBefore(messageElement, messageList.firstChild);
  } else {
    messageList.appendChild(messageElement);
  }
  
  // 如果有空状态显示，则隐藏
  const emptyState = document.getElementById("emptyState");
  if (emptyState) {
    emptyState.style.display = "none";
  }
}

// 处理课程数据更新
function handleCourseUpdates() {
  renderOptionalCourses();
}

// 过滤消息
function filterMessages(category) {
  if (!messageList) return;
  
  const messages = messageList.querySelectorAll('.message');
  const emptyState = document.getElementById('emptyState');
  let hasVisibleMessages = false;
  
  messages.forEach(message => {
    if (!category || message.dataset.category === category) {
      message.style.display = 'block';
      hasVisibleMessages = true;
    } else {
      message.style.display = 'none';
    }
  });
  
  // 显示或隐藏空状态
  if (emptyState) {
    emptyState.style.display = hasVisibleMessages ? 'none' : 'block';
  }
}

// 监听主题变化事件
function listenForThemeChanges() {
  window.addEventListener('themeChanged', function(event) {
    // 获取新主题
    const newTheme = event.detail.theme;
    console.log('课评速记页面：主题已切换为', newTheme);
    
    // 应用主题变化到UI元素
    updateLessonUIForTheme(newTheme);
  });
}

// 根据主题更新UI元素
function updateLessonUIForTheme(theme) {
  // 检查ThemeManager是否可用
  if (!window.ThemeManager) {
    console.error('ThemeManager未定义，无法应用主题');
    return;
  }
  
  // 获取当前主题信息
  const isDarkTheme = theme === 'dark';
  let themeInfo;
  try {
    themeInfo = window.ThemeManager.getThemeInfo(theme);
  } catch (error) {
    console.error('获取主题信息失败:', error);
    return;
  }
  
  // 更新顶栏样式
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.style.background = `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))`;
  }
  
  // 更新输入区域颜色
  const inputContainer = document.querySelector('.input-container');
  if (inputContainer) {
    inputContainer.style.backgroundColor = 'var(--background-secondary)';
    inputContainer.style.borderColor = 'var(--border-color)';
  }
  
  // 更新输入头部
  const inputHeader = document.querySelector('.input-header');
  if (inputHeader) {
    inputHeader.style.backgroundColor = 'var(--card-header-bg)';
    inputHeader.style.color = 'var(--text-color)';
  }
  
  // 更新所有消息卡片
  const messages = document.querySelectorAll('.message');
  messages.forEach(message => {
    message.style.backgroundColor = 'var(--background-secondary)';
    message.style.borderColor = 'var(--border-color)';
    message.style.color = 'var(--text-color)';
  });
  
  // 更新按钮样式
  const buttons = document.querySelectorAll('button:not(.emoji-btn)');
  buttons.forEach(button => {
    if (button.classList.contains('btn')) {
      button.style.backgroundColor = 'var(--button-primary)';
      button.style.color = 'var(--button-text)';
    }
  });
  
  // 更新表情按钮
  const emojiBtn = document.querySelector('.emoji-btn');
  if (emojiBtn) {
    emojiBtn.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  }
  
  // 更新选择框
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    select.style.backgroundColor = 'var(--background-secondary)';
    select.style.color = 'var(--text-color)';
    select.style.borderColor = 'var(--border-color)';
  });
  
  // 更新备用表情选择器
  const fallbackPicker = document.getElementById('emojiFallback');
  if (fallbackPicker) {
    fallbackPicker.style.backgroundColor = 'var(--background-secondary)';
    fallbackPicker.style.borderColor = 'var(--border-color)';
    fallbackPicker.style.boxShadow = 'var(--shadow)';
  }
}
