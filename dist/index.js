"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT;
if (!PORT) {
    console.log("Port not set in .env file");
    process.exit(1);
}
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.log(err);
});
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://letushelp-dev.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: false }));
// external routes
app.use('/api/v1/users', userRoute_1.default);
app.listen(8080, () => {
    console.log(`Server started on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});
