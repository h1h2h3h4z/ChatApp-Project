const db = require('../dbConnect')
const bcrypt = require('bcrypt')
const validator = require('validator');
const jwt = require('jsonwebtoken')
const CreateToken = (id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ id }, jwtkey, { expiresIn: "3d" });
}
const RegisterUser = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json("All Fields Are require!.....")
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json("Invailed email!.....")
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json("week password!.....")
    }
    try {
        const query = "SELECT * FROM chatApp.user WHERE email = ?";
        const [result] = await db.promise().query(query, [email]);

        if (result.length > 0) {
            return res.status(400).json("User with the given email already exists!");
        }

        const InsertQuery = "INSERT INTO chatApp.user(`name`, `email`, `password`, `createdAt`) VALUES (?,?,?,?)"
        const solt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, solt);
        const [insert] = await db.promise().query(InsertQuery, [name, email, hashedpassword, new Date()]);


        if (insert && insert.insertId) {
            const token = CreateToken(insert.insertId);
            return res.status(201).json({
                id: insert.insertId,
                name,
                email,
                token: token,
            });
        } else {
            return res.status(400).json("Error inserting user");
        }


    }
    catch (err) {
        return res.status(500).json('Server error');
    }

}
const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json("All fields are required...")
        }
        const SelectQuery = "SELECT * FROM chatApp.user WHERE email = ?";
        const [result] = await db.promise().query(SelectQuery, [email]);

        if (result.length > 0) {
            
            const isValidpassword = await bcrypt.compare(password,result[0].password)
            if(!isValidpassword){
                return res.status(401).json("Invalid Email or Password")
            }
            const token = CreateToken(result[0].userid);
            return res.status(200).json({
                id: result[0].userid,
                name : result[0].name,
                email,
                token: token,
            });

        }

        else {
            return res.status(401).json("Invalid Email or Password")

        }

    }
    catch (err) {
        return res.status(500).json('Server error');

    }
}
const FindUser = async(req,res)=>{
    const userid = req.params.userid;
    try{
        const SelectQuery = "SELECT * FROM chatApp.user where userid=?"
        const [result] =await db.promise().query(SelectQuery,[userid]);
        if(result.length>0){
            const r = JSON.stringify(result)
            const result2 = r.replace('[', '');
            const result3 = result2.replace(']','')
           const data = JSON.parse(result3)
            return res.status(200).json(data)
            
            
        }else{
            return res.status(200).json({message:"User not Founded......"})
        }
    }
    catch(err){
        return res.status(500).json({ error: 'Server error' });
    }
}
const GetUsers = async(req,res)=>{
    try{
        const SelectQuery = "SELECT * FROM chatApp.user"
        const [result] =await db.promise().query(SelectQuery);
        if(result.length>0){
            return res.status(200).json(result)
        }else{
            return res.status(200).json({message:"No Users Founded......"})
        }
    }
    catch(err){
        return res.status(500).json('Server error');
    }
}
module.exports = { RegisterUser, LoginUser,FindUser,GetUsers }