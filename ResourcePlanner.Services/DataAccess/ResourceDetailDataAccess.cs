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
            var returnValue = new DetailPage();
            switch (Aggregation)
            {


                case TimeAggregation.Daily:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceDetail(reader),
                        _connectionString,
                        @"rpdb.ResourceDetailDailySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourceDetailParamArray(ResourceId, StartDate, EndDate));
                    break;

                case TimeAggregation.Weekly:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceDetail(reader),
                        _connectionString,
                        @"rpdb.ResourceDetailWeeklySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourceDetailParamArray(ResourceId, StartDate, EndDate));
                    break;

                case TimeAggregation.Monthly:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceDetail(reader),
                         _connectionString,
                         @"rpdb.ResourceDetailMonthlySelect",
                         CommandType.StoredProcedure,
                         _timeout,
                         CreateResourceDetailParamArray(ResourceId, StartDate, EndDate));
                    break;

                case TimeAggregation.Quarterly:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceDetail(reader),
                         _connectionString,
                         @"rpdb.ResourceDetailQuarterlySelect",
                         CommandType.StoredProcedure,
                         _timeout,
                         CreateResourceDetailParamArray(ResourceId, StartDate, EndDate));
                    break;
                default:
                    break;
            }
            returnValue.TimeScale = Aggregation;
            returnValue.TimePeriods = returnValue.Projects.Count > 0
                ? returnValue.Projects[0].Assignments.Select(a => a.TimePeriod).ToList()
                : new List<string>();
            return returnValue;
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

        private SqlParameter[] CreateResourceDetailParamArray(int ResourceId, DateTime StartDate, DateTime EndDate)
        {
            var StartDateParam = AdoUtility.CreateSqlParameter("StartDateParam", SqlDbType.Date, StartDate);
            var EndDateParam = AdoUtility.CreateSqlParameter("EndDateParam", SqlDbType.Date, EndDate);
            var ResourceIdParam = AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, ResourceId);

            return new SqlParameter[] { StartDateParam, EndDateParam, ResourceIdParam };
        }
    }
}