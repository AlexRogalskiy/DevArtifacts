require "spec_helper"

describe WardsController do
  describe "routing" do

    it "routes to #index" do
      get("/wards").should route_to("wards#index")
    end

    it "routes to #new" do
      get("/wards/new").should route_to("wards#new")
    end

    it "routes to #show" do
      get("/wards/1").should route_to("wards#show", :id => "1")
    end

    it "routes to #edit" do
      get("/wards/1/edit").should route_to("wards#edit", :id => "1")
    end

    it "routes to #create" do
      post("/wards").should route_to("wards#create")
    end

    it "routes to #update" do
      put("/wards/1").should route_to("wards#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/wards/1").should route_to("wards#destroy", :id => "1")
    end

  end
end
