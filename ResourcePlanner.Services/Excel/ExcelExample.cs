using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using OrientationValues = DocumentFormat.OpenXml.Spreadsheet.OrientationValues;
using PageMargins = DocumentFormat.OpenXml.Spreadsheet.PageMargins;
using PageSetup = DocumentFormat.OpenXml.Spreadsheet.PageSetup;

namespace ResourcePlanner.Services.Excel
{
    public class ExcelExample : IExcelBuilder
    {
        private MemoryStream _stream;
        private SpreadsheetDocument _spreadsheetDocument;
        private WorkbookPart _workbookPart;
        private WorksheetPart _worksheetPart;
        private Workbook _workbook;
        private FileVersion _fileVersion;
        private Worksheet _worksheet;
        private SheetData _sheetData;
        private Sheets _sheets;
        private Columns _columns;
        private Sheet _sheet;
        private uint _sheetId = 1;

        private UInt32Value _defaultStyle = 0;
        private UInt32Value _bold         = 1;
        private UInt32Value _number       = 2;
        private UInt32Value _percent      = 3;
        private UInt32Value _currency     = 4;
        private UInt32Value _boldNumber   = 5;
        private UInt32Value _boldPercent  = 6;
        private UInt32Value _boldCurrency = 7;

        public ExcelExample()
        {
            Initialize();
        }

        public void Initialize()
        {
            _stream = new MemoryStream();
            _spreadsheetDocument = SpreadsheetDocument.Create(_stream, SpreadsheetDocumentType.Workbook);
            _workbookPart = _spreadsheetDocument.AddWorkbookPart();
            _workbook = _workbookPart.Workbook = new Workbook();

            _fileVersion = new FileVersion()
            {
                ApplicationName = "Microsoft Office Excel"
            };

            _spreadsheetDocument.WorkbookPart.AddNewPart<WorkbookStylesPart>();
            _spreadsheetDocument.WorkbookPart.WorkbookStylesPart.Stylesheet = GenerateStyleSheet();
            
            _workbook.Append(_fileVersion);
            
            _sheets = _spreadsheetDocument.WorkbookPart.Workbook.AppendChild<Sheets>(new Sheets());
        }

        public void CreateNewSheet(string sheetName)
        {
            _worksheetPart = _workbookPart.AddNewPart<WorksheetPart>();
            _worksheet = _worksheetPart.Worksheet = new Worksheet();

            _columns = new Columns();

            SetColumnWidth(1, ExcelConstants.DefaultColumnWidth);

            _worksheet.Append(_columns);

            _sheetData = _worksheet.AppendChild(new SheetData());

            _sheet = new Sheet();

            _sheet.Name    = sheetName;
            _sheet.SheetId = new UInt32Value(_sheetId);
            _sheet.Id      = _workbookPart.GetIdOfPart(_worksheetPart);

            _sheets.Append(_sheet);

            _sheetId++;
        }

        private static Column CreateColumnData(UInt32 StartColumnIndex, UInt32 EndColumnIndex, double ColumnWidth)
        {
            Column column;
            column = new Column();
            column.Min = StartColumnIndex;
            column.Max = EndColumnIndex;
            column.Width = ColumnWidth;
            column.CustomWidth = true;
            return column;
        }


        private Stylesheet GenerateStyleSheet()
        {
            var stylesheet = new Stylesheet();

            stylesheet.Fonts            = GetFonts();
            stylesheet.Fills            = GetFills();
            stylesheet.Borders          = GetBorders();
            stylesheet.NumberingFormats = GetNumberingFormats();
            stylesheet.CellFormats      = GetCellFormats();

            return stylesheet;
        }

        private Fonts GetFonts()
        {
            return new Fonts(
                new Font(
                    new FontSize() { Val = 11 },
                    new Color() { Rgb = new HexBinaryValue() { Value = "000000" } },
                    new FontName() { Val = "Calibri" }),
                new Font(
                    new Bold(),
                    new FontSize() { Val = 11 },
                    new Color() { Rgb = new HexBinaryValue() { Value = "000000" } },
                    new FontName() { Val = "Calibri" }),
                new Font(
                    new Italic(),
                    new FontSize() { Val = 11 },
                    new Color() { Rgb = new HexBinaryValue() { Value = "000000" } },
                    new FontName() { Val = "Calibri" }),
                new Font(
                    new FontSize() { Val = 16 },
                    new Color() { Rgb = new HexBinaryValue() { Value = "000000" } },
                    new FontName() { Val = "Times New Roman" })
                );
        }

        private Fills GetFills()
        {
            return new Fills(
                new Fill(
                    new PatternFill() { PatternType = PatternValues.None }),
                new Fill(
                    new PatternFill() { PatternType = PatternValues.Gray125 }),
                new Fill(
                    new PatternFill(
                        new ForegroundColor() { Rgb = new HexBinaryValue() { Value = "FFFFFF00" } }
                        ) { PatternType = PatternValues.Solid })
                );
        }

