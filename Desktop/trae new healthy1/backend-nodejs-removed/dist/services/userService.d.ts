export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    lastLogin?: string;
}
export declare const createUser: (name: string, email: string, password: string) => Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    lastLogin?: string;
}>;
export declare const authenticateUser: (email: string, password: string) => Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    lastLogin?: string;
}>;
export declare const getUserById: (id: string) => {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    lastLogin?: string;
};
export declare const generateTokens: (user: {
    id: string;
    email: string;
    role: string;
}) => {
    accessToken: any;
    refreshToken: any;
};
export declare const verifyRefreshToken: (refreshToken: string) => any;
export declare const createDemoUser: () => Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    lastLogin?: string;
} | undefined>;
//# sourceMappingURL=userService.d.ts.map