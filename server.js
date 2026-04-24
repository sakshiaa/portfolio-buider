const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// ================= TEST ROUTE=================
app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT ✅");
  res.send("TEST ROUTE WORKING ✅");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= DB CONNECTION =================
const db = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "portfolio_db",
    port: 3306,
  })
  .promise();

// Test DB
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("MySQL Connected ✅");
  } catch (err) {
    console.log("DB Connection Error ❌:", err);
  }
})();

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("DATA 👉", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required ❌",
      });
    }

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists ❌",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash],
    );

    res.json({
      success: true,
      message: "Registered successfully ✅",
    });
  } catch (err) {
    console.log("🔥 REAL ERROR 👉", err);

    res.status(500).json({
      success: false,
      message: err.sqlMessage || err.message,
    });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN DATA 👉", req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required ❌",
      });
    }

    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password ❌",
      });
    }

    const { password: _, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful ✅",
      user: safeUser,
    });
  } catch (err) {
    console.log("LOGIN ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: err.sqlMessage || err.message,
    });
  }
});
app.post("/forgot-password", async (req, res) => {
  try {
    console.log("FORGOT DATA 👉", req.body); // 👈 ADD THIS

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required ❌",
      });
    }

    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    console.log("USER FOUND 👉", user); // 👈 ADD THIS

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found ❌",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    res.status(200).json({
      success: true,
      message: "Password updated successfully ✅",
    });
  } catch (err) {
    console.log("FORGOT ERROR 👉", err); // 👈 IMPORTANT

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// ================= CONTACT =================
app.post("/contact", async (req, res) => {
  try {
    console.log("CONTACT HIT ✅");

    const { name, email, subject, message, phone, countryCode } = req.body;

    console.log("CONTACT DATA 👉", req.body);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields missing ❌",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sakshuu362@gmail.com",
        pass: "clliliuwnkfcyeuy",
      },
      tls: {
        rejectUnauthorized: false, // ✅ FIX HERE
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <sakshuu362@gmail.com>`,
      to: "sakshuu362@gmail.com",
      subject: subject || "New Contact Message 🚀",
      html: `
        <h2>📩 New Message from Portfolio</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${countryCode || ""} ${phone || ""}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Thank you! Your feedback has been submitted successfully ✅");

    res.json({
      success: true,
      message: "Message sent to email ✅",
    });
  } catch (err) {
    console.log("❌ CONTACT ERROR 👉", err);

    res.status(500).json({
      success: false,
      message: err.message || "Email failed ❌",
    });
  }
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000 🚀");
});

// ================= SAVE PROFILE =================
app.post("/profile", async (req, res) => {
  try {
    const { user_id, name, email, password } = req.body;

    console.log("PROFILE DATA 👉", req.body);
    console.log("PROFILE HIT ✅");

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name & Email required ❌",
      });
    }

    await db.query(
      "INSERT INTO profiles (user_id, name, email, password) VALUES (?, ?, ?, ?)",
      [user_id, name, email, password],
    );

    res.json({
      success: true,
      message: "Profile saved successfully ✅",
    });
  } catch (err) {
    console.log("PROFILE ERROR 👉", err);
    res.status(500).json({
      success: false,
      message: err.sqlMessage || err.message,
    });
  }
});
