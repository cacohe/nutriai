import axios from 'axios';
import config from '../config/index.js';

class AIModelService {
    constructor() {
        this.models = new Map();
        this.registerModel('qwen', this.qwenHandler.bind(this));
    }

    registerModel(name, handler) {
        this.models.set(name, handler);
    }

    async qwenHandler(foods, timePeriod, modelName) {
        const prompt = this.buildPrompt(foods, timePeriod);
        let actualModel = modelName && modelName !== 'qwen' ? modelName : process.env.QWEN_MODEL_NAME;
        
        if (!actualModel) {
            throw new Error('请配置 QWEN_MODEL_NAME');
        }

        const baseUrl = config.model.qwen.baseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
        
        const response = await axios.post(
            `${baseUrl}/chat/completions`,
            {
                model: actualModel,
                messages: [
                    { role: 'system', content: '你是一位专业营养师，请根据用户提供的食物进行营养分析，给出专业的营养建议。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.model.qwen.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return this.parseResponse(response.data.choices[0].message.content);
    }

    buildPrompt(foods, timePeriod) {
        const foodList = foods.map(f => `${f.name} ${f.amount}`).join('、');
        const periodLabel = {
            'breakfast': '早餐',
            'lunch': '午餐', 
            'dinner': '晚餐',
            'whole_day': '全天',
            'custom': '自定义'
        }[timePeriod] || timePeriod;
        
        return `
请分析以下食物的营养情况：

时间段：${periodLabel}
食物：${foodList}

请按以下格式返回分析结果（JSON格式）：
{
    "summary": "总体营养情况概述",
    "missingNutrients": ["缺少的营养素/食物类别"],
    "excessNutrients": ["过剩的营养素/食物类别"],
    "seasoningIssues": ["调料品问题"],
    "recommendations": {
        "increase": ["建议增加的食物类别"],
        "decrease": ["建议减少的食物类别"]
    },
    "healthEffects": {
        "excess": "过多摄入某类食物的健康影响",
        "deficient": "某类食物摄入不足的健康影响"
    }
}

请确保返回的是有效的JSON格式，不要包含其他内容。
`;
    }

    parseResponse(content) {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return { raw: content };
        } catch (e) {
            return { raw: content, error: '解析失败' };
        }
    }

    async analyze(modelName, foods, timePeriod) {
        const prefix = modelName.split('-')[0];
        const handler = this.models.get(prefix);
        if (!handler) {
            throw new Error(`不支持的模型: ${modelName}`);
        }
        return handler(foods, timePeriod, modelName);
    }

    getAvailableModels() {
        return Array.from(this.models.keys());
    }
}

export default new AIModelService();
