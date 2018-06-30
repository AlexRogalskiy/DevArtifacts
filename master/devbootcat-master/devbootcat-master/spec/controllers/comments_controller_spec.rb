require 'spec_helper'

describe CommentsController do

	describe "POST #create" do

    it "responds successfully with an HTTP 200 status code" do
      # get :index
      expect(response).to be_success
      expect(response.status).to eq(200)
		end

		it "to be redirect back" do
			pending
			expect(response).to redirect_to(:back)
		end
	end

end
