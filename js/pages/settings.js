document.addEventListener("DOMContentLoaded", function () {
  // 初始化滚动动画
  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });

  // 字体大小控制
  const decreaseFontBtn = document.getElementById("decrease-font");
  const resetFontBtn = document.getElementById("reset-font");
  const increaseFontBtn = document.getElementById("increase-font");

  // 获取当前字体大小缩放比例
  let fontScale = parseFloat(localStorage.getItem("fontScale") || "1");

  // 应用字体大小
  applyFontSize(fontScale);

  decreaseFontBtn.addEventListener("click", function () {
    if (fontScale > 0.8) {
      fontScale -= 0.1;
      applyFontSize(fontScale);
    }
  });

  resetFontBtn.addEventListener("click", function () {
    fontScale = 1;
    applyFontSize(fontScale);
  });

  increaseFontBtn.addEventListener("click", function () {
    if (fontScale < 1.5) {
      fontScale += 0.1;
      applyFontSize(fontScale);
    }
  });

  // 应用字体大小
  function applyFontSize(scale) {
    document.documentElement.style.fontSize = `${scale}rem`;
    localStorage.setItem("fontScale", scale.toString());
  }

  // 语言切换
  const languageOptions = document.querySelectorAll(".language-option");

  languageOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const language = this.getAttribute("data-lang");

      // 移除所有活动类
      languageOptions.forEach((opt) => opt.classList.remove("active"));

      // 添加活动类到当前选择
      this.classList.add("active");

      // 存储语言偏好      localStorage.setItem("language", language);

      // 显示切换提示
      window.showNotification(
        `界面语言已切换为${language === "zh" ? "中文" : "English"}`,
        "success"
      );

      // 实际项目中这里会调用翻译函数
      // Translator.setLanguage(language);
    });
  });

  // 初始化确认弹窗
  const confirmModal = document.getElementById("confirm-modal");
  const closeConfirmModal = document.getElementById(
    "close-confirm-modal"
  );
  const cancelAction = document.getElementById("cancel-action");
  const confirmAction = document.getElementById("confirm-action");
  const confirmTitle = document.getElementById("confirm-title");
  const confirmMessage = document.getElementById("confirm-message");

  // 关闭确认弹窗
  function closeModal() {
    confirmModal.style.display = "none";
  }

  closeConfirmModal.addEventListener("click", closeModal);
  cancelAction.addEventListener("click", closeModal);

  // 点击外部关闭弹窗
  window.addEventListener("click", function (event) {
    if (event.target === confirmModal) {
      closeModal();
    }
  });

  // 清除数据按钮事件
  document
    .getElementById("clear-schedule-data")
    .addEventListener("click", function () {
      showConfirmModal(
        "清除课表数据",
        "您确定要清除所有课表数据吗？此操作无法撤销。",
        function () {
          // 清除课表数据
          localStorage.removeItem("courses");
          window.showNotification("课表数据已清除", "success");
        }
      );    });

  document
    .getElementById("clear-exams-data")
    .addEventListener("click", function () {
      showConfirmModal(
        "清除考试数据",
        "您确定要清除所有考试数据吗？此操作无法撤销。",
        function () {
          // 清除考试数据
          localStorage.removeItem("exams");
          window.showNotification("考试数据已清除", "success");
        }
      );
    });

  document
    .getElementById("clear-all-data")
    .addEventListener("click", function () {
      showConfirmModal(
        "清除所有数据",
        "您确定要清除所有数据吗？此操作将清除课表、考试、个人资料等所有数据，且无法撤销。",
        function () {
          // 保存当前主题和语言设置
          const theme = localStorage.getItem("theme");
          const language = localStorage.getItem("language");

          // 清除所有数据
          localStorage.clear();

          // 恢复主题和语言设置
          if (theme) localStorage.setItem("theme", theme);
          if (language) localStorage.setItem("language", language);

          window.showNotification("所有数据已清除", "success");
        }
      );
    });

  // 显示确认弹窗
  function showConfirmModal(title, message, callback) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmModal.style.display = "flex";

    // 移除之前的事件监听器
    confirmAction.replaceWith(confirmAction.cloneNode(true));

    // 添加新的确认操作
    document
      .getElementById("confirm-action")
      .addEventListener("click", function () {
        callback();
        closeModal();
      });
  }

  // 备份数据
  document
    .getElementById("backup-data")
    .addEventListener("click", function () {
      const backupData = {
        courses: localStorage.getItem("courses"),
        exams: localStorage.getItem("exams"),
        profile: localStorage.getItem("profile"),
        settings: {
          theme: localStorage.getItem("theme"),
          language: localStorage.getItem("language"),
          fontScale: localStorage.getItem("fontScale"),
          notifications: {
            course: document.getElementById("course-notification")
              .checked,
            exam: document.getElementById("exam-notification").checked,
            reminderTime: document.getElementById("reminder-time").value,
          },
        },
        backupDate: new Date().toISOString(),
      };

      // 创建并下载备份文件
      const blob = new Blob([JSON.stringify(backupData)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `class-assistant-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      window.showNotification("数据备份已下载", "success");
    });

  // 恢复数据
  const restoreInput = document.getElementById("restore-input");
  restoreInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const backupData = JSON.parse(event.target.result);

        // 验证备份文件格式
        if (backupData && backupData.backupDate) {
          // 恢复数据
          if (backupData.courses) {
            localStorage.setItem("courses", backupData.courses);
          }
          if (backupData.exams) {
            localStorage.setItem("exams", backupData.exams);
          }
          if (backupData.profile) {
            localStorage.setItem("profile", backupData.profile);
          }

          // 恢复设置
          if (backupData.settings) {
            if (backupData.settings.theme) {
              localStorage.setItem("theme", backupData.settings.theme);
              document.body.setAttribute(
                "data-theme",
                backupData.settings.theme
              );
              // Assuming themeToggle exists and is handled elsewhere (e.g., themes.js)
              // themeToggle.checked = backupData.settings.theme === "dark";
            }

            if (backupData.settings.language) {
              localStorage.setItem(
                "language",
                backupData.settings.language
              );
              languageOptions.forEach((opt) => {
                opt.classList.toggle(
                  "active",
                  opt.getAttribute("data-lang") ===
                    backupData.settings.language
                );
              });
            }

            if (backupData.settings.fontScale) {
              fontScale = parseFloat(backupData.settings.fontScale);
              applyFontSize(fontScale);
            }

            if (backupData.settings.notifications) {
              document.getElementById("course-notification").checked =
                backupData.settings.notifications.course !== false;
              document.getElementById("exam-notification").checked =
                backupData.settings.notifications.exam !== false;

              if (backupData.settings.notifications.reminderTime) {
                document.getElementById("reminder-time").value =
                  backupData.settings.notifications.reminderTime;
              }
            }
          }

          window.showNotification("数据已成功恢复", "success");

          // 重置文件输入
          restoreInput.value = "";
        } else {
          throw new Error("Invalid backup format");
        }
      } catch (e) {
        window.showNotification("无效的备份文件", "error");
      }
    };
    reader.readAsText(file);
  });

  // 检查更新按钮
  document
    .getElementById("check-updates")
    .addEventListener("click", function () {
      window.showNotification("您已经在使用最新版本 (1.0.0)", "success");
    });

  // 移除备注中的showNotification函数注释
  // 这是不再需要的，因为我们现在使用全局通知组件
});
