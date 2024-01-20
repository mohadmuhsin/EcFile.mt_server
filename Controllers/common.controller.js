const { generateAccessToken, generateRefreshToken } = require("../auth/jwt.auth");
const User = require("../models/user.model");
const { GlobalSchema, Validate } = require("../validations/joi.validation")
const SchemaElements = GlobalSchema()
const bcrypt = require('bcrypt');
const Admin = require("../models/admin.model");
const { uploadToCloudinaryImage } = require("../utils/cloudinary");
const { sendVerifyEmailAsLink } = require("../auth/mail/emailVerify");


const commonController = {

    async register(req, res) {
        try {
            const { email, username, password, mobile, image } = req.body;
            console.log("here it is ", req.body);
            let userData;
            let validate;

            userData = {
                email: email,
                mobile: mobile,
                username: username,
                password: password
            }
            validate = Validate({
                email: SchemaElements.email,
                mobile: SchemaElements.mobile,
                username: SchemaElements.username,
                password: SchemaElements.password
            },
                userData
            )

            if (!validate.status) {
                console.log("erroro nda");
                return res.status(400).json({ message: validate.response[0].message })
            }

            const matching = await User.findOne({
                username: { $regex: new RegExp(username, 'i') },
            });
            if (matching) {
                return res.status(409).json({ message: "Username Already exist" });
            }

            const exists = await User.findOne({ email: email })
            if (exists)
                return res.status(400).json({ message: "This email is already registered" })

            const existAsAdmin = await Admin.findOne({ email: email })
            if (existAsAdmin)
                return res.status(400).json({ message: "This email is already registered" })

            const existNumber = await User.findOne({ mobile: mobile })
            if (existNumber)
                return res.status(400).json({ message: "This Mobile is already registered" })

            const hashedPassword = await bcrypt.hash(password, 10)
            if (!hashedPassword)
                return res.status(403).json({ message: "something went wrong try again!!" })

            let profile = {
                url: "",
                public_id: ""
            }
            await uploadToCloudinaryImage(image, "profile/user")
                .then((response) => {
                    profile.url = response.url
                    profile.public_id = response.public_id
                    console.log("image uploaded successfully");
                }).catch((err) => {
                    console.log(err);
                    return res.status(400).json({
                        message: "Image deletion failed",
                    });
                });

            let initialize;
            initialize = new User({
                email: email,
                mobile: mobile,
                username: username,
                password: hashedPassword,
                role: "user",
                profile: profile
            })
            await initialize.save()
                .then(() => {
                    return res.status(200).json({ message: "Registraion successfull" })
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({ message: "registeration failed, try again" });
                })


        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    },

    async login(req, res) {
        try {
            const { mobile, password, role } = req.body;
            console.log(req.body);
            let userData
            let validate;
            userData = {
                mobile: mobile,
                password: password
            }

            validate = Validate({
                mobile: SchemaElements.number,
                password: SchemaElements.password
            },
                userData
            )

            if (!validate.status) {
                return res.status(400).json({ message: validate.response[0].message })
            }
            let user;
            if (role === "user") {

                user = await User.findOne({ mobile: mobile })
                if (!user)
                    return res.status(404).json({ message: "Please enter a valid mobile number" });

                const validatePass = await bcrypt.compare(password, user.password);
                if (!validatePass)
                    return res.status(401).json({ message: "Password is incorrect!!" });
                console.log(user, "userdata");
                let authenticateEmail;
                await sendVerifyEmailAsLink(
                    user.email,
                    user.mobile,
                    "http://localhost:4200",
                ).then(async (response) => {
                    console.log(response, "verifien");
                    authenticateEmail = response;
                    if (authenticateEmail.status == false)
                        return res.status(400).json({
                            message: "Email is not validated",
                        });

                });
                return res.status(200).json({
                    message: "Verification link has been sent into your email",
                    code: authenticateEmail.verif_id,
                    user
                });

            } else if (role === "admin") {
                console.log("admin");
                user = await Admin.findOne({ mobile: mobile })
                if (!user)
                    return res.status(404).json({ message: "Please enter a valid mobile number" });

                const validatePass = await bcrypt.compare(password, user.password);
                if (!validatePass)
                    return res.status(401).json({ message: "Password is incorrect!!" });

                user = user.toObject();
                delete user.password;
                const payload = {
                    _id: user._id,
                    email: user.email,
                    role: user.role
                };

                const accessToken = generateAccessToken(payload, res);
                const refreshToken = generateRefreshToken(payload, res);
                const token = { accessToken, refreshToken };

                return res.json({ message: "welcome to the EcFile", user, token })
            }


        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    },
    async verifyUser(req, res) {
        try {
            const { mobile } = req.body;
            let user = await User.findOne({ mobile: mobile })
            if (!user)
                return res.status(404).json({ message: "User data not found" })

            user = user.toObject();
            delete user.password;
            const payload = {
                _id: user._id,
                email: user.email,
                role: user.role
            };

            const accessToken = generateAccessToken(payload, res);
            const refreshToken = generateRefreshToken(payload, res);
            const token = { accessToken, refreshToken };
           return res.json({ message: "welcome to the EcFile", user, token })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" })
        }
    }
}




module.exports = commonController;