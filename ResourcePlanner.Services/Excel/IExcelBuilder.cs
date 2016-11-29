using System.IO;
using DocumentFormat.OpenXml;

namespace ResourcePlanner.Services.Excel
{
    public interface IExcelBuilder
    {   
        void CreateNewSheet(string sheetName);
        MemoryStream ConvertToStream();

        void SetCellValue(string address, string value);
        void SetCellValue(string address, string value, ExcelStyleFormat styleFormat);

        void SetCellValue(string address, double value);
        void SetCellValue(string address, double value, ExcelNumberFormat numberFormat, ExcelStyleFormat styleFormat);
        
        void SetCellValue(int column, int row, string value);
        void SetCellValue(int column, int row, string value, ExcelStyleFormat styleFormat);
        
        void SetCellValue(int column, int row, double value);
        void SetCellValue(int column, int row, double value, ExcelNumberFormat numberFormat, ExcelStyleFormat styleFormat);

        void SetColumnWidth(uint column, double width);
    }
}
