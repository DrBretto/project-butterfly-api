const StrategyService = {
  getAllStrategies(knex, userId) {
    return knex
      .from("strategy")
      .select("*")
      .where("strategy.author_id", userId);
  },

  insertStrategy(knex, newStrategy) {
    return knex
      .insert(newStrategy)
      .into("strategy")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("strategy").select("*").where("id", id).first();
  },

  getByUser(knex, userId) {
    return knex.from("strategy").select("*").where("author_id", userId);
  },

  deleteStrategy(knex, id) {
    return knex("strategy").where({ id }).delete();
  },

  updateStrategy(knex, id, newStrategyFields) {
    return knex("strategy").where({ id }).update(newStrategyFields);
  },
};

module.exports = StrategyService;
