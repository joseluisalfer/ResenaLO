package principal.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a comment made by a user on a review.
 * Each comment is linked to a review and contains the user, text, date, and valoration (rating).
 */
@Document(collection = "comments")
public class Comments {

	/** Unique identifier for the comment. */
	@Id
	private String id;
    /** ID of the review this comment belongs to. */
    private String reviewId; // Referencia a la reseña a la que pertenece el comentario
    /** Username of the user who made the comment. */
    private String user;   // Usuario que hace el comentario
    /** Content of the comment. */
    private String text;     // El contenido del comentario
    /** Date when the comment was created. */
    private Date date;       // Fecha de creación del comentario
    /** Rating given in the comment. */
    private double valoration;

    /**
     * Default constructor.
     */
    public Comments() {
    }

    /**
     * Constructs a new Comments object with all fields.
     * @param reviewId ID of the review this comment belongs to
     * @param user Username of the commenter
     * @param text Content of the comment
     * @param date Date of creation
     * @param valoration Rating given in the comment
     */
	public Comments(String reviewId, String user, String text, Date date, double valoration) {
		this.reviewId = reviewId;
		this.user = user;
		this.text = text;
		this.date = date;
		this.valoration = valoration;
	}

	/**
	 * Gets the unique identifier of the comment.
	 * @return comment ID
	 */
	public String getId() {
		return id;
	}

	/**
	 * Sets the unique identifier of the comment.
	 * @param id comment ID
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * Gets the ID of the review this comment belongs to.
	 * @return review ID
	 */
	public String getReviewId() {
		return reviewId;
	}

	/**
	 * Sets the ID of the review this comment belongs to.
	 * @param resenaId review ID
	 */
	public void setReviewId(String resenaId) {
		this.reviewId = resenaId;
	}

	/**
	 * Gets the username of the commenter.
	 * @return username
	 */
	public String getUser() {
		return user;
	}

	/**
	 * Sets the username of the commenter.
	 * @param user username
	 */
	public void setUser(String user) {
		this.user = user;
	}

	/**
	 * Gets the content of the comment.
	 * @return comment text
	 */
	public String getText() {
		return text;
	}

	/**
	 * Sets the content of the comment.
	 * @param text comment text
	 */
	public void setText(String text) {
		this.text = text;
	}

	/**
	 * Gets the creation date of the comment.
	 * @return creation date
	 */
	public Date getDate() {
		return date;
	}

	/**
	 * Sets the creation date of the comment.
	 * @param date creation date
	 */
	public void setDate(Date date) {
		this.date = date;
	}

	/**
	 * Gets the rating given in the comment.
	 * @return valoration (rating)
	 */
	public double getValoration() {
		return valoration;
	}

	/**
	 * Sets the rating given in the comment.
	 * @param valoration rating
	 */
	public void setValoration(double valoration) {
		this.valoration = valoration;
	}
}
