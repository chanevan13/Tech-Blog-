const path = require("path");

const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const models = require("./models");

async function runServer(port, sequelize) {
    const app = express();

    const sess = {
        secret: "972eece8-7efe-4d70-89d5-18059dbc5566",
        cookie: {
            maxAge: 300000,
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        },
        resave: false,
        saveUninitialized: true,
        store: new SequelizeStore({
            db: sequelize,
        }),
    };

    app.use(session(sess));
    const hbs = exphbs.create({});
    hbs.handlebars.registerHelper("toDateString", (date) => {
        return date.toDateString();
    });
    app.engine("handlebars", hbs.engine);
    app.set("view engine", "handlebars");
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, "public")));

    app.get("/", async (req, res) => {
        const posts = await models.BlogPost.findAll();
        res.render("home", { posts: posts.map((x) => x.toJSON()) });
    });

    app.get("/login", async (req, res) => {
        res.render("login");
    });
    const SALT_ROUNDS = 7;
    app.post("/login", async (req, res) => {
        const user = await models.User.findOne({
            where: { username: req.body.username },
        });
        if (!user) {
            res.redirect("/login");
            return;
        }

        if (!await bcrypt.compare(req.body.password, user.hashed_password)) {
            res.redirect("/login");
            return;
        }
        user.hashed_password = undefined;
        req.session.user = user;
        res.redirect("/dashboard");
    });

    app.get("/logout", (req, res) => {
        req.session.user = undefined;
        res.redirect("/");
    });

    app.get("/signup", async (req, res) => {
        res.render("signup");
    });

    app.post("/signup", async (req, res) => {
        const newUser = {
            username: req.body.username,
            hashed_password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
        };
        const resp = await models.User.create(newUser);
        console.log("New user ${resp}");
        res.redirect("/dashboard");
    });

    app.get("/dashboard", async (req, res) => {
        if (!req.session.user) {
            res.redirect("/login");
            return;
        }

        const user = await models.User.findByPk(req.session.user.id, {
            include: [models.BlogPost, {
                model:models.Comment,
                include: models.BlogPost,
            }],
        });
        res.render("dashboard", { user: user.toJSON() });
    });

    app.put("/post/:id", async (req, res) => {
        const post = await models.BlogPost.findByPk(req.params.id);
        await post.update(req.body);
    });

    app.delete("/post/:id", async (req, res) => {
        const post = await models.BlogPost.findByPk(req.params.id, { include: models.Comment });
        await post.destroy();
    });

    app.get("/post/:id", async (req, res) => {
        const post = await models.BlogPost.findByPk(req.params.id, {
            include: {
                model: models.Comment,
                include: {
                    model: models.User,
                    attributes: { exclude: ["hashed_password"] },
                },
            },
        });
        res.render("post", { post: post.toJSON(), user: req.session.user });
    });

    app.post("/post", async (req, res) => {
        if (!req.session.user) {
            res.redirect("/login");
            return;
        }
        const user = await models.User.findByPk(req.session.user.id);
        const desc = req.body.description || req.body.content.slice(0, 100); // TODO
        const post = await models.BlogPost.create({
            title: req.body.title,
            description: desc,
            content: req.body.content,
            postDate: new Date(),
        });
        user.addBlogPost(post);
        res.redirect("/dashboard");
    });

    app.post("/post/:id/comment", async (req, res) => {
        if (!req.session.user) {
            res.redirect("/login");
            return;
        }
        const user = await models.User.findByPk(req.session.user.id);
        const post = await models.BlogPost.findByPk(req.params.id);
        const comment = await models.Comment.create(req.body);
        await post.addComment(comment);
        await user.addComment(comment);

        res.redirect(`/post/${req.params.id}/`);
    });

    app.get("/editor", async (req, res) => {
        res.render("editor");
    });

    await sequelize.sync({ force: false });
    app.listen(port, () => console.log(`Now listening on ${port}`));
}

runServer(3001, new Sequelize({ dialect: "sqlite", storage: "csqueeze.db" }));

module.exports = {
    runServer,
};
