import User, { UserDocument } from '../models/user';

// Function to create a new user
export async function createUser(username: string, email: string, password: string): Promise<UserDocument>{
    const newUser = new User({ username, email, password });
    return await newUser.save();
}

// Function to retrieve a user by email
export async function getUserByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email }).exec();
}
