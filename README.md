# GatherGO! - MVP App

这是一个使用 Expo + React Navigation 构建的活动发现与管理应用。

## 技术栈

- **框架**: Expo ~50.0.0
- **语言**: TypeScript
- **导航**: React Navigation (Native Stack + Bottom Tabs)
- **状态管理**: React Context API

## 项目结构

```
src/
├── components/          # 组件
│   ├── common/         # 通用组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Tag.tsx
│   └── event/          # 活动相关组件
│       ├── EventCard.tsx
│       └── EventTypeChips.tsx
├── contexts/            # Context 提供者
│   └── AuthContext.tsx
├── hooks/              # 自定义 Hooks
│   ├── useAuth.ts
│   └── useEvents.ts
├── navigation/          # 导航配置
│   ├── types.ts
│   ├── RootStack.tsx
│   ├── MainTabs.tsx
│   └── AuthStack.tsx
├── screens/            # 页面组件
│   ├── auth/           # 认证相关
│   │   ├── IntroScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── home/           # 首页相关
│   │   ├── HomeScreen.tsx
│   │   └── EventDetailScreen.tsx
│   ├── search/         # 搜索
│   │   └── SearchScreen.tsx
│   ├── upload/         # 上传
│   │   └── UploadScreen.tsx
│   ├── calendar/       # 行事历
│   │   └── CalendarScreen.tsx
│   └── profile/        # 个人中心
│       └── ProfileScreen.tsx
└── types/              # TypeScript 类型定义
    ├── event.ts
    └── user.ts
```

## 导航架构

### RootStack (最外层)
- `Intro`: 首次进入的引导页
- `MainTabs`: 主应用底部导航
- `Auth`: 认证流程（Login/Register）
- `EventDetail`: 活动详情页（Modal 形式）

### MainTabs (底部五个 Tab)
- `Home`: 首页
- `Search`: 搜索页
- `Upload`: 上传页
- `Calendar`: 行事历
- `Profile`: 我的

### AuthStack
- `Login`: 登入页
- `Register`: 注册页

## 功能说明

### 1. 认证流程
- 首次进入显示 `IntroScreen`，可选择：
  - 建立账号 → 前往注册页
  - 登入 → 前往登入页
  - 先逛逛，稍后登入 → 进入访客模式（MainTabs）

### 2. 访客模式限制
- `Home` 和 `Search` 页面：访客和登入用户都可以使用
- `Upload`、`Calendar`、`Profile`：未登入时会提示并引导至登入页

### 3. 首页 (HomeScreen)
- Banner 展示精选活动
- 活动类型按钮（应援/演唱会/展览/其他）
- 当月活动列表
- 点击活动类型 → 跳转到搜索页并自动筛选
- 点击活动卡片 → 查看活动详情

### 4. 搜索页 (SearchScreen)
- 支持关键词搜索
- 支持按活动类型筛选
- 从首页活动类型按钮进入时会自动应用筛选

### 5. 上传页 (UploadScreen)
- 需要登入才能使用
- 表单字段：
  - 活动名称（必填）
  - 活动类型（必填）
  - 活动地点（必填）
  - 开始日期（必填）
  - 结束日期（可选）
  - 主办单位/发起人（可选）
  - 备注/描述（可选）
- 提交后显示成功提示（目前只做 console.log）

### 6. 行事历 (CalendarScreen)
- 需要登入才能使用
- 显示收藏的活动（目前使用假数据）
- 按日期分组展示

### 7. 我的 (ProfileScreen)
- 未登入：显示登入提示和按钮
- 已登入：显示用户信息、功能菜单、登出按钮

## 安装与运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm start
# 或
expo start
```

3. 在模拟器或真机上运行：
- 按 `i` 启动 iOS 模拟器
- 按 `a` 启动 Android 模拟器
- 扫描二维码在真机上运行

## 注意事项

1. **假数据**: 目前所有活动数据都是硬编码的假数据，位于 `src/hooks/useEvents.ts`
2. **认证**: 登入/注册功能使用假数据，不会真正验证用户信息
3. **图片**: 活动图片使用 placeholder URL，实际项目中需要替换为真实图片
4. **样式**: UI 样式较为简单，后续可以进一步美化

## 后续开发计划

- [ ] 连接后端 API
- [ ] 实现真实的用户认证
- [ ] 实现活动收藏功能
- [ ] 实现小帮手审核模式（Phase 2）
- [ ] 优化 UI/UX
- [ ] 添加图片上传功能
- [ ] 实现日期选择器组件

