package principal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Mapea el CORS a todas las rutas bajo /API
                registry.addMapping("/API/**")
                        .allowedOrigins("*")  // Permite conexiones desde cualquier IP (NO recomendable, a falat de preguntar a Roberto)
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");  // Permite cualquier tipo de cabecera 
            }
        };
    }
}
