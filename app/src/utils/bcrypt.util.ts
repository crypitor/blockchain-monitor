import * as bcrypt from 'bcrypt';
const saltRound = 10;
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRound);
}