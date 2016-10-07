using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourcePlanner.Services.Models;
using ResourcePlanner.Core.Utilities;
using ResourcePlanner.Services.Mapper;
using System.Data;
using System.Data.SqlClient;
using static ResourcePlanner.Services.Enums.Enums;

namespace ResourcePlanner.Services.DataAccess
{
    public class ResourceDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public ResourceDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public ResourcePage GetResourcePage(ResourceQuery pageParams)
        {


            ResourcePage returnValue = new ResourcePage();
            switch (pageParams.Aggregation)
            {


                case TimeAggregation.Daily:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader),
                        _connectionString,
                        @"rpdb.ResourcePageDailySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourcePageParamArray(pageParams));
                    break;

                case TimeAggregation.Weekly:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader),
                        _connectionString,
                        @"rpdb.ResourcePageWeeklySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourcePageParamArray(pageParams));
                    break;

                case TimeAggregation.Monthly:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader),
                        _connectionString,
                        @"rpdb.ResourcePageMonthlySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourcePageParamArray(pageParams));
                    break;

                case TimeAggregation.Quarterly:
            
                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader),
                        _connectionString,
                        @"rpdb.ResourcePageQuarterlySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourcePageParamArray(pageParams));
                    break;
                default:
                    break;
            }

            return returnValue;
        }

        public DetailPage GetResourceDetail(int ResourceId, DateTime StartDate, DateTime EndDate)
        {
            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceDetail(reader),
                _connectionString,
                @"rpdb.ResourceDetailSelect",
                CommandType.StoredProcedure,
                _timeout,
                CreateResourceDetailParamArray(ResourceId, StartDate, EndDate));
            return returnValue;
        }

        private SqlParameter[] CreateResourcePageParamArray(ResourceQuery pageParams)
        {
            var CityParam      = AdoUtility.CreateSqlTableValuedParameter("CityParam", AdoUtility.IntTableDbTypeName, SqlDbType.Structured, pageParams.City);
            var OrgUnitParam   = AdoUtility.CreateSqlTableValuedParameter("OrgUnitParam", AdoUtility.IntTableDbTypeName, SqlDbType.Structured, pageParams.OrgUnit);
            var RegionParam    = AdoUtility.CreateSqlTableValuedParameter("RegionParam", AdoUtility.IntTableDbTypeName, SqlDbType.Structured, pageParams.Region);
            var MarketParam    = AdoUtility.CreateSqlTableValuedParameter("MarketParam", AdoUtility.IntTableDbTypeName, SqlDbType.Structured, pageParams.Market);
            var PracticeParam  = AdoUtility.CreateSqlTableValuedParameter("PracticeParam", AdoUtility.IntTableDbTypeName, SqlDbType.Structured, pageParams.Practice);
            var PositionParam  = AdoUtility.CreateSqlParameter("PositionParam", 50, SqlDbType.VarChar, pageParams.Position[0]);
            var StartDateParam = AdoUtility.CreateSqlParameter("StartDateParam", SqlDbType.Date, pageParams.StartDate);
            var EndDateParam   = AdoUtility.CreateSqlParameter("EndDateParam", SqlDbType.Date, pageParams.EndDate);
            var SortOrderParam = AdoUtility.CreateSqlParameter("SortOrderParam", 20, SqlDbType.VarChar, pageParams.Sort.ToString());
            var SortDirectionParam = AdoUtility.CreateSqlParameter("SortDirectionParam", 20, SqlDbType.VarChar, pageParams.SortDirection.ToString());


            return new SqlParameter[] { SortOrderParam, SortDirectionParam,
                CityParam, OrgUnitParam, RegionParam, MarketParam, PracticeParam,
                PositionParam, StartDateParam, EndDateParam };
        }

        private SqlParameter[] CreateResourceDetailParamArray(int ResourceId, DateTime StartDate, DateTime EndDate)
        {
            var StartDateParam = AdoUtility.CreateSqlParameter("StartDateParam", SqlDbType.Date, StartDate);
            var EndDateParam = AdoUtility.CreateSqlParameter("EndDateParam", SqlDbType.Date, EndDate);
            var ResourceIdParam = AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, ResourceId);

            return new SqlParameter[] { StartDateParam, EndDateParam, ResourceIdParam };
        }
    }
}