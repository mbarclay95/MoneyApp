using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace MoneyMaker.Models
{
	public class Database
	{

		public List<List<string>> GetCategoriesOrSubCategories(string type)
		{
			List<List<string>> categories = new List<List<string>>();
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_GetCategories", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@select", SqlDbType.VarChar).Value = type;
				connect.Open();
				var dt = new DataTable();
				dt.Load(command.ExecuteReader());
				if (dt.Rows.Count == 0)
				{
					return categories;
				}
				for (int i = 0; i < dt.Rows.Count; i++)
				{
					List<string> temp = new List<string>();
					for (int j = 0; j < dt.Columns.Count; j++)
					{
						temp.Add(dt.Rows[i][j].ToString());
					}
					categories.Add(temp);
				}
			}
			return categories;
		}

		public void InsertData(List<string> newData)
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_InsertEntry", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@Category", SqlDbType.Int).Value = newData[0];
				command.Parameters.Add("@SubCategory", SqlDbType.Int).Value = newData[1];
				command.Parameters.Add("@Amount", SqlDbType.VarChar).Value = newData[2];
				command.Parameters.Add("@Date", SqlDbType.Date).Value = newData[3];
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public void AddAutomation(List<string> newData)
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_AddAutomation", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@Category", SqlDbType.Int).Value = newData[0];
				command.Parameters.Add("@SubCategory", SqlDbType.Int).Value = newData[1];
				command.Parameters.Add("@Day", SqlDbType.Int).Value = newData[2];
				command.Parameters.Add("@Date", SqlDbType.Date).Value = newData[3];
				command.Parameters.Add("@amount", SqlDbType.VarChar).Value = newData[4];
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public void EditAutomation(List<string> newData)
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_EditAutomation", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@ID", SqlDbType.Int).Value = newData[0];
				command.Parameters.Add("@Day", SqlDbType.Int).Value = newData[1];
				command.Parameters.Add("@Amount", SqlDbType.VarChar).Value = newData[2];
				command.Parameters.Add("@Date", SqlDbType.Date).Value = newData[3];
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public void EditEntry(List<string> newData)
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_EditEntry", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@ID", SqlDbType.Int).Value = newData[0];
				command.Parameters.Add("@Amount", SqlDbType.VarChar).Value = newData[1];
				command.Parameters.Add("@Date", SqlDbType.Date).Value = newData[2];
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public void EditCatOrSubCat(List<string> newData)
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_EditCatOrSubCat", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@ID", SqlDbType.Int).Value = newData[0];
				command.Parameters.Add("@Name", SqlDbType.VarChar).Value = newData[1];
				command.Parameters.Add("@Indicator", SqlDbType.Int).Value = newData[2];
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public void AddCatOrSubCat(List<string> newData)
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_AddCatOrSubCat", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@Name", SqlDbType.VarChar).Value = newData[0];
				command.Parameters.Add("@CategoryID", SqlDbType.Int).Value = newData[1];
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public void RemoveCatOrSubCat(List<string> newData)
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_RemoveCatOrSubCat", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@ID", SqlDbType.Int).Value = newData[0];
				command.Parameters.Add("@Indicator", SqlDbType.Int).Value = newData[1];
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public void RemoveAutomation(string id)
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_RemoveAutomation", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@ID", SqlDbType.Int).Value = id;
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public void RemoveEntry(string id)
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_RemoveEntry", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@ID", SqlDbType.Int).Value = id;
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public void RunAutomations()
		{
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_RunAutomations", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				connect.Open();
				command.ExecuteNonQuery();
			}
		}

		public List<List<string>> GetPast(int indicator)
		{
			List<List<string>> past = new List<List<string>>();
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_GetPastEntries", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				command.Parameters.Add("@INDICATOR", SqlDbType.Int).Value = indicator;
				connect.Open();
				var dt = new DataTable();
				dt.Load(command.ExecuteReader());
				if (dt.Rows.Count == 0)
				{
					return past;
				}
				for (int i = 0; i < dt.Rows.Count; i++)
				{
					List<string> temp = new List<string>();
					for (int j = 0; j < dt.Columns.Count; j++)
					{
						temp.Add(dt.Rows[i][j].ToString());
					}
					past.Add(temp);
				}
			}
			return past;
		}

		public List<List<string>> GetAutomations()
		{
			List<List<string>> Automations = new List<List<string>>();
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_GetAutomations", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				connect.Open();
				var dt = new DataTable();
				dt.Load(command.ExecuteReader());
				if (dt.Rows.Count == 0)
				{
					return Automations;
				}
				for (int i = 0; i < dt.Rows.Count; i++)
				{
					List<string> temp = new List<string>();
					for (int j = 0; j < dt.Columns.Count; j++)
					{
						temp.Add(dt.Rows[i][j].ToString());
					}
					Automations.Add(temp);
				}
			}
			return Automations;
		}

		public List<List<string>> hip()
		{
			List<List<string>> past = new List<List<string>>();
			using (SqlConnection connect = new SqlConnection(WebConfigurationManager.ConnectionStrings["Money"].ConnectionString))
			using (SqlCommand command = new SqlCommand("sp_gethip", connect))
			{
				command.CommandType = CommandType.StoredProcedure;
				connect.Open();
				var dt = new DataTable();
				dt.Load(command.ExecuteReader());
				if (dt.Rows.Count == 0)
				{
					return past;
				}
				for (int i = 0; i < dt.Rows.Count; i++)
				{
					List<string> temp = new List<string>();
					for (int j = 0; j < dt.Columns.Count; j++)
					{
						temp.Add(dt.Rows[i][j].ToString());
					}
					past.Add(temp);
				}
			}
			return past;
		}
	}
}