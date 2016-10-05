CREATE TABLE [Fact].[Project_Financial_Summary] (
    [Project_Financial_Summary_Key] INT      NOT NULL,
    [Date_Key]                      INT      NOT NULL,
    [Project_Key]                   INT      NOT NULL,
    [Customer_Key]                  INT      NOT NULL,
    [Actual_Revenue_Amount]         MONEY    NOT NULL,
    [Actual_Expense_Amount]         MONEY    NOT NULL,
    [Gross_Profit_Amount]           MONEY    NULL,
    [Insert_Date]                   DATETIME NOT NULL,
    [Update_Date]                   DATETIME NULL
);

