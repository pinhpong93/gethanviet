/*
 * Copyright(c) INFINI TRAVEL INFORMATION, INC
 * 2015 All Rights Reserved.
 *
 * ファイル名：Application.java
 * パッケージ名：com.infini.ibe
 *
 */

package main.java;

import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;

import com.mysql.jdbc.AbandonedConnectionCleanupThread;


/**
 * @See org.springframework.boot.context.web.SpringBootServletInitializer
 */
@SuppressWarnings("deprecation")
//@Import({ AppSecurityConfiguration.class })
@SpringBootApplication
public class Application extends SpringBootServletInitializer {
    private static Log LOGGER = LogFactory.getLog(Application.class);

    /**
     * configure for spring boot
     */
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    /**
     * main method to run spring boot
     * 
     * @param args
     * @throws Exception
     */
    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }
    
    /**
     * create ServletContextListener bean to listener contextDestroyed
     * @return
     */
    @Bean
    protected ServletContextListener listener() {
        return new ServletContextListener() {
            
            /*
             * (non-Javadoc)
             * @see javax.servlet.ServletContextListener#contextInitialized(javax.servlet.ServletContextEvent)
             */
            @Override
            public void contextInitialized(ServletContextEvent sce) {
                LOGGER.info("Initialising Context...");
            }

            /*
             * (non-Javadoc)
             * @see javax.servlet.ServletContextListener#contextDestroyed(javax.servlet.ServletContextEvent)
             */
            @Override
            public final void contextDestroyed(ServletContextEvent sce) {
                LOGGER.info("Destroying Context...");
                
                try {
                    LOGGER.info("Calling MySQL AbandonedConnectionCleanupThread shutdown");
                    AbandonedConnectionCleanupThread.shutdown();
                } catch (InterruptedException e) {
                    logger.warn("SERVER problem cleaning up: " + e.getMessage());
                    e.printStackTrace();
                }
                
                ClassLoader cl = Thread.currentThread().getContextClassLoader();

                Enumeration<Driver> drivers = DriverManager.getDrivers();
                while (drivers.hasMoreElements()) {
                    Driver driver = drivers.nextElement();

                    if (driver.getClass().getClassLoader() == cl) {

                        try {
                            LOGGER.info("Deregistering JDBC driver {}");
                            DriverManager.deregisterDriver(driver);

                        } catch (SQLException ex) {
                            LOGGER.error("Error deregistering JDBC driver {}", ex);
                        }

                    } else {
                        LOGGER.trace("Not deregistering JDBC driver {} as it does not belong to this webapp's ClassLoader");
                    }
                }
            }
        };
    }

}
