package main.java.WebSearchJp.Controller;

import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import main.java.WebSearchJp.Common.AppController;


/**
 * RSearch controller class
 */
@Controller
@Scope("request")
public class ResultController extends AppController {

	@Autowired
	private HttpSession session;

	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/result")
	public ModelAndView result() throws Exception {
		System.out.println("Start==================================");
        System.out.println("ResultController : result()");
        System.out.println("Start==================================");
		ModelAndView view = initView();
		ArrayList<String> listHanTu = new ArrayList<>();
		ArrayList<String> listHanViet = new ArrayList<>();
		
		listHanTu = (ArrayList<String>) session.getAttribute("listHanTu");
		listHanViet = (ArrayList<String>) session.getAttribute("listHanViet");
			
		view.addObject("listHanTu", listHanTu);
		view.addObject("listHanViet", listHanViet);
		view.addObject(BODY, VIEW_DIR + "search");

		return view;
	}
}
