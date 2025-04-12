# 课堂助手 (Classroom Assistant)

本项目是一个基于 Web 的应用程序，旨在帮助学生管理他们的学业生活，包括课程表、成绩和考试倒计时。

## 项目结构

```
.
├── countdown.html             # 考试倒计时页面
├── grades.html                # 成绩管理页面
├── index.html                 # 应用程序的主登陆页面
├── lesson.html                # 快速笔记/课程复习页面
├── profile.html               # 用户个人资料页面
├── schedule.html              # 查看和管理课程表页面
├── settings.html              # 应用程序设置页面
│
├── css/                       # CSS 样式表目录
│   ├── footer.css             # 页脚组件样式。定义页脚的布局、链接样式和响应式行为。依赖于 styles.css 中定义的全局变量。
│   ├── scrollAnimation.css    # 滚动触发动画样式。定义元素在滚动进入视口时的动画效果（如淡入、滑动）。可应用于任何需要滚动动画的元素。
│   ├── sidebar.css            # 侧边栏导航样式。定义侧边栏的布局、展开/折叠动画、菜单项样式和响应式行为。依赖于 styles.css 中定义的全局变量和主题变量。
│   ├── styles.css             # 全局基础样式和主题变量 (亮/暗)。定义 HTML 元素的基础样式、全局布局类、排版、核心 UI 组件（按钮、表单、卡片、模态框、通知）的默认外观，并包含亮色和暗色模式的基础 CSS 变量。是所有其他 CSS 文件的基础。
│   ├── pages/                 # 页面特定样式目录。包含仅适用于特定页面的 CSS 规则，用于覆盖或补充全局/组件样式，实现页面特有的布局和元素样式。
│   │   ├── countdown.css      # 考试倒计时页面的特定样式，如倒计时显示、进度条、状态徽章。
│   │   ├── grades.css         # 成绩管理页面的特定样式，如图表容器、成绩表格、分数徽章、选项卡。
│   │   ├── index.css          # 首页的特定样式，如英雄区域、特色卡片、统计部分。
│   │   ├── lesson.css         # 课评速记页面的特定样式，如消息气泡、输入区域、快速反应按钮。
│   │   ├── profile.css        # 个人资料页面的特定样式，如头像上传、用户信息、统计卡片。
│   │   ├── schedule.css       # 课程表页面的特定样式，如时间网格、课程卡片、编辑模式、拖放指示器。
│   │   └── settings.css       # 设置页面的特定样式，如设置行、主题切换器（开关和小球）、语言选择器。
│   └── themes/                # 主题相关样式目录
│       └── themes.css         # 具体主题定义。定义了多个渐变主题和深色主题的 CSS 变量（颜色、渐变、背景等），通过覆盖 :root 或 [data-theme="dark"] 中的变量来应用不同的视觉风格。还包含主题预览组件的样式。
│
├── js/                        # JavaScript 文件目录
│   ├── footer.js              # 动态加载页脚的逻辑
│   ├── main.js                # 全局 JavaScript：主题初始化、通知、工具函数 (日期、存储等)
│   ├── scrollAnimation.js     # 滚动触发动画逻辑
│   ├── sidebar.js             # 动态加载和管理侧边栏的逻辑
│   ├── themes.js              # 主题切换和管理逻辑
│   ├── data/                  # 数据管理脚本目录
│   │   └── schedule_data.js   # 处理课程表数据结构、CRUD 操作和 localStorage 持久化
│   └── pages/                 # 页面特定 JavaScript 逻辑目录
│       ├── countdown.js
│       ├── grades.js
│       ├── index.js
│       ├── lesson.js
│       ├── profile.js
│       ├── schedule.js        # 课程表页面逻辑：渲染视图、模态框、编辑、拖放
│       └── settings.js
│
├── pages/                     # HTML 模板/片段目录
│   ├── footer.html            # 页脚 HTML 模板
│   └── sidebar.html           # 侧边栏导航菜单 HTML 模板
│
└── test/                      # 测试文件和实验目录
    ├── 测试动态边栏/          # 与动态侧边栏相关的测试
    ├── 测试各颜色主题细节配置/ # 主题颜色配置测试
    ├── 测试色彩搭配/          # 色彩组合测试
    ├── 测试颜色切换主题页面/  # 主题切换功能测试
    ├── 测试页面动画/          # 页面动画测试
    └── 测试昼夜交替切换/      # 日/夜模式切换测试
```

## 文件描述

- **HTML 文件 (根目录):** 根目录中的每个 `.html` 文件代表应用程序的一个主要页面/视图 (例如, `index.html` 是主页, `schedule.html` 是课程表页面)。
- **`css/`:** 包含所有样式信息。
  - `styles.css`: 定义核心外观和感觉，包括布局、排版、主题颜色变量以及通用 UI 元素的基础样式。
  - `sidebar.css`, `footer.css`, `scrollAnimation.css`: 组件特定样式。
  - `css/pages/`: 包含仅适用于特定页面的 CSS 规则，有助于保持全局样式表的整洁。
  - `css/themes/`: 包含与不同视觉主题相关的 CSS。
- **`js/`:** 包含所有客户端逻辑。
  - `main.js`: 包含跨多个页面使用的基本功能，例如初始化例程、辅助函数 (通知、日期格式化、存储) 以及可能的全局事件监听器。
  - `sidebar.js`, `footer.js`, `scrollAnimation.js`, `themes.js`: 处理特定 UI 组件或功能的逻辑。
  - `js/data/schedule_data.js`: 管理课程表数据的结构和操作，包括保存到浏览器存储和从中加载。
  - `js/pages/`: 包含仅在相应页面上执行的 JavaScript 代码，管理其特定的交互和状态。
- **`pages/`:** 存储可重用的 HTML 片段 (如侧边栏和页脚)，这些片段可能使用 JavaScript 动态加载到主页面中。
- **`test/`:** 开发过程中用于在隔离环境中测试特定功能或视觉概念的实验文件集合。
