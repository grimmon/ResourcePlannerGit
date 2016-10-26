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
    public class EmailDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public EmailDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }
        public EmailRequestInfo GetResourceManagerByResourceId(int ResourceId, int userId)
        {
            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceManagerInfo(reader, userId),
               _connectionString,
               @"rpdb.ResourceManagerByResourceIdSelect",
               CommandType.StoredProcedure,
               _timeout,
               new SqlParameter[] { AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, ResourceId),
                                    AdoUtility.CreateSqlParameter("UserId", SqlDbType.Int, userId) });
            return returnValue;
        }
    }
}