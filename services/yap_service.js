const Yap = require("../models/yap_model");

async function createYap(title, content, authorId) {
  try {
    const yap = new Yap({
      title,
      content,
      author: authorId,
    });
    const savedYap = await yap.save();
    return savedYap;
  } catch (error) {
    throw error;
  }
}

async function getYaps() {
  try {
    const yaps = await Yap.find();
    return yaps;
  } catch (error) {
    throw error;
  }
}

async function getYap(id) {
  try {
    const yap = await Yap.findById(id);
    if (!yap) {
      throw new Error("Yap not found");
    }
    return yap;
  } catch (error) {
    throw error;
  }
}

async function updateYap(id, title, content) {
  try {
    const yap = await Yap.findById(id);
    if (!yap) {
      throw new Error("Yap not found");
    }
    yap.title = title;
    yap.content = content;
    yap.updatedAt = Date.now();
    const updatedYap = await yap.save();
    return updatedYap;
  } catch (error) {
    throw error;
  }
}

async function deleteYap(id) {
  try {
    const yap = await Yap.findByIdAndDelete(id);
    if (!yap) {
      throw new Error("Yap not found");
    }
    return yap;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createYap,
  getYaps,
  getYap,
  updateYap,
  deleteYap,
};
