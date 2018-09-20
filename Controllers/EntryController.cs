using Microsoft.ApplicationInsights.Extensibility.Implementation;
using MoneyMaker.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace MoneyMaker.Controllers
{
    public class EntryController : Controller
    {
        // GET: Entry
        public ActionResult Index()
        {
            return View();
        }

		// [HttpGet]
		public ActionResult GetCategories()
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<List<string>> categories = database.GetCategoriesOrSubCategories("Category");
			string str = jsonSerializer.Serialize(categories);
			return Json(str, JsonRequestBehavior.AllowGet);
		}

		// [HttpGet]
		public ActionResult GetSubCategories()
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<List<string>> subcategories = database.GetCategoriesOrSubCategories("SubCategory");
			string str = jsonSerializer.Serialize(subcategories);
			return Json(str, JsonRequestBehavior.AllowGet);
		}

		// [HttpGet]
		public ActionResult hi()
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<List<string>> subcategories = database.hip();
			string str = jsonSerializer.Serialize(subcategories);
			return Json(str, JsonRequestBehavior.AllowGet);
		}

		//[HttpPost]
		public ActionResult SendData(string data)
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<string> newData = JsonConvert.DeserializeObject<List<string>>(data);
			database.InsertData(newData);
			return new JsonResult() { Data = new { Success = true } };
		}
	}
}