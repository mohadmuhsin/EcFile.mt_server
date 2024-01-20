
const userController = {
   
    async getUserData(req, res) {
        try {
            const data = req.user;
            if (!data)
                return res.status(404).json({ message: "please try again" })
            return res.status(200).json({ message: "You profile data ", data })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error!!" })
        }
    },
    async logout(req, res) {
        try {
            res.cookie("jwt", "", { maxAge: 0 });
            res.cookie("ReTkn", "", { maxAge: 0 });
            res.status(200).json({ message: "Thanks for visiting EcFile, Hope you will back" });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal Server Error" })
        }
    },
}


module.exports = userController;