using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourcePlanner.Services.Excel;
using ResourcePlanner.Services.Models;
using System.Data.SqlClient;
using ResourcePlanner.Core.Extensions;

namespace ResourcePlanner.Services.Mapper
{
    public static class ExcelMapper
    {

        public static IExcelBuilder MapResourcePageToExcel(ResourceQuery queryParameters, SqlDataReader reader)
        {

            var document = ExceldocFactory.Create();

            document.CreateNewSheet("Cover Sheet");

            document.SetColumnWidth(1, 27);
            document.SetColumnWidth(2, 27);
            document.SetColumnWidth(3, 27);

            document.SetCellValue("A1", "Insight Resource Assignments", ExcelStyleFormat.Bold);

            document.SetCellValue("A3", "Start date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B3", queryParameters.StartDate.ToString("MM-dd-yyyy"));

            document.SetCellValue("A5", "End Date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B5", queryParameters.EndDate.ToString("MM-dd-yyyy"));



            document.CreateNewSheet("Data");

            document.SetCellValue(ExcelUtility.GetExcelAddress(1, 1), "Resource Name", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(2, 1), "Position", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(3, 1), "Delivery City", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(4, 1), "Home City", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(5, 1), "Practice", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(6, 1), "SubPractice", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(7, 1), "Resource Manager", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(8, 1), "Date Period", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(9, 1), "Resource Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(10, 1), "Forecast Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(11, 1), "Actual Hours", ExcelStyleFormat.Bold);

            int rowNumber = 2;

            while (reader.Read())
            {                                                                     
                document.SetCellValue(ExcelUtility.GetExcelAddress(1, rowNumber), reader.GetNullableString("LastName") + ", " + reader.GetNullableString("FirstName"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(2, rowNumber), reader.GetNullableString("Position"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(3, rowNumber), reader.GetNullableString("City"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(4, rowNumber), reader.GetNullableString("HomeCity"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(5, rowNumber), reader.GetNullableString("Practice"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(6, rowNumber), reader.GetNullableString("SubPractice"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(7, rowNumber), reader.GetNullableString("ResourceManagerLastName") + ", " + reader.GetNullableString("ResourceManagerFirstName"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(8, rowNumber), reader.GetString("PeriodName"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(9, rowNumber), reader.GetDouble("ForecastHours").ToString());
                document.SetCellValue(ExcelUtility.GetExcelAddress(10, rowNumber), reader.GetDouble("ActualHours").ToString());
                document.SetCellValue(ExcelUtility.GetExcelAddress(11, rowNumber), reader.GetDouble("ResourceHours").ToString());
                rowNumber++;
            }

            return document;
        }

        public static IExcelBuilder MapResourceDetailPageToExcel(SqlDataReader reader, Enums.Enums.TimeAggregation Aggregation, DateTime StartDate, DateTime EndDate)
        {

            var document = ExceldocFactory.Create();

            document.CreateNewSheet("Cover Sheet");

            document.SetColumnWidth(1, 27);
            document.SetColumnWidth(2, 27);
            document.SetColumnWidth(3, 27);

            reader.Read();

            document.SetCellValue("A1", "Insight Resource Assignments for " + reader.GetNullableString("LastName") + ", " + reader.GetNullableString("FirstName"), ExcelStyleFormat.Bold);

            document.SetCellValue("A3", "Start date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B3", StartDate.ToString("MM-dd-yyyy"));

            document.SetCellValue("A5", "End Date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B5", EndDate.ToString("MM-dd-yyyy"));

            document.SetCellValue("A7", "Practice: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B7", reader.GetNullableString("Practice"));
            document.SetCellValue("A9", "Sub-practice: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B9", reader.GetNullableString("SubPractice"));
            document.SetCellValue("A11", "Org Unit: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B11", reader.GetNullableString("OrgUnit"));
            document.SetCellValue("A13", "Market: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B13", reader.GetNullableString("Market"));
            document.SetCellValue("D7", "City: ", ExcelStyleFormat.Bold);
            document.SetCellValue("E7", reader.GetNullableString("City"));
            document.SetCellValue("D9", "Position: ", ExcelStyleFormat.Bold);
            document.SetCellValue("E9", reader.GetNullableString("Position"));
            document.SetCellValue("D11", "Manager: ", ExcelStyleFormat.Bold);
            document.SetCellValue("E11", reader.GetNullableString("ResourceManagerLastName") + "," + reader.GetNullableString("ResourceManagerFirstName"));

            reader.NextResult();
            document.CreateNewSheet("Data");       

            document.SetCellValue(ExcelUtility.GetExcelAddress(1, 1), "Project Name", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(2, 1), "WBS Element", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(3, 1), "Descritpion", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(4, 1), "Customer", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(5, 1), "Opportunity Owner", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(6, 1), "Project Manager", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(7, 1), "Period Start", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(8, 1), "Period End", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(9, 1), "Resource Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(10, 1), "Forecast Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(11, 1), "Actual Hours", ExcelStyleFormat.Bold); 
            int rowNumber = 2;

            while (reader.Read())
            {
                document.SetCellValue(ExcelUtility.GetExcelAddress(1, rowNumber),  reader.GetNullableString("ProjectName"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(2, rowNumber),  reader.GetNullableString("WBSCode"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(3, rowNumber),  reader.GetNullableString("Description"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(4, rowNumber),  reader.GetNullableString("Customer"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(5, rowNumber),  reader.GetNullableString("OpportunityOwnerLastName") + ", " + reader.GetNullableString("OpportunityOwnerFirstName"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(6, rowNumber),  reader.GetNullableString("ProjectManagerLastName") + ", " + reader.GetNullableString("ProjectManagerFirstName"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(7, rowNumber),  reader.GetDateTime("PeriodStart").ToString());
                document.SetCellValue(ExcelUtility.GetExcelAddress(8, rowNumber),  reader.GetDateTime("PeriodEnd").ToString());
                document.SetCellValue(ExcelUtility.GetExcelAddress(9, rowNumber),  reader.GetDouble("ResoureHours").ToString());
                document.SetCellValue(ExcelUtility.GetExcelAddress(10, rowNumber), reader.GetDouble("ForecastHours").ToString());
                document.SetCellValue(ExcelUtility.GetExcelAddress(11, rowNumber), reader.GetDouble("ActualHours").ToString());
                rowNumber++;
            }

            return document;
        }

        public static IExcelBuilder MapProjectPageToExcel(SqlDataReader reader)
        {

            var document = ExceldocFactory.Create();

            document.CreateNewSheet("Cover Sheet");

            document.SetColumnWidth(1, 27);
            document.SetColumnWidth(2, 27);
            document.SetColumnWidth(3, 27);

            reader.Read();

            document.SetCellValue("A1", "Insight Resource Assignments for " + reader.GetNullableString("ProjectName"), ExcelStyleFormat.Bold);

            document.SetCellValue("A3", "Start date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B3", reader.GetDateTime("StartDate").ToString("yyyy-MM-dd"));

            document.SetCellValue("A5", "End Date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B5", reader.GetDateTime("EndDate").ToString("yyyy-MM-dd"));

            document.SetCellValue("A7", "Project Number: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B7", reader.GetNullableString("Practice"));
            document.SetCellValue("A9", "Description: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B9", reader.GetNullableString("SubPractice"));
            document.SetCellValue("A11", "Offering: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B11", reader.GetNullableString("OrgUnit"));
            document.SetCellValue("D7", "WBS Element: ", ExcelStyleFormat.Bold);
            document.SetCellValue("D7", reader.GetNullableString("Market"));
            document.SetCellValue("D9", "Manager: ", ExcelStyleFormat.Bold);
            document.SetCellValue("E9", reader.GetNullableString("ProjectManagerLastName") + "," + reader.GetNullableString("ProjectManagerFirstName"));





            document.CreateNewSheet("Data");

            document.SetCellValue(ExcelUtility.GetExcelAddress(1, 1), "Resource Name", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(2, 1), "Position", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(3, 1), "Cost Rate", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(4, 1), "Total Forecast Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(5, 1), "Total Resource Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(6, 1), "Time Period", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(7, 1), "Resource Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(8, 1), "Forecast Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(9, 1), "Actual Hours", ExcelStyleFormat.Bold);
            int rowNumber = 2;

            while (reader.Read())
            {
                document.SetCellValue(ExcelUtility.GetExcelAddress(1, rowNumber), reader.GetNullableString("LastName") + "," + reader.GetNullableString("FirstName"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(2, rowNumber), reader.GetNullableString("Position"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(3, rowNumber), (reader.GetNullableDouble("CostRate") ?? 0).ToString());
                document.SetCellValue(ExcelUtility.GetExcelAddress(4, rowNumber), reader.GetNullableString("TotalForecastHours"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(5, rowNumber), reader.GetNullableString("TotalResourceHours"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(6, rowNumber), reader.GetNullableString("TimePeriod"));
                document.SetCellValue(ExcelUtility.GetExcelAddress(7, rowNumber), reader.GetDouble("ResourceHours").ToString());
                document.SetCellValue(ExcelUtility.GetExcelAddress(8, rowNumber), reader.GetDouble("ForecastHours").ToString());
                document.SetCellValue(ExcelUtility.GetExcelAddress(9, rowNumber), reader.GetDouble("ActualHours").ToString());
                rowNumber++;
            }

            return document;
        }
    }
}