/**
 * 课表数据
 * 包含课程信息、时间段和星期数据
 * 适用于智能工程学院的课程安排
 */

// 导出课表数据
export const scheduleData = {
  courses: [
    {
      id: 1,
      title: "人工智能导论",
      teacher: "张教授",
      location: "智能楼101",
      color: "course-computer",
      day: 1,
      startTime: 1,
      endTime: 2,
    },
    {
      id: 2,
      title: "高等工程数学",
      teacher: "李教授",
      location: "理学楼201",
      color: "course-math",
      day: 3,
      startTime: 1,
      endTime: 2,
    },
    {
      id: 3,
      title: "数据结构与算法",
      teacher: "郑教授",
      location: "智能楼301",
      color: "course-computer",
      day: 4,
      startTime: 1,
      endTime: 2,
    },
    {
      id: 4,
      title: "线性代数",
      teacher: "王教授",
      color: "course-math",
      location: "理学楼202",
      day: 5,
      startTime: 1,
      endTime: 2,
    },
    {
      id: 5,
      title: "机器学习基础",
      teacher: "吴教授",
      location: "智能楼205",
      color: "course-computer",
      day: 2,
      startTime: 3,
      endTime: 4,
    },
    {
      id: 6,
      title: "工程物理",
      teacher: "刘教授",
      location: "理学楼207",
      color: "course-physics",
      day: 4,
      startTime: 3,
      endTime: 4,
    },
    {
      id: 7,
      title: "算法分析与设计",
      teacher: "杨教授",
      location: "智能楼304",
      color: "course-computer",
      day: 5,
      startTime: 3,
      endTime: 4,
    },
    {
      id: 8,
      title: "智能系统设计",
      teacher: "黄教授",
      location: "智能楼302",
      color: "course-computer",
      day: 1,
      startTime: 5,
      endTime: 6,
    },
    {
      id: 9,
      title: "神经网络与深度学习",
      teacher: "陈教授",
      location: "智能楼470",
      color: "course-computer",
      day: 2,
      startTime: 5,
      endTime: 6,
    },
    {
      id: 10,
      title: "传感器技术基础",
      teacher: "赵教授",
      location: "工学院526",
      color: "course-computer",
      day: 3,
      startTime: 5,
      endTime: 6,
    },
    {
      id: 11,
      title: "嵌入式系统",
      teacher: "林教授",
      location: "智能楼202",
      color: "course-computer",
      day: 5,
      startTime: 5,
      endTime: 6,
    },
    {
      id: 12,
      title: "智能机器人实践",
      teacher: "张指导",
      location: "创新实验室",
      color: "course-sports",
      day: 6,
      startTime: 3,
      endTime: 4,
    },
    {
      id: 13,
      title: "工程英语沟通",
      teacher: "Smith教授",
      location: "外语楼206",
      color: "course-english",
      day: 3,
      startTime: 7,
      endTime: 8,
    },
    {
      id: 14,
      title: "自动控制原理",
      teacher: "罗教授",
      location: "智能楼204",
      color: "course-computer",
      day: 4,
      startTime: 7,
      endTime: 8,
    },
    {
      id: 15,
      title: "专业英语写作",
      teacher: "Johnson教授",
      location: "外语楼208",
      color: "course-english",
      day: 5,
      startTime: 7,
      endTime: 8,
    },
    {
      id: 16,
      title: "人机交互设计",
      teacher: "周教授",
      location: "智能楼306",
      color: "course-computer",
      day: 1,
      startTime: 3,
      endTime: 4,
    },
    {
      id: 17,
      title: "概率论与数理统计",
      teacher: "钱教授",
      location: "理学楼203",
      color: "course-math",
      day: 2,
      startTime: 1,
      endTime: 2,
    },
    {
      id: 18,
      title: "智能优化算法",
      teacher: "孙教授",
      location: "智能楼305",
      color: "course-computer",
      day: 1,
      startTime: 9,
      endTime: 10,
    },
    {
      id: 19,
      title: "深度学习架构",
      teacher: "吴教授",
      location: "智能楼470",
      color: "course-computer",
      day: 2,
      startTime: 9,
      endTime: 10,
    },
    {
      id: 20,
      title: "图像处理与分析",
      teacher: "林教授",
      location: "智能楼470",
      color: "course-computer",
      day: 3,
      startTime: 9,
      endTime: 10,
    },
    {
      id: 21,
      title: "计算机视觉",
      teacher: "陈教授",
      location: "智能楼470",
      color: "course-computer",
      day: 4,
      startTime: 9,
      endTime: 10,
    },
    {
      id: 22,
      title: "智能机器人导论",
      teacher: "赵教授",
      location: "智能楼305",
      color: "course-physics",
      day: 5,
      startTime: 9,
      endTime: 10,
    },
    {
      id: 23,
      title: "创新创业实践",
      teacher: "创业导师团队",
      location: "创业中心",
      color: "course-sports",
      day: 7,
      startTime: 5,
      endTime: 6,
    },
    {
      id: 24,
      title: "智能硬件设计",
      teacher: "郭教授",
      location: "智能楼401",
      color: "course-computer",
      day: 2,
      startTime: 7,
      endTime: 8,
    },
    {
      id: 25,
      title: "强化学习",
      teacher: "马教授",
      location: "智能楼308",
      color: "course-computer",
      day: 4,
      startTime: 5,
      endTime: 6,
    },
    {
      id: 26,
      title: "智能机器人社团",
      teacher: "学生活动",
      location: "创新实验室",
      color: "course-sports",
      day: 6,
      startTime: 5,
      endTime: 6,
    },
  ],
  timePeriods: [
    { id: 1, time: "08:00-08:45" },
    { id: 2, time: "08:55-09:40" },
    { id: 3, time: "10:10-10:55" },
    { id: 4, time: "11:05-11:50" },
    { id: 5, time: "14:20-15:05" },
    { id: 6, time: "15:15-16:00" },
    { id: 7, time: "16:30-17:15" },
    { id: 8, time: "17:25-18:10" },
    { id: 9, time: "19:00-19:45" },
    { id: 10, time: "19:55-20:40" },
    { id: 11, time: "20:50-21:35" },
  ],
  days: [
    { id: 1, name: "周一" },
    { id: 2, name: "周二" },
    { id: 3, name: "周三" },
    { id: 4, name: "周四" },
    { id: 5, name: "周五" },
    { id: 6, name: "周六" },
    { id: 7, name: "周日" },
  ],
};

