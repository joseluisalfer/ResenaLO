package principal.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")
public class Comments {

	@Id
	private String id;
    private String reviewId; // Referencia a la reseña a la que pertenece el comentario
    private String user;   // Usuario que hace el comentario
    private String text;     // El contenido del comentario
    private Date date;       // Fecha de creación del comentario
    private double valoration;
    public Comments() {
    	
    }
	public Comments(String reviewId, String user, String text, Date date, double valoration) {
		this.reviewId = reviewId;
		this.user = user;
		this.text = text;
		this.date = date;
		this.valoration = valoration;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getReviewId() {
		return reviewId;
	}

	public void setReviewId(String resenaId) {
		this.reviewId = resenaId;
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
	public double getValoration() {
		return valoration;
	}
	public void setValoration(double valoration) {
		this.valoration = valoration;
	}
	
}
