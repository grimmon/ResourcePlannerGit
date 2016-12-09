using ResourcePlanner.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.DataAccess
{
    public class AppRoleDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public AppRoleDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public void Insert(string name, bool setAsDefault)
        {

           AdoUtility.ExecuteQuery(null,
                _connectionString,
                @"rpdb.AppRoleInsert",
                CommandType.StoredProcedure,
                _timeout,
                new SqlParameter[] { AdoUtility.CreateSqlParameter("name", 100, SqlDbType.VarChar, name),
                                     AdoUtility.CreateSqlParameter("setAsDefault", SqlDbType.Bit, setAsDefault)});
        }
        public void Update(int appRoleId, string name = null, bool? setAsDefault = null)
        {
            var parameters = new List<SqlParameter>();
            parameters.Add(AdoUtility.CreateSqlParameter("appRoleId", SqlDbType.Int, appRoleId));
            if (name != null) { parameters.Add(AdoUtility.CreateSqlParameter("name", 100, SqlDbType.VarChar, name)); }
            if (setAsDefault.HasValue) { parameters.Add(AdoUtility.CreateSqlParameter("setAsDefault", SqlDbType.Bit, setAsDefault.Value)); }
            AdoUtility.ExecuteQuery(null,
             _connectionString,
             @"rpdb.AppRoleUpdate",
             CommandType.StoredProcedure,
             _timeout,
             parameters.ToArray());
        }
        public void Delete(int AppRoleId)
        {

            AdoUtility.ExecuteQuery(null,
                 _connectionString,
                 @"rpdb.AppRoleDelete",
                 CommandType.StoredProcedure,
                 _timeout,
                 new SqlParameter[] { AdoUtility.CreateSqlParameter("AppRoleId", SqlDbType.Int, AppRoleId)});
        }
    }
}