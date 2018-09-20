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
    public class AutomateController : Controller
    {
        // GET: Automate
        public ActionResult Index()
        {
            return View();
        }

		//[HttpPost]
		public ActionResult AddAutomate(string data)
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<string> newData = JsonConvert.DeserializeObject<List<string>>(data);
			database.AddAutomation(newData);
			return new JsonResult() { Data = new { Success = true } };
		}

		//[HttpPost]
		public ActionResult EditAutomate(string data)
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<string> newData = JsonConvert.DeserializeObject<List<string>>(data);
			database.EditAutomation(newData);
			return new JsonResult() { Data = new { Success = true } };
		}

		//[HttpGet]
		public ActionResult GetAutomations()
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<List<string>> Automations = database.GetAutomations();
			string str = jsonSerializer.Serialize(Automations);
			return Json(str, JsonRequestBehavior.AllowGet);
		}

		//[HttpPost]
		public ActionResult RunAutomate()
		{
			Database database = new Database();
			database.RunAutomations();
			return new JsonResult() { Data = new { Success = true } };
		}

		//[HttpPost]
		public ActionResult RemoveAutomate(string data)
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			string id = JsonConvert.DeserializeObject<string>(data);
			database.RemoveAutomation(id);
			return new JsonResult() { Data = new { Success = true } };
		}
	}
}