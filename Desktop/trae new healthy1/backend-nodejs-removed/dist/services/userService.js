"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDemoUser = exports.verifyRefreshToken = exports.generateTokens = exports.getUserById = exports.authenticateUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
let users = [];
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
const findUserByEmail = (email) => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};
const findUserById = (id) => {
    return users.find(user => user.id === id);
};
const createUser = async (name, email, password) => {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, env_1.config.BCRYPT_ROUNDS);
    const newUser = {
        id: generateId(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    logger_1.logger.info('User created successfully', {
        userId: newUser.id,
        email: newUser.email
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};
exports.createUser = createUser;
const authenticateUser = async (email, password) => {
    const user = findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    user.lastLogin = new Date().toISOString();
    logger_1.logger.info('User authenticated successfully', {
        userId: user.id,
        email: user.email
    });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.authenticateUser = authenticateUser;
const getUserById = (id) => {
    const user = findUserById(id);
    if (!user) {
        throw new Error('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.getUserById = getUserById;
const generateTokens = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    const accessToken = jwt.sign(payload, env_1.config.JWT_SECRET, {
        expiresIn: env_1.config.JWT_EXPIRES_IN
    });
    const refreshToken = jwt.sign(payload, env_1.config.JWT_REFRESH_SECRET, {
        expiresIn: env_1.config.JWT_REFRESH_EXPIRES_IN
    });
    return {
        accessToken,
        refreshToken
    };
};
exports.generateTokens = generateTokens;
const verifyRefreshToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, env_1.config.JWT_REFRESH_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const createDemoUser = async () => {
    try {
        const demoUser = await (0, exports.createUser)('Demo User', 'demo@nutrition.com', 'demo123');
        logger_1.logger.info('Demo user created', { email: demoUser.email });
        return demoUser;
    }
    catch (error) {
        logger_1.logger.info('Demo user already exists or creation failed');
    }
};
exports.createDemoUser = createDemoUser;
(0, exports.createDemoUser)();
//# sourceMappingURL=userService.js.map