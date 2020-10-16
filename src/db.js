const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/whatsapp')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    notNull: true
  },
  alias: {
    type: DataTypes.STRING,
    notNull: true
  },
  number: {
    type: DataTypes.STRING,
    notNull: true,
  },
  avatarUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
})

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  from: {
    type: DataTypes.UUID,
    notNull: true
  },
  to: {
    type: DataTypes.UUID,
    notNull: true
  },
  text: {
    type: DataTypes.STRING,
    notNull: true,
  },
})

const Contact = sequelize.define('Contact', {
  owner: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  contact: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
})

const Call = sequelize.define('Call', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  from: {
    type: DataTypes.UUID,
    notNull: true,
  },
  to: {
    type: DataTypes.UUID,
    notNull: true,
  },
  duration_ms: {
    type: DataTypes.INTEGER,
    notNull: true,
    validate: {
      min: 0,
    },
  },
  missed: {
    type: DataTypes.BOOLEAN,
    notNull: true,
  }
})

User.hasMany(Message, { foreignKey: 'from' })
Message.belongsTo(User, { foreignKey: 'from' })

User.hasMany(Message, { foreignKey: 'to' })
Message.belongsTo(User, { foreignKey: 'to' })

User.belongsToMany(User, { through: Contact, foreignKey: 'owner', as: 'Owners' })
User.belongsToMany(User, { through: Contact, foreignKey: 'contact', as: 'Contacts' })
Contact.belongsTo(User, { foreignKey: 'owner', as: 'Owner' })
Contact.belongsTo(User, { foreignKey: 'contact', as: 'Contact' })

User.hasMany(Call, { foreignKey: 'from', as: 'CallFrom' })
Call.belongsTo(User, { foreignKey: 'from', as: 'From' })

User.hasMany(Call, { foreignKey: 'to', as: 'CallTo' })
Call.belongsTo(User, { foreignKey: 'to', as: 'To' })

async function init() {
  console.log("initiating database...")
  await sequelize.authenticate()
  await sequelize.sync({ force: true })

  console.log('filling db...')
  await fillDb()
}

async function fillDb() {
  await User.bulkCreate([
    {
      id: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      name: "Eric",
      alias: "eric",
      number: "1111-1111",
      avatarUrl: "https://api.adorable.io/avatars/285/gonza.png"
    },
    {
      id: "d3d0ce4b-7d9e-4788-8f08-33316f42a41b",
      name: "Gonzalo",
      alias: "gonza",
      number: "1111-1111",
      avatarUrl: "https://api.adorable.io/avatars/285/gonza.png"
    },
    {
      id: "ea4803ca-782b-4d77-9379-f4aa878244be",
      name: "Jónatan",
      alias: "jona",
      number: "2222-2222",
      avatarUrl: "https://api.adorable.io/avatars/285/jona.png"
    }
  ]);

  await Message.bulkCreate([
    {
      id: "6714ddd8-eaf9-459c-91df-dfc80b28fdd6",
      from: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      to: "d3d0ce4b-7d9e-4788-8f08-33316f42a41b",
      createdAt: "Fri Oct 09 2020 12:27:41 GMT-0300 (Argentina Standard Time)",
      text: "hola gonza"
    },
    {
      id: "1d569940-5456-469e-a80a-9a24b71a6072",
      from: "d3d0ce4b-7d9e-4788-8f08-33316f42a41b",
      to: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      createdAt: "Fri Oct 09 2020 12:28:41 GMT-0300 (Argentina Standard Time)",
      text: "hola eric"
    },
    {
      id: "d10264a9-5af5-4649-872c-746c15e49b7f",
      from: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      to: "d3d0ce4b-7d9e-4788-8f08-33316f42a41b",
      createdAt: "Fri Oct 09 2020 12:29:41 GMT-0300 (Argentina Standard Time)",
      text: "necesito ayuda con js"
    },
    {
      id: "2e37c289-8569-455d-85db-9bc94671f9ca",
      from: "d3d0ce4b-7d9e-4788-8f08-33316f42a41b",
      to: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      createdAt: "Fri Oct 09 2020 12:30:41 GMT-0300 (Argentina Standard Time)",
      text: "oka, en que te ayudo"
    },
    {
      id: "64c91357-ca44-4fca-baf8-4f03433edb3b",
      from: "ea4803ca-782b-4d77-9379-f4aa878244be",
      to: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      createdAt: "Fri Oct 09 2020 12:28:41 GMT-0300 (Argentina Standard Time)",
      text: "hola Eric, vos trabajaste en el log in?"
    },
    {
      id: "1e903edc-422e-4e5e-9e22-55ca6ddefde3",
      from: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      to: "ea4803ca-782b-4d77-9379-f4aa878244be",
      createdAt: "Fri Oct 09 2020 12:29:41 GMT-0300 (Argentina Standard Time)",
      text: "hola Jonatan. sí, el sprint pasado"
    },
    {
      id: "c11d3c6c-832a-42d2-88c4-a9e1375fed50",
      from: "ea4803ca-782b-4d77-9379-f4aa878244be",
      to: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      createdAt: "Fri Oct 09 2020 12:30:41 GMT-0300 (Argentina Standard Time)",
      text: "esta devolviendo 404"
    },
    {
      id: "70a087dc-9509-4c82-bef3-a4d28e305721",
      from: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      to: "ea4803ca-782b-4d77-9379-f4aa878244be",
      createdAt: "Fri Oct 09 2020 12:31:41 GMT-0300 (Argentina Standard Time)",
      text: "dame un segundo que lo reviso"
    }
  ])

  await Contact.bulkCreate([
    {
      owner: '76cf9e44-562a-424c-8cd0-6dfddb09af64',
      contact: 'd3d0ce4b-7d9e-4788-8f08-33316f42a41b',
    },
    {
      owner: '76cf9e44-562a-424c-8cd0-6dfddb09af64',
      contact: 'ea4803ca-782b-4d77-9379-f4aa878244be',
    },
    {
      owner: 'd3d0ce4b-7d9e-4788-8f08-33316f42a41b',
      contact: '76cf9e44-562a-424c-8cd0-6dfddb09af64',
    },
    {
      owner: 'ea4803ca-782b-4d77-9379-f4aa878244be',
      contact: '76cf9e44-562a-424c-8cd0-6dfddb09af64',
    },
  ])

  await Call.bulkCreate([
    {
      id: "e8ced4e5-b654-479e-929f-9d896e48eff5",
      from: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      to: "ea4803ca-782b-4d77-9379-f4aa878244be",
      createdAt: "Fri Oct 09 2020 12:31:41 GMT-0300 (Argentina Standard Time)",
      duration_ms: 300000,
      missed: false
    },
    {
      id: "6e4d7be9-9573-4494-b394-6a815a83ab7d",
      from: "d3d0ce4b-7d9e-4788-8f08-33316f42a41b",
      to: "76cf9e44-562a-424c-8cd0-6dfddb09af64",
      createdAt: "Fri Oct 09 2020 11:31:41 GMT-0300 (Argentina Standard Time)",
      duration_ms: 10000,
      missed: true
    }
  ])
}

module.exports = {
  init,
  User,
  Message,
  Contact,
  Call,
}