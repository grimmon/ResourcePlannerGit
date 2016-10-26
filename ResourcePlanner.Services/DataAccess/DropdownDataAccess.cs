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
    public class DropdownDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public DropdownDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public List<DropdownValue> GetDropdownValues()
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToDropdown(reader),
                _connectionString,
                @"rpdb.DropdownValuesSelect",
                CommandType.StoredProcedure,
                _timeout,
                new SqlParameter[0]);
            returnValue.Add(new DropdownValue() { Category = "Aggregation", Name = "Weekly" });
            returnValue.Add(new DropdownValue() { Category = "Aggregation", Name = "Monthly" });
            returnValue.Add(new DropdownValue() { Category = "Aggregation", Name = "Quarterly" });
            returnValue.Add(new DropdownValue() { Category = "Aggregation", Name = "Daily" });
            return returnValue;
        }
    }
}