package main.java.WebSearchJp.Common;

import java.io.IOException;
import java.util.ArrayList;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class HTMLContentUtil {
	public String getHtmlFromUrl(String url){
		String htmlOut = "";
		Document doc;
		try {
			doc = Jsoup.connect(url).get();			
		    htmlOut = doc.html();
		} catch (IOException e) {
			e.getMessage().toString();
		}	    
		
		return htmlOut;
	}
	
	public ArrayList<String> getContentFromClass(String url, String nameClass){
		String stringOut = "";
		ArrayList<String> listStringHV = new ArrayList<String>();
		ArrayList<String> listHtml = new ArrayList<String>();
		try {
			Document doc;
			doc = Jsoup.connect(url).get();
			Elements hanviet = doc.getElementsByClass(nameClass);
			for(Element w:hanviet){
				
				listHtml.add(w.html());
			}
			
			for(String w:listHtml){
				if (w.startsWith("<")) {
					int start = w.indexOf(">", 1);
					int end = w.indexOf("<", 1);
					stringOut = w.substring(start + 1, end);
				} else {
					stringOut = w;
				}
				listStringHV.add(stringOut);
			}

			
			
		} catch (IOException e) {
			e.getMessage().toString();
		}	
		return listStringHV;
	}

}
