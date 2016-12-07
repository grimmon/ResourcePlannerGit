using ResourcePlanner.Core.Utilities;
using ResourcePlanner.Services.Mapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.DataAccess
{
    public class AuthDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public AuthDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public bool CheckAuth(string userName, string authType )
        {

            var authorized = AdoUtility.ExecuteQuery(reader => EntityMapper.CheckAuth(reader),
                _connectionString,
                @"rpdb.CheckAuthorization",
                CommandType.StoredProcedure,
                _timeout,
                new SqlParameter[] { AdoUtility.CreateSqlParameter("UserName", 50, SqlDbType.VarChar, userName),
                                     AdoUtility.CreateSqlParameter("AuthType", 50, SqlDbType.VarChar, authType)});

            return authorized;
        }

        public List<Enums.Enums.Permission> PermissionsByLogin(string login)
        {
            return AdoUtility.ExecuteQuery(reader => EntityMapper.MapToPermissions(reader),
                _connectionString,
                @"rpdb.PermissionByPrincipalSelect",
                CommandType.StoredProcedure,
                _timeout,
                new SqlParameter[] { AdoUtility.CreateSqlParameter("Login", 100, SqlDbType.VarChar, login)});
        }
    }
}