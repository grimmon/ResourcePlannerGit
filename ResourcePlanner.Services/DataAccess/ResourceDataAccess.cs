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

        public IExcelBuilder GetResourceExcelData(ResourceQuery pageParams)
        {

            var returnValue = AdoUtility.ExecuteQuery(reader => ExcelMapper.MapResourcePageToExcel(pageParams, reader),
                 _connectionString,
                 @"rpdb.ResourcePageSelect",
                 CommandType.StoredProcedure,
                 _timeout,
                 CreateResourcePageParamArray(pageParams));
            return returnValue;
        }

        public async Task<Stream> GetExcelStream(ResourceQuery param)
        {
            var resourceTask = Task.Factory.StartNew(() => GetResourceExcelData(param));

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

        private SqlParameter[] CreateResourcePageParamArray(ResourceQuery pageParams)
        {
            var parameterList = new List<SqlParameter>();

            if (pageParams.Aggregation == TimeAggregation.Daily)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Day"));
            }
            else if (pageParams.Aggregation == TimeAggregation.Monthly)
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("TimeScaleParam", 20, SqlDbType.VarChar, "Month"));
            }
            else if (pageParams.Aggregation == TimeAggregation.Quarterly)
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
            parameterList.Add(AdoUtility.CreateSqlParameter("login", 100, SqlDbType.VarChar, pageParams.Login));

            if (pageParams.Cities != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("CityParam", SqlDbType.VarChar, pageParams.Cities));
            }
            if (pageParams.HomeCities != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("HomeCityParam", SqlDbType.VarChar, pageParams.HomeCities));
            }
            if (pageParams.OrgUnits != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("OrgUnitParam", SqlDbType.VarChar, pageParams.OrgUnits));
            }
            if (pageParams.Regions != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("RegionParam", SqlDbType.VarChar, pageParams.Regions));
            }
            if (pageParams.Markets != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("MarketParam", SqlDbType.VarChar, pageParams.Markets));
            }
            if (pageParams.Practices != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("PracticeParam", SqlDbType.VarChar, pageParams.Practices));
            }
            if (pageParams.SubPractices != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SubPracticeParam", SqlDbType.VarChar, pageParams.SubPractices));
            }
            if (pageParams.ResourceManagers != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("ResourceManagerParam", SqlDbType.VarChar, pageParams.ResourceManagers));
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
            if (pageParams.SearchTerm4 != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SearchTerm4Param", 50, SqlDbType.VarChar, pageParams.SearchTerm4));
            }
            if (pageParams.SearchTerm5 != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("SearchTerm5Param", 50, SqlDbType.VarChar, pageParams.SearchTerm5));
            }
            if (pageParams.Positions != "")
            {
                parameterList.Add(AdoUtility.CreateSqlParameter("PositionParam", SqlDbType.VarChar, pageParams.Positions));
            }
            return parameterList.ToArray();
        }
    }
}