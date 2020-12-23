import { Request, Response } from 'express';

export default {
  'POST /api/login': (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username !== 'admin' || password !== 'admin1') {
      res.json({
        code: 40300,
        data: null,
        message: '账号名或密码错误',
      });
      return;
    }

    res.json({
      code: 20000,
      data: null,
      message: 'Success',
    });
  },
  'POST /api/logout': (req: Request, res: Response) => {
    res.json({
      code: 20000,
      data: null,
      message: 'Success',
    });
  },
};