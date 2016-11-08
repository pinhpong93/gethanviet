
package main.java.WebSearchJp.Form;

import java.util.LinkedList;
import java.util.List;

/**
 * RSearchForm form
 */
public class SearchForm {

	/**
     * Error list
     */
    private List<Throwable> error = new LinkedList<Throwable>();
    /**
     * errorsを取得します。
     * @return errors
     */
    public List<Throwable> getError() {
        return error;
    }

    /**
     * errorsを設定します。
     * @param errors
     */
    public void setError(List<Throwable> error) {
    	//List<Throwable>(error);
        this.error = (List<Throwable>)error;
    }

	
	private String searchInput;
	public String getSearchInput() {
		return searchInput;
	}

	public void setSearchInput(String searchInput) {
		this.searchInput = searchInput;
	}

	public String getSearchInput2() {
		return searchInput2;
	}

	public void setSearchInput2(String searchInput2) {
		this.searchInput2 = searchInput2;
	}


	private String searchInput2;
	
	
	
}
