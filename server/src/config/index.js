import dotenv from 'dotenv';
dotenv.config();

export default {
    database: {
        url: process.env.DATABASE_URL
    },
    model: {
        default: process.env.DEFAULT_MODEL || 'qwen',
        qwen: {
            apiKey: process.env.QWEN_API_KEY,
            baseUrl: process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
        }
    }
};
