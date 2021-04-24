const router = require('express').Router();

router.get('/test', (req, res) => {
    res.send("This is my user test route.")
})

router.post('/register', async (req, res) => {
    const { email, username, password, firstName, lastName } = req.body; //revisit when we have modals
    try {
        console.log('start of the try')
        const newUser = await UserModel.create({
            email,
            username,
            firstName,
            lastName,
            password: bcrypt.hashSync(password, 13)
        });

        console.log('after the new model')

        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET,
            {
                expiresIn: 60 * 60 * 24
            }
        );
        console.log('after the token')
        res.status(201).json({
            message: "User Registered!",
            user: newUser,
            token
        })
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use." //Username already in use
            })
        } else {
            res.status(500).json({
                message: "Failed to register",
                error: err
            })
        }
    }
})

router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    try {
        let loginUser = await UserModel.findOne({
            where: {
                username
            }
        })
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password); //need to add bcrypt

            if (passwordComparison) {
                const token = jwt.sign(
                    { id: loginUser.id },
                    process.env.JWT_SECRET,
                    { expiresIn: 60 * 60 * 24 }
                )

                res.status(200).json({
                    message: "User successfully logged in!",
                    user: loginUser,
                    token
                })
            } else {
                res.status(401).json({
                    message: "Error: password."
                })
            }
        } else {
            res.status(401).json({
                message: "Error: username."
            })
        }
    } catch (error) {
        res.status(500).json({
            error: `Failed to login user. ${err}`
        })
    }
})


module.exports = router;


//REED WUZ HERE!!!