import express from 'express';
import cors from 'cors';
import formRoutes from './routes/formRoutes';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', formRoutes);

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "服务器内部错误"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 