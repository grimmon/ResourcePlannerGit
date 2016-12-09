using ResourcePlanner.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.DataAccess
{
    public class RolePermissionDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public RolePermissionDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public void Add(int permissionId, int appRoleId)
        {

            AdoUtility.ExecuteQuery(null,
                 _connectionString,
                 @"rpdb.RoleMembershipAdd",
                 CommandType.StoredProcedure,
                 _timeout,
                 new SqlParameter[] { AdoUtility.CreateSqlParameter("permissionId", SqlDbType.Int, permissionId),
                                     AdoUtility.CreateSqlParameter("appRoleId", SqlDbType.Int, appRoleId)});
        }
        public void Remove(int permissionId, int appRoleId)
        {

            AdoUtility.ExecuteQuery(null,
                 _connectionString,
                 @"rpdb.RoleMembershipRemove",
                 CommandType.StoredProcedure,
                 _timeout,
                 new SqlParameter[] { AdoUtility.CreateSqlParameter("securityPrincipalId", SqlDbType.Int, permissionId),
                                      AdoUtility.CreateSqlParameter("appRoleId", SqlDbType.Int, appRoleId)});
        }
    }
}