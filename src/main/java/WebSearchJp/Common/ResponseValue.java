package main.java.WebSearchJp.Common;

import java.io.Serializable;


public class ResponseValue implements Serializable {
    
    private static final long serialVersionUID = -3360937012897702320L;
    
    /**
     * result data
     */
    private Object result;
   
    /**
     * Constructor method
     * initial variable
     * @param inputForm
     */
    public ResponseValue(Object result) {
        this.result = result;
    }

    
    /**
     * resultを取得します。
     * @return result
     */
    public Object getResult() {
        return result;
    }

    /**
     * resultを設定します。
     * @param result
     */
    public void setResult(Object result) {
        this.result = result;
    }

    
}
