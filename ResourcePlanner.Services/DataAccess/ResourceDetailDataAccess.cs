using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
using System.Web;
using ResourcePlanner.Services.Models;
using ResourcePlanner.Core.Utilities;
using ResourcePlanner.Services.Mapper;
using System.Data;
using System.Data.SqlClient;
using static ResourcePlanner.Services.Enums.Enums;
using ResourcePlanner.Services.Excel;

namespace ResourcePlanner.Services.DataAccess
{
    public class ResourceDetailDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public ResourceDetailDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }

        public DetailPage GetResourceDetail(int ResourceId, TimeAggregation Aggregation, DateTime StartDate, DateTime EndDate, string login)
        {
            var returnValue =  AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceDetail(reader),
                  _connectionString,
                  @"rpdb.ResourceDetailPageSelect",
                  CommandType.StoredProcedure,
                  _timeout,
                  CreateResourceDetailParamArray(ResourceId, Aggregation, StartDate, EndDate, login));
            returnValue.TimeScale = Aggregation;
            returnValue.TimePeriods = returnValue.Projects.Count > 0
                ? returnValue.Projects[0].Assignments.Select(a => a.TimePeriod).ToList()
                : new List<string>();
            return returnValue;
        }

        private SqlParameter[] CreateResourceDetailParamArray(int ResourceId, TimeAggregation Aggregation, DateTime StartDate, DateTime EndDate, string login)
        {
            var AggParam = new SqlParameter();
            if (Aggregation == TimeAggregation.Daily)
            {
                AggParam = AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Day");
            }
            else if (Aggregation == TimeAggregation.Monthly)
            {
                AggParam = AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Month");
            }
            else if (Aggregation == TimeAggregation.Quarterly)
            {
                AggParam = AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Quarter");
            }
            else
            {
                AggParam = AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Week");
            }
            var StartDateParam = AdoUtility.CreateSqlParameter("StartDateParam", SqlDbType.Date, StartDate);
            var EndDateParam = AdoUtility.CreateSqlParameter("EndDateParam", SqlDbType.Date, EndDate);
            var ResourceIdParam = AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, ResourceId);
            var loginParam = AdoUtility.CreateSqlParameter("login", 100, SqlDbType.VarChar, login);
            return new SqlParameter[] { StartDateParam, EndDateParam, ResourceIdParam, AggParam, loginParam };
        }
    }
}