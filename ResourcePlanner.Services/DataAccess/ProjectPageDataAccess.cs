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


namespace ResourcePlanner.Services.DataAccess
{
    public class ProjectPageDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public ProjectPageDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }



        public ProjectPage GetProjectPage(int ProjectId)
        {
            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToProjectPage(reader),
                 _connectionString,
                 @"rpdb.ProjectViewSelect",
                 CommandType.StoredProcedure,
                 _timeout,
                 CreateProjectPageParamArray(ProjectId));
            return returnValue;
        }

        private SqlParameter[] CreateProjectPageParamArray(int ProjectId)
        {
            var ProjectIdParam = AdoUtility.CreateSqlParameter("ProjectId", SqlDbType.Int, ProjectId);

            return new SqlParameter[] { ProjectIdParam };
        }
    }
}