// 本地存储的键名
const STORAGE_KEY = 'classroom-assistant-schedule';

// 从本地存储加载数据
export function loadScheduleFromStorage() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // 更新课程数据
      if (parsedData.courses && Array.isArray(parsedData.courses)) {
        scheduleData.courses = parsedData.courses;
      }
      
      return true;
    }
  } catch (error) {
    console.error('从本地存储加载课表数据失败:', error);
  }
  
  return false;
}

// 保存数据到本地存储
export function saveScheduleToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      courses: scheduleData.courses
    }));
    return true;
  } catch (error) {
    console.error('保存课表数据到本地存储失败:', error);
    return false;
  }
}

// 提供添加课程的方法
export function addCourse(courseData) {
  // 生成新的课程ID
  const newId = scheduleData.courses.length > 0
    ? Math.max(...scheduleData.courses.map(c => c.id)) + 1
    : 1;
  
  // 创建新课程对象
  const newCourse = {
    id: newId,
    ...courseData
  };
  
  // 添加到课程列表
  scheduleData.courses.push(newCourse);
  
  // 保存到本地存储
  saveScheduleToStorage();
  
  return newCourse;
}

// 提供删除课程的方法 - 增强版
export function deleteCourse(courseId) {
  try {
    // 确保courseId是数字
    const idToDelete = parseInt(courseId);
    if (isNaN(idToDelete)) {
      console.error('无效的课程ID:', courseId);
      return false;
    }

    const initialLength = scheduleData.courses.length;
    
    // 使用严格比较
    scheduleData.courses = scheduleData.courses.filter(course => {
      return course.id !== idToDelete;
    });
    
    // 检查是否真的删除了课程
    const success = scheduleData.courses.length < initialLength;
    if (success) {
      // 保存前再次验证
      const stillExists = scheduleData.courses.some(c => c.id === idToDelete);
      if (!stillExists) {
        saveScheduleToStorage();
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('删除课程失败:', error);
    return false;
  }
}

// 提供清空课程的方法
export function clearCourses() {
  scheduleData.courses = [];
  
  // 保存到本地存储
  saveScheduleToStorage();
}

// 提供更新课程的方法
export function updateCourse(courseId, updatedData) {
  const courseIndex = scheduleData.courses.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) return false;
  
  // 保留原有ID和其他必要字段
  scheduleData.courses[courseIndex] = {
    ...scheduleData.courses[courseIndex],
    ...updatedData,
    id: courseId // 确保ID不会被覆盖
  };
  
  // 保存到本地存储
  saveScheduleToStorage();
  
  return true;
}

// 提供移动课程的方法 - 增加详细调试信息
export function moveCourse(courseId, newDay, newStartTime) {
  console.log('==== 课程移动请求 ====', { courseId, newDay, newStartTime });
  
  // 1. 基本参数验证
  courseId = parseInt(courseId);
  newDay = parseInt(newDay);
  newStartTime = parseInt(newStartTime);
  
  // 检查参数有效性
  if (isNaN(courseId) || isNaN(newDay) || isNaN(newStartTime)) {
    console.error('移动课程失败: 无效的参数', { courseId, newDay, newStartTime });
    return false;
  }
  
  // 查找课程
  const courseIndex = scheduleData.courses.findIndex(course => course.id === courseId);
  if (courseIndex === -1) {
    console.error('移动课程失败: 找不到课程', courseId);
    return false;
  }
  
  // 获取当前课程信息
  const currentCourse = scheduleData.courses[courseIndex];
  console.log('当前课程信息:', {
    id: currentCourse.id,
    title: currentCourse.title,
    day: currentCourse.day,
    startTime: currentCourse.startTime,
    endTime: currentCourse.endTime,
    duration: currentCourse.endTime - currentCourse.startTime
  });
  
  // 计算课程占用的格子数量
  const courseDuration = currentCourse.endTime - currentCourse.startTime;
  
  // 2. 边界检查
  // 检查日期范围 (1-7)
  if (newDay < 1 || newDay > 7) {
    console.error('移动课程失败: 日期超出范围', newDay);
    return false;
  }
  
  // 检查时间范围
  console.log('时间范围检查:', { 
    newStartTime, 
    timePeriods: scheduleData.timePeriods.length,
    isValid: newStartTime >= 1 && newStartTime <= scheduleData.timePeriods.length 
  });
  
  if (newStartTime < 1 || newStartTime > scheduleData.timePeriods.length) {
    console.error('移动课程失败: 开始时间超出范围', newStartTime);
    return false;
  }
  
  // 计算新的结束时间
  const newEndTime = newStartTime + courseDuration;
  console.log('新位置信息:', { 
    newDay, 
    newStartTime, 
    courseDuration,
    newEndTime,
    timePeriods: scheduleData.timePeriods.length
  });
  
  // 检查新的结束时间是否超出范围
  if (newEndTime > scheduleData.timePeriods.length + 1) {
    console.error('移动课程失败: 结束时间超出范围', { 
      newEndTime, 
      maxTime: scheduleData.timePeriods.length + 1 
    });
    return false;
  }
  
  // 3. 如果位置没变，直接返回成功
  if (currentCourse.day === newDay && currentCourse.startTime === newStartTime) {
    console.log('课程位置未变化，无需移动');
    return true;
  }
  
  // 4. 详细的冲突检测 - 纯粹基于格子的占用状态
  // 目标位置需要的格子数
  const requiredSlots = [];
  
  // 收集目标位置所有需要的格子
  for (let slot = newStartTime; slot < newEndTime; slot++) {
    requiredSlots.push({ day: newDay, time: slot });
  }
  
  console.log('需要检查的格子:', requiredSlots);
  
  // 记录所有当前课程列表，便于调试
  console.log('当前所有课程:', scheduleData.courses.map(c => ({
    id: c.id,
    title: c.title,
    day: c.day,
    time: `${c.startTime}-${c.endTime}`
  })));
  
  // 检查这些格子是否有任何一个被占用
  let conflictFound = false;
  
  scheduleData.courses.forEach(course => {
    // 排除当前课程自身
    if (course.id === courseId) return;
    
    // 只检查同一天的课程
    if (course.day !== newDay) return;
    
    console.log(`检查可能冲突的课程:`, {
      id: course.id,
      title: course.title,
      day: course.day,
      time: `${course.startTime}-${course.endTime}`
    });
    
    // 检查此课程占用的所有格子
    for (let t = course.startTime; t < course.endTime; t++) {
      // 检查是否与目标格子重叠
      const overlap = requiredSlots.some(slot => slot.time === t);
      
      if (overlap) {
        console.log(`发现冲突! 格子 [${newDay}, ${t}] 已被课程 "${course.title}" 占用`);
        conflictFound = true;
        // 找到冲突后继续检查，记录所有冲突点
      }
    }
  });
  
  // 如果有冲突，拒绝移动
  if (conflictFound) {
    console.error('移动课程失败: 目标位置存在时间冲突');
    return false;
  }
  
  // 5. 更新课程位置
  console.log('验证通过，准备移动课程');
  scheduleData.courses[courseIndex] = {
    ...currentCourse,
    day: newDay,
    startTime: newStartTime,
    endTime: newEndTime
  };
  
  // 保存到本地存储
  saveScheduleToStorage();
  console.log('课程移动成功', {
    course: currentCourse.title,
    from: { day: currentCourse.day, time: `${currentCourse.startTime}-${currentCourse.endTime}` },
    to: { day: newDay, time: `${newStartTime}-${newEndTime}` }
  });
  
  return true;
}
