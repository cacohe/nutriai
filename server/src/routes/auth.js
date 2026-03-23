import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../services/database.js';
import config from '../config/index.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'nutriai-secret-key-2024';

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: '请提供用户名和密码' });
        }

        if (username.length < 3 || username.length > 50) {
            return res.status(400).json({ error: '用户名长度需要在3-50个字符之间' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: '密码长度至少6个字符' });
        }

        const existingUser = await db.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: '用户名已存在' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
            [username, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                user: { id: user.id, username: user.username },
                token
            }
        });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({ error: '注册失败' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: '请提供用户名和密码' });
        }

        const result = await db.query(
            'SELECT id, username, password, created_at FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                user: { id: user.id, username: user.username },
                token
            }
        });
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

export default router;