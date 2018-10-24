package cn.com.pfinfo.swagger.bean;

public class User {

	private String id;
	private String account;
	private String name;

	public User(String account, String name) {
		this.account=account;
		this.name=name;
	}
	
	public User() {
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getAccount() {
		return account;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}
