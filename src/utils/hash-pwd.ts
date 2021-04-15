import * as crypto from 'crypto';

export const hashPwd = (p: string): string => {
    const hmac = crypto.createHmac('sha512', 'oHOoHO#hf83hf3fO#oif#OFh3o8ho8f');
    hmac.update(p);
    return hmac.digest('hex');
};
