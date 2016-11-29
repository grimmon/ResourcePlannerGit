using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourcePlanner.Services.Excel;
using ResourcePlanner.Services.Models;

namespace ResourcePlanner.Services.Mapper
{
    public class ExcelMapper
    {

        public IExcelBuilder MapResourcePageToExcel(ResourceQuery queryParameters, ResourcePageExcelData[] data)
        {

            var document = ExceldocFactory.Create();

            document.CreateNewSheet("Cover Sheet");

            document.SetColumnWidth(1, 27);
            document.SetColumnWidth(2, 27);
            document.SetColumnWidth(3, 27);

            document.SetCellValue("A1", "Insight Resource Assignments", ExcelStyleFormat.Bold);

            document.SetCellValue("A3", "Start date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B3", queryParameters.StartDate.ToString("MM-DD-YYYY"));

            document.SetCellValue("A5", "End Date: ", ExcelStyleFormat.Bold);
            document.SetCellValue("B5", queryParameters.EndDate.ToString("MM-DD-YYYY"));



            document.CreateNewSheet("Data");

            document.SetCellValue(ExcelUtility.GetExcelAddress(1, 1), "Resource Name", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(2, 1), "Date Period", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(3, 1), "Position", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(4, 1), "City", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(5, 1), "Practice", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(6, 1), "SubPractice", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(7, 1), "Resource Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(8, 1), "Forecast Hours", ExcelStyleFormat.Bold);
            document.SetCellValue(ExcelUtility.GetExcelAddress(9, 1), "Actual Hours", ExcelStyleFormat.Bold);

            int rowNumber = 2;

            foreach (var datum in data)
            {
                document.SetCellValue(ExcelUtility.GetExcelAddress(1, rowNumber), datum.LastName + ", " + datum.FirstName);
                document.SetCellValue(ExcelUtility.GetExcelAddress(2, rowNumber), datum.TimePeriod);
                document.SetCellValue(ExcelUtility.GetExcelAddress(3, rowNumber), datum.Position);
                document.SetCellValue(ExcelUtility.GetExcelAddress(4, rowNumber), datum.City);
                document.SetCellValue(ExcelUtility.GetExcelAddress(5, rowNumber), datum.Practice);
                document.SetCellValue(ExcelUtility.GetExcelAddress(6, rowNumber), datum.SubPractice);
                document.SetCellValue(ExcelUtility.GetExcelAddress(7, rowNumber), datum.ResourceHours);
                document.SetCellValue(ExcelUtility.GetExcelAddress(8, rowNumber), datum.ForecastHours);
                document.SetCellValue(ExcelUtility.GetExcelAddress(9, rowNumber), datum.ActualHours);
                rowNumber++;
            }

            return document;
        }
    }
}