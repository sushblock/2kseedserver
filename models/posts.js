module.exports = (sequelize, DataTypes) => {
    const posts = sequelize.define("posts",{
        title: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        postText: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
    });

    posts.associate = (models) => {
        posts.hasMany(models.comments, {
            onDelete: 'cascade',
        }),
        posts.hasMany(models.likes, {   
            onDelete: 'cascade',
        })
    }

    return posts
}