package main.java.WebSearchJp.Config;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.velocity.tools.generic.EscapeTool;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.ErrorPage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

/**
 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter
 */
@Configuration
@EnableWebMvc
@ComponentScan({"WebSearchJp"})
public class AppConfiguration extends WebMvcConfigurerAdapter {

    private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { "/"
        // add static resource here
    };
    
    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver slr = new SessionLocaleResolver();
        slr.setDefaultLocale(Locale.JAPANESE);
        return slr;
    }
 
    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor lci = new LocaleChangeInterceptor();
        lci.setParamName("lang");
        return lci;
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry)
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (!registry.hasMappingForPattern("/**")) {
            registry.addResourceHandler("/**").addResourceLocations(
                    CLASSPATH_RESOURCE_LOCATIONS);
            
        }
    }
    
  
    
    /*
     * @see org.springframework.web.servlet.HandlerInterceptor
     */
    public class AppHandlerInterceptor extends HandlerInterceptorAdapter {

        /*
         * (non-Javadoc)
         * @see org.springframework.web.servlet.HandlerInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object)
         */
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        	HttpSession session = request.getSession(false);// don't create if it doesn't exist
        	if(session != null && !session.isNew()) {
        	    //chain.doFilter(request, response);
        	} else {
        		/*if(isAjaxRequest(request)){
        			return true;
        		} else {*/
	        		request.getSession(true);
	        		response.sendRedirect(request.getContextPath() + "/*/search");
	        		return false;
        		//}
        	}
           return true;
        }

        /*
         * (non-Javadoc)
         * @see org.springframework.web.servlet.HandlerInterceptor#postHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object, org.springframework.web.servlet.ModelAndView)
         */
        @Override
        public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
            if (modelAndView != null) {
                modelAndView
                    .addObject("esc", new EscapeTool());
            }
        }
        
        /**
         * Check request ajax
         * @param request
         * @return
         */
    /*    private boolean isAjaxRequest(HttpServletRequest request) {
            String xReqName = request.getHeader(Constants.AJAX_REQ_HEADER);
            return Constants.AJAX_REQ_VALUE.equals(xReqName);
        }*/
    }
    
    /**
     * エラーメッセージのカスタマイズ(Spring Boot Reference 26.1.6 Error Handling)
     * @return
     */
    @Bean
    public EmbeddedServletContainerCustomizer containerCustomizer(){
        return new ErrorHandling();
    }

    /*
     * @see org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer
     */
    private static class ErrorHandling implements EmbeddedServletContainerCustomizer {

        /*
         * (non-Javadoc)
         * @see org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer#customize(org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer)
         */
        @Override
        public void customize(ConfigurableEmbeddedServletContainer factory) {
            factory.addErrorPages(new ErrorPage(HttpStatus.BAD_REQUEST, "/400"));
            factory.addErrorPages(new ErrorPage(HttpStatus.UNAUTHORIZED, "/401"));
            factory.addErrorPages(new ErrorPage(HttpStatus.FORBIDDEN, "/403"));    
            factory.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/404"));
            factory.addErrorPages(new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/500"));
            factory.addErrorPages(new ErrorPage(HttpStatus.SERVICE_UNAVAILABLE, "/503")); 
        }
    }
    
}
