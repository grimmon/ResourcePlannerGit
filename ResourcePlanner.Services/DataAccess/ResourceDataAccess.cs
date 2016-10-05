using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourcePlanner.Services.Models;
using ResourcePlanner.Core.Utilities;
using ResourcePlanner.Services.Mapper;
using System.Data;
using System.Data.SqlClient;

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

            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader),
                _connectionString,
                @"rpdb.ResourcePageSelect",
                CommandType.StoredProcedure,
                _timeout,
                CreateResourcePageParamArray(pageParams));
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
            var AggParam       = AdoUtility.CreateSqlParameter("AggParam", 20, SqlDbType.VarChar, pageParams.Aggregation.ToString());
            var CityParam      = AdoUtility.CreateSqlParameter("CityParam",  SqlDbType.Int, pageParams.City[0]);
            var OrgUnitParam   = AdoUtility.CreateSqlParameter("OrgUnitParam", SqlDbType.Int, pageParams.OrgUnit[0]);
            var RegionParam    = AdoUtility.CreateSqlParameter("RegionParam", SqlDbType.Int, pageParams.Region[0]);
            var MarketParam    = AdoUtility.CreateSqlParameter("MarketParam", SqlDbType.Int, pageParams.Market[0]);
            var PracticeParam  = AdoUtility.CreateSqlParameter("PracticeParam", SqlDbType.Int, pageParams.Practice[0]);
            var PositionParam  = AdoUtility.CreateSqlParameter("PositionParam", 50, SqlDbType.VarChar, pageParams.Position[0]);
            var StartDateParam = AdoUtility.CreateSqlParameter("StartDateParam", SqlDbType.Date, pageParams.StartDate);
            var EndDateParam   = AdoUtility.CreateSqlParameter("EndDateParam", SqlDbType.Date, pageParams.EndDate);
            var SortOrderParam = AdoUtility.CreateSqlParameter("SortOrderParam", 20, SqlDbType.VarChar, pageParams.Sort.ToString());
            var SortDirectionParam = AdoUtility.CreateSqlParameter("SortDirectionParam", 20, SqlDbType.VarChar, pageParams.SortDirection.ToString());


            return new SqlParameter[] { AggParam, SortOrderParam, CityParam, OrgUnitParam, RegionParam, MarketParam,
                PracticeParam, PositionParam, StartDateParam, EndDateParam };
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