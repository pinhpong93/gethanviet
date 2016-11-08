/*
 * Copyright(c) INFINI TRAVEL INFORMATION, INC
 * 2015 All Rights Reserved.
 *
 * ファイル名：AppController.java
 * パッケージ名：com.infini.ibe.common.controller
 *
 */

package main.java.WebSearchJp.Common;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.HandlerMapping;


/**
 * BaseController controller class
 */
public class AppController {		
	
	/** layout default */
	private String LAYOUT = "common-layout";

	/** body key */
	protected String BODY = "body";

	/**
	 * Folder contain template. Default is the same @RequestMapping("...").
	 * <br />
	 * Ex: @RequestMapping("/login") is VIEW_DIR = "login"
	 */
	protected String VIEW_DIR = "";

	/** Logのインスタンス - {@link org.apache.commons.logging.Log} */
	protected Log logger;
	protected SimpleView view;

	/** suffix of velocity template */
	@Value("${spring.velocity.suffix}")
	protected String suffix;

	/** VelocityEngineのインスタンス */
	@Autowired
	private VelocityEngine velocityEngine;

	/** HttpSessionのインスタンス */
	@Autowired
	private HttpSession session;

	/** HttpServletRequestのインスタンス */
	@Autowired
	protected HttpServletRequest request;
	
	@Autowired
	protected HttpServletResponse response;



	/** constructor method */
	public AppController() {
	}

	/** change layout default */
	public AppController(String layout) {
		LAYOUT = layout;
	}

	/**
	 * init variable
	 */
	@PostConstruct
	private void init() {

		if (session != null) {
		}
	}
	
	/**
	 * init ModelAndView with "common-layout"
	 */
	protected SimpleView initView() {
		return initView(LAYOUT);
	}

	/**
	 * Initial ModelAndView with {layout}
	 *
	 * @param layout
	 */
	private SimpleView initView(String layout) {
		
		// Get page name to show title pate
		String titlePage = getPageName();
		
		// initial view
		view = (SimpleView) new SimpleView(velocityEngine, layout, suffix);
		view.addObject(Constants.OBJ_TITLEPAGE, titlePage);
		
		return view;
		
	}

	
	/**
	 * Get name of page current by URL
	 * @return page name
	 */
	protected String getPageName(){
		String restOfTheUrl = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
		String pName = "";
		if(restOfTheUrl.endsWith("search")){
			pName= "search";
		} else if(restOfTheUrl.endsWith("result")){
			pName= "result";
		} else if(restOfTheUrl.endsWith("information")){
			pName= "information";
		} else if(restOfTheUrl.endsWith("confirmation")){
			pName= "confirmation";
		} else if(restOfTheUrl.endsWith("complete")){
			pName= "complete";
		}	
		return pName;
	}
	
}
