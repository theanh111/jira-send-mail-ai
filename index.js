import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

const googleAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

const getAuthHeader = () => {
    return {
        auth: {
            username: JIRA_EMAIL,
            password: JIRA_TOKEN,
        },
        headers: {
            Accept: "application/json",
        },
    };
};

const jqls = {
    todo: `status = "To Do"`,
    inprogress: `status = "In Progress"`,
    inreview: `status = "In Review"`,
};

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "0cec27570e04d9",
        pass: "880737b200b172"
    }
});

async function sendMail(content) {
    console.log("Dang gui mail...")
    const mailOptions = {
        from: 'test@gmail.com',
        to: 'employee@gmail.com',
        subject: 'Daily Standup Report',
        html: content,
    };
    sendMail = transporter.sendMail(mailOptions, function (error, info) {
      
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    })
};

async function askGoogleAI(content) {
    const response = await googleAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
    });
    sendMail(response.text);
}

async function fetchIssues(jql) {
    const response = await axios.get(`${JIRA_URL}/rest/api/3/search`, {
        ...getAuthHeader(),
        params: { jql },
    });

    return response.data.issues.map((issue) => {
        const projectName = issue.fields.project == null ? '' : issue.fields.project.name;
        const issuePriority = issue.fields.priority == null ? '' : issue.fields.priority.name;
        const issueKey = issue.key;
        const issueName = issue.fields.summary;
        const issueDueDate = issue.fields.duedate;
        const issueCreator = issue.fields.creator == null ? '' : issue.fields.creator.displayName;
        const issueAssignee = issue.fields.assignee == null ? '' : issue.fields.assignee.displayName;
        return '- [Project Name: ' + projectName + '] -- [Issue Priority: ' + issuePriority + '] -- [Due Date: ' + issueDueDate + '] -- [Issue Creator: ' + issueCreator + '] -- [Issue Assignee: ' + issueAssignee + '] -- [Issue: ' + issueKey + ': ' + issueName + ']';
    });
}

(async () => {
    const todoTasks = await fetchIssues(jqls.todo);
    const inProgressTasks = await fetchIssues(jqls.inprogress);
    const inReviewTasks = await fetchIssues(jqls.inreview);

    const report = `
Daily Standup - ${new Date().toLocaleDateString("vi-VN")}

Danh sách To Do:
${todoTasks.join("\n") || "- (Không có task nào)"}

Danh sách In Progress:
${inProgressTasks.join("\n") || "- (Không có task nào)"}

Danh sách In Review:
${inReviewTasks.join("\n") || "- (Không có task nào)"}
`;

    console.log(report);

    askGoogleAI(`Dựa vào danh sách task trên hãy viết cho tôi một bản báo cáo chi tiết 
    và cụ thể kế hoạch làm các task dưới dạng html để tôi gửi mail, format cho tôi html mail như công ty. Không giải thích, không giới thiệu: ` + report)
})();