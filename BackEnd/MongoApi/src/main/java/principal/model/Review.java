package principal.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "resenas")
public class Review {

	@Id
	private String id;
	private String title;
	private List<byte[]> images;
	private String user;
	private double valoration;
	private String description;
	private Date date;

	public Review() {
	}

	public Review(String title, List<byte[]> images, String user, double valoration, String description) {
		super();
		this.title = title;
		this.images = images;
		this.user = user;
		this.valoration = valoration;
		this.description = description;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<byte[]> getImages() {
		return images;
	}

	public void setImages(List<byte[]> images) {
		this.images = images;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public double getValoration() {
		return valoration;
	}

	public void setValoration(double valoration) {
		this.valoration = valoration;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

}
