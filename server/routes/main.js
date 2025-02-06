require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { genPassword, validPassword } = require("../utils/saltHashUtils.js");
const main = express.Router();
const prisma = new PrismaClient();
const { Anthropic } = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(` `);
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

main.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { hash, salt } = user;
    const isValidPassword = validPassword(password, hash, salt);

    if (isValidPassword) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "2d",
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

main.post("/api/signup", async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;
  const { salt, hash } = genPassword(password);
  await prisma.user.create({
    data: {
      username,
      email,
      firstName,
      lastName,
      salt,
      hash,
    },
  });
  res.status(201).json({
    message: "User created successfully",
  });
});

main.post("/api/create-post", verifyToken, async (req, res) => {
  const generateTitleAI = async (userBlogPost) => {
    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content:
            "Please generate an appropaite title for this blog post. Regardless, make sure the title is only a sentence long. only retrun the title." +
            userBlogPost,
        },
      ],
    });
    return completion.content[0].text;
  };

  try {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      const userId = parseInt(authData.userId);
      console.log("this is the user id", userId);
      const { content } = req.body;
      const titleAI = await generateTitleAI(content);
      await prisma.post.create({
        data: {
          title: titleAI,
          content,
          userId,
        },
      });

      res.json({
        message: `Post succesfully created!`,
      });
    });
  } catch (error) {
    console.error(error);
  }
});

main.post("/api/ai-completion", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      try {
        const completion = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: prompt + "your response has to be a string",
            },
          ],
        });

        res.json({
          content: completion.content[0].text,
        });
      } catch (openaiError) {
        console.error("OpenAI API Error:", openaiError);
        res.status(500).json({
          message: "Error getting AI completion",
          error: openaiError.message,
        });
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//this API is meant to get all the posts for a specific user based on the user
main.get("/api/all-posts-user", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
      const userId = parseInt(authData.userId);
      const posts = await prisma.post.findMany({
        where: { userId },
        include: {
          User: {
            select: {
              username: true,
              firstName: true,
              lastName: true
            }
          },       
          comments: {
            include: {
              User: {
                select: {
                  username: true,
                  firstName: true,
                  lastName: true
                } 
              }
            }
          },
        }
      });
      res.json(posts); 
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


main.get("/api/all-posts", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
      const posts = await prisma.post.findMany({
        where: {
          userId
        },
        include: {
          comments: {
            include: {
              User: {
                select: {
                  username: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          User: {
            select: {
              username: true
            }
          }
        },
        orderBy: {
          id: 'desc'
        }
       });
      res.json(posts);
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


main.delete("/api/delete-post", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
      const { postIdToDelete } = req.body; 
      const userId = parseInt(authData.userId); 
      const postToDelete = await prisma.post.delete({
        where: {
          id: parseInt(postIdToDelete)
        }
      })
      
      const newListOfPosts = await prisma.post.findMany({
        where: { userId },
        include: {
          User: {
            select: {
              username: true,
              firstName: true,
              lastName: true
            }
          },       
          comments: {
            include: {
              User: {
                select: {
                  username: true,
                  firstName: true,
                  lastName: true
                } 
              }
            }
          },
        }
      });
      res.json(newListOfPosts);
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = main;