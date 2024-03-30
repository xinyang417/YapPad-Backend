const ApiConsumption = require("../models/api_consumption_model")

/**
 * @param {Number} uid user id
 */
async function initApiConsumption(uid) {
  const consumption = await ApiConsumption.create({
    calls: 0,
    user: uid
  })
  await consumption.save()
}

/**
 * @param {Number} uid user id
 */
async function incrementApiConsumption(uid) {
  const consumption = await ApiConsumption.findOne({ user: uid })
  consumption.calls += 1;
  await consumption.save()
}

/**
 * @param {Number} uid user id
 */
async function getApiConsumption(uid) {
  const consumption = await ApiConsumption.findOne({ user: uid })
  return consumption.calls
}

module.exports = {
  initApiConsumption,
  incrementApiConsumption,
  getApiConsumption
}