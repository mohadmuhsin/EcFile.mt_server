const User = require("../models/user.model");

const adminController = {

    async getUsers(req, res) {
        try {
            const users = await User.find()
            if (!users)
                return res.status(404).json({ message: "No matched data found!!" });
            return res.status(200).json({ message: "Registered users", users });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error!!" })
        }
    },
  

    async getUserData(req, res) {
        try {
            const data = req.admin
            if (!data)
                return res.status(404).json({ message: "please try again" })
            return res.status(200).json(data)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error!!" })
        }
    },
    async logout(req, res) {
        try {
            let data = req.admin;
            res.cookie("adJwt", "", { maxAge: 0 });
            res.cookie("adReTkn", "", { maxAge: 0 });
            res.status(200).json({ message: "Thanks for visiting EcFile, Hope you will back", data });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal Server Error" })
        }
    },
}


module.exports = adminController;