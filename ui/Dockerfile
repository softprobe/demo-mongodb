
# 构建阶段
FROM --platform=linux/amd64 node:20-alpine AS build

# 设置工作目录
WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production
ARG PROD_API_URL=http://114.215.188.138:8088
ENV VITE_PROD_API_URL=${PROD_API_URL}

# 复制 package.json 和 pnpm-lock.yaml
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装依赖
RUN npm install -g pnpm && pnpm install

# 复制所有文件
COPY . .

# 构建应用（确保以生产模式构建）
RUN pnpm build --mode production

# 运行阶段
FROM --platform=linux/amd64 nginx:stable-alpine

# 复制构建结果到 nginx 服务目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]