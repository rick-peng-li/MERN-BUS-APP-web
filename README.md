# MERN-BUS-APP-web

Git 仓库：`git@github.com:rick-peng-li/MERN-BUS-APP-web.git`

Unique Travels 长途客车在线订票系统，前后端分离架构。用户可以注册登录、查询城市间的班次、查看指定日期的实时余票、可视化选座、填写乘客信息、模拟信用卡支付并生成电子车票，同时在个人中心查看账户信息与历史订单。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | React 19、Vite 8、React Router 7、Ant Design 6、Axios、Day.js |
| 后端 | Node.js 20+、Express 5（ESM）、Mongoose 9、jsonwebtoken、bcryptjs |
| 数据库 | MongoDB |
| 工具链 | ESLint 风格约定、Vite 别名 `@/`、环境变量 dotenv |

鉴权方式为 JWT：登录成功后签发 Token，前端保存在 `localStorage`，通过 `Authorization: Bearer` 请求头携带；后端中间件统一校验并挂载当前用户。开发模式下 Vite 将 `/api` 代理到后端 8080 端口，生产模式下由 Express 托管前端构建产物。

## 项目结构

```
MERN-BUS-APP-web/
├── client/                        # 前端（Vite）
│   ├── index.html
│   ├── vite.config.js             # @ 别名、/api 代理
│   └── src/
│       ├── main.jsx               # 应用入口、Ant Design 主题
│       ├── App.jsx
│       ├── router/                # 路由表与受保护路由装配
│       ├── layouts/               # 顶部导航、页脚等整体布局
│       ├── pages/                 # 页面级组件
│       │   ├── home/              # 首页
│       │   ├── auth/              # 登录、注册
│       │   ├── booking/           # 订票主流程
│       │   ├── ticket/            # 电子车票
│       │   └── profile/           # 个人中心
│       ├── components/
│       │   ├── common/            # 品牌 Logo、受保护路由
│       │   └── booking/           # 搜索表单、班次列表、座位图、乘客信息、支付、订单汇总
│       ├── services/              # axios 实例与接口封装
│       ├── hooks/                 # useRequest 等通用逻辑
│       ├── context/               # 登录态与订票草稿
│       ├── utils/                 # 常量、格式化、银行卡、本地存储
│       ├── styles/                # 全局样式
│       └── assets/                # 图片资源
└── server/                        # 后端（Express）
    ├── server.js                  # 启动入口（连接数据库并监听端口）
    ├── app.js                     # 中间件与路由装配
    ├── config/                    # 环境变量、数据库连接、业务常量
    ├── routes/                    # auth / user / booking 路由表
    ├── controllers/               # 请求处理与业务逻辑
    ├── middleware/                # JWT 鉴权、404、统一错误处理
    ├── models/                    # User / Bus / Booking
    ├── utils/                     # ApiError、交易号与正则工具
    └── seed/                      # 初始化脚本与班次数据
```

## 页面与功能

| 路由 | 页面 | 功能 |
| --- | --- | --- |
| `/` | 首页 | 品牌展示、热门线路、订票流程说明与入口 |
| `/login` | 登录 | 邮箱 + 密码登录，演示账号一键填充 |
| `/register` | 注册 | 姓名、邮箱、手机号、性别、生日与密码注册，邮箱查重 |
| `/book` | 订票 | 三步流程：查询班次（按城市与日期显示实时余票）→ 选座并填写每位乘客姓名与性别 → 模拟信用卡支付并生成订单 |
| `/ticket/:transactionId` | 电子车票 | 行程、座位、乘客、金额、状态与交易号 |
| `/profile` | 个人中心 | 账户信息、订单数 / 座位数 / 累计消费统计、历史订单与车票跳转 |
| `*` | 404 | 未匹配路由兜底 |

`/book`、`/profile`、`/ticket/:transactionId` 为受保护页面，未登录访问会跳转到登录页，并在登录后回到原页面。订票草稿（已选班次、座位、乘客）保存在 `sessionStorage`，刷新页面不丢失。

## 接口设计

统一前缀 `/api`，除登录、注册与健康检查外均需 JWT 鉴权。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 服务健康检查 |
| POST | `/api/auth/login` | 登录，参数 `{email, password}`，返回 `{token, user}` |
| POST | `/api/auth/register` | 注册，参数 `{name, email, password, mobile, gender, dob?}` |
| GET | `/api/auth/me` | 当前登录用户 |
| GET | `/api/user/profile` | 用户信息与订单统计 |
| GET | `/api/user/bookings` | 当前用户历史订单（含班次详情） |
| GET | `/api/booking/cities` | 出发地与目的地列表（由班次去重） |
| POST | `/api/booking/search` | 按 `{startCity, destination, date?}` 查询班次，传日期时返回当日实时余票 |
| GET | `/api/booking/buses/:id` | 单个班次详情 |
| GET | `/api/booking/buses/:id/seats?date=` | 指定日期已售座位 |
| POST | `/api/booking/book` | 创建订单 `{busId, travelDate, seats[], passengers[]}`，校验座位冲突 |
| GET | `/api/booking/ticket/:transactionId` | 按交易号查询当前用户的车票 |

## 数据模型

- **User**：name、email（唯一）、password（bcrypt 哈希，默认不返回）、mobile、gender、dob
- **Bus**：companyName、busType、busNumber、startCity、destination、totalSeats、availableSeats、pricePerSeat
- **Booking**：transactionId（唯一）、user、bus、travelDate、seats、passengers（seat/name/gender）、totalAmount、status

## 环境变量

后端读取 `server/.env`（可参考 `server/.env.example`）：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` | `8080` | API 监听端口 |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/bus_app` | MongoDB 连接串 |
| `JWT_SECRET` | 开发用默认值 | JWT 签名密钥，生产环境必须修改 |
| `JWT_EXPIRES_IN` | `1d` | Token 有效期 |
| `NODE_ENV` | `development` | 设为 `production` 时由后端托管 `client/dist` |

前端可选 `client/.env`：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | API 基础路径，留空走 Vite 代理 |

## 本地启动

前置要求：Node.js 20+、MongoDB（可用 Docker 启动：`docker run -d --name bus-mongo -p 27017:27017 mongo:7.0`）。

```bash
# 后端
cd server
npm install
cp .env.example .env     # 按需修改连接串与密钥
npm run seed             # 首次启动导入班次数据与演示账号
npm run dev              # node --watch 热更新；或 npm start

# 前端（新终端）
cd client
npm install
npm run dev              # http://localhost:5173，/api 自动代理到 8080
```

演示账号：`demo@uniquetravels.com` / `demo1234`

## 生产部署

```bash
cd client && npm run build
cd ../server && NODE_ENV=production npm start
```

访问 `http://localhost:8080` 即可（端口由 `PORT` 调整）。
