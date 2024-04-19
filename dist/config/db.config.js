"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.DB_CONN_STRING;
//db connection
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(connectionString || "DB_CONN_STRING is not defined.");
        console.log(`Database connection successful to ${process.env.DB_NAME}`);
    }
    catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};
exports.default = connectDB;
