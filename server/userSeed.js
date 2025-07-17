import User from "./models/User.js";
import bcrypt from "bcrypt";
import connectToDatabase from "./db/db.js";
const userRegister = async () => {
  connectToDatabase();
  const isExist = await User.findOne({ email: process.env.ADMIN_EMAIL });
  const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  if (isExist) {
    // Cập nhật mật khẩu nếu admin đã tồn tại
    isExist.password = hashPassword;
    isExist.name = process.env.ADMIN_NAME; // cập nhật tên nếu cần
    await isExist.save();
    return;
  }

  const newUser = new User({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: hashPassword,
    role: "admin",
  });

  await newUser.save();
};

userRegister();
