// services/dashboard.service.js

const Order =
  require("../models/order.model");

const User =
  require("../models/user.model");

/*
========================================
GET DASHBOARD STATS
========================================
*/

exports.getDashboardStatsService =
  async () => {

    /*
    ========================================
    DATES
    ========================================
    */

    const now =
      new Date();

    const currentMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const previousMonth =
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

    const previousMonthEnd =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      );

    /*
    ========================================
    TOTAL ORDERS
    ========================================
    */

    const totalOrders =
      await Order.countDocuments();

    /*
    ========================================
    TOTAL CUSTOMERS
    ========================================
    */

    const totalCustomers =
      await User.countDocuments({
        role: "user",
      });

    /*
    ========================================
    TOTAL REVENUE
    ========================================
    */

    const totalRevenueData =
      await Order.aggregate([
        {
          $match: {
            status: {
              $ne:
                "cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,

            total: {
              $sum:
                "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      totalRevenueData[0]
        ?.total || 0;

    /*
    ========================================
    CURRENT MONTH REVENUE
    ========================================
    */

    const currentMonthRevenueData =
      await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte:
                currentMonth,
            },

            status: {
              $ne:
                "cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,

            total: {
              $sum:
                "$totalAmount",
            },
          },
        },
      ]);

    const monthlyRevenue =
      currentMonthRevenueData[0]
        ?.total || 0;

    /*
    ========================================
    PREVIOUS MONTH REVENUE
    ========================================
    */

    const previousMonthRevenueData =
      await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte:
                previousMonth,

              $lte:
                previousMonthEnd,
            },

            status: {
              $ne:
                "cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,

            total: {
              $sum:
                "$totalAmount",
            },
          },
        },
      ]);

    const previousRevenue =
      previousMonthRevenueData[0]
        ?.total || 0;

    /*
    ========================================
    CURRENT MONTH ORDERS
    ========================================
    */

    const currentMonthOrders =
      await Order.countDocuments({
        createdAt: {
          $gte:
            currentMonth,
        },
      });

    /*
    ========================================
    PREVIOUS MONTH ORDERS
    ========================================
    */

    const previousMonthOrders =
      await Order.countDocuments({
        createdAt: {
          $gte:
            previousMonth,

          $lte:
            previousMonthEnd,
        },
      });

    /*
    ========================================
    CURRENT MONTH CUSTOMERS
    ========================================
    */

    const currentMonthCustomers =
      await User.countDocuments({
        role: "user",

        createdAt: {
          $gte:
            currentMonth,
        },
      });

    /*
    ========================================
    PREVIOUS MONTH CUSTOMERS
    ========================================
    */

    const previousMonthCustomers =
      await User.countDocuments({
        role: "user",

        createdAt: {
          $gte:
            previousMonth,

          $lte:
            previousMonthEnd,
        },
      });

    /*
    ========================================
    GROWTH CALCULATOR
    ========================================
    */

    const calculateGrowth =
      (
        current,
        previous
      ) => {

        if (
          previous === 0
        ) {

          if (
            current === 0
          ) {
            return "0";
          }

          return "100";
        }

        return (
          (
            (current -
              previous) /
            previous
          ) *
          100
        ).toFixed(1);
      };

    /*
    ========================================
    RETURN
    ========================================
    */

    return {
      totalOrders,

      totalRevenue,

      totalCustomers,

      monthlyRevenue,

      ordersGrowth:
        calculateGrowth(
          currentMonthOrders,
          previousMonthOrders
        ),

      revenueGrowth:
        calculateGrowth(
          monthlyRevenue,
          previousRevenue
        ),

      customersGrowth:
        calculateGrowth(
          currentMonthCustomers,
          previousMonthCustomers
        ),

      monthlyGrowth:
        calculateGrowth(
          monthlyRevenue,
          previousRevenue
        ),
    };
  };

  /*
========================================
REVENUE CHART
========================================
*/

/*
========================================
REVENUE CHART
========================================
*/

exports.getRevenueChartService =
  async (range) => {

    const chart = [];

    const now =
      new Date();

    /*
    ========================================
    30 DAYS (DAILY DATA)
    ========================================
    */

    if (
      range === "30days"
    ) {

      for (
        let i = 29;
        i >= 0;
        i--
      ) {

        const start =
          new Date();

        start.setDate(
          now.getDate() - i
        );

        start.setHours(
          0,
          0,
          0,
          0
        );

        const end =
          new Date(start);

        end.setHours(
          23,
          59,
          59,
          999
        );

        const revenueData =
          await Order.aggregate([
            {
              $match: {
                createdAt: {
                  $gte:
                    start,

                  $lte:
                    end,
                },

                status: {
                  $ne:
                    "cancelled",
                },
              },
            },
            {
              $group: {
                _id: null,

                totalRevenue:
                  {
                    $sum:
                      "$totalAmount",
                  },

                totalOrders:
                  {
                    $sum: 1,
                  },
              },
            },
          ]);

        chart.push({
          month:
            start.toLocaleDateString(
              "default",
              {
                day: "numeric",
              }
            ),

          revenue:
            revenueData[0]
              ?.totalRevenue || 0,

          orders:
            revenueData[0]
              ?.totalOrders || 0,
        });
      }
    }

    /*
    ========================================
    MONTHLY DATA
    ========================================
    */

    else {

      let monthsToShow = 6;

      if (
        range ===
        "3months"
      ) {

        monthsToShow = 3;
      }

      if (
        range ===
        "1year"
      ) {

        monthsToShow = 12;
      }

      for (
        let i =
          monthsToShow - 1;
        i >= 0;
        i--
      ) {

        const start =
          new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
          );

        const end =
          new Date(
            now.getFullYear(),
            now.getMonth() -
              i +
              1,
            0,
            23,
            59,
            59
          );

        const revenueData =
          await Order.aggregate([
            {
              $match: {
                createdAt: {
                  $gte:
                    start,

                  $lte:
                    end,
                },

                status: {
                  $ne:
                    "cancelled",
                },
              },
            },
            {
              $group: {
                _id: null,

                totalRevenue:
                  {
                    $sum:
                      "$totalAmount",
                  },

                totalOrders:
                  {
                    $sum: 1,
                  },
              },
            },
          ]);

        chart.push({
          month:
            start.toLocaleString(
              "default",
              {
                month:
                  "short",
              }
            ),

          revenue:
            revenueData[0]
              ?.totalRevenue || 0,

          orders:
            revenueData[0]
              ?.totalOrders || 0,
        });
      }
    }

    /*
    ========================================
    TOTAL STATS
    ========================================
    */

    const totalRevenueData =
      await Order.aggregate([
        {
          $match: {
            status: {
              $ne:
                "cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,

            totalRevenue:
              {
                $sum:
                  "$totalAmount",
              },

            totalOrders:
              {
                $sum: 1,
              },
          },
        },
      ]);

    /*
    ========================================
    RETURN
    ========================================
    */

    return {
      chart,

      stats: {
        totalRevenue:
          totalRevenueData[0]
            ?.totalRevenue || 0,

        totalOrders:
          totalRevenueData[0]
            ?.totalOrders || 0,
      },
    };
  };