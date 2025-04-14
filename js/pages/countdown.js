document.addEventListener("DOMContentLoaded", function () {
  // 初始化滚动动画
  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });

  let exams = Storage.get("exams", [
    {
      id: 1,
      name: "数据结构期末考试",
      subject: "数据结构与算法",
      date: "2025-04-17T09:00:00",
      location: "教学楼B-303",
      notes: "考试范围为教材第1-10章，开卷考试",
    },
    {
      id: 2,
      name: "计算机网络期中考试",
      subject: "计算机网络",
      date: "2025-04-22T14:00:00",
      location: "实验楼C-210",
      notes: "考试内容为TCP/IP协议和网络安全，闭卷考试",
    },
    {
      id: 3,
      name: "操作系统期末考试",
      subject: "操作系统原理",
      date: "2025-05-15T10:00:00",
      location: "教学楼A-501",
      notes: "考试范围全书，需重点复习进程管理和内存管理",
    },
  ]);

  // DOM Elements
  const countdownList = document.getElementById("countdown-list");
  const emptyState = document.getElementById("empty-state");
  const examModal = document.getElementById("exam-modal");
  const closeExamModalBtn = document.getElementById("close-exam-modal");
  const cancelExamBtn = document.getElementById("cancel-exam");
  const examForm = document.getElementById("exam-form");
  const modalTitle = document.getElementById("modal-title");
  const examIdInput = document.getElementById("exam-id");
  const addExamBtn = document.getElementById("add-exam-btn");
  const addExamEmptyBtn = document.getElementById("add-exam-empty");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const filterSelect = document.getElementById("filter-select");

  let countdownInterval;

  function saveExams() {
    Storage.save("exams", exams);
  }

  function getExamStatus(examDate) {
    const now = new Date();
    const diffDays = Math.ceil(
      (new Date(examDate) - now) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 0) return "past";
    if (diffDays <= 7) return "urgent";
    if (diffDays <= 30) return "upcoming";
    return "distant";
  }

  function getStatusInfo(status) {
    switch (status) {
      case "urgent":
        return {
          text: "紧急",
          class: "status-urgent",
          borderColor: "var(--danger-color)",
        };
      case "upcoming":
        return {
          text: "即将到来",
          class: "status-upcoming",
          borderColor: "var(--warning-color)",
        };
      case "distant":
        return {
          text: "较远",
          class: "status-distant",
          borderColor: "var(--success-color)",
        };
      case "past":
        return {
          text: "已结束",
          class: "status-past",
          borderColor: "var(--text-secondary)",
        }; // Style for past
      default:
        return { text: "", class: "", borderColor: "transparent" };
    }
  }

  function renderExamList(filteredExams) {
    countdownList.innerHTML = "";

    if (!filteredExams || filteredExams.length === 0) {
      emptyState.style.display = "block";
      countdownList.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    countdownList.style.display = "block";

    filteredExams.forEach((exam) => {
      const examDate = new Date(exam.date);
      const status = getExamStatus(exam.date);
      const statusInfo = getStatusInfo(status);

      const item = document.createElement("div");
      item.className = `countdown-item animate-on-scroll fade-up ${status}`;
      item.style.borderLeft = `4px solid ${statusInfo.borderColor}`;
      item.dataset.examId = exam.id;

      const countdownValues = calculateCountdown(examDate);

      const totalSpan = 60 * 24 * 60 * 60 * 1000;
      const timeRemaining = Math.max(0, examDate - new Date());
      const progressPercent = Math.max(
        0,
        Math.min(100, (1 - timeRemaining / totalSpan) * 100)
      );

      item.innerHTML = `
        <div class="status-badge ${statusInfo.class}">${
        statusInfo.text
      }</div>
        <div class="countdown-main">
          <h3 class="countdown-title">${exam.name}</h3>
          <div class="countdown-details">
            <div><span class="countdown-detail-label">科目：</span>${
              exam.subject || "N/A"
            }</div>
            <div><span class="countdown-detail-label">时间：</span>${formatDate(
              examDate,
              "YYYY年MM月DD日 HH:mm"
            )}</div>
            <div><span class="countdown-detail-label">地点：</span>${
              exam.location || "N/A"
            }</div>
            <div><span class="countdown-detail-label">备注：</span>${
              exam.notes || "无"
            }</div>
          </div>
          <div class="countdown-actions">
            <button class="btn btn-outline edit-btn"><i class="fas fa-edit"></i> 编辑</button>
            <button class="btn btn-outline delete-btn" style="color: var(--danger-color)"><i class="fas fa-trash"></i> 删除</button>
          </div>
        </div>
        <div class="countdown-display ${
          status === "past" ? "past-exam" : ""
        }">
           ${
             status !== "past"
               ? `
          <div class="countdown-label">距离考试还剩</div>
          <div class="countdown-timer">
            <div class="countdown-unit">
              <div class="countdown-value days">${
                countdownValues.days
              }</div>
              <div class="countdown-unit-label">天</div>
            </div>
            <div class="countdown-unit">
              <div class="countdown-value hours">${String(
                countdownValues.hours
              ).padStart(2, "0")}</div>
              <div class="countdown-unit-label">时</div>
            </div>
            <div class="countdown-unit">
              <div class="countdown-value minutes">${String(
                countdownValues.minutes
              ).padStart(2, "0")}</div>
              <div class="countdown-unit-label">分</div>
            </div>
            <div class="countdown-unit">
              <div class="countdown-value seconds">${String(
                countdownValues.seconds
              ).padStart(2, "0")}</div>
              <div class="countdown-unit-label">秒</div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          `
               : `
          <div class="countdown-label">考试已结束</div>
           <div style="font-size: 2rem; color: var(--text-secondary); margin-top: 1rem;"><i class="fas fa-check-circle"></i></div>
          `
           }
        </div>
      `;
      countdownList.appendChild(item);
    });

    initScrollAnimation(".animate-on-scroll", {
      threshold: 0.1,
      once: true,
    });

    countdownList.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = e.target.closest(".countdown-item").dataset.examId;
        openEditExamModal(parseInt(itemId));
      });
    });
    countdownList.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = e.target.closest(".countdown-item").dataset.examId;
        deleteExam(parseInt(itemId));
      });
    });

    startCountdownTimer();
  }

  function updateCountdowns() {
    const items = countdownList.querySelectorAll(".countdown-item");
    items.forEach((item) => {
      const examId = parseInt(item.dataset.examId);
      const exam = exams.find((e) => e.id === examId);
      if (!exam || getExamStatus(exam.date) === "past") return; // Skip if not found or past

      const examDate = new Date(exam.date);
      const countdownValues = calculateCountdown(examDate);

      const daysEl = item.querySelector(".countdown-value.days");
      const hoursEl = item.querySelector(".countdown-value.hours");
      const minutesEl = item.querySelector(".countdown-value.minutes");
      const secondsEl = item.querySelector(".countdown-value.seconds");

      if (daysEl) daysEl.textContent = countdownValues.days;
      if (hoursEl)
        hoursEl.textContent = String(countdownValues.hours).padStart(
          2,
          "0"
        );
      if (minutesEl)
        minutesEl.textContent = String(countdownValues.minutes).padStart(
          2,
          "0"
        );
      if (secondsEl)
        secondsEl.textContent = String(countdownValues.seconds).padStart(
          2,
          "0"
        );

      const progressBar = item.querySelector(".progress-fill");
      if (progressBar) {
        const totalSpan = 60 * 24 * 60 * 60 * 1000;
        const timeRemaining = Math.max(0, examDate - new Date());
        const progressPercent = Math.max(
          0,
          Math.min(100, (1 - timeRemaining / totalSpan) * 100)
        );
        progressBar.style.width = `${progressPercent}%`;
      }
    });
  }

  function startCountdownTimer() {
    clearInterval(countdownInterval);
    updateCountdowns();
    countdownInterval = setInterval(updateCountdowns, 1000);
  }

  function openAddExamModal() {
    modalTitle.textContent = "添加考试";
    examIdInput.value = "";
    examForm.reset();
    // Default date/time
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    document.getElementById("exam-date").value = formatDate(
      defaultDate,
      "YYYY-MM-DD"
    );
    document.getElementById("exam-time").value = "09:00";
    examModal.style.display = "flex";
  }

  function openEditExamModal(examId) {
    const exam = exams.find((e) => e.id === examId);
    if (!exam) return;

    modalTitle.textContent = "编辑考试";
    examIdInput.value = exam.id;

    document.getElementById("exam-name").value = exam.name;
    document.getElementById("exam-subject").value = exam.subject || "";
    const examDate = new Date(exam.date);
    document.getElementById("exam-date").value = formatDate(
      examDate,
      "YYYY-MM-DD"
    );
    document.getElementById("exam-time").value = formatDate(
      examDate,
      "HH:mm"
    );
    document.getElementById("exam-location").value = exam.location || "";
    document.getElementById("exam-notes").value = exam.notes || "";

    examModal.style.display = "flex";
  }

  function closeExamModal() {
    examModal.style.display = "none";
  }

  addExamBtn.addEventListener("click", openAddExamModal);
  addExamEmptyBtn.addEventListener("click", openAddExamModal);
  closeExamModalBtn.addEventListener("click", closeExamModal);
  cancelExamBtn.addEventListener("click", closeExamModal);
  window.addEventListener("click", (event) => {
    if (event.target === examModal) closeExamModal();
  });

  examForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const examId = examIdInput.value;
    const examDateStr = document.getElementById("exam-date").value;
    const examTimeStr = document.getElementById("exam-time").value;
    const examDateTime = new Date(`${examDateStr}T${examTimeStr}`);

    const examData = {
      name: document.getElementById("exam-name").value,
      subject: document.getElementById("exam-subject").value,
      date: examDateTime.toISOString(),
      location: document.getElementById("exam-location").value,
      notes: document.getElementById("exam-notes").value,
    };

    if (examId) {
      const index = exams.findIndex((e) => e.id === parseInt(examId));
      if (index !== -1) {
        exams[index] = { ...exams[index], ...examData };
        showNotification("考试信息已更新", "success");
      }
    } else {
      examData.id =
        exams.length > 0 ? Math.max(...exams.map((e) => e.id)) + 1 : 1;
      exams.push(examData);
      showNotification("考试已成功添加", "success");
    }

    saveExams();
    applyFiltersAndSort();
    closeExamModal();
  });

  window.deleteExam = function (examId) {
    if (confirm("确定要删除这个考试吗？")) {
      exams = exams.filter((e) => e.id !== examId);
      saveExams();
      showNotification("考试已成功删除", "info");
      applyFiltersAndSort(); // Re-render the list
    }
  };

  function applyFiltersAndSort() {
    let processedExams = [...exams];
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const sortValue = sortSelect.value;

    if (searchTerm) {
      processedExams = processedExams.filter(
        (exam) =>
          exam.name.toLowerCase().includes(searchTerm) ||
          (exam.subject &&
            exam.subject.toLowerCase().includes(searchTerm)) ||
          (exam.location &&
            exam.location.toLowerCase().includes(searchTerm))
      );
    }

    if (filterValue !== "all") {
      if (filterValue === "past") {
        // Handle 'past' filter
        processedExams = processedExams.filter(
          (exam) => getExamStatus(exam.date) === "past"
        );
      } else {
        processedExams = processedExams.filter(
          (exam) => getExamStatus(exam.date) === filterValue
        );
      }
    }

    processedExams.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      switch (sortValue) {
        case "date-asc":
          return dateA - dateB;
        case "date-desc":
          return dateB - dateA;
        case "name-asc":
          return a.name.localeCompare(b.name, "zh-CN");
        case "name-desc":
          return b.name.localeCompare(a.name, "zh-CN");
        default:
          return 0;
      }
    });

    renderExamList(processedExams);
  }

  searchInput.addEventListener(
    "input",
    debounce(applyFiltersAndSort, 300)
  );
  sortSelect.addEventListener("change", applyFiltersAndSort);
  filterSelect.addEventListener("change", applyFiltersAndSort);

  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });
  applyFiltersAndSort();

  const pastOption = document.createElement("option");
  pastOption.value = "past";
  pastOption.textContent = "已结束";
  filterSelect.appendChild(pastOption);
});
