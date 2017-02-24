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
        public GetAssignment GetAssignment(int resourceId, int projectMasterId, DateTime date)
        {

            return AdoUtility.ExecuteQuery(reader => EntityMapper.MapToGetAssignment(reader),
                _connectionString,
                @"rpdb.InternalAssignmentGet",
                CommandType.StoredProcedure,
                _timeout,
                new SqlParameter[] { AdoUtility.CreateSqlParameter("ResourceId",SqlDbType.Int, resourceId),
                                     AdoUtility.CreateSqlParameter("ProjectMasterId", SqlDbType.Int, projectMasterId),
                                     AdoUtility.CreateSqlParameter("Date", SqlDbType.Date, date) }
                );

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

        public List<IdNameGeneric> GetWBSProjects(string searchTerm)
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToIdNameGeneric(reader, "ProjectMasterId", "ProjectName", "WBSCode"),
                _connectionString,
                @"rpdb.WBSProjectSelect",
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

        public List<IdNameGeneric> GetTasks()
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToIdNameGeneric(reader, "ProjectMasterId", "TaskName"),
                _connectionString,
                @"rpdb.TaskSelect",
                CommandType.StoredProcedure,
                _timeout,
                 new SqlParameter[] { });

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
                parameterList.Add(AdoUtility.CreateSqlParameter("SundayHours", SqlDbType.Float, asgn.SundayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("MondayHours", SqlDbType.Float, asgn.MondayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("TuesdayHours", SqlDbType.Float, asgn.TuesdayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("WednesdayHours", SqlDbType.Float, asgn.WednesdayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("ThursdayHours", SqlDbType.Float, asgn.ThursdayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("FridayHours", SqlDbType.Float, asgn.FridayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("SaturdayHours", SqlDbType.Float, asgn.SaturdayHours.Value));


            }   

            return parameterList.ToArray();
        }

        private SqlParameter[] UpdateAssignmentParameters(UpdateAssignment asgn)
        {
            var parameterList = new List<SqlParameter>();

            parameterList.Add(AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, asgn.ResourceId));
            parameterList.Add(AdoUtility.CreateSqlParameter("ProjectMasterId", SqlDbType.Int, asgn.ProjectMasterId));
            parameterList.Add(AdoUtility.CreateSqlParameter("Date", 20, SqlDbType.Date, asgn.StartDate));

            if (asgn.TotalHours.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("TotalHours", SqlDbType.Float, asgn.TotalHours));
            }
            else
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SundayHours", SqlDbType.Float, asgn.SundayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("MondayHours", SqlDbType.Float, asgn.MondayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("TuesdayHours", SqlDbType.Float, asgn.TuesdayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("WednesdayHours", SqlDbType.Float, asgn.WednesdayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("ThursdayHours", SqlDbType.Float, asgn.ThursdayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("FridayHours", SqlDbType.Float, asgn.FridayHours.Value));
                parameterList.Add(AdoUtility.CreateSqlParameter("SaturdayHours", SqlDbType.Float, asgn.SaturdayHours.Value));


            }

            return parameterList.ToArray();
        }
    }
}