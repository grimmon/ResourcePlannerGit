using System;
using System.Data.SqlClient;
using System.Linq;

namespace ResourcePlanner.Core.Extensions
{
    public static class SqlClientExtensions
    {
        public static bool GetBoolean(this SqlDataReader reader, string columnName)
        {
            return reader.GetBoolean(reader.GetOrdinal(columnName));
        }

        public static DateTime GetDateTime(this SqlDataReader reader, string columnName)
        {
            return reader.GetDateTime(reader.GetOrdinal(columnName));
        }

        public static DateTimeOffset GetDateTimeOffset(this SqlDataReader reader, int columnIndex)
        {
            return reader.GetDateTimeOffset(columnIndex);
        }
        public static DateTimeOffset GetDateTimeOffset(this SqlDataReader reader, string columnName)
        {
            return reader.GetDateTimeOffset(reader.GetOrdinal(columnName));
        }

        public static double GetDecimal(this SqlDataReader reader, string columnName)
        {
            return reader.GetSqlDecimal(reader.GetOrdinal(columnName)).ToDouble();
        }

        public static double GetDouble(this SqlDataReader reader, string columnName)
        {
            return reader.GetDouble(reader.GetOrdinal(columnName));
        }

        public static short GetInt16(this SqlDataReader reader, string columnName)
        {
            return reader.GetInt16(reader.GetOrdinal(columnName));
        }

        public static byte GetByte(this SqlDataReader reader, string columnName)
        {
            return reader.GetByte(reader.GetOrdinal(columnName));
        }

        public static int GetInt32(this SqlDataReader reader, string columnName)
        {
            return reader.GetInt32(reader.GetOrdinal(columnName));
        }

        public static long GetInt64(this SqlDataReader reader, string columnName)
        {
            return reader.GetInt64(reader.GetOrdinal(columnName));
        }

        public static bool? GetNullableBoolean(this SqlDataReader reader, int columnIndex)
        {
            return reader.IsDBNull(columnIndex) ? new bool?() : reader.GetBoolean(columnIndex);
        }

        public static bool? GetNullableBoolean(this SqlDataReader reader, string columnName)
        {
            return GetNullableBoolean(reader, reader.GetOrdinal(columnName));
        }

        public static DateTime? GetNullableDateTime(this SqlDataReader reader, int columnIndex)
        {
            return reader.IsDBNull(columnIndex) ? new DateTime?() : reader.GetDateTime(columnIndex);
        }

        public static DateTime? GetNullableDateTime(this SqlDataReader reader, string columnName)
        {
            return GetNullableDateTime(reader, reader.GetOrdinal(columnName));
        }
        public static DateTimeOffset? GetNullableDateTimeOffset(this SqlDataReader reader, int columnIndex)
        {
            return reader.IsDBNull(columnIndex) ? new DateTimeOffset?() : reader.GetDateTimeOffset(columnIndex);
        }

        public static DateTimeOffset? GetNullableDateTimeOffset(this SqlDataReader reader, string columnName)
        {
            return GetNullableDateTimeOffset(reader, reader.GetOrdinal(columnName));
        }

        public static double? GetNullableDecimal(this SqlDataReader reader, int columnIndex)
        {
            return reader.IsDBNull(columnIndex) ? new double?() : reader.GetSqlDecimal(columnIndex).ToDouble();
        }

        public static double? GetNullableDecimal(this SqlDataReader reader, string columnName)
        {
            return GetNullableDecimal(reader, reader.GetOrdinal(columnName));
        }

        public static double? GetNullableDouble(this SqlDataReader reader, int columnIndex)
        {
            return reader.IsDBNull(columnIndex) ? new double?() : reader.GetDouble(columnIndex);
        }

        public static double? GetNullableDouble(this SqlDataReader reader, string columnName)
        {
            return GetNullableDouble(reader, reader.GetOrdinal(columnName));
        }

        public static int? GetNullableInt32(this SqlDataReader reader, int columnIndex)
        {
            return reader.IsDBNull(columnIndex) ? new int?() : reader.GetInt32(columnIndex);
        }

        public static int? GetNullableInt16(this SqlDataReader reader, int columnIndex)
        {
            return reader.IsDBNull(columnIndex) ? new int?() : reader.GetInt16(columnIndex);
        }

        public static int? GetNullableInt32(this SqlDataReader reader, string columnName)
        {
            return GetNullableInt32(reader, reader.GetOrdinal(columnName));
        }

        public static int? GetNullableInt16(this SqlDataReader reader, string columnName)
        {
            return GetNullableInt16(reader, reader.GetOrdinal(columnName));
        }

        public static int? GetNullableByte(this SqlDataReader reader, int columnIndex)
        {
            return reader.IsDBNull(columnIndex) ? new int?() : reader.GetByte(columnIndex);
        }

        public static int? GetNullableByte(this SqlDataReader reader, string columnName)
        {
            return GetNullableByte(reader, reader.GetOrdinal(columnName));
        }

        public static string GetNullableString(this SqlDataReader reader, int columnIndex)
        {
            return reader.IsDBNull(columnIndex) ? null : reader.GetString(columnIndex);
        }

        public static string GetNullableString(this SqlDataReader reader, string columnName)
        {
            return GetNullableString(reader, reader.GetOrdinal(columnName));
        }

        public static string GetString(this SqlDataReader reader, string columnName)
        {
            return reader.GetString(reader.GetOrdinal(columnName));
        }

        public static bool IsDBNull(this SqlDataReader reader, string columnName)
        {
            return reader.IsDBNull(reader.GetOrdinal(columnName));
        }

        public static char GetChar(this SqlDataReader reader, string columnName)
        {
            return reader.GetChar(reader.GetOrdinal(columnName));
        }

        public static object GetValue(this SqlDataReader reader, string columnName)
        {
            return reader.GetValue(reader.GetOrdinal(columnName));
        }

        public static T GetFieldValue<T>(this SqlDataReader reader, string columnName)
        {
            return reader.GetFieldValue<T>(reader.GetOrdinal(columnName));
        }

        public static T GetNullableFieldValue<T>(this SqlDataReader reader, string columnName)
        {
            return reader.IsDBNull(reader.GetOrdinal(columnName)) ? default(T) : reader.GetFieldValue<T>(columnName);
        }

        public static Type GetFieldType(this SqlDataReader reader, string columnName)
        {
            return reader.GetFieldType(reader.GetOrdinal(columnName));
        }

        public static bool HasColumn(this SqlDataReader reader, string columnName)
        {
            var columns =
                Enumerable.Range(0, reader.FieldCount)
                    .Select(reader.GetName)
                    .ToList();
            return columns.Exists(c => string.Compare(c, columnName, StringComparison.InvariantCultureIgnoreCase) == 0);
        }
    }
}
