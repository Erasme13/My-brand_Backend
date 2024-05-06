import User, { UserDocument } from '../models/user';

// Function to create a new user
export async function createUser(username: string, email: string, password: string): Promise<UserDocument>{
    try {
        const newUser = new User({ username, email, password });
        return await newUser.save();
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}

// Function to retrieve a user by email
export async function getUserByEmail(email: string): Promise<UserDocument | null> {
    try {
        return await User.findOne({ email }).exec();
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Failed to fetch user by email');
    }
}
