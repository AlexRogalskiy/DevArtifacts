package com.jcg.example.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserBean
{

		private String userId;

		private String id;

		private String body;

		private String title;



		public String getTitle()
		{
				return this.title;
		}

		public void setTitle(String title)
		{
				this.title = title;
		}

		public String getUserId()
		{
				return this.userId;
		}

		public void setUserId(String userid)
		{
				this.userId = userid;
		}

		public String getId()
		{
				return this.id;
		}

		public void setId(String title)
		{
				this.id = title;
		}

		public String getBody()
		{
				return this.body;
		}

		public void setBody(String body)
		{
				this.body = body;
		}

		@Override
    public String toString()
    {
		    return "UserBean [userId=" + this.userId + ", id=" + this.id + ", body=" + this.body + ", title=" + this.title + "]";
    }


}
