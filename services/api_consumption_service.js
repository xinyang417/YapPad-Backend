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
  let consumption = await ApiConsumption.findOne({ user: uid })
  // if no consumption record exists for the user, initialize one
  if (!consumption) {
    consumption = await ApiConsumption.create({
      calls: 0,
      user: uid
    });
  }

  // now ok to increment since we know consumption is not null
  consumption.calls += 1;
  await consumption.save();
}
/**
 * @param {Number} uid user id
 */
async function getApiConsumption(uid) {
  try {
    const consumption = await ApiConsumption.findOne({ user: uid });
    return consumption ? consumption.calls : 0; // 0 if no document is found
  } catch (error) {
    console.error(`Error fetching API consumption for user ${uid}:`, error);
    throw error; 
  }
}


module.exports = {
  initApiConsumption,
  incrementApiConsumption,
  getApiConsumption
}