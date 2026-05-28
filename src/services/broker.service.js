const Broker =
  require(
    "../models/broker.model"
  );

/*
========================================
CREATE
========================================
*/

exports.createBrokerService =
  async (data) => {

    return await Broker.create(
      data
    );
  };

/*
========================================
GET ALL
========================================
*/

exports.getAllBrokersService =
  async () => {

    return await Broker.find()
      .sort({
        createdAt: -1,
      });
  };

/*
========================================
UPDATE
========================================
*/

exports.updateBrokerService =
  async (
    id,
    data
  ) => {

    return await Broker.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
  };

/*
========================================
DELETE
========================================
*/

exports.deleteBrokerService =
  async (id) => {

    return await Broker.findByIdAndDelete(
      id
    );
  };