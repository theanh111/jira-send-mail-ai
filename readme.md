# 📬 Jira Send Mail AI

**Tự động tạo báo cáo Daily Standup từ Jira và gửi email chuyên nghiệp bằng AI**

---

## 🧠 Giới thiệu

Dự án này giúp nhân viên:

- Tự động lấy danh sách các task từ Jira theo trạng thái **To Do**, **In Progress**, và **In Review**.
- Sử dụng **Google Gemini AI** để viết **báo cáo chi tiết** và **định dạng email HTML chuyên nghiệp**.
- Gửi báo cáo qua **Mailtrap SMTP**, hỗ trợ kiểm thử email trong môi trường an toàn.

---

## 🔧 Công nghệ sử dụng

| Công nghệ     | Mô tả                                    |
| ------------- | ---------------------------------------- |
| Node.js       | Nền tảng thực thi chính                  |
| Axios         | Gọi API Jira                             |
| dotenv        | Quản lý biến môi trường `.env`           |
| @google/genai | Gọi mô hình Gemini AI (Gemini 1.5 Flash) |
| Nodemailer    | Gửi email SMTP                           |
| Mailtrap      | Môi trường kiểm thử gửi email            |

---

## Cài đặt


### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Tạo file `.env` và cấu hình

```env
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_TOKEN=your-jira-api-token
GOOGLE_AI_API_KEY=your-google-api-key
```

> Lưu ý: API token của Jira và Google AI cần còn hiệu lực và có đủ quyền.

---

## Cách sử dụng

Chạy script bằng lệnh:

```bash
node index.js
```

Script sẽ:

1. Lấy danh sách task từ Jira theo JQL:
   - `To Do`
   - `In Progress`
   - `In Review`
2. Tổng hợp và định dạng danh sách.
3. Gửi nội dung cho **Gemini AI** để viết báo cáo HTML.
4. Gửi email đến địa chỉ `employee@gmail.com` thông qua Mailtrap.

---

## Cấu hình gửi mail

SMTP Mailtrap được cấu hình sẵn trong file:

```js
host: "sandbox.smtp.mailtrap.io",
port: 2525,
auth: {
  user: "0cec27570e04d9",
  pass: "880737b200b172"
}
```

Bạn có thể thay đổi thông tin này trong phần `transporter` của `nodemailer`.

---

## Kết quả

- Một email HTML được AI viết dựa trên danh sách Jira.
- Email được gửi tới người nhận qua Mailtrap.
- Format chuẩn HTML chuyên nghiệp, phù hợp với môi trường doanh nghiệp.
