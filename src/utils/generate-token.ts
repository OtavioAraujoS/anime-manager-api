import 'dotenv/config';
import * as jwt from 'jsonwebtoken';

export function generateToken() {
  try {
    const payload = { sub: 1, username: 'admin' };
    const secret = '';

    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    console.log('Token gerado:', token);
  } catch (error) {
    console.error('Erro ao gerar o token:', error);
  }
}

generateToken();
