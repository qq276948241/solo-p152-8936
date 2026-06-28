# 演出日程后台 · 项目说明文档

> 面向新同事的快速上手文档，讲清代码组织方式。

## 一、技术栈概览

- **框架**：React 18 + TypeScript
- **构建**：Vite
- **路由**：react-router-dom 7（BrowserRouter）
- **状态**：zustand 5（全局 store）+ useState/useSearchParams（组件/URL 状态）
- **样式**：TailwindCSS 3（自定义主题色）
- **图标**：lucide-react

---

## 二、入口 & 路由

### 2.1 挂载流程

`main.tsx` 负责把 `<App />` 挂到 `#root`：

```tsx
// src/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`index.css` 在 `main.tsx` 里全局引入，里面定义了全局渐变背景、字体以及 `.card-base` / `.btn-primary` / `.input-base` 等复用样式类。

### 2.2 路由切换

项目用的是 **react-router-dom 的 BrowserRouter**，没有自己造轮子。路由表在 `App.tsx` 里：

| 路径 | 页面组件 | 说明 |
|---|---|---|
| `/` | 重定向 → `/shows` | 根路径直接跳演出列表 |
| `/shows` | [ShowList.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/pages/ShowList.tsx) | 演出列表页（实际首页） |
| `/shows/:id` | [ShowEdit.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/pages/ShowEdit.tsx) | 详情编辑页 |
| `/messages` | [MessageBoard.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/pages/MessageBoard.tsx) | 留言板页 |
| `*` | 重定向 → `/shows` | 404 兜底 |

页面之间通过 `<Link>`（卡片跳转）和 `useNavigate`（保存后返回）切换。`Navbar` 组件固定在顶部，提供导航入口。

> ⚠️ 注意：`pages/Home.tsx` 是一个历史遗留空页，实际首页是 `ShowList`，路由绑定的也是 ShowList，不用管 Home。

---

## 三、数据层：mock 数据 & 全局 store

### 3.1 mockData

初始演出和留言放在 [data/mockData.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/data/mockData.ts)，共 7 场演出 + 14 条留言。字段结构定义在 [types/index.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/types/index.ts)：

```ts
type ShowStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

interface Show {
  id: string; venue: string; date: string; price: number;
  status: ShowStatus; address: string; notes: string;
  createdAt: string; updatedAt: string;
}

