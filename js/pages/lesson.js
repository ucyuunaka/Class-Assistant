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
  
  // 初始化滚动动画
  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });
});

// 初始化UI元素引用
function initUI() {
  courseSelect = document.getElementById("courseSelect");
  messageList = document.getElementById("messageList");
  selectedReactions = document.getElementById("selectedReactions");
  emojiButton = document.getElementById("emojiButton");
  sendButton = document.getElementById("sendButton");
}

// 初始化表情选择器
function initEmojiPicker() {
  // 创建表情选择器元素
  emojiPicker = document.createElement("emoji-picker");
  emojiPicker.classList.add("emoji-picker");
  document.body.appendChild(emojiPicker);
  emojiPicker.style.display = "none";
  
  // 表情选择器点击事件
  emojiPicker.addEventListener("emoji-click", event => {
    const emoji = event.detail.unicode;
    addReaction(emoji);
    emojiPicker.style.display = "none";
  });
}

// 初始化事件监听
function initEvents() {
  // 表情按钮点击事件
  emojiButton.addEventListener("click", function(e) {
    e.stopPropagation();
    
    // 显示/隐藏表情选择器
    if (emojiPicker.style.display === "none") {
      const buttonRect = emojiButton.getBoundingClientRect();
      emojiPicker.style.left = `${buttonRect.left}px`;
      emojiPicker.style.top = `${buttonRect.bottom + 5}px`;
      emojiPicker.style.display = "block";
    } else {
      emojiPicker.style.display = "none";
    }
  });
  
  // 点击其他地方隐藏表情选择器
  document.addEventListener("click", function() {
    emojiPicker.style.display = "none";
  });
  
  // 发送按钮点击事件
  sendButton.addEventListener("click", sendMessage);
}

// 渲染可选课程列表
export function renderOptionalCourses() {
  // 清空现有选项（保留第一个默认选项）
  while (courseSelect.options.length > 1) {
    courseSelect.remove(1);
  }
  
  // 获取所有课程
  const courses = getAllCourses();
  
  // 创建课程选项
  courses.forEach(course => {
    const option = document.createElement("option");
    option.value = course.title;
    option.text = course.title;
    courseSelect.appendChild(option);
  });
}

// 处理课程数据更新
function handleCourseUpdates(updateData) {
  console.log("课程数据已更新:", updateData);
  // 重新渲染课程下拉列表
  renderOptionalCourses();
}

// 添加表情反应
function addReaction(emoji) {
  if (!reactionMap.has(emoji)) {
    reactionMap.set(emoji, 1);
  } else {
    reactionMap.set(emoji, reactionMap.get(emoji) + 1);
  }
  
  renderSelectedReactions();
}

// 渲染已选择的表情
function renderSelectedReactions() {
  selectedReactions.innerHTML = "";
  
  reactionMap.forEach((count, emoji) => {
    const tag = document.createElement("div");
    tag.classList.add("reaction-tag");
    tag.innerHTML = `
      <span class="reaction-emoji">${emoji}</span>
      <span class="reaction-count">${count}</span>
      <span class="reaction-remove" data-emoji="${emoji}">×</span>
    `;
    selectedReactions.appendChild(tag);
    
    // 添加删除事件
    tag.querySelector(".reaction-remove").addEventListener("click", function() {
      const emoji = this.getAttribute("data-emoji");
      reactionMap.delete(emoji);
      renderSelectedReactions();
    });
  });
}

// 发送消息
function sendMessage() {
  const courseValue = courseSelect.value;
  if (!courseValue) {
    window.showNotification("请选择一个课程", "error");
    return;
  }
  
  if (reactionMap.size === 0) {
    window.showNotification("请至少添加一个表情反应", "error");
    return;
  }
  
  // 创建消息元素
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "sent");
  messageDiv.setAttribute("data-course", courseValue);
  
  // 获取当前时间
  const now = new Date();
  const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  // 构建消息内容
  let reactionsHTML = "";
  reactionMap.forEach((count, emoji) => {
    reactionsHTML += `
      <div class="reaction-bubble" data-emoji="${emoji}">
        <span class="reaction-emoji">${emoji}</span>
        <span class="reaction-count">${count}</span>
      </div>
    `;
  });
  
  messageDiv.innerHTML = `
    <div class="message-content">
      <div class="course-name">${courseValue}</div>
      <div class="message-text">课程评价</div>
      <div class="message-reactions">
        ${reactionsHTML}
      </div>
      <div class="message-time">${timeString}</div>
    </div>
  `;
  
  // 添加到消息列表
  messageList.insertBefore(messageDiv, messageList.firstChild);
  
  // 清空表情选择
  reactionMap.clear();
  renderSelectedReactions();
  
  // 显示成功通知
  window.showNotification("评价已发送", "success");
}
