const { DataTypes, Sequelize, Op } = require('sequelize')

const sequelize = new Sequelize('sqlite:memory:')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

const Color = sequelize.define('Color', {
  id: {
    type: DataTypes.NUMBER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

Color.hasMany(User)
User.belongsTo(Color)

async function main() {
  await sequelize.authenticate()
  console.log('authenticate success')

  await sequelize.sync({ force: true })

  {
    await Color.create({ id: 1, name: 'rosa'})
    await Color.create({ id: 2, name: 'violeta'})

    await User.create({ name: 'Rorri', ColorId: 1 })
    await User.create({ name: 'Eric' })
    await User.create({ name: 'Mila' })
  }

  {
    const users = await User.findAll({
      include: Color
    })
    console.log(users.map(u => u.toJSON()))
  }

  {
    const user = await User.findOne({
      where: {
        ColorId: {
          [Op.not]: null
        }
      }
    })
    const color = await user.getColor()
    console.log(color.toJSON())
  }

  {
    const color = await Color.create({
      id: 3,
      name: 'rojo'
    })
    console.log(color.toJSON())

    const result = await Color.destroy({
      where: {
        id: 3
      }
    })
    console.log('destroyed', result)
  }
}

;(async () => {
  try {
    await main()
  } catch (err) {
    console.log(err)
  }
})()
