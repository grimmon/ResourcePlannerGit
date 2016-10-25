
using ResourcePlanner.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Core.Utilities
{
    public class AdoUtility
    {
        public const string VarCharTableDbTypeName = "rpdb.typeVarCharTable";
        public const string IntTableDbTypeName = "rpdb.typeIntTable";

        public static DataTable CreateIntDataTable()
        {
            var table = new DataTable();

            var col = new DataColumn
            {
                ColumnName = "Int",
                DataType = typeof(int),
            };

            table.Columns.Add(col);

            return table;
        }

        public static DataTable CreateVarCharDataTable()
        {
            var table = new DataTable();

            var col = new DataColumn
            {
                ColumnName = "VarChar",
                DataType = typeof(string),
                MaxLength = 100,
            };

            table.Columns.Add(col);

            return table;
        }

        public static SqlParameter CreateSqlParameter(string parameterName, SqlDbType sqlDbType, object value)
        {
            return new SqlParameter
            {
                ParameterName = parameterName,
                SqlDbType = sqlDbType,
                Value = value ?? DBNull.Value,
            };
        }
        public static SqlParameter CreateSqlParameter(string parameterName, int size, SqlDbType sqlDbType, object value)
        {
            return new SqlParameter
            {
                ParameterName = parameterName,
                Size = size,
                SqlDbType = sqlDbType,
                Value = value ?? DBNull.Value,
            };
        }
        public static SqlParameter CreateSqlTableValuedParameter<T>(string parameterName, string typeName, SqlDbType sqlDbType, IEnumerable<T> values)
        {
            var param = CreateSqlTableValuedParameter(parameterName, typeName, sqlDbType);
            var dataTable = (DataTable)param.Value;
            var column = dataTable.Columns[0];
            foreach (var value in values)
            {
                var row = dataTable.NewRow();
                row[column.ColumnName] = value;
                dataTable.Rows.Add(row);
            }
            return param;
        }

        public static SqlParameter CreateSqlTableValuedParameter(string parameterName, string typeName, SqlDbType sqlDbType)
        {
            object value;

            // Get empty table.
            switch (typeName)
            {
                case VarCharTableDbTypeName:
                    value = CreateVarCharDataTable();
                    break;
                case IntTableDbTypeName:
                    value = CreateIntDataTable();
                    break;

                default:
                    throw new ArgumentException("Unhandled value of typeName: " + typeName, "typeName");
            }

            // Return parameter.
            return new SqlParameter
            {
                ParameterName = parameterName,
                SqlDbType = sqlDbType,
                TypeName = typeName,
                Value = value,
            };
        }
        public static void ExecuteQuery(Action<SqlDataReader> resultAction, string connectionString, string sqlStatement, CommandType type, int timeout, params SqlParameter[] parameters)
        {
            using (var conn = new SqlConnection(connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandTimeout = timeout;
                cmd.CommandText = sqlStatement;
                cmd.CommandType = type;
                parameters.ForEach(i => cmd.Parameters.Add(i));
#if DEBUG
                try
                {
                    var queryText = SqlQueryToString(sqlStatement, parameters);
#endif
                conn.Open();
                if (resultAction != null)
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        try
                        {
                            resultAction(reader);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception("callback error", ex);
                        }
                    }
                }
                else
                {
                    cmd.ExecuteNonQuery();
                }
#if DEBUG
                }
                catch (Exception ex)
                {
                    okthrow GenerateSqlError(sqlStatement, parameters, ex);
                }
                finally
                {
                    conn.Close();
                }
#endif
            }
        }
        public static void ExecuteQuery(Action<SqlDataReader> resultAction, SqlConnection connection, SqlTransaction transaction, string sqlStatement, CommandType type, int timeout, params SqlParameter[] parameters)
        {
            using (var cmd = connection.CreateCommand())
            {
                cmd.CommandTimeout = timeout;
                cmd.CommandText = sqlStatement;
                cmd.CommandType = type;
                cmd.Transaction = transaction;
                parameters.ForEach(i => cmd.Parameters.Add(i));
#if DEBUG
                try
                {
                    var queryText = SqlQueryToString(sqlStatement, parameters);
#endif
                if (resultAction != null)
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        try
                        {
                            resultAction(reader);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception("callback error", ex);
                        }
                    }
                }
                else
                {
                    cmd.ExecuteNonQuery();
                }
#if DEBUG
                }
                catch (Exception ex)
                {
                    throw GenerateSqlError(sqlStatement, parameters, ex);
                }
#endif
            }
        }
        public static T ExecuteQuery<T>(Func<SqlDataReader, T> resultAction, string connectionString, string sqlStatement, CommandType type, int timeout, params SqlParameter[] parameters)
        {
            T returnValue;
            using (var conn = new SqlConnection(connectionString))
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandTimeout = timeout;
                cmd.CommandText = sqlStatement;
                cmd.CommandType = type;
                parameters.ForEach(i => cmd.Parameters.Add(i));

#if DEBUG
                try
                {
                    var queryText = SqlQueryToString(sqlStatement, parameters);
#endif

                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        try
                        {
                            returnValue = resultAction(reader);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception("callback error", ex);
                        }
                    }
#if DEBUG
                }
                catch (Exception ex)
                {
                    throw GenerateSqlError(sqlStatement, parameters, ex);
                }
                finally
                {
                    conn.Close();
                }
