# 养老金提取API服务

这是一个基于Express + TypeScript实现的养老金提取API服务。

## 主要功能

- 动态表单配置加载
- 表单数据验证
- 税收计算
- 状态管理
- 数据提供者集成

## 技术栈

- Express
- TypeScript
- Node.js

## 项目结构

```
server/
├── src/
│   ├── config/           # 配置文件
│   ├── controllers/      # 控制器
│   ├── models/          # 数据模型
│   ├── routes/          # 路由定义
│   ├── services/        # 业务逻辑
│   ├── types/           # TypeScript类型定义
│   ├── utils/           # 工具函数
│   └── app.ts           # 应用入口
├── package.json
└── tsconfig.json
```

## API 端点

### 表单配置

- `GET /api/forms/{formId}` - 获取表单配置
- `GET /api/forms/{formId}/metadata` - 获取表单元数据

### 数据提供者

- `GET /api/forms/data-providers` - 获取数据提供者数据

### 验证

- `POST /api/forms/{formId}/sections/{sectionId}/validate` - 验证表单数据

### 提交

- `POST /api/submit` - 提交表单数据

## 开发

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建
npm run build

# 生产模式运行
npm run start
```

## 配置

主要配置文件位于 `src/config` 目录下：

- `forms/` - 表单配置
- `validators.ts` - 验证器配置
- `providers.ts` - 数据提供者配置 