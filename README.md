# NutriAI 智能营养分析系统

基于AI大模型的营养分析Web应用。

## 技术栈

- **后端**: Node.js + Express
- **前端**: React + Vite
- **数据库**: Neon (PostgreSQL)
- **AI模型**: 通义千问 (Qwen)

## 项目结构

```
.
├── client/              # 前端React应用
│   ├── src/
│   │   ├── components/ # React组件
│   │   ├── services/   # API服务
│   │   └── styles/     # 样式文件
│   └── package.json
├── server/              # 后端Express服务
│   ├── src/
│   │   ├── routes/     # API路由
│   │   ├── services/   # 业务逻辑
│   │   ├── config/     # 配置文件
│   │   └── index.js    # 入口文件
│   ├── package.json
│   └── neon-init.sql   # 数据库初始化
├── Dockerfile.server   # 后端Docker镜像
├── Dockerfile.client   # 前端Docker镜像
├── docker-compose.yml  # Docker编排
├── render.yaml        # Render部署配置
└── SPEC.md            # 规格说明书
```

## 本地开发

### 1. 初始化Neon

1. 在 [Neon](https://neon.tech) 创建项目
2. 获取连接字符串
3. 运行 `server/neon-init.sql` 创建表

### 2. 配置环境变量

编辑 `server/.env`：
```bash
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
QWEN_API_KEY=your-api-key
QWEN_MODEL_NAME=qwen3.5-122b-a10b
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
DEFAULT_MODEL=qwen
PORT=3001
```

### 3. 启动

```bash
npm run dev
```

访问 http://localhost:5173

## Docker部署

```bash
# 构建并启动
docker-compose up --build

# 后台运行
docker-compose up -d
```

访问 http://localhost:5173

## Render部署

### 方式1: 使用render.yaml

1. 在 [Render](https://render.com) 连接GitHub仓库
2. 创建新的 Blueprint，选择 render.yaml
3. 配置环境变量

### 方式2: 手动部署

1. **后端服务**
   - New Web Service
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - 配置环境变量

2. **前端静态服务**
   - New Static Site
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`
   - 配置 API_URL 环境变量

## 功能说明

- 输入食物名称和份量
- 选择时间段（早餐/午餐/晚餐/全天/自定义）
- AI自动分析营养状况
- 查看历史记录
- 支持模型扩展
