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
    public class PastController : Controller
    {
        // GET: Past
        public ActionResult Index()
        {
            return View();
        }

		// [HttpGet]
		public ActionResult GetPast()
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<List<string>> Past = database.GetPast(0);
			string str = jsonSerializer.Serialize(Past);
			return Json(str, JsonRequestBehavior.AllowGet);
		}

		//[HttpPost]
		public ActionResult EditEntry(string data)
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<string> newData = JsonConvert.DeserializeObject<List<string>>(data);
			database.EditEntry(newData);
			return new JsonResult() { Data = new { Success = true } };
		}

		//[HttpPost]
		public ActionResult RemoveEntry(string data)
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			string id = JsonConvert.DeserializeObject<string>(data);
			database.RemoveEntry(id);
			return new JsonResult() { Data = new { Success = true } };
		}

		//[HttpPost]
		public ActionResult EditCatOrSubCat(string data)
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<string> newData = JsonConvert.DeserializeObject<List<string>>(data);
			database.EditCatOrSubCat(newData);
			return new JsonResult() { Data = new { Success = true } };
		}

		//[HttpPost]
		public ActionResult AddCatOrSubCat(string data)
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<string> newData = JsonConvert.DeserializeObject<List<string>>(data);
			database.AddCatOrSubCat(newData);
			return new JsonResult() { Data = new { Success = true } };
		}

		//[HttpPost]
		public ActionResult RemoveCatOrSubCat(string data)
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<string> newData = JsonConvert.DeserializeObject<List<string>>(data);
			database.RemoveCatOrSubCat(newData);
			return new JsonResult() { Data = new { Success = true } };
		}
	}
}