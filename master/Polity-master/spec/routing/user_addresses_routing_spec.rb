require "spec_helper"

describe UserAddressesController do
  describe "routing" do

    it "routes to #index" do
      get("/user_addresses").should route_to("user_addresses#index")
    end

    it "routes to #new" do
      get("/user_addresses/new").should route_to("user_addresses#new")
    end

    it "routes to #show" do
      get("/user_addresses/1").should route_to("user_addresses#show", :id => "1")
    end

    it "routes to #edit" do
      get("/user_addresses/1/edit").should route_to("user_addresses#edit", :id => "1")
    end

    it "routes to #create" do
      post("/user_addresses").should route_to("user_addresses#create")
    end

    it "routes to #update" do
      put("/user_addresses/1").should route_to("user_addresses#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/user_addresses/1").should route_to("user_addresses#destroy", :id => "1")
    end

  end
end
