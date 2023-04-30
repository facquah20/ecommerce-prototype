import { createHash } from 'crypto';

export function hashPassword(password){
    return createHash('sha256').update(password).digest('hex');

}