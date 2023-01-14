const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'https://res.cloudinary.com/dnitjpfm5/image/upload/v1672528895/fachetti/generic/150-1503945_transparent-user-png-default-user-image-png-png_d5kq3a.png'
      },
      isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull:true,
      }
    },
    {
      timestamps: true,
      createdAt: true,
      updatedAt: false,
    }
  );
};
