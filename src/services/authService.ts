import User, { UserDocument } from '../models/user';

import bcrypt from 'bcrypt';

async function loginUser(email: string, password: string): Promise<UserDocument | null> {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return null;
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export { loginUser };
