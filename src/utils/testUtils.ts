import User from '../models/user';

async function clearUsersFromDatabase() {
    try {
        await User.deleteMany({});
    } catch (error) {
        console.error('Error clearing users from database:', error);
        throw error;
    }
}

export default clearUsersFromDatabase;
