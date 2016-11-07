using ResourcePlanner.Core.Utilities;
using ResourcePlanner.Services.Mapper;
using ResourcePlanner.Services.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.DataAccess
{
    public class ProjectDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public ProjectDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public List<IdNameGeneric> GetProjects(string searchTerm)
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToIdNameGeneric(reader, "ProjectId", ""),
                _connectionString,
                @"rpdb.ProjectSelect",
                CommandType.StoredProcedure,
                _timeout,
                new SqlParameter[] { searchTerm != "" 
                                        ? AdoUtility.CreateSqlParameter("SearchTerm", 50, SqlDbType.VarChar, searchTerm) 
                                        : null });
            return returnValue;
        }
    }
}