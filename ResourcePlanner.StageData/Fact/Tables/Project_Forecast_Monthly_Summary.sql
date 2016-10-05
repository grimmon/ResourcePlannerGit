CREATE TABLE [Fact].[Project_Forecast_Monthly_Summary] (
    [Project_Forecast_Monthly_Summary_Key] INT      NOT NULL,
    [Project_Forecast_Key]                 INT      NOT NULL,
    [Date_Key_Submission]                  INT      NOT NULL,
    [Date_Key_Forecast_Month]              INT      NOT NULL,
    [Status_Key]                           INT      NOT NULL,
    [Customer_Key]                         INT      NOT NULL,
    [Employee_Key_Project_Manager]         INT      NOT NULL,
    [Employee_Key_Financial_Admin]         INT      NOT NULL,
    [Employee_Key_Forecast_Approval]       INT      NOT NULL,
    [Forecasted_Revenue_Amount]            MONEY    NOT NULL,
    [Forecasted_Expense_Amount]            MONEY    NOT NULL,
    [Gross_Profit_Amount]                  MONEY    NOT NULL,
    [Gross_Profit_Percentage]              MONEY    NOT NULL,
    [Percent_Complete]                     MONEY    NOT NULL,
    [Baseline_Forecast]                    BIT      NOT NULL,
    [Insert_Date]                          DATETIME NOT NULL,
    [Update_Date]                          DATETIME NULL
);

