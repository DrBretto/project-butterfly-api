const StockService = {
  getAllStocks(knex, userId) {
    return knex.from("stock").select("*").where("stock.author_id", userId);
  },

  insertStock(knex, newStock) {
    return knex
      .insert(newStock)
      .into("stock")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("stock").select("*").where("id", id).first();
  },

  deleteStock(knex, id) {
    return knex("stock").where({ id }).delete();
  },

  updateStock(knex, id, newStockFields) {
    return knex("stock").where({ id }).update(newStockFields);
  },
};

module.exports = StockService;
