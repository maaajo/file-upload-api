"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.registerController = void 0;
const http_status_codes_1 = require("http-status-codes");
const prismaErrorHandler_1 = require("../../utils/db/prismaErrorHandler");
const http_exception_1 = require("../../utils/exceptions/http.exception");
const user_service_1 = require("../user/user.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_utils_1 = require("../../utils/auth/jwt.utils");
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.createNewUser)(req.body);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.OK,
            result: "SUCCESS",
            data: user,
        });
    }
    catch (error) {
        const prismaErrorMessage = (0, prismaErrorHandler_1.getPrismaErrorMessage)(error);
        const customException = new http_exception_1.CustomException(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, prismaErrorMessage || error);
        return next(customException);
    }
});
exports.registerController = registerController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email: providedEmail, password: providedPassword } = req.body;
        const getUserResult = yield (0, user_service_1.getUserByEmail)(providedEmail);
        if (!getUserResult) {
            const customException = new http_exception_1.CustomException(http_status_codes_1.StatusCodes.NOT_FOUND, "Email not found");
            return next(customException);
        }
        const isPasswordValid = yield bcrypt.compare(providedPassword, getUserResult.password);
        if (!isPasswordValid) {
            yield (0, user_service_1.insertLastFailedAuthAttempt)(providedEmail);
            const customException = new http_exception_1.CustomException(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid Password");
            return next(customException);
        }
        const token = (0, jwt_utils_1.createJwtToken)({
            email: providedEmail,
            role: getUserResult.role,
        });
        yield (0, user_service_1.insertSuccessAuthAttempt)(providedEmail);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            result: "SUCCESS",
            data: {
                token,
            },
        });
    }
    catch (error) {
        const customException = new http_exception_1.CustomException(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
        return next(customException);
    }
});
exports.loginController = loginController;
//# sourceMappingURL=auth.controller.js.map