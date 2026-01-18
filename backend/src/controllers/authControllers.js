const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { response } = require('../app')

const register = async (req, res) => {
    try{
        const {username, email, password} = req.body
        
        if (!username || !email || !password){
            return res.status(400).json({message: 'All fields are required'})
        }
        if (password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters."})
        }

        const existingUser = await User.findOne({$or:[{email}, {password}]})

        if(existingUser){
            return res.status(400).json({message: "User Already Exists"})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            username,
            email, 
            password: hashedPassword
        })

        return res.status(201).json({
            message: "User registered Successfully",
            userId: user._id
        })
    } catch (e){
        console.log("Register error:", e)
        return res.status(500).json({message: "Internal Server Error."})
    }
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body
        if (!email || !password){
            return res.status(400).json({message: "Email and Password are required"})
        }

        const user = await User.findOne({email})
        if (!user){
            return res.status(400).json({message: "Invalid User"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({message: "Invalid Password"})
        }

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET, {expiresIn: "7d"}
        )
        
        return res.json({token, user: {id: user._id, username: user.username, email: user.email}})

    } catch (e){
        console.log('Login Error:', e)
        return res.status(500).json({message: "Internal Server Error"})
    }
}


module.exports = {
    register,
    login
}