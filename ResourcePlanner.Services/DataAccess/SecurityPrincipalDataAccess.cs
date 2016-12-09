using ResourcePlanner.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.DataAccess
{
    public class SecurityPrincipalDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public SecurityPrincipalDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public void Insert(string login)
        {

            AdoUtility.ExecuteQuery(null,
                 _connectionString,
                 @"rpdb.SecurityPrincipalInsert",
                 CommandType.StoredProcedure,
                 _timeout,
                 new SqlParameter[] { AdoUtility.CreateSqlParameter("name", 100, SqlDbType.VarChar, login)});
        }
        public void Delete(int AppRoleId)
        {

            AdoUtility.ExecuteQuery(null,
                 _connectionString,
                 @"rpdb.SecurityPrincipalDelete",
                 CommandType.StoredProcedure,
                 _timeout,
                 new SqlParameter[] { AdoUtility.CreateSqlParameter("AppRoleId", SqlDbType.Int, AppRoleId) });
        }
    }
}