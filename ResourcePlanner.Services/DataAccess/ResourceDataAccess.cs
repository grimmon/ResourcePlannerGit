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
    public class ResourceDataAccess
    {
        private readonly string _connectionString;
        private readonly int _timeout;

        public ResourceDataAccess(string connectionString, int timeout)
        {
            _connectionString = connectionString;
            _timeout = timeout;
        }


        public ResourcePage GetResourcePage(ResourceQuery pageParams)
        {


            ResourcePage returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader, pageParams),
                  _connectionString,
                  @"rpdb.ResourcePageSelect",
                  CommandType.StoredProcedure,
                  _timeout,
                  CreateResourcePageParamArray(pageParams));


            returnValue.PageNum = pageParams.PageNum;
            returnValue.PageSize = pageParams.PageSize;
            returnValue.TimeScale = pageParams.Aggregation;

            returnValue.TimePeriods = returnValue.Resources.Count > 0
                ? returnValue.Resources[0].Assignments.Select(a => a.TimePeriod).ToList()
                : new List<string>();

            return returnValue;

        }

        public ResourcePageExcelData[] GetResourceExcelData(ResourceQuery pageParams)
        {


            ResourcePageExcelData[] returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourceCSV(reader, pageParams),
                 _connectionString,
                 @"rpdb.ResourcePageDailySelect",
                 CommandType.StoredProcedure,
                 _timeout,
                 CreateResourcePageParamArray(pageParams));

            return returnValue;

        }

        public async Task<Stream> GetExcelStream(ResourceQuery param)
        {
            var excelMapper = new ExcelMapper();
            var resourceTask = Task.Factory.StartNew(() => GetResourceExcelData(param));

            try
            {
                var delay = Task.Delay(300000);
                await Task.WhenAny(Task.WhenAll(new Task[] { resourceTask }), delay);

                if (delay.Status == TaskStatus.RanToCompletion)
                {
                    throw new TimeoutException("At least one task exceeded timeout");
                }

                var page = resourceTask.Result;
                var excelData = excelMapper.MapResourcePageToExcel(param, page);

                return excelData.ConvertToStream();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private SqlParameter[] CreateResourcePageParamArray(ResourceQuery pageParams)
        {
            var parameterList = new List<SqlParameter>();

            if (pageParams.Aggregation == TimeAggregation.Daily)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Day"));
            }
            if (pageParams.Aggregation == TimeAggregation.Monthly)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Month"));
            }
            if (pageParams.Aggregation == TimeAggregation.Daily)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Quarter"));
            }
            else
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Week"));
            }

            parameterList.Add(AdoUtility.CreateSqlParameter("StartDateParam", SqlDbType.Date, pageParams.StartDate));
            parameterList.Add(AdoUtility.CreateSqlParameter("EndDateParam", SqlDbType.Date, pageParams.EndDate));
            parameterList.Add(AdoUtility.CreateSqlParameter("SortOrderParam", 20, SqlDbType.VarChar, pageParams.Sort.ToString()));
            parameterList.Add(AdoUtility.CreateSqlParameter("SortDirectionParam", 20, SqlDbType.VarChar, pageParams.SortDirection.ToString()));
            parameterList.Add(AdoUtility.CreateSqlParameter("PageNum", SqlDbType.Int, pageParams.PageNum));
            parameterList.Add(AdoUtility.CreateSqlParameter("PageSize", SqlDbType.Int, pageParams.PageSize));

            if (pageParams.City.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("CityParam", SqlDbType.Int, pageParams.City.Value));
            }
            if (pageParams.OrgUnit.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("OrgUnitParam", SqlDbType.Int, pageParams.OrgUnit.Value));
            }
            if (pageParams.Region.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("RegionParam", SqlDbType.Int, pageParams.Region.Value));
            }
            if (pageParams.Market.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("MarketParam", SqlDbType.Int, pageParams.Market.Value));
            }
            if (pageParams.Practice.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("PracticeParam", SqlDbType.Int, pageParams.Practice.Value));
            }
            if (pageParams.SubPractice.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SubPracticeParam", SqlDbType.Int, pageParams.SubPractice.Value));
            }
            if (pageParams.ResourceManager.HasValue)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("ResourceManagerParam", SqlDbType.Int, pageParams.ResourceManager.Value));
            }
            if (pageParams.SearchTerm1 != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SearchTerm1Param", 50, SqlDbType.VarChar, pageParams.SearchTerm1));
            }
            if (pageParams.SearchTerm2 != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SearchTerm2Param", 50, SqlDbType.VarChar, pageParams.SearchTerm2));
            }
            if (pageParams.SearchTerm3 != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SearchTerm3Param", 50, SqlDbType.VarChar, pageParams.SearchTerm3));
            }
            if (pageParams.Positions != null)
            {
                parameterList.Add(AdoUtility.CreateSqlTableValuedParameter("PositionParam", "rpdb.typeIntTable", SqlDbType.Structured, pageParams.Positions));
            }
            return parameterList.ToArray();
        }
    }
}