import express from 'express';
import aiModel from '../services/aiModel.js';
import db from '../services/database.js';
import config from '../config/index.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
    try {
        const { foods, timePeriod, model } = req.body;

        if (!foods || !Array.isArray(foods) || foods.length === 0) {
            return res.status(400).json({ error: '请提供食物列表' });
        }

        if (!timePeriod) {
            return res.status(400).json({ error: '请选择时间段' });
        }

        const modelName = model || config.model.default;
        const result = await aiModel.analyze(modelName, foods, timePeriod);

        const insertResult = await db.query(
            'INSERT INTO analyses (foods, time_period, result) VALUES ($1, $2, $3) RETURNING id',
            [JSON.stringify(foods), timePeriod, JSON.stringify(result)]
        );

        res.json({ success: true, result, historyId: insertResult.rows[0]?.id });
    } catch (error) {
        console.error('分析失败:', error);
        res.status(500).json({ error: error.message || '分析失败' });
    }
});

router.get('/analyses', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM analyses ORDER BY created_at DESC LIMIT 50'
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('获取历史记录失败:', error);
        res.status(500).json({ error: '获取历史记录失败' });
    }
});

router.get('/config/models', (req, res) => {
    res.json({
        success: true,
        data: {
            available: aiModel.getAvailableModels(),
            default: config.model.default
        }
    });
});

export default router;
