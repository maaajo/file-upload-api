"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config/config"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
const { port, host, logging } = config_1.default;
const initializeMiddleware = () => {
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)(logging.level));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, compression_1.default)());
};
const start = (port) => {
    try {
        initializeMiddleware();
        app.listen(port, () => {
            console.log(`App is listening on ${host}:${port}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start(port);
//# sourceMappingURL=app.js.map