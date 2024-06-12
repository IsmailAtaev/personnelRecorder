const sequelize = require("../database");
const { DataTypes } = require("sequelize");


const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    pass: { type: DataTypes.STRING, unique: true },
    login: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "USER" }
})


const UserInfo = sequelize.define('userInfo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    profilImg: { type: DataTypes.STRING },
    languages: { type: DataTypes.STRING },
})


const PdfDocument = sequelize.define('pdfDocument', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    pathPdf: { type: DataTypes.STRING },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
})


const EmployeeRegistrationTime = sequelize.define('EmployeeRegistrationTime', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    comeTime: { type: DataTypes.DATE, allowNull: false },
    leaveTime: { type: DataTypes.DATE, },
    flag: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    // Other model options
    tableName: 'EmployeeRegistrationTime',
    timestamps: false, // Disable timestamps if needed
    tableOptions: {
        timezone: false // Disable timezone conversion for this table
    }
})


const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { timestamps: false })


const Holiday = sequelize.define('holiday', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    color: { type: DataTypes.STRING, allowNull: false },

})



User.hasOne(UserInfo)
UserInfo.belongsTo(User)

User.hasMany(PdfDocument)
PdfDocument.belongsTo(User)


User.hasMany(EmployeeRegistrationTime)
EmployeeRegistrationTime.belongsTo(User)



// User.hasMany(Task)
// Task.belongsTo(User)

EmployeeRegistrationTime.hasOne(Task)
Task.belongsTo(EmployeeRegistrationTime)


module.exports = {
    User,
    UserInfo,
    PdfDocument,
    EmployeeRegistrationTime,
    Task,
    Holiday,
}
