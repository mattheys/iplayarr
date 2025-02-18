import dotenv from 'dotenv'
dotenv.config();

export const getParameter = (key) => {
    return process.env[key];
}