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
    public class ResourceBreakdownDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public ResourceBreakdownDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }



        public ResourceBreakdown GetResourceBreakdown(int ResourceId, DateTime StartDate, DateTime EndDate)
        {
            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceBreakdown(reader),
                  _connectionString,
                  @"rpdb.ResourceBreakDownSelect",
                  CommandType.StoredProcedure,
                  _timeout,
                  CreateResourceBreakdownParamArray(ResourceId,StartDate, EndDate));
            return returnValue;
        }
        private SqlParameter[] CreateResourceBreakdownParamArray(int ResourceId, DateTime StartDate, DateTime EndDate)
        {
            var StartDateParam = AdoUtility.CreateSqlParameter("StartDateParam", SqlDbType.Date, StartDate);
            var EndDateParam = AdoUtility.CreateSqlParameter("EndDateParam", SqlDbType.Date, EndDate);
            var ResourceIdParam = AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, ResourceId);
           
            return new SqlParameter[] { StartDateParam, EndDateParam, ResourceIdParam };
        }
    }
}