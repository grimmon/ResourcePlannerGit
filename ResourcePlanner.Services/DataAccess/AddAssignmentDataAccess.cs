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
    public class AddAssignmentDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public AddAssignmentDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public void AddAssignment(AddAssignments asgn)
        {

            AdoUtility.ExecuteQuery(null,
                _connectionString,
                @"rpdb.InternalAssignmentInsert",
                CommandType.StoredProcedure,
                _timeout,
                AddAssignmentParameters(asgn));
        }
        public void UpdateAssignment(UpdateAssignment asgn)
        {

            AdoUtility.ExecuteQuery(null,
                _connectionString,
                @"rpdb.InternalAssignmentUpdate",
                CommandType.StoredProcedure,
                _timeout,
                UpdateAssignmentParameters(asgn));

        }
        public List<IdNameGeneric> GetProjects(string searchTerm)
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToIdNameGeneric(reader, "ProjectMasterId", "ProjectName", "WBSCode"),
                _connectionString,
                @"rpdb.ProjectSelect",
                CommandType.StoredProcedure,
                _timeout,
                 searchTerm == "" ? new SqlParameter[] { }
                              : new SqlParameter[] { AdoUtility.CreateSqlParameter("SearchTerm", 50, SqlDbType.VarChar, searchTerm) });

            return returnValue;
        }

        public List<IdNameGeneric> GetPositions(string searchTerm)
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToIdNameGeneric(reader, "ReferenceId", "LabelText"),
                _connectionString,
                @"rpdb.PositionSelect",
                CommandType.StoredProcedure,
                _timeout,
                 searchTerm == "" ? new SqlParameter[] { }
                              : new SqlParameter[] { AdoUtility.CreateSqlParameter("SearchTerm", 50, SqlDbType.VarChar, searchTerm) });

            return returnValue;
        }

        private SqlParameter[] AddAssignmentParameters(AddAssignments asgn)
        {
            var parameterList = new List<SqlParameter>();

            parameterList.Add(AdoUtility.CreateSqlTableValuedParameter("ResourceIds", "rpdb.typeIntTable", SqlDbType.Structured, asgn.ResourceIds));
            parameterList.Add(AdoUtility.CreateSqlParameter("ProjectMasterId", SqlDbType.Int, asgn.ProjectMasterId));
            parameterList.Add(AdoUtility.CreateSqlParameter("StartDate", 20, SqlDbType.Date, asgn.StartDate));
            parameterList.Add(AdoUtility.CreateSqlParameter("EndDate", 20, SqlDbType.Date, asgn.EndDate));
            if (asgn.TotalHours.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("TotalHours", SqlDbType.Float, asgn.TotalHours));
            }
            else
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("HoursPerDay", SqlDbType.Float, asgn.HoursPerDay.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("DaysOfWeek", SqlDbType.Int, asgn.DaysOfWeek));
            }   

            return parameterList.ToArray();
        }

        private SqlParameter[] UpdateAssignmentParameters(UpdateAssignment asgn)
        {
            var parameterList = new List<SqlParameter>();

            parameterList.Add(AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, asgn.ResourceId));
            parameterList.Add(AdoUtility.CreateSqlParameter("ProjectMasterId", SqlDbType.Int, asgn.ProjectMasterId));
            parameterList.Add(AdoUtility.CreateSqlParameter("StartDate", 20, SqlDbType.Date, asgn.StartDate));
            parameterList.Add(AdoUtility.CreateSqlParameter("EndDate", 20, SqlDbType.Date, asgn.EndDate));
            if (asgn.TotalHours.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("TotalHours", SqlDbType.Float, asgn.TotalHours));
            }
            else
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("HoursPerDay", SqlDbType.Float, asgn.HoursPerDay.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("DaysOfWeek", SqlDbType.Int, asgn.DaysOfWeek));
            }
            return parameterList.ToArray();
        }
    }
}