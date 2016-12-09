using ResourcePlanner.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.DataAccess
{
    public class PrincipalRoleMembershipDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public PrincipalRoleMembershipDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public void Add(int securityPrincipalId, int appRoleId)
        {

            AdoUtility.ExecuteQuery(null,
                 _connectionString,
                 @"rpdb.PrincipalRoleMembershipAdd",
                 CommandType.StoredProcedure,
                 _timeout,
                 new SqlParameter[] { AdoUtility.CreateSqlParameter("securityPrincipalId", SqlDbType.Int, securityPrincipalId),
                                     AdoUtility.CreateSqlParameter("appRoleId", SqlDbType.Int, appRoleId)});
        }
        public void Remove(int securityPrincipalId, int appRoleId)
        {

            AdoUtility.ExecuteQuery(null,
                 _connectionString,
                 @"rpdb.PrincipalRoleMembershipRemove",
                 CommandType.StoredProcedure,
                 _timeout,
                 new SqlParameter[] { AdoUtility.CreateSqlParameter("securityPrincipalId", SqlDbType.Int, securityPrincipalId),
                                      AdoUtility.CreateSqlParameter("appRoleId", SqlDbType.Int, appRoleId)});
        } 
    }
}