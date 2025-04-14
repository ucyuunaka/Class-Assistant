document.addEventListener("DOMContentLoaded", function () {
  // 初始化滚动动画
  initScrollAnimation(".animate-on-scroll", {
    threshold: 0.1,
    once: true,
  });

  // 初始化表单日期为当天
  const examDateInput = document.getElementById("examDate");
  if (examDateInput) {
    examDateInput.valueAsDate = new Date();
  }


  // 添加成绩表单显示/隐藏
  const addGradeBtn = document.getElementById("addGradeBtn");
  const addGradeForm = document.getElementById("addGradeForm");
  const cancelAddBtn = document.getElementById("cancelAddBtn");

  if (addGradeBtn && addGradeForm && cancelAddBtn) {
    addGradeBtn.addEventListener("click", function () {
      addGradeForm.style.display = "block";
      this.style.display = "none";
    });

    cancelAddBtn.addEventListener("click", function () {
      addGradeForm.style.display = "none";
      addGradeBtn.style.display = "inline-block";
    });
  }


  // 成绩表单提交
  const gradeForm = document.getElementById("gradeForm");
  if (gradeForm) {
      gradeForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // 在这里可以添加成绩数据处理和保存逻辑
        // 这里只是示例，实际应用中可能需要与后端交互

        // 模拟添加成绩到表格
        const subjectSelect = document.getElementById("subject");
        const examTypeSelect = document.getElementById("examType");
        const semesterSelect = document.getElementById("semester");
        const scoreInput = document.getElementById("score");
        const creditInput = document.getElementById("credit");
        const examDateInput = document.getElementById("examDate");
        const gradesTableBody = document.getElementById("gradesTableBody");


        if (!subjectSelect || !examTypeSelect || !semesterSelect || !scoreInput || !creditInput || !examDateInput || !gradesTableBody) {
            console.error("One or more form elements not found!");
            return;
        }

        const subject = subjectSelect.options[subjectSelect.selectedIndex].text;
        const examType = examTypeSelect.options[examTypeSelect.selectedIndex].text;
        const semester = semesterSelect.options[semesterSelect.selectedIndex].text;
        const score = scoreInput.value;
        const credit = creditInput.value;
        const examDate = examDateInput.value;

        // 创建新行
        const newRow = document.createElement("tr");

        // 设置评分样式
        let scoreClass = "score-poor";
        if (score >= 90) {
          scoreClass = "score-excellent";
        } else if (score >= 80) {
          scoreClass = "score-good";
        } else if (score >= 60) {
          scoreClass = "score-average";
        }

        // 添加行内容
        newRow.innerHTML = `
        <td>${subject}</td>
        <td>${examType}</td>
        <td>${semester}</td>
        <td><span class="score-badge ${scoreClass}">${score}</span></td>
        <td>${credit}</td>
        <td>${examDate}</td>
        <td>
          <button class="btn-icon"><i class="fas fa-edit"></i></button>
          <button class="btn-icon text-danger"><i class="fas fa-trash"></i></button>
        </td>
      `;

        // 插入表格
        gradesTableBody.prepend(newRow);

        // 重置表单和UI状态
        this.reset();
        if (examDateInput) {
            examDateInput.valueAsDate = new Date();
        }
        if (addGradeForm && addGradeBtn) {
            addGradeForm.style.display = "none";
            addGradeBtn.style.display = "inline-block";
        }

        // 重新计算统计信息和更新图表
        updateStatistics();
        renderCharts();
      });
  }


  // “导出成绩单”按钮功能提示
  const exportGradesBtn = document.querySelector('.btn i.fa-file-export')
  if (exportGradesBtn) {
    exportGradesBtn.closest('button').addEventListener('click', function() {
      alert('导出成绩单功能正在开发中...');
    });
  }

  // “筛选”按钮功能提示
  const filterBtn = document.querySelector('.btn i.fa-filter')
  if (filterBtn) {
    filterBtn.closest('button').addEventListener('click', function() {
      alert('筛选功能正在开发中...');
    });
  }

  // 初始化图表
  renderCharts();

  // 绘制所有图表
  function renderCharts() {
    renderTrendChart();
    renderSubjectChart();
    renderCompareChart();
  }        // 趋势图表
  function renderTrendChart() {
    const trendChartCtx = document.getElementById("trendChart");
    if (!trendChartCtx) return;
    const ctx = trendChartCtx.getContext("2d");

    // 更详细的历史数据
    const data = {
      labels: ["2022-2", "2023-1", "2023-2", "2024-1", "2024-2"],
      datasets: [
        {
          label: "GPA趋势",
          data: [3.2, 3.4, 3.6, 3.7, 3.85],
          borderColor: "#4285F4",
          backgroundColor: "rgba(66, 133, 244, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: "平均分",
          data: [78, 83, 87, 88, 92],
          borderColor: "#0F9D58",
          backgroundColor: "rgba(15, 157, 88, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: "课程数量",
          data: [4, 5, 7, 8, 12],
          borderColor: "#DB4437",
          backgroundColor: "rgba(219, 68, 55, 0.1)",
          borderWidth: 2,
          fill: false,
          tension: 0.2,
          borderDash: [5, 5],
          yAxisID: 'y1',
        },
      ],
    };

    new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
          },
          y1: {
              type: 'linear',
              display: true,
              position: 'right',
              grid: {
                  drawOnChartArea: false,
              },
              beginAtZero: true,
          }
        },
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }        // 科目分布图
  function renderSubjectChart() {
    const subjectChartCtx = document.getElementById("subjectChart");
    if (!subjectChartCtx) return;
    const ctx = subjectChartCtx.getContext("2d");

    const data = {
      labels: [
        "高等数学",
        "程序设计",
        "大学物理",
        "大学英语",
        "数据库原理",
        "操作系统",
        "计算机网络",
        "线性代数",
        "软件工程",
        "人工智能导论"
      ],
      datasets: [
        {
          data: [92, 98, 78, 88, 95, 73, 76, 85, 96, 93],
          backgroundColor: [
            "rgba(66, 133, 244, 0.7)",
            "rgba(15, 157, 88, 0.7)",
            "rgba(244, 160, 0, 0.7)",
            "rgba(219, 68, 55, 0.7)",
            "rgba(162, 63, 173, 0.7)",
            "rgba(83, 109, 254, 0.7)",
            "rgba(255, 138, 101, 0.7)",
            "rgba(46, 204, 113, 0.7)",
            "rgba(155, 89, 182, 0.7)",
            "rgba(26, 188, 156, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    };

    new Chart(ctx, {
      type: "radar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
            },
          },
        },
        plugins: {
            legend: {
                display: false
            }
        }
      },
    });
  }        // 比较图表
  function renderCompareChart() {
    const compareChartCtx = document.getElementById("compareChart");
    if (!compareChartCtx) return;
    const ctx = compareChartCtx.getContext("2d");

    const data = {
      labels: [
        "高等数学",
        "程序设计",
        "大学物理",
        "大学英语",
        "数据库原理",
        "操作系统",
        "计算机网络",
        "线性代数",
        "软件工程",
        "人工智能导论",
        "概率统计",
        "计算机图形学"
      ],
      datasets: [
        {
          label: "你的分数",
          data: [92, 98, 78, 88, 95, 73, 76, 85, 96, 93, 58, 89],
          backgroundColor: "rgba(66, 133, 244, 0.7)",
        },
        {
          label: "班级平均",
          data: [86, 85, 83, 90, 87, 79, 82, 80, 88, 84, 76, 85],
          backgroundColor: "rgba(244, 160, 0, 0.7)",
        },
        {
          label: "历史最高分",
          data: [98, 100, 95, 97, 99, 96, 94, 97, 100, 98, 93, 96],
          backgroundColor: "rgba(15, 157, 88, 0.7)",
          borderColor: "rgba(15, 157, 88, 1)",
          borderWidth: 1,
          type: 'line',
          fill: false
        }
      ],
    };

    new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }

  // 更新统计信息
  function updateStatistics() {
    // 在实际应用中，这里应该重新计算GPA和平均分
    // 这里只是简单示例，实际应用中可能需要更复杂的计算逻辑
    const totalCoursesElement = document.getElementById("total-courses");
    const gradesTableBody = document.getElementById("gradesTableBody");
    if (totalCoursesElement && gradesTableBody) {
        totalCoursesElement.textContent = gradesTableBody.getElementsByTagName("tr").length;
    }

  }

  // 更改GPA计算系统时更新显示
  const gpaSystemSelect = document.getElementById("gpaSystem");
  if (gpaSystemSelect) {
      gpaSystemSelect.addEventListener("change", function () {
        // 在实际应用中，这里应该根据所选系统重新计算并显示GPA
        // 这里只是示例
        alert(
          "已切换到" +
            this.options[this.selectedIndex].text +
            "计算方式，将重新计算GPA"
        );
        // Example: Recalculate and update GPA display
        // calculateAndDisplayGPA(this.value);
      });
  }

  // Optional: Function to calculate and display GPA based on selected system
  // function calculateAndDisplayGPA(systemValue) {
  //    console.log("Calculating GPA for system:", systemValue);
  //    // Add actual GPA calculation logic here
  //    const gpaValueElement = document.getElementById("gpa-value");
  //    if (gpaValueElement) {
  //        // Update the GPA value display based on calculation
  //        // gpaValueElement.textContent = calculatedGPA;
  //    }
  // }

});