        private Borders GetBorders()
        {
            return new Borders(
                new Border(
                    new LeftBorder(),
                    new RightBorder(),
                    new TopBorder(),
                    new BottomBorder(),
                    new DiagonalBorder()),
                new Border(
                    new LeftBorder(
                        new Color() { Auto = true }
                        ) { Style = BorderStyleValues.Thin },
                    new RightBorder(
                        new Color() { Auto = true }
                        ) { Style = BorderStyleValues.Thin },
                    new TopBorder(
                        new Color() { Auto = true }
                        ) { Style = BorderStyleValues.Thin },
                    new BottomBorder(
                        new Color() { Auto = true }
                        ) { Style = BorderStyleValues.Thin },
                    new DiagonalBorder())
                );
        }

        private NumberingFormats GetNumberingFormats()
        {
            return new NumberingFormats(
                new DocumentFormat.OpenXml.Spreadsheet.NumberingFormat()
                {
                    NumberFormatId = UInt32Value.FromUInt32(0),
                    FormatCode = "General"
                },
                new DocumentFormat.OpenXml.Spreadsheet.NumberingFormat()
                {
                    NumberFormatId = UInt32Value.FromUInt32(1),
                    FormatCode = "#,##0.00%"
                },
                new DocumentFormat.OpenXml.Spreadsheet.NumberingFormat()
                {
                    NumberFormatId = UInt32Value.FromUInt32(2),
                    FormatCode = "$#,##0.00"
                },
                new DocumentFormat.OpenXml.Spreadsheet.NumberingFormat()
                {
                    NumberFormatId = UInt32Value.FromUInt32(3),
                    FormatCode = "#,##0.00"
                });
        }

        private CellFormats GetCellFormats()
        {
            return new CellFormats(
                new CellFormat() { FontId = 0, FillId = 0, BorderId = 0, NumberFormatId = 0 }, //default 
                new CellFormat() { FontId = 1, FillId = 0, BorderId = 0, NumberFormatId = 0 }, //bold
                new CellFormat() { FontId = 0, FillId = 0, BorderId = 0, NumberFormatId = 3 }, //number
                new CellFormat() { FontId = 0, FillId = 0, BorderId = 0, NumberFormatId = 1 }, //percent
                new CellFormat() { FontId = 0, FillId = 0, BorderId = 0, NumberFormatId = 2 }, //currency
                new CellFormat() { FontId = 1, FillId = 0, BorderId = 0, NumberFormatId = 3 }, //bold number
                new CellFormat() { FontId = 1, FillId = 0, BorderId = 0, NumberFormatId = 1 }, //bold percent
                new CellFormat() { FontId = 1, FillId = 0, BorderId = 0, NumberFormatId = 2 }  //bold currency
                );
        }

        public void SetCellValue(int column, int row, string value)
        {
            SetCellValue(ExcelUtility.GetExcelAddress(column, row), value);
        }

        public void SetCellValue(int column, int row, string value, ExcelStyleFormat styleFormat)
        {
            SetCellValue(ExcelUtility.GetExcelAddress(column, row), value, styleFormat);
        }

        public void SetCellValue(int column, int row, double value)
        {
            SetCellValue(ExcelUtility.GetExcelAddress(column, row), value);
        }

        public void SetCellValue(int column, int row, double value, ExcelNumberFormat numberFormat, ExcelStyleFormat styleFormat)
        {
            SetCellValue(ExcelUtility.GetExcelAddress(column, row), value, numberFormat, styleFormat);
        }

        public void SetCellValue(string addressName, string value)
        {
            SetValue(addressName, value);
            _worksheetPart.Worksheet.Save();
        }

        public void SetCellValue(string address, string value, ExcelStyleFormat styleFormat)
        {
            SetCellValue(address, value);
            UpdateStyle(address, styleFormat);
        }

        public void SetCellValue(string address, double value)
        {
            var cell = GetCell(address);
            cell.DataType = CellValues.Number;
            cell.CellValue = new CellValue(value.ToString());
        }

        public void SetCellValue(string address, double value, ExcelNumberFormat numberFormat, ExcelStyleFormat styleFormat)
        {
            if (numberFormat == ExcelNumberFormat.Percent)
            {
                SetCellValue(address, value/100.00);
            }
            else
            {
                SetCellValue(address, value);
            }

            UpdateStyle(address, numberFormat, styleFormat);
        }

        public void SetColumnWidth(uint column, double width)
        {
            _columns.Append(CreateColumnData(column, column, width));
        }

        private void SetValue(string address, string value)
        {
            var cell = GetCell(address);

            double numberValue;

            if (double.TryParse(value, out numberValue))
            {
                cell.DataType = CellValues.Number;
            }
            else
            {
                cell.DataType = CellValues.String;
            }
            
            cell.CellValue = new CellValue(value);
            
        }

