// controllers/dashboard.controller.js

const {
    getDashboardStatsService, getRevenueChartService,
} = require(
    "../services/dashboard.service"
);


/*
========================================
GET DASHBOARD STATS
========================================
*/

exports.getDashboardStatsController =
    async (
        req,
        res,
        next
    ) => {

        try {

            const stats =
                await getDashboardStatsService();

            return res
                .status(200)
                .json({
                    success: true,

                    data: stats,
                });

        } catch (error) {

            next(error);

        }
    };

/*
========================================
REVENUE CHART
========================================
*/

exports.getRevenueChartController =
    async (
        req,
        res,
        next
    ) => {

        try {

            const result =
                await getRevenueChartService(
                    req.query.range
                );

            return res
                .status(200)
                .json({
                    success: true,

                    data:
                        result.chart,

                    stats:
                        result.stats,
                });

        } catch (error) {

            next(error);

        }
    };