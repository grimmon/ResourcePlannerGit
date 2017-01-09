using ResourcePlanner.Services.Mapper;
using ResourcePlanner.Services.Models;
using ResourcePlanner.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.DataAccess
{
    public class AddProjectDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public AddProjectDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public IdNameGeneric AddProject(AddProject project)
        {
            IdNameGeneric result = null;

            var results = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToIdNameGeneric(reader, "ProjectMasterId", "ProjectName"),
                _connectionString,
                @"rpdb.InternalProjectInsert",
                CommandType.StoredProcedure,
                _timeout,
                ProjectParameters(project));
            if (results.Count > 0)
            {
                result = results[0];
            }
            return result;

            
        }

        public IdNameGeneric UpdateProject(string oldWBSCode, int newProjectMasterId)
        {
            IdNameGeneric result = null;

            var results = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToIdNameGeneric(reader, "ProjectMasterId", "WBSCode"),
                _connectionString,
                @"rpdb.InternalProjectUpdate",
                CommandType.StoredProcedure,
                _timeout,
                new SqlParameter[] { AdoUtility.CreateSqlParameter("OldWBSCode", 50, SqlDbType.VarChar, oldWBSCode),
                                     AdoUtility.CreateSqlParameter("NewProjectMasterId", SqlDbType.Int, newProjectMasterId)} );
            if (results.Count > 0)
            {
                result = results[0];
            }
            return result;

        }

        public List<IdNameGeneric> GetCustomers(string searchTerm)
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToIdNameGeneric(reader, "CustomerId", "CustomerName"),
                _connectionString,
                @"rpdb.CustomerSelect",
                CommandType.StoredProcedure,
                _timeout,
                 searchTerm == "" ? new SqlParameter[] { }
                              : new SqlParameter[] { AdoUtility.CreateSqlParameter("SearchTerm", 50, SqlDbType.VarChar, searchTerm) });

            return returnValue;
        }

        public List<IdNameGeneric> GetManagers(string searchTerm1, string searchTerm2, string searchTerm3 )
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToIdNameGeneric(reader, "ResourceId", "ResourceName"),
                _connectionString,
                @"rpdb.ManagerSelect",
                CommandType.StoredProcedure,
                _timeout,
                ManagerParameters(searchTerm1, searchTerm2, searchTerm3));

            return returnValue;
        }

        private SqlParameter[] ManagerParameters(string searchTerm1, string searchTerm2, string searchTerm3)
        {
            var parameterList = new List<SqlParameter>();

            
            if (searchTerm1 != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SearchTerm1", 100, SqlDbType.VarChar, searchTerm1));
            }
            if (searchTerm2 != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SearchTerm2", 100, SqlDbType.VarChar, searchTerm2));
            }
            if (searchTerm3 != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SearchTerm3", 100, SqlDbType.VarChar, searchTerm3));
            }

            return parameterList.ToArray();
        }

        private SqlParameter[] ProjectParameters(AddProject project)
        {
            var parameterList = new List<SqlParameter>();

            parameterList.Add(AdoUtility.CreateSqlParameter("ProjectName", 100, SqlDbType.VarChar, project.ProjectName));
            parameterList.Add(AdoUtility.CreateSqlParameter("StartDate", SqlDbType.Date, project.StartDate));
            parameterList.Add(AdoUtility.CreateSqlParameter("EndDate", SqlDbType.Date, project.EndDate));
            if(project.Description != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("Description", 100, SqlDbType.VarChar, project.Description));
            }
            if (project.CustomerName != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("CustomerName", 100, SqlDbType.VarChar, project.CustomerName));
            }
            if (project.CustomerId.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("CustomerId", SqlDbType.Float, project.CustomerId.Value));
            }
            if (project.OpportunityOwnerId.HasValue)
            { 
                parameterList.Add(AdoUtility.CreateSqlParameter("OpportunityOwnerId", SqlDbType.Int, project.OpportunityOwnerId.Value));
            }
            if (project.ProjectManagerId.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("ProjectManagerId", SqlDbType.Int, project.ProjectManagerId.Value));
            }

            return parameterList.ToArray();
        }
    }
}