        public Cell GetCell(string address)
        {
            var rowIndex = GetRowIndex(address);
            var row = GetRow(rowIndex);
            var cell = row.Elements<Cell>().FirstOrDefault(c => c.CellReference.Value == address);

            if (cell == null)
            {
                cell = CreateCell(row, address);
            }

            return cell;
        }

        public void UpdateStyle(string address, ExcelNumberFormat numberFormat, ExcelStyleFormat styleFormat)
        {
            var cell = GetCell(address);

            if (numberFormat == ExcelNumberFormat.None && styleFormat == ExcelStyleFormat.None)
            {
                cell.StyleIndex = _defaultStyle;
            }
            else if (numberFormat == ExcelNumberFormat.None && styleFormat == ExcelStyleFormat.Bold)
            {
                cell.StyleIndex = _bold;
            }
            else if (numberFormat == ExcelNumberFormat.Number && styleFormat == ExcelStyleFormat.None)
            {
                cell.StyleIndex = _number;
            }
            else if (numberFormat == ExcelNumberFormat.Number && styleFormat == ExcelStyleFormat.Bold)
            {
                cell.StyleIndex = _boldNumber;
            }
            else if (numberFormat == ExcelNumberFormat.Currency && styleFormat == ExcelStyleFormat.None)
            {
                cell.StyleIndex = _currency;
            }
            else if (numberFormat == ExcelNumberFormat.Currency && styleFormat == ExcelStyleFormat.Bold)
            {
                cell.StyleIndex = _boldCurrency;
            }
            else if (numberFormat == ExcelNumberFormat.Percent && styleFormat == ExcelStyleFormat.None)
            {
                cell.StyleIndex = _percent;
            }
            else if (numberFormat == ExcelNumberFormat.Percent && styleFormat == ExcelStyleFormat.Bold)
            {
                cell.StyleIndex = _boldPercent;
            }
        }

        public void UpdateStyle(string address, ExcelStyleFormat styleFormat)
        {
            var cell = GetCell(address);

            if (styleFormat == ExcelStyleFormat.None)
            {
                cell.StyleIndex = _defaultStyle;
            }
            else if (styleFormat == ExcelStyleFormat.Bold)
            {
                cell.StyleIndex = _bold;
            }
        }

        private Cell CreateCell(Row row, String address)
        {
            Cell cellResult;
            Cell refCell = null;

            var addressValue = ExcelUtility.GetExcelColumnNumber(address);

            foreach (var cell in row.Elements<Cell>())
            {
                var cellValue = ExcelUtility.GetExcelColumnNumber(cell.CellReference.Value);
                
                if (cellValue > addressValue)
                {
                    refCell = cell;
                    break;
                }
            }

            cellResult = new Cell()
            {
                //StyleIndex = Convert.ToUInt32(1),
                CellReference = address

            };

            row.InsertBefore(cellResult, refCell);
            return cellResult;
        }

        private Row GetRow(uint rowIndex)
        {
            var row = _sheetData.Elements<Row>().FirstOrDefault(r => r.RowIndex.Value == rowIndex);
            
            if (row == null)
            {
                row = new Row();
                row.RowIndex = rowIndex;
                _sheetData.Append(row);
            }
            return row;
        }

        private UInt32 GetRowIndex(string address)
        {
            string rowPart;
            UInt32 l;
            UInt32 result = 0;

            for (int i = 0; i < address.Length; i++)
            {
                if (UInt32.TryParse(address.Substring(i, 1), out l))
                {
                    rowPart = address.Substring(i, address.Length - i);
                    if (UInt32.TryParse(rowPart, out l))
                    {
                        result = l;
                        break;
                    }
                }
            }
            return result;
        }

        public MemoryStream ConvertToStream()
        {
            SetPageSetup();

            _spreadsheetDocument.WorkbookPart.Workbook.Save();
            _spreadsheetDocument.Close();

            _stream.Seek(0, SeekOrigin.Begin);

            return _stream;
        }

        private void SetPageSetup()
        {
            var pageMargins = new PageMargins();
            pageMargins.Left = 0.45D;
            pageMargins.Right = 0.45D;
            pageMargins.Top = 0.5D;
            pageMargins.Bottom = 0.5D;
            pageMargins.Header = 0.3D;
            pageMargins.Footer = 0.3D;
            _worksheetPart.Worksheet.AppendChild(pageMargins);

            var pageSetup = new PageSetup();
            pageSetup.Orientation = OrientationValues.Landscape;
            pageSetup.FitToHeight = 2;
            pageSetup.HorizontalDpi = 200;
            pageSetup.VerticalDpi = 200;
            _worksheetPart.Worksheet.AppendChild(pageSetup);
        }
    }
}
