using System;
using System.Globalization;
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
        private static IExcelBuilder document;
        private static int colNumber;
        private static uint rowNumber;
        private static string[] days = new string[] { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };
        private static string defaultDays = days[1] + "-" + days[5];


        private static void SetCell(uint col, int width)
        {
            document.SetColumnWidth(col, width);
        }

        private static void SetCell(string header, int width = 18)
        {
            document.SetColumnWidth((uint)colNumber, width);
            document.SetCellValue(ExcelUtility.GetExcelAddress(colNumber++, 1), header, ExcelStyleFormat.Bold);
        }

        private static void SetCell(SqlDataReader reader, string fieldName, string fieldName2 = null)
        {
            var value = reader.GetNullableString(fieldName);
            if (fieldName2 != null)
            {
                value += ", " + reader.GetNullableString(fieldName2);
            }
            document.AddCell(colNumber++, value);
        }

        private static void SetCellDate(SqlDataReader reader, string fieldName)
        {
            var dateTime = reader.GetNullableDateTime(fieldName);
            document.AddCell(colNumber++, dateTime == null ? "" : ((DateTime)dateTime).ToString("d", CultureInfo.InvariantCulture));
        }

        private static void SetCellDaysOfWeek(SqlDataReader reader, string fieldName)
        {
            var value = "";
            if (!reader.IsDBNull(fieldName))
            {
                var mask = reader.GetInt32(fieldName);
                if (mask == 62)
                {
                    value = defaultDays;
                }
                else
                {
                    for (var i = 0; i < 7; i++)
                    {
                        if ((mask & (1 << i)) > 0)
                        {
                            if (value != "")
                            {
                                value += ",";
                            }
                            value += days[i];
                        }
                    }
                }
            }
            document.AddCell(colNumber++, value);
        }

        private static void SetCellDouble(SqlDataReader reader, string fieldName)
        {
            document.AddCell(colNumber++, reader.GetNullableDouble(fieldName));
        }

        public static IExcelBuilder MapResourcePageToExcel(ResourceQuery queryParameters, SqlDataReader reader)
        {

            document = ExceldocFactory.Create();

            document.CreateNewSheet("Cover Sheet");

            SetCell(1, 27);
            SetCell(2, 27);
            SetCell(3, 27);

            document.SetCellValue("A1", "Insight Resource Assignments", ExcelStyleFormat.Bold);

            document.SetCellValue("A3", "Start date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B3", queryParameters.StartDate.ToString("MM-dd-yyyy"));

            document.SetCellValue("A5", "End Date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B5", queryParameters.EndDate.ToString("MM-dd-yyyy"));

            document.CreateNewSheet("Data");

            rowNumber = 1;
            colNumber = 1;

            SetCell("Resource Name", 20);
            SetCell("Position");
            SetCell("Delivery City", 12);
            SetCell("Home City");
            SetCell("Practice");
            SetCell("SubPractice", 12);
            SetCell("Resource Manager");
            SetCell("Project Name");
            SetCell("Total Hours", 10);
            SetCell("Sunday Hours", 10);
            SetCell("Monday Hours", 10);
            SetCell("Tuesday Hours", 10);
            SetCell("Wednesday Hours", 10);
            SetCell("Thursday Hours", 10);
            SetCell("Friday Hours", 10);
            SetCell("Saturday Hours", 10);
            SetCell("Start Date", 11);
            SetCell("End Date", 11);
            SetCell("Customer", 12);
            SetCell("WBS Code", 15);
            SetCell("Offering");
            SetCell("Description");
            SetCell("Hour Type", 10);
            SetCell("Assignment Type", 10);
            SetCell("Record Source",10);

            while (reader.Read())
            {
                document.AddRow(++rowNumber);
                colNumber = 1;

                SetCell(reader, "LastName", "FirstName");
                SetCell(reader, "Position");
                SetCell(reader, "City");
                SetCell(reader, "HomeCity");
                SetCell(reader, "Practice");
                SetCell(reader, "SubPractice");
                SetCell(reader, "ResourceManagerLastName", "ResourceManagerFirstName");
                SetCell(reader, "ProjectName");
                SetCellDouble(reader, "Totalhours");
                SetCellDouble(reader, "HoursPerDay");
                SetCellDate(reader, "StartDate");
                SetCellDate(reader, "EndDate");
                SetCell(reader, "Customer");
                SetCell(reader, "WBSCode");
                SetCell(reader, "Offering");
                SetCell(reader, "Description");
                SetCell(reader, "HourType");
                SetCell(reader, "AssignmentType");
                SetCell(reader, "RecordSource");
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