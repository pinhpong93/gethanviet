package main.java.WebSearchJp.Controller;

import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import main.java.WebSearchJp.Common.AppController;
import main.java.WebSearchJp.Common.HTMLContentUtil;
import main.java.WebSearchJp.Common.ResponseValue;
import main.java.WebSearchJp.Form.SearchForm;

@RestController
@EnableAutoConfiguration
public class SearchController extends AppController{
	
	/** HttpSessionのインスタンス */
    @Autowired
    private HttpSession session;
    
    /** constructor method */
    public SearchController() {
        //super("");
    }

    /**
     * view welcome page
     * @return
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView welcome(Model model) {
        initView().setViewName("common-layout");
        return view;
    }

    /**
     * init login form
     * @param error
     * @param logout
     * @return
     * @throws Exception 
     */
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ModelAndView initForm() throws Exception {
        System.out.println("Start==================================");
        System.out.println("SearchController : initForm()");
        System.out.println("Start==================================");
        ModelAndView view = initView();
    	view.addObject(BODY, "search");
    	return view;
    	        
    }
    
    private String getHanVietLast(String hantu){
	    String urlToRead="http://hvdic.thivien.net/whan/" + hantu;
	    String nameClass = "hvres-spell";
	    ArrayList<String> listStringHV = new ArrayList<String>();
	    String hanviet = "";
	    HTMLContentUtil htmlContent = new HTMLContentUtil();
	    listStringHV = htmlContent.getContentFromClass(urlToRead, nameClass);
		int size = listStringHV.size();
		if(size == 0) {
			hanviet = "";
		} else {
			hanviet = listStringHV.get(size-1);
		}	
		
		if(size > 0) {
			String hanviet2 = "[";
			for(String w:listStringHV){
				hanviet2=hanviet2+w+"/";
			}
		}
		
		
	    return hanviet;
	    
    }
    
    @RequestMapping(value = "/searchResult", method = RequestMethod.POST)
	@ResponseBody
	public ResponseValue search(@RequestBody SearchForm postObject) throws Exception {
		ArrayList<String> listHanTu = new ArrayList<>();
		ArrayList<String> listHanViet = new ArrayList<>();
		String[] words=postObject.getSearchInput().split("\\s");//chia chuoi dua tren string phan cac nhau boi khoang trang (\\s) 
		//su dung vong lap foreach de in cac phan tu trong mang chuoi  
		for(String w:words){ 
			if(w != " " & w != "  " & w != "") {
				listHanTu.add(w);
			}
			
		} 
		
		for (String hantu : listHanTu) {
			String hanviet = getHanVietLast(hantu);
			String hanviet1 = "";
			String hanviet2 = "";
			if (hanviet != "") {
				listHanViet.add(hanviet.toUpperCase());
			} else {
				if (hantu.length() == 3) {
					hanviet1 = getHanVietLast(hantu.substring(0, 2));
					if (hanviet1 == "") {
						hanviet1 = getHanVietLast(hantu.substring(0, 1)) + " " + getHanVietLast(hantu.substring(1, 2));
					}
					hanviet2 = getHanVietLast(hantu.substring(2, 3));
				} else if (hantu.length() == 4) {
					hanviet1 = getHanVietLast(hantu.substring(0, 2));
					if (hanviet1 == "") {
						hanviet1 = getHanVietLast(hantu.substring(0, 1)) + " " + getHanVietLast(hantu.substring(1, 2));
					}
					hanviet2 = getHanVietLast(hantu.substring(2, 4));
					if (hanviet2 == "") {
						hanviet2 = getHanVietLast(hantu.substring(2, 3)) + " " + getHanVietLast(hantu.substring(3, 4));
					}
				} else {
					for(int i=0;i<=hantu.length()-1;i++){
						if(hanviet1 == "") {
							hanviet1 = getHanVietLast(hantu.substring(i, i+1));
						} else {
							hanviet1 = hanviet1 + " "+ getHanVietLast(hantu.substring(i, i+1));
						}
					}
				}

			}
			if(hanviet2 == "") {
				hanviet = hanviet1;
			} else {
				hanviet = hanviet1 + " " + hanviet2;
			}
			if(hanviet != "") {
			listHanViet.add(hanviet.toUpperCase());
			}
			
		}
		
    	session.setAttribute("listHanViet", listHanViet);
    	session.setAttribute("listHanTu", listHanTu);
		return new ResponseValue(listHanViet);
	}
    

}