#endif
            }
            return returnValue;
        }
         public static string SqlQueryToString(string sqlStatement, SqlParameter[] parameters)
         {
                var result = sqlStatement + "; \nParameters:\n";

                foreach (var parameter in parameters)
                {
                    result += SqlParameterToString(parameter) + "\n";
                }

                return result;
         }
        public static string SqlParameterToString(SqlParameter parameter)
        {
            var result = parameter.ParameterName;

            var valueTypeFormat = "({0}): ";
            var valueFormat = "\t{0}";

            if (parameter.Value is DataTable)
            {
                result += string.Format(valueTypeFormat, parameter.TypeName);

                var data = (DataTable)parameter.Value;

                foreach (var datum in data.Rows)
                {
                    foreach (var value in ((DataRow)datum).ItemArray)
                    {
                        result += string.Format(valueFormat, value);
                    }
                }
            }
            else
            {
                result += string.Format(valueTypeFormat, parameter.SqlDbType);
                result += string.Format(valueFormat, parameter.Value);
            }

            return result;
        }

        private static Exception GenerateSqlError(string sqlStatement, SqlParameter[] parameters, Exception ex)
        {
            if (ex.Message == "callback error")
            {
                throw new Exception("Callback Error for " + sqlStatement + "; " + ex.InnerException.Message, ex.InnerException);
            }

            var errorMessage = ex.Message + ":\n" + SqlQueryToString(sqlStatement, parameters);

            return new Exception(errorMessage);
        }


        public static DataTable PullData(string connString, string tableName, string whereClause = "")
        {
            DataTable dataTable = new DataTable();
            string query = "select * from " + tableName + " " + whereClause;

            SqlConnection conn = new SqlConnection(connString);
            SqlCommand cmd = new SqlCommand(query, conn);
            conn.Open();

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dataTable);
            conn.Close();
            da.Dispose();
            return dataTable;
        }

        public static void ExecuteBulkInsert(string connectionString, DataTable source, string destinationTableName, int timeout = 30)
        {
            using (SqlBulkCopy cop = new SqlBulkCopy(connectionString))
            {
                cop.BulkCopyTimeout = timeout;
                foreach (var column in source.Columns)
                    cop.ColumnMappings.Add(column.ToString(), column.ToString());

                cop.DestinationTableName = destinationTableName;
                cop.WriteToServer(source);
            }
        }

    }



}