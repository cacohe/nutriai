# 营养分析系统规格说明书

## 1. 项目概述

- **项目名称**: NutriAI - 智能营养分析系统
- **项目类型**: 前后端分离Web应用
- **核心功能**: 用户输入食物信息，由AI大模型进行营养分析，提供营养摄入建议
- **目标用户**: 关注健康饮食的普通用户

## 2. 技术栈

### 后端
- **框架**: Node.js + Express
- **数据库**: Neon (PostgreSQL)
- **AI模型**: 支持Qwen及扩展

### 前端
- **框架**: React + Vite
- **HTTP客户端**: Axios
- **UI**: 简洁CSS

## 3. 功能规格

### 3.1 食物输入
- 用户输入食物名称和份量
- 支持时间段选择：早餐/午餐/晚餐/全天/自定义时间段
- 可输入多种食物

### 3.2 营养分析
- 分析结果包括：
  - 是否缺少某类营养
  - 是否某类营养过剩
  - 调料品是否过多或过少
  - 建议增加/减少的食物类别
  - 食用过多/过少某类食物的健康影响

### 3.3 模型支持
- 默认使用Qwen模型
- 可扩展支持其他模型
- 模型配置可管理

### 3.4 用户认证
- 用户注册（用户名+密码）
- 用户登录（JWT Token认证）
- Token有效期7天

### 3.5 历史记录
- 保存分析历史（关联user_id）
- 仅显示当前用户的记录
- 按user_id过滤保护隐私

## 4. 数据库设计

### users表
- id: 主键(UUID)
- username: 用户名(唯一)
- password: 密码(bcrypt加密)
- created_at: 创建时间

### analyses表
- id: 主键
- user_id: 用户ID
- foods: 食物JSON
- time_period: 时间段
- result: 分析结果JSON
- created_at: 创建时间

## 5. API设计

### 用户认证
### POST /api/auth/register
- 输入: username, password
- 输出: user, token

### POST /api/auth/login
- 输入: username, password
- 输出: user, token

### 营养分析（需认证）
### POST /api/analyze
- 输入: foods[], time_period
- 输出: 分析结果

### GET /api/analyses
- 输出: 当前用户的历史记录列表（按user_id过滤）

### GET /api/config/models
- 输出: 可用模型列表

## 6. 验收标准

- [x] 用户可输入食物信息
- [x] 可选择时间段
- [x] 返回营养分析结果
- [x] 结果分类清晰易读
- [x] 支持扩展模型
- [x] 代码结构清晰
- [x] 用户注册/登录功能
- [x] JWT Token认证
- [x] 历史记录按user_id过滤保护隐私
