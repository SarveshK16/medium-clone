import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign } from "hono/jwt"
import { signupInput, signinInput } from "@sarveshsk/medium-common";


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>()

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const { success } = signupInput.safeParse(body)

    if (!success) {
        c.status(411);
        return c.json({
            message: "Incorrect inputs"
        })
    }
    try {
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
            },
        })

        const token = await sign({
            id: user.id,
        }, c.env.JWT_SECRET)

        // return c.text(token)
        return c.json({
            name: body.name,
            token,
        })
    } catch (error) {
        console.log(error);
        c.status(411);
        return c.text(`Invalid : ${error}`)
    }

})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const { success } = signinInput.safeParse(body)

    if (!success) {
        c.status(411);
        return c.json({
            message: "Incorrect inputs"
        })
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
                password: body.password
            }
        })

        if (!user) {
            c.status(403);
            return c.json({
                error: "user not found"
            });
        }

        const jwt = await sign(
            {
                id: user.id
            }, c.env.JWT_SECRET
        )
        return c.text(jwt)
    } catch (error) {
        console.log(error);
        c.status(411);
        return c.text('Invalid')
    }
})
