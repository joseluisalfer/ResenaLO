package principal.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")
public class Comments {

	@Id
	private String id;
    private String resenaId; // Referencia a la reseña a la que pertenece el comentario
    private String user;   // Usuario que hace el comentario
    private String text;     // El contenido del comentario
    private Date date;       // Fecha de creación del comentario
    
	public Comments() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getResenaId() {
		return resenaId;
	}

	public void setResenaId(String resenaId) {
		this.resenaId = resenaId;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}
	
}
