import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt"
import { createBlogInput, updateBlogInput } from "@sarveshsk/medium-common";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string,
    }
}>()

blogRouter.use("/*", async (c, next) => {
    const header = c.req.header("authorization") || ""
    const token = header.split(" ")[1]

    try {
        const user = await verify(token, c.env.JWT_SECRET)
        if (user) {
            //@ts-ignore
            c.set("userId", user.id)
            await next()
        } else {
            c.status(403)
            return c.json(
                { message: "You are not logged in" }
            );
        }
    } catch (error) {
        c.status(403)
        return c.json(
            { message: "You are not logged in" }
        );
    }


})

blogRouter.post('/', async (c) => {
    const body = await c.req.json()
    const { success } = createBlogInput.safeParse(body)

    if (!success) {
        c.status(411);
        return c.json({
            message: "Incorrect inputs"
        })
    }
    const userId = c.get("userId")
    console.log(userId)
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userId,
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json()
    const { success } = updateBlogInput.safeParse(body)

    if (!success) {
        c.status(411);
        return c.json({
            message: "Incorrect inputs"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blogs = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    })

    return c.json({
        blogs
    })
})

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return c.json({
            blog
        })
    } catch (error) {
        c.status(411)
        return c.json({
            message: "Error while fetching the blog post"
        })
    }
})