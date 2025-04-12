document.addEventListener("DOMContentLoaded", function () {
  // 初始化滚动动画
  if (typeof initScrollAnimation === "function") {
    initScrollAnimation(".animate-on-scroll", {
      threshold: 0.1,
      once: true,
    });
  } else {
    console.error("initScrollAnimation function not found.");
  }

  // --- 基本信息编辑 ---
  const editBasicInfoBtn = document.getElementById("edit-basic-info");
  const saveBasicInfoBtn = document.getElementById("save-basic-info");
  const cancelBasicInfoBtn = document.getElementById("cancel-basic-info");
  const saveBasicInfoBtnGroup = document.getElementById(
    "save-basic-info-btn-group"
  );
  const basicInfoInputs = document.querySelectorAll("#basic-info-form input");

  // 保存原始值，用于取消时恢复
  const originalBasicInfoValues = {};

  if (editBasicInfoBtn) {
    editBasicInfoBtn.addEventListener("click", function () {
      // 启用输入框
      basicInfoInputs.forEach((input) => {
        originalBasicInfoValues[input.id] = input.value;
        input.disabled = false;
      });

      // 显示保存按钮
      if (saveBasicInfoBtnGroup) saveBasicInfoBtnGroup.style.display = "block";
      // 隐藏编辑按钮
      if (editBasicInfoBtn) editBasicInfoBtn.style.display = "none";
    });
  }

  if (cancelBasicInfoBtn) {
    cancelBasicInfoBtn.addEventListener("click", function () {
      // 恢复原始值并禁用输入框
      basicInfoInputs.forEach((input) => {
        input.value = originalBasicInfoValues[input.id] || ""; // Use fallback if original value wasn't saved
        input.disabled = true;
      });

      // 隐藏保存按钮
      if (saveBasicInfoBtnGroup) saveBasicInfoBtnGroup.style.display = "none";
      // 显示编辑按钮
      if (editBasicInfoBtn) editBasicInfoBtn.style.display = "block";
    });
  }

  if (saveBasicInfoBtn) {
    saveBasicInfoBtn.addEventListener("click", function () {
      // 在实际应用中，这里会发送数据到服务器

      // 禁用输入框
      basicInfoInputs.forEach((input) => {
        input.disabled = true;
      });

      // 隐藏保存按钮
      if (saveBasicInfoBtnGroup) saveBasicInfoBtnGroup.style.display = "none";
      // 显示编辑按钮
      if (editBasicInfoBtn) editBasicInfoBtn.style.display = "block";

      // 更新用户名显示
      const userNameElement = document.querySelector(".user-name");
      const fullNameInput = document.getElementById("full-name");
      if (userNameElement && fullNameInput) {
        userNameElement.textContent = fullNameInput.value;
      }


      // 显示成功消息
      displaySaveMessage("基本信息已更新"); // Use notification
    });
  }

  // 教育经历编辑
  const editEducationBtn = document.getElementById("edit-education");
  const saveEducationBtn = document.getElementById("save-education");
  const cancelEducationBtn = document.getElementById("cancel-education");
  const saveEducationBtnGroup = document.getElementById(
    "save-education-btn-group"
  );
  const educationInputs = document.querySelectorAll("#education-form input");

  // 保存原始值，用于取消时恢复
  const originalEducationValues = {};

  if (editEducationBtn) {
    editEducationBtn.addEventListener("click", function () {
      // 启用输入框
      educationInputs.forEach((input) => {
        originalEducationValues[input.id] = input.value;
        input.disabled = false;
      });

      // 显示保存按钮
      if (saveEducationBtnGroup) saveEducationBtnGroup.style.display = "block";
      // 隐藏编辑按钮
      if (editEducationBtn) editEducationBtn.style.display = "none";
    });
  }

  if (cancelEducationBtn) {
    cancelEducationBtn.addEventListener("click", function () {
      // 恢复原始值并禁用输入框
      educationInputs.forEach((input) => {
        input.value = originalEducationValues[input.id] || ""; // Use fallback
        input.disabled = true;
      });

      // 隐藏保存按钮
      if (saveEducationBtnGroup) saveEducationBtnGroup.style.display = "none";
      // 显示编辑按钮
      if (editEducationBtn) editEducationBtn.style.display = "block";
    });
  }

  if (saveEducationBtn) {
    saveEducationBtn.addEventListener("click", function () {
      // 在实际应用中，这里会发送数据到服务器

      // 禁用输入框
      educationInputs.forEach((input) => {
        input.disabled = true;
      });

      // 隐藏保存按钮
      if (saveEducationBtnGroup) saveEducationBtnGroup.style.display = "none";
      // 显示编辑按钮
      if (editEducationBtn) editEducationBtn.style.display = "block";

      // 显示成功消息
      displaySaveMessage("教育经历已更新"); // Use notification
    });
  }

  // 头像上传
  const avatarInput = document.getElementById("avatar-input");
  const userAvatar = document.getElementById("user-avatar");

  if (avatarInput && userAvatar) {
    avatarInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          userAvatar.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 修改密码
  const changePasswordBtn = document.getElementById("change-password-btn");
  // const passwordModal = document.getElementById("password-modal"); // Removed: Element doesn't exist
  // const closePasswordModal = document.getElementById( // Removed: Element doesn't exist
  //   "close-password-modal"
  // );
  // const cancelPasswordBtn = document.getElementById("cancel-password"); // Removed: Element doesn't exist
  // const passwordForm = document.getElementById("password-form"); // Removed: Element doesn't exist

  // 打开密码模态框 (Replaced with notification)
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", function () {
      // passwordModal.style.display = "flex"; // Removed
      showNotification("“修改密码”功能暂未实现", "info"); // Added notification
    });
  }

  // // 关闭密码模态框 (Removed: No modal)
  // function closePasswordModal() {
  //   passwordModal.style.display = "none";
  //   passwordForm.reset();
  // }

  // closePasswordModal.addEventListener("click", closePasswordModal); // Removed
  // cancelPasswordBtn.addEventListener("click", closePasswordModal); // Removed

  // // 点击外部关闭模态框 (Removed: No modal/form)
  // window.addEventListener("click", function (event) {
  //   if (event.target === passwordModal) {
  //     closePasswordModal();
  //   }
  // });

  // // 密码表单提交 (Removed: No modal/form)
  // passwordForm.addEventListener("submit", function (e) {
  //   e.preventDefault();

  //   const currentPassword =
  //     document.getElementById("current-password").value;
  //   const newPassword = document.getElementById("new-password").value;
  //   const confirmPassword = document.getElementById("confirm-password").value;

  //   // 基本验证
  //   if (newPassword !== confirmPassword) {
  //     showNotification("新密码和确认密码不匹配", "error");
  //     return;
  //   }
  //   if (newPassword.length < 6) {
  //     showNotification("新密码长度至少为6位", "warning");
  //     return;
  //   }

  //   // 在实际应用中，这里会发送请求到服务器验证当前密码并更新
  //   console.log("Current:", currentPassword, "New:", newPassword);

  //   // 模拟成功
  //   showNotification("密码修改成功", "success");
  //   closePasswordModal(); // 关闭模态框
  // });

  // 更换手机号
  const changePhoneBtn = document.getElementById("change-phone-btn");
  if (changePhoneBtn) {
    changePhoneBtn.addEventListener("click", function () {
      showNotification("“更换手机”功能暂未实现", "info");
    });
  }

  // Helper function to use showNotification if available
  function displaySaveMessage(message, type = "success") {
    if (typeof showNotification === "function") {
      showNotification(message, type);
    } else {
      alert(message); // Fallback if showNotification is not loaded
    }
  }

  // Ensure showNotification is defined globally or imported if needed
  // Example: Assuming showNotification is defined in main.js or similar
  // Make sure main.js is loaded before profile.js
});
