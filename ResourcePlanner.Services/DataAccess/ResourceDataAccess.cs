using System;
using System.Collections.Generic;
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


            ResourcePage returnValue = new ResourcePage();
            switch (pageParams.Aggregation)
            {


                case TimeAggregation.Daily:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader, pageParams),
                        _connectionString,
                        @"rpdb.ResourcePageDailySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourcePageParamArray(pageParams));
                    break;

                case TimeAggregation.Weekly:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader, pageParams),
                        _connectionString,
                        @"rpdb.ResourcePageWeeklySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourcePageParamArray(pageParams));
                    break;

                case TimeAggregation.Monthly:

                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader, pageParams),
                        _connectionString,
                        @"rpdb.ResourcePageMonthlySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourcePageParamArray(pageParams));
                    break;

                case TimeAggregation.Quarterly:
            
                    returnValue = AdoUtility.ExecuteQuery(reader => EntityMapper.MapToResourcePage(reader, pageParams),
                        _connectionString,
                        @"rpdb.ResourcePageQuarterlySelect",
                        CommandType.StoredProcedure,
                        _timeout,
                        CreateResourcePageParamArray(pageParams));
                    break;
                default:
                    break;
            }
            returnValue.PageNum = pageParams.PageNum;
            returnValue.PageSize = pageParams.PageSize;
            returnValue.TimeScale = pageParams.Aggregation;

            returnValue.TimePeriods = returnValue.Resources.Count > 0  
                ? returnValue.Resources[0].Assignments.Select(a => a.TimePeriod).ToList()
                : new List<string>();
            
            return returnValue;
            
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
            return returnValue;
        }

        private SqlParameter[] CreateResourcePageParamArray(ResourceQuery pageParams)
        {
            var parameterList = new List<SqlParameter>();

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
            if(pageParams.Positions != null)
            {
                parameterList.Add(AdoUtility.CreateSqlTableValuedParameter("PositionParam", "rpdb.typeIntTable", SqlDbType.Structured, pageParams.Positions));
            }
            return parameterList.ToArray();
        }

        private SqlParameter[] CreateResourceDetailParamArray(int ResourceId, DateTime StartDate, DateTime EndDate)
        {
            var StartDateParam = AdoUtility.CreateSqlParameter("StartDateParam", SqlDbType.Date, StartDate);
            var EndDateParam = AdoUtility.CreateSqlParameter("EndDateParam", SqlDbType.Date, EndDate);
            var ResourceIdParam = AdoUtility.CreateSqlParameter("ResourceId", SqlDbType.Int, ResourceId);

            return new SqlParameter[] { StartDateParam, EndDateParam, ResourceIdParam };
        }
    }
}