﻿using ResourcePlanner.Services.Mapper;
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
    public class AssignmentDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public AssignmentDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public void AddAssignment(AddAssignment asgn)
        {

            AdoUtility.ExecuteQuery(reader => EntityMapper.MapToDropdown(reader),
                _connectionString,
                @"rpdb.InternalAssignmentInsert",
                CommandType.StoredProcedure,
                _timeout,
                AssignmentParameters(asgn));
        }

        private SqlParameter[] AssignmentParameters(AddAssignment asgn)
        {
            var parameterList = new List<SqlParameter>();

            parameterList.Add(AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, asgn.ResourceId));
            parameterList.Add(AdoUtility.CreateSqlParameter("ProjectId", SqlDbType.Int, asgn.ProjectId));
            parameterList.Add(AdoUtility.CreateSqlParameter("TotalHours", SqlDbType.Float, asgn.Hours));
            parameterList.Add(AdoUtility.CreateSqlParameter("StartDate", 20, SqlDbType.Date, asgn.StartDate));
            parameterList.Add(AdoUtility.CreateSqlParameter("EndDate", 20, SqlDbType.Date, asgn.EndDate));
            if (asgn.DaysOfWeek > 0)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("DaysOfWeek", SqlDbType.Int, asgn.DaysOfWeek));
            }

            return parameterList.ToArray();
        }
    }
}