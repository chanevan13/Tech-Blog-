const Sequelize = require("sequelize");
const { Model, DataTypes } = Sequelize;

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
	dialect: "mysql",
	host: "db",
    });

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    hashed_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const BlogPost = sequelize.define("BlogPost", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

User.hasMany(BlogPost, { onDelete: "CASCADE" });
BlogPost.belongsTo(User);

const Comment = sequelize.define("Comment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1,480],
        },
    },
});

User.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(User);
BlogPost.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(BlogPost);

module.exports = {
    BlogPost,
    User,
    Comment,
};
