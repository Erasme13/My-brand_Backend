"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_js_1 = require("./config/db.config.js");
const blogRoutes_js_1 = __importDefault(require("./routes/blogRoutes.js"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions_1 = __importDefault(require("./swagger/swaggerOptions"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const usersRoutes_js_1 = require("./routes/usersRoutes.js");
const contactRoutes_js_1 = __importDefault(require("./routes/contactRoutes.js"));
const commentRoutes_js_1 = __importDefault(require("./routes/commentRoutes.js"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const port = process.env.PORT || 4000;
exports.app.use((0, cors_1.default)());
exports.app.use((0, helmet_1.default)());
exports.app.use(body_parser_1.default.json());
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use(errorHandler_1.default);
// my routes
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions_1.default);
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
//routes
exports.app.use("/api", usersRoutes_js_1.usersRouter, blogRoutes_js_1.default, contactRoutes_js_1.default, commentRoutes_js_1.default);
db_config_js_1.db.then(() => {
    exports.app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
});