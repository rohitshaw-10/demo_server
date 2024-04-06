const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");

const cookieParser = require("cookie-parser");
const database = require("./config/database");

const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const { TokenExpiredError } = require("jsonwebtoken");

const PORT = process.env.PORT || 4005;
database.connect();

// Update the CORS configuration to allow requests from your frontend domain
const allowedOrigins = ["http://localhost:3000", "https://demo-server-ebon.vercel.app/"]; // Add your frontend domain here
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is allowed or if it's undefined (e.g., direct API requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
cloudinaryConnect();
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
