package main.java.WebSearchJp.Common;

import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.tools.generic.EscapeTool;
import org.springframework.ui.velocity.VelocityEngineUtils;
import org.springframework.web.servlet.ModelAndView;

/**
 * User validate class
 */
public class SimpleView extends ModelAndView {

    /**
     * velocityEngine VelocityEngine to work with
     * {@link org.apache.velocity.app.VelocityEngine}
     */
    private VelocityEngine velocityEngine;
    
    /**
     * suffix of velocity template
     */
    private String suffix;

    /**
     * @see org.springframework.web.servlet.ModelAndView(java.lang.String)
     */
    public SimpleView(VelocityEngine velocityEngine, String viewName, String suffix) {
        super(viewName);
        this.velocityEngine = velocityEngine;
        this.suffix = suffix;
        render();
    }
    
    /**
     * Render template
     * @see org.springframework.ui.velocity.VelocityEngineUtils.mergeTemplateIntoString(org.apache.velocity.app.VelocityEngine, 
     *                                              java.lang.String, java.lang.String, java.util.Map<java.lang.String,java.lang.Object>)
     * @return
     */
    @SuppressWarnings("static-access")
	public String render() {
        this.addObject("esc", new EscapeTool());
        return VelocityEngineUtils.mergeTemplateIntoString(velocityEngine, this.getViewName() + suffix, Constants.Text.APP_ENCODING, this.getModel());
    }

}
