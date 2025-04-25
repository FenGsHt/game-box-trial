# 待玩游戏清单功能使用指南

## 功能概述

待玩游戏清单(TodoList)功能可以帮助用户记录想要体验的游戏，并可以标记已完成的游戏。主要功能包括：

1. 添加待玩游戏
2. 标记游戏为已玩/未玩
3. 删除不再需要的游戏记录
4. 实时同步更新（多设备同步）

## 技术实现

该功能使用了以下技术：

- **前端**: React + TypeScript + Next.js
- **后端/数据库**: Supabase (PostgreSQL)
- **实时同步**: Supabase实时订阅
- **UI组件**: 自定义Checkbox、Input等组件

## 数据库设置

需要在Supabase中创建`game_todos`表，SQL脚本位于`src/lib/game_todos_table.sql`。主要包含：

```sql
CREATE TABLE IF NOT EXISTS game_todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

表设置了适当的行级安全策略(RLS)，确保用户只能访问自己的数据。

## 组件说明

1. **GameTodoList组件**: 核心组件，包含添加、切换、删除待玩游戏的功能
2. **TodoListPage页面**: 包含待玩游戏清单的页面组件

## 使用步骤

### 1. 访问待玩游戏清单

可以通过以下方式访问：
- 导航栏中的"待玩清单"链接
- 导航栏中的待玩清单图标
- 直接访问`/todolist`路径

### 2. 添加游戏到待玩清单

1. 在输入框中输入游戏名称
2. 点击添加按钮或按回车键

### 3. 标记游戏为已玩/未玩

点击游戏前的复选框可以切换游戏的完成状态。

### 4. 删除游戏

点击游戏右侧的删除图标可以从清单中移除该游戏。

## 实时同步功能

所有操作都会实时同步到数据库，并通过Supabase的实时订阅功能同步到所有已登录的设备上。这意味着：

1. 在手机上添加的游戏会立即显示在电脑上
2. 多设备间的状态变更会实时更新
3. 数据永久保存在用户的账户中

## 注意事项

1. 使用该功能需要用户登录
2. 未登录用户将看到登录提示
3. 数据与用户帐户绑定，不同用户看到的是各自的清单 