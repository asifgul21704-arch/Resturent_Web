import { Router, Request, Response, NextFunction } from "express";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

type AccountRole = "customer" | "admin";

interface AccountDocument extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: AccountRole;
  createdAt: Date;
}

const accountSchema = new Schema<AccountDocument>({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 30, default: "" },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer", immutable: true },
  createdAt: { type: Date, default: Date.now }
});

const Account = mongoose.models.Account || mongoose.model<AccountDocument>("Account", accountSchema);
export const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." }
});

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  return secret;
};

const publicAccount = (account: AccountDocument) => ({
  id: account._id.toString(),
  name: account.name,
  email: account.email,
  phone: account.phone || "",
  avatar: "",
  role: account.role,
  addresses: [],
  dietaryPreferences: [],
  createdAt: account.createdAt.toISOString().slice(0, 10)
});

const issueSession = (res: Response, account: AccountDocument) => {
  const token = jwt.sign(
    { sub: account._id.toString(), role: account.role },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
  res.cookie("foody_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export interface AuthenticatedRequest extends Request {
  account?: AccountDocument;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.foody_session;
    if (!token) return res.status(401).json({ message: "Please sign in to continue." });

    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
    if (!payload.sub) return res.status(401).json({ message: "Invalid session." });

    const account = await Account.findById(payload.sub);
    if (!account) return res.status(401).json({ message: "Account no longer exists." });

    req.account = account;
    next();
  } catch {
    res.clearCookie("foody_session", { path: "/" });
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.account?.role !== "admin") {
    return res.status(403).json({ message: "Administrator access is required." });
  }
  next();
};

authRouter.use(authLimiter);

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone = "" } = req.body ?? {};
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
      return res.status(400).json({ message: "Please enter a name between 2 and 80 characters." });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }
    if (typeof password !== "string" || password.length < 10 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 10 and 128 characters." });
    }
    if (typeof phone !== "string" || phone.length > 30) {
      return res.status(400).json({ message: "Please enter a valid phone number." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await Account.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const account = await Account.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash,
      role: "customer"
    });

    issueSession(res, account);
    return res.status(201).json({ user: publicAccount(account) });
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    console.error("Foody registration error:", error);
    return res.status(500).json({ message: "Unable to create your account right now." });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const account = await Account.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    issueSession(res, account);
    return res.json({ user: publicAccount(account) });
  } catch (error) {
    console.error("Foody login error:", error);
    return res.status(500).json({ message: "Unable to sign in right now." });
  }
});

authRouter.get("/customers", requireAuth, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const customers = await Account.find({ role: "customer" })
      .select("name email phone createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({
      customers: customers.map((customer: any) => ({
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        role: "customer",
        avatar: "",
        createdAt: customer.createdAt ? new Date(customer.createdAt).toISOString() : null,
        addresses: [],
        dietaryPreferences: []
      })),
      total: customers.length
    });
  } catch (error) {
    console.error("Foody customer directory error:", error);
    return res.status(500).json({ message: "Unable to load customer directory." });
  }
});

authRouter.get("/me", requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: publicAccount(req.account!) });
});

authRouter.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("foody_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
  res.status(200).json({ message: "Signed out successfully." });
});

export const connectDatabaseAndBootstrapAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI is missing. Add your MongoDB Atlas connection string.");

  await mongoose.connect(mongoUri);
  console.log("Foody MongoDB connection established.");

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set; admin bootstrap skipped.");
    return;
  }
  if (adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  const existing = await Account.findOne({ email: adminEmail }).select("+passwordHash");
  if (existing) {
    if (existing.role !== "admin") {
      throw new Error("ADMIN_EMAIL already belongs to a customer account. Use a new admin email.");
    }
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await Account.create({
    name: "Foody Administrator",
    email: adminEmail,
    phone: "",
    passwordHash,
    role: "admin"
  });
  console.log("Initial Foody administrator account created.");
};
