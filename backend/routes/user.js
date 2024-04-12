const express = require('express')
const zod = require('zod')
const { User } = require("../db.js")        //** obj deref
const JWT_SECRET = require("../config.js")
const { authMiddleware } = require('../middleware.js')

const router = express.Router()

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

router.post("/signup", async (req, res) => {
    const body = req.body
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.json({
            message: "Invalid inputs", 
        })
    }

    const existingUser = await User.finOne({
        username: req.body.username,
    })

    if(existingUser){
        return res.json({
            message: "Useranme already taken",
        })
    }
    
    const dbUser = await User.create(body)
    const userId = dbUser._id

    const token = jwt.sign({
            userId,
    }, JWT_SECRET)

    res.json({
        message: "User created succesfully",
        token: token
    })

})

const signinSchema = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }
    
    res.status(411).json({
        message: "Error while logging in"
    })
})


const updateBodySchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/', authMiddleware, async (req, res) => {
    const { success } = updateBodySchema.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Error while updating the information",
        })
    }
    
    await User.updateOne(req.body, {
        id: req.userId
    })
    
    res.json({
        message: "Updates successfully",
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || ""
    
    const users = await User.find({
        $or: [{
            firstName: {
                $regex: filter
            },       
            lastName: {
                $regex: filter
            }            
        }]
    })
    
    res.json({
        users: users.map(user => ({             // ** user: 
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        }))
    })
})

module.exports = router



// ** User here is model of db created 
// ** dbUser here is the instance of model User created if new user has to be added to db
// ** whenever hitting backend -->> await 


// ** signup signin update buld route ends
// **