interface Message {
  id: string; showId: string; nickname: string; content: string;
  createdAt: string; starred: boolean;
}
```

### 3.2 zustand store（useAppStore）

全局状态在 [store/useAppStore.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/store/useAppStore.ts)，**数据自带 localStorage 持久化**（`SHOWS_KEY` / `MESSAGES_KEY`）：

| 主要字段 / 方法 | 作用 |
|---|---|
| `shows` | 演出数组 |
| `messages` | 留言数组 |
| `getShowById(id)` | 根据 id 取演出 |
| `getMessagesByShowId(id)` | 按演出过滤留言 + 按 createdAt 倒序 |
| `updateShow(id, data)` | 更新演出字段，写回 localStorage |
| `toggleMessageStar(id)` | 切换留言标星 |
| `setSearchKeyword(keyword)` | 设置搜索关键字（⚠️ 筛选逻辑已迁出，详见下一节） |

### 3.3 ShowList 如何消费数据

ShowList 不再直接从 store 拿筛选后的结果，而是调用自定义 hook [useShowFilter](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/hooks/useShowFilter.ts)：

```tsx
const { shows } = useAppStore();
const {
  filteredShows,        // 搜索 + 状态 叠加筛选 + 倒序的结果
  searchKeyword,        // 当前搜索关键字（从 URL 读）
  setSearchKeyword,     // 设置关键字（写 URL）
  activeStatus,         // 当前激活的状态（从 URL 读）
  setActiveStatus,      // 切换状态（写 URL）
  statusCounts,         // 各状态计数对象
} = useShowFilter(shows);
```

**筛选条件是和 URL 绑定的**，地址栏形如 `?q=北京&status=upcoming`，刷新、返回、分享链接都能还原。

---

## 四、组件分类

### 4.1 布局 / 导航

- **[Navbar.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/components/Navbar.tsx)** — 顶部导航栏，Logo + 两个路由入口（演出日程 / 留言板），active 路由高亮橙色下划线。

### 4.2 列表页相关

- **[ShowCard.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/components/ShowCard.tsx)** — 演出卡片，`<Link>` 包一层，内部显示场地、日期时间、地址、票价、备注。点整卡跳转 `/shows/:id`。
- **[StatusBadge.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/components/StatusBadge.tsx)** — 状态药丸标签，4 种状态对应不同配色（即将开演用橙色、正在进行用绿色、已结束灰色、已取消红色）。
- **[StatusFilterBar.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/components/StatusFilterBar.tsx)** — 横向滚动的状态筛选标签栏，选中态亮橙实心 + 白字，未选中半透明紫底 + 白色边框。
- **[SearchInput.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/components/SearchInput.tsx)** — 搜索框组件，带 🔍 图标和清除按钮（输入非空时显示），受控组件：`value` + `onChange(string)`。

### 4.3 留言板相关

- **[MessageCard.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/components/MessageCard.tsx)** — 留言卡片，显示昵称、内容、相对时间，右上角星标切换 `onToggleStar(id)`。

### 4.4 详情编辑页表单字段

- **[FormFields.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/components/FormFields.tsx)** — 封装了 `TextInput`、`TextArea`、`NumberInput`、`SelectInput`、`DateTimeLocalInput` 5 种表单字段，**全部用原生 HTML 属性类型**，不在空 interface 上绕弯子。用法：

```tsx
<TextInput label="场地名称" value={form.venue} onChange={v => setForm('venue', v)} required />
```

### 4.5 空状态

- **[EmptyState.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/components/EmptyState.tsx)** — 业务级空状态，支持 icon（shows/messages 两种）、title、description、可选 action 按钮，**项目里主要用这个**。
- **[Empty.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/components/Empty.tsx)** — 极简占位组件，仅居中显示 "Empty" 文字，**目前未在业务中使用**，保留用于快速占位。

---

## 五、Hooks

- **[useShowFilter.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/hooks/useShowFilter.ts)** — 筛选逻辑封装，输入原始 `shows`，输出过滤/排序/计数后的结果 + 控制方法。**关键：状态跟 URL searchParams（`q` / `status`）双向同步，返回按钮、刷新都不丢筛选。**
- **[useTheme.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/hooks/useTheme.ts)** — 主题切换 hook，支持 light/dark，遵循「用户本地存储 → 系统偏好 → 默认 dark」优先级。用法：`const { theme, toggleTheme, isDark } = useTheme()`。会把 theme 写到 `document.documentElement.classList` 以配合 Tailwind `darkMode: "class"`。**目前主题 UI 没接上，hook 留着后续扩展。**

---

## 六、工具函数

### 6.1 lib/utils.ts（通用工具）

[lib/utils.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/lib/utils.ts) 放通用工具，业务组件和 store 都用：

| 函数 | 作用 |
|---|---|
| `cn(...inputs)` | `clsx + tailwind-merge` 组合，处理 className 冲突，**写组件必用** |
| `compareByDateDesc(a, b)` | 按 `date` 字段倒序比较器（演出列表排序） |
| `compareByCreatedAtDesc(a, b)` | 按 `createdAt` 倒序比较器（留言排序） |
| `formatShowTime(iso)` | 拆分 ISO 时间 → `{ dateText, timeText }`，卡片里避免重复写 `formatDate/formatTime` |
| `countShowsByStatus(shows)` | 一次 reduce 算出 5 个状态的计数（含 `all`） |
| `filterShowsByVenue(shows, keyword)` | 按场地名做非空、trim、忽略大小写过滤 |

### 6.2 utils/format.ts（纯格式化）

[utils/format.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo152/project152/src/utils/format.ts) 放时间、价格等纯格式化：`formatDate` / `formatTime` / `formatDateTime` / `formatRelativeTime` / `formatPrice` / `formatDateTimeLocal` / `generateId`。

---

## 七、设计规范

### 7.1 配色

在 `tailwind.config.js` 的 `theme.extend.colors` 里集中定义，**直接用语义化类名，不要硬编码色值**：

| 语义 | 类名 | 色值 | 典型场景 |
|---|---|---|---|
| 主色（深紫） | `bg-primary` / `text-primary` | `#2D1B4E` | 页面底色、导航栏、输入框底 |
| 主色半透明 | `bg-primary-400/40` | — | 未选中的药丸标签底 |
| 强调色（亮橙） | `bg-accent` / `text-accent` | `#FF6B35` | 主按钮、选中态标签、票价数字、星标、链接 hover 边框 |
| 强调色阴影 | `shadow-glow` | — | 主按钮 hover 发光效果 |
| 表面色 | `bg-surface/80 backdrop-blur-sm` | `#3A2460` 半透明 | 卡片底（配合毛玻璃质感） |

**配色使用原则**：
- 操作上的「确认/选中/强调」→ 一律 `accent`
- 大面积容器背景 → `surface/80`（别直接用纯白/纯黑，保持深色质感）
- 辅助文字 → `text-white/60` ~ `text-white/80`，别用灰阶色覆盖层

### 7.2 圆角卡片

- 普通卡片统一用预定义 class：**`.card-base`**（`bg-surface/80 backdrop-blur-sm rounded-2xl shadow-card border border-white/5`）
- 可点击卡片（如 ShowCard）用 **`.card-hoverable`**（在 card-base 基础上加上 hover 抬升 + 橙色边框阴影）
- 表单字段圆角：`rounded-xl`（.input-base 已内置）
- 按钮圆角：`rounded-xl`（.btn-primary / .btn-secondary 已内置）
- 药丸（badge / 标签）：`rounded-full`

### 7.3 移动端适配要点

1. **栅格断点**：卡片网格统一 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`，移动端单列，平板双列，桌面三列。
2. **横向滚动标签栏**：状态筛选和留言板筛选条都是横向滚动，写法固定为：
   ```tsx
   <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
     <button className="flex-shrink-0 ...">标签</button>
     ...
   </div>
   ```
   关键三件套：`overflow-x-auto`（横滑）+ `flex-shrink-0`（子项不被挤压）+ 外层负 margin 抵消内边距让内容靠边。
3. **触摸热区**：所有可点击元素最小高度 `min-h-[44px]`（苹果 HIG 推荐），`.btn-primary` / `.input-base` 等已内置。
4. **间距响应式**：常用间距 `mb-6 sm:mb-8`、`gap-4 sm:gap-5`，移动端紧凑，桌面舒展。
5. **长文本处理**：场地名、地址用 `truncate`（单行省略），备注用 `line-clamp-2`（两行省略），避免卡片撑变形。
6. **多行堆叠代替挤一行**：移动端日期和时间用 `flex-col sm:flex-row sm:items-center sm:gap-2` 竖排，屏幕够宽再横排。
