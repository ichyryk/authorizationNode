import bcrypt from 'bcryptjs';
import Role from './models/Role.js';
import User from './models/User.js'
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import  configObj from './config.js';

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    };

    return jwt.sign(payload, configObj.secret, {expiresIn: "24h"});
};

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Error registration', errors})
            };
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({message: "User exist with this username"})
            };
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: "ADMIN" });
            const user = new User({ username, password: hashPassword, roles: [userRole.value] });
            await user.save();
            return res.json({ message: "User successfully registered" });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "Registration error"});
        };
    };

    async login(req, res) { 
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return req.status(400).json({ message: "User is not found" });
            };
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Password incorrect' });
            }; 
            const token = generateAccessToken(user._id, user.roles);
         
            return res.json({ token });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "Login error"});
        };
    };
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Users error"});
        };
    };
};

export default new AuthController();