using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace ResourcePlanner.Services.Excel
{
    public class ExcelUtility
    {

        //This is not zero indexed. The first column starts at 1. 
        //1 = A, 2 = B, etc.
        public static string GetExcelColumnName(int columnNumber)
        {
            int dividend = columnNumber;
            string columnName = String.Empty;
            int modulo;

            while (dividend > 0)
            {
                modulo = (dividend - 1) % 26;
                columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
                dividend = (int)((dividend - modulo) / 26);
            }

            return columnName;
        }

        public static int GetExcelColumnNumber(string address)
        {
            var column = Regex.Replace(address, @"[\d-]", string.Empty);

            int retVal = 0;
            string col = column.ToUpper();
            for (int iChar = col.Length - 1; iChar >= 0; iChar--)
            {
                char colPiece = col[iChar];
                int colNum = colPiece - 64;
                retVal = retVal + colNum * (int)Math.Pow(26, col.Length - (iChar + 1));
            }
            return retVal;
        }

        public static string GetExcelAddress(int columnNumber, int rowNumber)
        {
            return GetExcelColumnName(columnNumber) + rowNumber.ToString();
        }

        public static string StringifyArray(string[] objects)
        {
            var result = "";

            if (objects == null || objects.Length == 0)
            {
                result = "all";
            }
            else
            {
                for (int i = 0; i < objects.Length - 1; i++)
                {
                    result += objects[i] + ", ";
                }

                result += objects[objects.Length - 1];
            }

            return result;
        }

        public static void MapColumn(IExcelBuilder document, int column, int startRow, List<string> values)
        {
            foreach (var value in values)
            {
                document.SetCellValue(GetExcelAddress(column, startRow), value);
                startRow++;
            }
        }

        public static void MapColumn(IExcelBuilder document, int column, int startRow, List<double> values)
        {
            foreach (var value in values)
            {
                document.SetCellValue(GetExcelAddress(column, startRow), value);
                startRow++;
            }
        }

        public static void MapRow(IExcelBuilder document, int startColumn, int row, List<string> values)
        {
            foreach (var value in values)
            {
                document.SetCellValue(GetExcelAddress(startColumn, row), value);
                startColumn++;
            }
        }

        public static void MapRow(IExcelBuilder document, int startColumn, int row, List<double> values)
        {
            foreach (var value in values)
            {
                document.SetCellValue(GetExcelAddress(startColumn, row), value);
                startColumn++;
            }
        }
    }
}
