using System.Web;
using System.Web.Optimization;

namespace MoneyMaker
{
	public class BundleConfig
	{
		// For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
						"~/Scripts/jquery-{version}.js"));

			bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
						"~/Scripts/jquery.validate*"));

			// Use the development version of Modernizr to develop with and learn from. Then, when you're
			// ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
					  "~/Scripts/bootstrap.js",
					  "~/Scripts/respond.js"));

			bundles.Add(new ScriptBundle("~/bundles/homepage").Include(
					  "~/Scripts/homepage.js"));

			bundles.Add(new StyleBundle("~/Content/css").Include(
					  "~/Content/bootstrap.css",
					  "~/Content/site.css"));

			bundles.Add(new ScriptBundle("~/bundles/Entry").Include(
					  "~/Scripts/Entry.js"));

			bundles.Add(new ScriptBundle("~/bundles/Automate").Include(
					  "~/Scripts/Automate.js"));

			bundles.Add(new ScriptBundle("~/bundles/stats").Include(
					  "~/Scripts/stats.js"));

			bundles.Add(new ScriptBundle("~/bundles/Past").Include(
					  "~/Scripts/Past.js"));

			bundles.Add(new ScriptBundle("~/Scripts/processing").Include(
										 "~/Scripts/processing.min.js",
										 "~/Scripts/processing.js"));

			bundles.Add(new StyleBundle("~/Content/Entry").Include(
					  "~/Content/Entry.css"));

			bundles.Add(new ScriptBundle("~/Scripts/datatables").Include(
										 "~/Scripts/jquery.dataTables.min.js",
										 "~/Scripts/dataTables.bootstrap.min.js"));

			bundles.Add(new ScriptBundle("~/Scripts/datepicker").Include(
										 "~/Scripts/daterangepicker.js",
										 "~/Scripts/moment.min.js",
										 "~/Scripts/bootstrap-datepicker.min.js",
										 "~/Scripts/bootstrap-datepicker.js"));

			//bundles.Add(new StyleBundle("~/Content/daterangepicker").Include(
					  //"~/Content/daterangepicker.css"));

			bundles.Add(new StyleBundle("~/Content/daterangepicker").Include(
					  "~/Content/jquery-ui.min.css",
					  "~/Content/jquery-ui.structure.min.css",
					  "~/Content/jquery-ui.theme.min.css"));


		}
	}
}
