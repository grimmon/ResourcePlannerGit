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
using ResourcePlanner.Services.Excel;

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



        public ProjectPage GetProjectPage(int ProjectId, string login)
        {
            var returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToProjectPage(reader),
                 _connectionString,
                 @"rpdb.ProjectViewSelect",
                 CommandType.StoredProcedure,
                 _timeout,
                 CreateProjectPageParamArray(ProjectId, login));
            return returnValue;
        }

        public IExcelBuilder GetProjectExcelData(int ProjectId, string login)
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => ExcelMapper.MapProjectPageToExcel(reader),
                 _connectionString,
                 @"rpdb.ProjectViewSelect",
                 CommandType.StoredProcedure,
                 _timeout,
                 CreateProjectPageParamArray(ProjectId, login));
            return returnValue;
        }
        public async Task<Stream> GetExcelStream(int ProjectId, string login)
        {
            var resourceTask = Task.Factory.StartNew(() => GetProjectExcelData(ProjectId, login));

            try
            {
                var delay = Task.Delay(300000);
                await Task.WhenAny(Task.WhenAll(new Task[] { resourceTask }), delay);

                if (delay.Status == TaskStatus.RanToCompletion)
                {
                    throw new TimeoutException("At least one task exceeded timeout");
                }

                var excelData = resourceTask.Result;

                return excelData.ConvertToStream();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private SqlParameter[] CreateProjectPageParamArray(int ProjectId, string login)
        {
            var ProjectIdParam = AdoUtility.CreateSqlParameter("ProjectMasterId", SqlDbType.Int, ProjectId);
            var loginParam = AdoUtility.CreateSqlParameter("login", 100, SqlDbType.VarChar, login);

            return new SqlParameter[] { ProjectIdParam, loginParam };
        }
    }
}