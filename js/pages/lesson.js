document.addEventListener("DOMContentLoaded", function () {
  // 初始化滚动动画并存储实例
  const scrollAnimation = initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });

  // DOM元素
  const emojiButton = document.getElementById("emojiButton");
  const emojiPickerContainer = document.getElementById(
    "emojiPickerContainer"
  );
  const emojiPicker = document.getElementById("emojiPicker");
  const selectedReactions = document.getElementById("selectedReactions");
  const courseSelect = document.getElementById("courseSelect");
  const sendButton = document.getElementById("sendButton");
  const messageList = document.getElementById("messageList");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const emptyState = document.getElementById("emptyState");

  // 选定的表情列表
  let selectedEmojis = [];

  // 表情选择器显示/隐藏
  emojiButton.addEventListener("click", function () {
    emojiPickerContainer.classList.toggle("visible");
  });

  // 点击其他地方关闭表情选择器
  document.addEventListener("click", function (e) {
    if (
      !emojiButton.contains(e.target) &&
      !emojiPickerContainer.contains(e.target)
    ) {
      emojiPickerContainer.classList.remove("visible");
    }
  });

  // 选择表情
  emojiPicker.addEventListener("emoji-click", (event) => {
    const emoji = event.detail.unicode;

    // 限制最多选择5个表情
    if (selectedEmojis.length < 5 && !selectedEmojis.includes(emoji)) {
      selectedEmojis.push(emoji);
      updateSelectedEmojis();
    }

    // 自动关闭选择器
    emojiPickerContainer.classList.remove("visible");
  });

  // 更新已选表情显示
  function updateSelectedEmojis() {
    selectedReactions.innerHTML = "";
    selectedEmojis.forEach((emoji, index) => {
      const tag = document.createElement("div");
      tag.className = "reaction-tag";
      tag.innerHTML = `
        <span class="reaction-tag-emoji">${emoji}</span>
        <span class="reaction-tag-text">点击删除</span>
      `;
      tag.addEventListener("click", () => {
        selectedEmojis.splice(index, 1);
        updateSelectedEmojis();
      });
      selectedReactions.appendChild(tag);
    });
  }

  // 发送评价
  sendButton.addEventListener("click", function () {    const course = courseSelect.value;
    if (!course) {
      window.showNotification("请选择一个课程", "warning");
      return;
    }    if (selectedEmojis.length === 0) {
      window.showNotification("请至少选择一个表情评价", "warning");
      return;
    }

    // 创建新的消息
    addNewMessage(course, selectedEmojis);
  });

  // 添加新消息
  function addNewMessage(course, emojis) {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(
      2,
      "0"
    )} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    // 从select选项获取课程分类
    const categoryOption = Array.from(courseSelect.options).find(
      (option) => option.value === course
    );
    const category = categoryOption
      ? categoryOption.dataset.category
      : "";

    // 创建消息HTML
    const messageEl = document.createElement("div");
    // 首先添加基本类名
    messageEl.className = "message sent";
    messageEl.dataset.course = course;
    messageEl.dataset.category = category;

    // 生成反应气泡HTML
    let reactionsHTML = "";
    emojis.forEach((emoji) => {
      reactionsHTML += `
        <div class="reaction-bubble" data-emoji="${emoji}">
          <span class="reaction-emoji">${emoji}</span>
          <span class="reaction-count">1</span>
        </div>
      `;
    });

    messageEl.innerHTML = `
      <div class="message-content">
        <div class="course-name">${course}</div>
        <div class="message-text">我的课程评价</div>
        <div class="message-reactions">
          ${reactionsHTML}
        </div>
        <div class="message-time">${timeStr}</div>
      </div>
    `;

    // 添加到列表最前面
    messageList.insertBefore(messageEl, messageList.firstChild);

    // 设置动画 - 确保在下一帧应用类，以便观察者可以检测到
    requestAnimationFrame(() => {
       messageEl.classList.add("animate-on-scroll", "fade-up");
       // 刷新滚动动画观察器以包含新元素
       if (scrollAnimation && scrollAnimation.refresh) {
         scrollAnimation.refresh();
       }
    });


    // 更新过滤状态
    updateFilter(
      document.querySelector(".filter-btn.active").dataset.filter
    );
  }

  // 课程过滤功能
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // 更新按钮激活状态
      filterButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // 应用过滤
      updateFilter(this.dataset.filter);
    });
  });

  // 更新过滤显示
  function updateFilter(filter) {
    const messages = document.querySelectorAll(".message");
    let visibleCount = 0;

    messages.forEach((msg) => {
      if (filter === "all" || msg.dataset.category === filter) {
        msg.style.display = "flex";
        visibleCount++;
      } else {
        msg.style.display = "none";
      }
    });

    // 更新空状态显示
    emptyState.style.display = visibleCount > 0 ? "none" : "block";
  }

  // 添加反应功能
  messageList.addEventListener("click", function (e) {
    const reactionBubble = e.target.closest(".reaction-bubble");
    if (reactionBubble) {
      const countEl = reactionBubble.querySelector(".reaction-count");
      let count = parseInt(countEl.textContent);
      count++;
      countEl.textContent = count;

      // 添加点击动画
      reactionBubble.style.transform = "scale(1.2)";
      setTimeout(() => {
        reactionBubble.style.transform = "";
      }, 200);
    }
  });

  // 长按消息显示快速反应选择器
  let pressTimer;

  messageList.addEventListener("mousedown", function (e) {
    const message = e.target.closest(".message");
    if (message) {
      pressTimer = setTimeout(() => {
        showQuickReactions(message);
      }, 500);
    }
  });

  messageList.addEventListener("mouseup", function () {
    clearTimeout(pressTimer);
  });

  messageList.addEventListener("mouseleave", function () {
    clearTimeout(pressTimer);
  });

  // 移动端支持
  messageList.addEventListener("touchstart", function (e) {
    const message = e.target.closest(".message");
    if (message) {
      pressTimer = setTimeout(() => {
        showQuickReactions(message);
      }, 500);
    }
  });

  messageList.addEventListener("touchend", function () {
    clearTimeout(pressTimer);
  });

  // 显示快速反应选择器
  function showQuickReactions(message) {
    // 移除所有现有的快速反应选择器
    document
      .querySelectorAll(".quick-reactions")
      .forEach((el) => el.remove());

    // 创建新的快速反应选择器
    const quickReactions = document.createElement("div");
    quickReactions.className = "quick-reactions";

    // 常用表情
    const commonEmojis = ["👍", "❤️", "😂", "🎉", "😢", "🔥", "👏", "🤔"];

    commonEmojis.forEach((emoji) => {
      const item = document.createElement("div");
      item.className = "quick-reaction-item";
      item.textContent = emoji;
      item.addEventListener("click", function () {
        // 检查是否已有该表情的反应
        let reactionBubble = Array.from(
          message.querySelectorAll(".reaction-bubble")
        ).find((bubble) => bubble.dataset.emoji === emoji);

        if (reactionBubble) {
          // 更新已有反应
          const countEl = reactionBubble.querySelector(".reaction-count");
          let count = parseInt(countEl.textContent);
          count++;
          countEl.textContent = count;
        } else {
          // 创建新反应
          const reactionsContainer =
            message.querySelector(".message-reactions");
          reactionBubble = document.createElement("div");
          reactionBubble.className = "reaction-bubble";
          reactionBubble.dataset.emoji = emoji;
          reactionBubble.innerHTML = `
            <span class="reaction-emoji">${emoji}</span>
            <span class="reaction-count">1</span>
          `;
          reactionsContainer.appendChild(reactionBubble);
        }

        // 移除选择器
        quickReactions.remove();
      });

      quickReactions.appendChild(item);
    });

    // 添加到消息元素
    message.appendChild(quickReactions);

    // 显示选择器
    setTimeout(() => {
      quickReactions.classList.add("visible");
    }, 10);

    // 点击其他地方关闭选择器
    function closeQuickReactions(e) {
      if (!quickReactions.contains(e.target)) {
        quickReactions.remove();
        document.removeEventListener("click", closeQuickReactions);
      }
    }

    setTimeout(() => {
      document.addEventListener("click", closeQuickReactions);
    }, 10);
  }

  // 初始过滤设置为"全部"
  updateFilter("all");
});
