"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.resizeImage = exports.saveFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const saveFile = async (file, folder = 'uploads') => {
    const filename = `${Date.now()}-${file.originalname}`;
    const dir = path_1.default.join(__dirname, '..', folder);
    await fs_1.default.promises.mkdir(dir, { recursive: true });
    const filepath = path_1.default.join(dir, filename);
    await fs_1.default.promises.writeFile(filepath, file.buffer);
    return filepath;
};
exports.saveFile = saveFile;
const resizeImage = async (filepath, width, height) => {
    const outputPath = filepath.replace(/\.(\w+)$/, '-resized.$1');
    await (0, sharp_1.default)(filepath).resize(width, height).toFile(outputPath);
    return outputPath;
};
exports.resizeImage = resizeImage;
const deleteFile = async (filepath) => {
    await fs_1.default.promises.unlink(filepath);
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=fileService.js.map