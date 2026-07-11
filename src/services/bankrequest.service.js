const BankRequest = require("../models/bankrequest.model");

exports.createBankRequestService = async (data) => {
  return await BankRequest.create(data);
};

exports.getBankRequestsService = async () => {
  return await BankRequest.find().sort({
    createdAt: -1,
  });
};

exports.updateBankRequestService = async (id, data) => {
  return await BankRequest.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

exports.deleteBankRequestService = async (id) => {
  return await BankRequest.findByIdAndDelete(id);
};