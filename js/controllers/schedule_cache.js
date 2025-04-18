// 课表缓存控制器
// 用于优化课表性能，通过缓存常用数据避免重复计算

import { scheduleData } from "../data/schedule_data.js";

// 课程缓存数据结构
const coursesCache = {
  byDay: new Map(), // 按天分组的课程
  durationById: new Map(), // 课程时长缓存
};

/**
 * 更新课程缓存
 * 重新计算和分组课程信息
 */
export function updateCoursesCache() {
  // 重置缓存
  coursesCache.byDay.clear();
  coursesCache.durationById.clear();
  
  // 初始化每天的空数组
  for (let i = 1; i <= 7; i++) {
    coursesCache.byDay.set(i, []);
  }
  
  // 遍历每门课程，预计算信息并分组
  scheduleData.courses.forEach(course => {
    // 计算并缓存课程时长
    const duration = course.endTime - course.startTime + 1;
    coursesCache.durationById.set(course.id, duration);
    
    // 将课程添加到对应天的数组
    if (coursesCache.byDay.has(course.day)) {
      coursesCache.byDay.get(course.day).push(course);
    }
  });
  
  console.log("课程缓存已更新", coursesCache);
}

/**
 * 检查是否可以放置课程
 * @param {number} courseId - 课程ID
 * @param {number} targetDay - 目标日期
 * @param {number} targetTime - 目标时间
 * @returns {boolean} 是否可以放置
 */
export function checkCanPlaceCourse(courseId, targetDay, targetTime) {
  if (!courseId || !targetDay || !targetTime) return false;
  
  courseId = parseInt(courseId);
  
  // 获取当前课程信息
  const course = scheduleData.courses.find(c => c.id === courseId);
  if (!course) return false;
  
  // 使用缓存的课程时长，如果没有则重新计算
  const duration = coursesCache.durationById.get(courseId) || (course.endTime - course.startTime + 1);
  const newEndTime = targetTime + duration - 1;
  
  // 检查时间是否超出范围
  if (newEndTime > scheduleData.timePeriods.length) {
    return false;
  }
  
  // 使用按天分组的数据来检查冲突
  const coursesOnSameDay = coursesCache.byDay.get(targetDay) || [];
  
  // 检查是否与其他课程冲突 (只检查同一天的课程)
  const hasConflict = coursesOnSameDay.some(c => {
    // 跳过当前课程自身
    if (c.id === courseId) return false;
    
    // 检查时间段是否有重叠
    return (targetTime <= c.endTime && newEndTime >= c.startTime);
  });
  
  return !hasConflict;
}

/**
 * 获取课程放置失败的具体原因
 * @param {number} courseId - 课程ID
 * @param {number} targetDay - 目标日期
 * @param {number} targetTime - 目标时间
 * @returns {string} 不可放置的原因
 */
export function getMoveCourseFailReason(courseId, targetDay, targetTime) {
  if (!courseId || !targetDay || !targetTime) {
    return "参数无效";
  }
  
  courseId = parseInt(courseId);
  
  // 获取当前课程信息
  const course = scheduleData.courses.find(c => c.id === courseId);
  if (!course) {
    return "找不到课程";
  }
  
  // 使用缓存的课程时长，如果没有则重新计算
  const duration = coursesCache.durationById.get(courseId) || (course.endTime - course.startTime + 1);
  const newEndTime = targetTime + duration - 1;
  
  // 检查时间是否超出范围
  if (newEndTime > scheduleData.timePeriods.length) {
    return "课程结束时间超出课表范围";
  }
  
  // 使用按天分组的数据来寻找冲突的课程
  const coursesOnSameDay = coursesCache.byDay.get(targetDay) || [];
  
  // 寻找冲突的课程
  const conflictCourses = coursesOnSameDay.filter(c => {
    // 跳过当前课程自身
    if (c.id === courseId) return false;
    
    // 检查时间段是否有重叠
    return (targetTime <= c.endTime && newEndTime >= c.startTime);
  });
  
  if (conflictCourses.length > 0) {
    return `与课程「${conflictCourses[0].title}」时间冲突`;
  }
  
  return "未知原因";
}

/**
 * 获取更详细的不可放置原因
 * @param {number} courseId - 课程ID
 * @param {number} targetDay - 目标日期
 * @param {number} targetTime - 目标时间
 * @returns {string} 不可放置的详细原因
 */
export function getPlacementBlockReason(courseId, targetDay, targetTime) {
  if (!courseId || !targetDay || !targetTime) {
    return "参数无效";
  }
  
  courseId = parseInt(courseId);
  
  // 获取当前课程信息
  const course = scheduleData.courses.find(c => c.id === courseId);
  if (!course) {
    return "找不到课程";
  }
  
  // 使用缓存的课程时长，如果没有则重新计算
  const duration = coursesCache.durationById.get(courseId) || (course.endTime - course.startTime + 1);
  const newEndTime = targetTime + duration - 1;
  
  // 检查时间是否超出范围
  if (newEndTime > scheduleData.timePeriods.length) {
    return `超出课表范围 (需要${duration}节连续课时)`;
  }
  
  // 使用按天分组的数据来寻找冲突的课程
  const coursesOnSameDay = coursesCache.byDay.get(targetDay) || [];
  
  // 寻找冲突的课程
  const conflictCourses = coursesOnSameDay.filter(c => {
    // 跳过当前课程自身
    if (c.id === courseId) return false;
    
    // 检查时间段是否有重叠
    return (targetTime <= c.endTime && newEndTime >= c.startTime);
  });
  
  if (conflictCourses.length > 0) {
    const conflictCourse = conflictCourses[0];
    return `与「${conflictCourse.title}」(${conflictCourse.startTime}-${conflictCourse.endTime}节) 时间冲突`;
  }
  
  return "无法放置";
}

// 导出缓存对象以便可能的扩展需要
export { coursesCache };
