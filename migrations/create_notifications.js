exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('phone');
      table.timestamps(true, true);
    })
    .createTable('notifications', (table) => {
      table.increments('id').primary();
      table.enu('type', ['email', 'sms', 'in-app']).notNullable();
      table.text('message').notNullable();
      table.enu('status', ['pending', 'sent', 'failed']).defaultTo('pending');
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('notifications')
    .dropTableIfExists('users');
};
