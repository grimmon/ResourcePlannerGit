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
    public class ResourceDetailDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public ResourceDetailDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }

        

        public DetailPage GetResourceDetail(int ResourceId, TimeAggregation Aggregation, DateTime StartDate, DateTime EndDate)
        {
            var returnValue =  AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceDetail(reader),
                  _connectionString,
                  @"rpdb.ResourceDetailPageSelect",
                  CommandType.StoredProcedure,
                  _timeout,
                  CreateResourceDetailParamArray(ResourceId, Aggregation, StartDate, EndDate));
            returnValue.TimeScale = Aggregation;
            returnValue.TimePeriods = returnValue.Projects.Count > 0
                ? returnValue.Projects[0].Assignments.Select(a => a.TimePeriod).ToList()
                : new List<string>();
            return returnValue;
        }

        public IExcelBuilder GetResourceDetailExcelData(int ResourceId, TimeAggregation Aggregation, DateTime StartDate, DateTime EndDate)
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => ExcelMapper.MapResourceDetailPageToExcel(reader, Aggregation, StartDate, EndDate),
                 _connectionString,
                 @"rpdb.ResourcePageSelect",
                 CommandType.StoredProcedure,
                 _timeout,
                 CreateResourceDetailParamArray(ResourceId, Aggregation, StartDate, EndDate));
            return returnValue;
        }
        public async Task<Stream> GetExcelStream(int ResourceId, TimeAggregation Aggregation, DateTime StartDate, DateTime EndDate)
        {
            var resourceTask = Task.Factory.StartNew(() => GetResourceDetailExcelData(ResourceId, Aggregation, StartDate, EndDate));

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

        //public ResourcePageExcelData[] GetResourceExcelData(ResourceQuery pageParams)
        //{


        //    ResourcePageExcelData[] returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceCSV(reader, pageParams),
        //         _connectionString,
        //         @"rpdb.ResourcePageDailySelect",
        //         CommandType.StoredProcedure,
        //         _timeout,
        //         CreateResourcePageParamArray(pageParams));

        //    return returnValue;

        //}
        //public async Task<Stream> GetExcelStream(ResourceQuery param)
        //{
        //    var excelMapper = new ExcelMapper();
        //    var resourceTask = Task.Factory.StartNew(() => GetResourceExcelData(param));

        //    try
        //    {
        //        var delay = Task.Delay(300000);
        //        await Task.WhenAny(Task.WhenAll(new Task[] { resourceTask }), delay);

        //        if (delay.Status == TaskStatus.RanToCompletion)
        //        {
        //            throw new TimeoutException("At least one task exceeded timeout");
        //        }

        //        var page = resourceTask.Result;
        //        var excelData = excelMapper.MapResourcePageToExcel(param, page);

        //        return excelData.ConvertToStream();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        private SqlParameter[] CreateResourceDetailParamArray(int ResourceId, TimeAggregation Aggregation, DateTime StartDate, DateTime EndDate)
        {
            var AggParam = new SqlParameter();
            if (Aggregation == TimeAggregation.Daily)
            {
                AggParam = AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Day");
            }
            else if (Aggregation == TimeAggregation.Monthly)
            {
                AggParam = AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Month");
            }
            else if (Aggregation == TimeAggregation.Quarterly)
            {
                AggParam = AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Quarter");
            }
            else
            {
                AggParam = AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Week");
            }
            var StartDateParam = AdoUtility.CreateSqlParameter("StartDateParam", SqlDbType.Date, StartDate);
            var EndDateParam = AdoUtility.CreateSqlParameter("EndDateParam", SqlDbType.Date, EndDate);
            var ResourceIdParam = AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, ResourceId);

            return new SqlParameter[] { StartDateParam, EndDateParam, ResourceIdParam, AggParam };
        }
    }
}