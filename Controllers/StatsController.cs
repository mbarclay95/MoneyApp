using MoneyMaker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace MoneyMaker.Controllers
{
    public class StatsController : Controller
    {
        // GET: Stats
        public ActionResult Index()
        {
            return View();
        }

		// [HttpGet]
		public ActionResult GetStats()
		{
			Database database = new Database();
			var jsonSerializer = new JavaScriptSerializer();
			List<List<string>> Past = database.GetPast(1);
			string str = jsonSerializer.Serialize(Past);
			return Json(str, JsonRequestBehavior.AllowGet);
		}
	}
}