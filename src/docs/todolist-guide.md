# 待玩游戏清单功能使用指南

## 功能概述

待玩游戏清单(TodoList)功能可以帮助用户记录想要体验的游戏，并可以标记已完成的游戏。主要功能包括：

1. 添加待玩游戏
2. 标记游戏为已玩/未玩
3. 为游戏评分（1-5星，支持半星评价）
4. 删除不再需要的游戏记录
5. 创建和管理游戏组，与组内成员共享待玩清单
6. 实时同步更新（多设备同步）

## 技术实现

该功能使用了以下技术：

- **前端**: React + TypeScript + Next.js
- **后端/数据库**: Supabase (PostgreSQL)
- **实时同步**: Supabase实时订阅
- **UI组件**: 自定义Checkbox、Input、Rating Stars等组件
- **行级安全策略**: Supabase RLS策略，确保数据安全

## 数据库设置

需要在Supabase中创建以下数据表：

### 1. 游戏组表 (game_groups)
```sql
CREATE TABLE IF NOT EXISTS game_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. 游戏组成员表 (game_group_members)
```sql
CREATE TABLE IF NOT EXISTS game_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES game_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);
```

### 3. 待玩游戏清单表 (game_todos)
```sql
CREATE TABLE IF NOT EXISTS game_todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  user_id UUID NOT NULL,
  group_id UUID REFERENCES game_groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

表设置了适当的行级安全策略(RLS)，确保用户只能访问自己的数据和所属组的数据。

## 组件说明

1. **GameTodoList组件**: 核心组件，包含添加、标记、评分和删除待玩游戏的功能
2. **RatingStars组件**: 星级评分组件，支持1-5星评分，可选择半星
3. **GroupSelector组件**: 游戏组选择器，用于切换不同游戏组的待玩清单
4. **TodoListPage页面**: 包含待玩游戏清单的页面组件
5. **GroupManagerPage页面**: 游戏组管理页面，用于创建和管理游戏组

## 使用步骤

### 1. 访问待玩游戏清单

可以通过以下方式访问：
- 导航栏中的"待玩清单"链接
- 导航栏中的待玩清单图标
- 直接访问`/todo-list`路径

### 2. 添加游戏到待玩清单

1. 在输入框中输入游戏名称
2. 点击添加按钮或按回车键
3. 游戏会被添加到当前选中的组或个人清单中

### 3. 标记游戏为已玩/未玩

点击游戏前的复选框可以切换游戏的完成状态。

### 4. 为游戏评分

在每个游戏项目下方有五颗星星的评分系统：
1. 点击整颗星星给予整数评分（1-5星）
2. 点击星星的左半部分给予半星评分（0.5, 1.5, 2.5, 3.5, 4.5星）
3. 评分会自动保存到数据库并实时同步到所有设备

### 5. 删除游戏

点击游戏右侧的删除图标可以从清单中移除该游戏。

### 6. 创建和管理游戏组

1. 访问游戏组管理页面 `/group-manager`
2. 创建新的游戏组
   - 输入组名称和描述
   - 点击"创建游戏组"按钮
3. 管理组成员
   - 从左侧列表选择要管理的组
   - 输入新成员的邮箱地址，点击"添加成员"
   - 点击成员旁边的删除按钮可以移除成员
4. 删除游戏组
   - 点击组右侧的删除按钮可以删除整个组及其待玩清单

### 7. 使用组待玩清单

1. 在待玩清单页面顶部选择要使用的游戏组
2. 所有对该组清单的操作都会在组内成员间同步
3. 组内成员可以查看、添加、标记和评分组内待玩游戏
4. 只有组长可以删除组内的待玩游戏

## 实时同步功能

所有操作（包括添加、标记完成、评分和删除）都会实时同步到数据库，并通过Supabase的实时订阅功能同步到所有已登录的设备和组内成员上。

1. 在手机上添加的游戏会立即显示在电脑上
2. 组内一个成员添加的游戏会立即显示给所有组员
3. 多设备间的状态变更和评分会实时更新
4. 数据永久保存在用户的账户和组记录中

## 权限说明

1. **个人清单**:
   - 用户只能看到自己创建的待玩游戏
   - 用户可以完全控制自己的待玩游戏

2. **组清单**:
   - 组长可以添加/删除组成员
   - 组长可以删除组内任何待玩游戏
   - 组员可以查看和标记组内所有待玩游戏
   - 组员可以向组内添加新的待玩游戏
   - 任何人都可以为组内游戏评分

## 注意事项

1. 使用该功能需要用户登录
2. 未登录用户将看到登录提示
3. 数据与用户帐户和组绑定
4. 评分为可选项，默认新添加的游戏评分为0（未评分）
5. 删除组时，该组的所有待玩游戏也会被删除 