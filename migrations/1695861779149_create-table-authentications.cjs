/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    id: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
