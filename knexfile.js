module.exports = {
    development: {
      client: 'sqlite3',
      connection: {
        filename: './src/database/dev.sqlite3',
      },
      useNullAsDefault: true,
      migrations: {
        directory: './src/database/migrations',
      },
      seeds: {
        directory: './src/database/seeds',
      },
    },
};  